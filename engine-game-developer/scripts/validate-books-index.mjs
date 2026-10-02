#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const MAX_EVENTS_FILE_BYTES = 4_200_000_000;
const MAX_COST_MULTIPLIER = 2_000;

function usage() {
  console.error(
    "Usage: node scripts/validate-books-index.mjs --index <index.json> [--base-dir <dir>] [--format json|text]"
  );
}

function parseArgs(argv) {
  const args = { index: "", baseDir: "", format: "json" };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--index" && value) {
      args.index = value;
      index += 1;
    } else if (key === "--base-dir" && value) {
      args.baseDir = value;
      index += 1;
    } else if (key === "--format" && value) {
      if (!["json", "text"].includes(value)) {
        throw new Error("--format must be json or text");
      }
      args.format = value;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete option: ${key}`);
    }
  }
  if (!args.index) {
    throw new Error("--index is required");
  }
  return args;
}

function validate(indexData, baseDir) {
  const errors = [];
  const warnings = [];
  const modes = indexData?.modes;

  if (!Array.isArray(modes) || modes.length === 0) {
    errors.push({ code: "invalid_modes", message: "index.modes must be a non-empty array." });
    return { errors, warnings, modesChecked: 0 };
  }

  const names = new Set();
  const referencedFiles = new Set();
  let cheapestCost = Infinity;
  let hasBaseCost = false;

  modes.forEach((mode, modeIndex) => {
    const label = typeof mode?.name === "string" && mode.name ? mode.name : `mode[${modeIndex}]`;
    if (!mode || typeof mode !== "object" || Array.isArray(mode)) {
      errors.push({ mode: label, code: "invalid_mode", message: "Mode must be an object." });
      return;
    }

    const expectedKeys = new Set(["name", "cost", "events", "weights"]);
    Object.keys(mode)
      .filter((key) => !expectedKeys.has(key))
      .forEach((key) => {
        errors.push({
          mode: label,
          code: "unknown_index_field",
          message: `Field '${key}' is not part of the documented index mode shape.`
        });
      });

    if (typeof mode.name !== "string" || mode.name.trim() === "") {
      errors.push({ mode: label, code: "invalid_name", message: "name must be a non-empty string." });
    } else if (names.has(mode.name)) {
      errors.push({ mode: label, code: "duplicate_name", message: "Mode names must be unique." });
    } else {
      names.add(mode.name);
    }

    if (typeof mode.cost !== "number" || !Number.isFinite(mode.cost) || mode.cost <= 0) {
      errors.push({ mode: label, code: "invalid_cost", message: "cost must be a positive number." });
    } else {
      cheapestCost = Math.min(cheapestCost, mode.cost);
      hasBaseCost ||= mode.cost === 1;
      if (mode.cost > MAX_COST_MULTIPLIER) {
        errors.push({
          mode: label,
          code: "cost_limit",
          message: `cost exceeds Engine's ${MAX_COST_MULTIPLIER}x critical limit.`
        });
      }
    }

    for (const [key, extension] of [["events", ".jsonl.zst"], ["weights", ".csv"]]) {
      const fileName = mode[key];
      if (typeof fileName !== "string" || fileName.trim() === "") {
        errors.push({ mode: label, code: `invalid_${key}`, message: `${key} must be a filename.` });
        continue;
      }
      if (!fileName.endsWith(extension)) {
        errors.push({
          mode: label,
          code: `invalid_${key}_extension`,
          message: `${key} must end in '${extension}'.`
        });
      }
      const filePath = path.resolve(baseDir, fileName);
      const relativePath = path.relative(baseDir, filePath);
      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        errors.push({
          mode: label,
          code: "file_outside_package",
          message: `${key} must resolve inside the package directory.`
        });
        continue;
      }
      if (referencedFiles.has(filePath)) {
        errors.push({
          mode: label,
          code: "duplicate_file_reference",
          message: `${fileName} is already referenced by another mode field.`
        });
      }
      referencedFiles.add(filePath);
      if (!fs.existsSync(filePath)) {
        errors.push({ mode: label, code: "missing_file", message: `Missing ${key} file: ${filePath}` });
        continue;
      }
      if (!fs.statSync(filePath).isFile()) {
        errors.push({ mode: label, code: "not_a_file", message: `${filePath} is not a file.` });
        continue;
      }
      if (key === "events" && fs.statSync(filePath).size > MAX_EVENTS_FILE_BYTES) {
        errors.push({
          mode: label,
          code: "events_file_too_large",
          message: `${filePath} exceeds Engine's 4.2 GB limit.`
        });
      }
    }
  });

  if (!hasBaseCost) {
    errors.push({ code: "missing_base_cost", message: "A mode with cost 1.0 is required." });
  } else if (cheapestCost !== 1) {
    errors.push({ code: "base_not_cheapest", message: "The 1.0x base mode must be the cheapest mode." });
  }

  return { errors, warnings, modesChecked: modes.length };
}

function renderText(result) {
  const lines = [
    `status: ${result.status}`,
    `modesChecked: ${result.modesChecked}`,
    `errors: ${result.errors.length}`,
    `warnings: ${result.warnings.length}`
  ];
  for (const issue of [...result.errors, ...result.warnings]) {
    lines.push(`- [${issue.code}]${issue.mode ? ` ${issue.mode}:` : ""} ${issue.message}`);
  }
  return lines.join("\n");
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    usage();
    console.error(error.message);
    process.exit(2);
  }

  const indexPath = path.resolve(args.index);
  if (!fs.existsSync(indexPath)) {
    console.error(`Index file not found: ${indexPath}`);
    process.exit(2);
  }

  let indexData;
  try {
    indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch (error) {
    console.error(`Invalid index JSON: ${error.message}`);
    process.exit(2);
  }

  const details = validate(indexData, args.baseDir ? path.resolve(args.baseDir) : path.dirname(indexPath));
  const result = {
    status: details.errors.length === 0 ? "pass" : "fail",
    ...details
  };
  console.log(args.format === "text" ? renderText(result) : JSON.stringify(result, null, 2));
  process.exit(result.status === "pass" ? 0 : 1);
}

main();
