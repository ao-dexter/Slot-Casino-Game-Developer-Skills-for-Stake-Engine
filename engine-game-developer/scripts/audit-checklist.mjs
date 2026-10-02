#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const TEXT_EXTENSIONS = new Set([
  ".md", ".txt", ".json", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx",
  ".svelte", ".html", ".css", ".yml", ".yaml"
]);
const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", "coverage", ".cache"]);

function usage() {
  console.error(
    "Usage: node scripts/audit-checklist.mjs --rules <json> --target <path> [--social true|false] [--format json|text]"
  );
}

function parseArgs(argv) {
  const args = { rules: "", target: "", social: true, format: "json" };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--rules" && value) args.rules = value;
    else if (key === "--target" && value) args.target = value;
    else if (key === "--social" && value) args.social = value.toLowerCase() !== "false";
    else if (key === "--format" && value && ["json", "text"].includes(value)) args.format = value;
    else throw new Error(`Unknown or incomplete option: ${key}`);
    index += 1;
  }
  if (!args.rules || !args.target) {
    throw new Error("--rules and --target are required");
  }
  return args;
}

function walk(target, files = []) {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (TEXT_EXTENSIONS.has(path.extname(target).toLowerCase())) files.push(path.resolve(target));
    return files;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    walk(path.join(target, entry.name), files);
  }
  return files;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseRegex(phrase) {
  const escaped = escapeRegex(phrase);
  const start = /^[\p{L}\p{N}]/u.test(phrase) ? "(?<![\\p{L}\\p{N}])" : "";
  const end = /[\p{L}\p{N}]$/u.test(phrase) ? "(?![\\p{L}\\p{N}])" : "";
  return new RegExp(`${start}${escaped}${end}`, "giu");
}

function lineNumber(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function renderText(result) {
  const lines = [
    `status: ${result.status}`,
    `filesScanned: ${result.filesScanned}`,
    `violations: ${result.violations.length}`
  ];
  for (const issue of result.violations) {
    const location = issue.file ? `${issue.file}:${issue.line}` : "project";
    lines.push(`- [${issue.type}] ${location}: ${issue.message}`);
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

  const rulesPath = path.resolve(args.rules);
  const targetPath = path.resolve(args.target);
  if (!fs.existsSync(rulesPath) || !fs.existsSync(targetPath)) {
    console.error("Rules or target path does not exist.");
    process.exit(2);
  }

  let rules;
  try {
    rules = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
  } catch (error) {
    console.error(`Invalid rules JSON: ${error.message}`);
    process.exit(2);
  }
  const files = walk(targetPath);
  const contents = files.map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));
  const violations = [];

  for (const term of rules.restrictedTerms ?? []) {
    if (term.socialOnly && !args.social) continue;
    const regex = phraseRegex(term.phrase);
    for (const { file, text } of contents) {
      for (const match of text.matchAll(regex)) {
        violations.push({
          type: "restricted_term",
          file: path.relative(process.cwd(), file),
          line: lineNumber(text, match.index),
          message: `'${term.phrase}' should be reviewed; suggested replacement: '${term.replacement}'.`
        });
      }
    }
  }

  const aggregate = contents.map(({ text }) => text).join("\n").toLowerCase();
  for (const required of rules.requiredPhrases ?? []) {
    if (!aggregate.includes(required.phrase.toLowerCase())) {
      violations.push({
        type: "missing_required_phrase",
        line: 0,
        message: required.description || `Missing '${required.phrase}'.`
      });
    }
  }

  const result = {
    status: violations.length === 0 ? "pass" : "fail",
    filesScanned: files.length,
    violations
  };
  console.log(args.format === "text" ? renderText(result) : JSON.stringify(result, null, 2));
  process.exit(result.status === "pass" ? 0 : 1);
}

main();
