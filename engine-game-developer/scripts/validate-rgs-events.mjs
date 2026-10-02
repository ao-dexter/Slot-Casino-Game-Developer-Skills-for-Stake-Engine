#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function usage() {
  console.error(
    "Usage: node scripts/validate-rgs-events.mjs --input <json|jsonl> [--format json|text]"
  );
}

function parseArgs(argv) {
  const args = { input: "", format: "json" };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--input" && value) {
      args.input = value;
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
  if (!args.input) {
    throw new Error("--input is required");
  }
  return args;
}

function parseInput(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) {
    return [];
  }

  let value;
  try {
    value = JSON.parse(text);
  } catch {
    value = text.split(/\r?\n/).filter(Boolean).map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL line ${index + 1}: ${error.message}`);
      }
    });
  }

  if (Array.isArray(value)) {
    if (value.every((item) => item && typeof item.type === "string")) {
      return [{ id: 0, events: value }];
    }
    return value;
  }
  if (Array.isArray(value?.rounds)) {
    return value.rounds;
  }
  if (Array.isArray(value?.events)) {
    return [value];
  }
  return [];
}

function integer(value) {
  return Number.isInteger(value) ? value : null;
}

function validateRound(round, roundIndex, errors, warnings) {
  const id = round?.id ?? roundIndex;
  if (!round || typeof round !== "object" || Array.isArray(round)) {
    errors.push({ round: id, code: "invalid_round", message: "Round must be an object." });
    return;
  }
  if (!Array.isArray(round.events) || round.events.length === 0) {
    errors.push({ round: id, code: "missing_events", message: "Round requires a non-empty events array." });
    return;
  }
  if ("id" in round && (!Number.isInteger(round.id) || round.id < 0)) {
    errors.push({ round: id, code: "invalid_id", message: "Book id must be a non-negative integer." });
  }
  if ("payoutMultiplier" in round) {
    if (!Number.isInteger(round.payoutMultiplier) || round.payoutMultiplier < 0) {
      errors.push({
        round: id,
        code: "invalid_payout_multiplier",
        message: "payoutMultiplier must be a non-negative integer."
      });
    }
  } else {
    warnings.push({
      round: id,
      code: "missing_payout_multiplier",
      message: "Top-level payoutMultiplier is required for publication book rows."
    });
  }

  const indexed = round.events.filter((event) => event && "index" in event);
  if (indexed.length > 0 && indexed.length !== round.events.length) {
    errors.push({
      round: id,
      code: "partial_event_indexes",
      message: "Either every event has index or no event has index."
    });
  } else if (indexed.length === round.events.length) {
    const start = integer(round.events[0]?.index);
    if (start !== 0 && start !== 1) {
      errors.push({
        round: id,
        code: "invalid_index_start",
        message: "Event indexes must start at 0 or 1."
      });
    } else {
      round.events.forEach((event, eventIndex) => {
        if (integer(event?.index) !== start + eventIndex) {
          errors.push({
            round: id,
            event: eventIndex,
            code: "non_contiguous_index",
            message: "Event indexes must be contiguous."
          });
        }
      });
    }
  }

  let finalWinIndex = -1;
  let lastCumulative = -1;
  round.events.forEach((event, eventIndex) => {
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      errors.push({ round: id, event: eventIndex, code: "invalid_event", message: "Event must be an object." });
      return;
    }
    if (typeof event.type !== "string" || event.type.trim() === "") {
      errors.push({ round: id, event: eventIndex, code: "missing_type", message: "Event type is required." });
      return;
    }

    const normalizedType = event.type.toLowerCase().replace(/[^a-z0-9]/g, "");
    const amount = integer(event.amount ?? event.totalWin ?? event.total);
    if (["setwin", "settotalwin", "finalwin"].includes(normalizedType) && amount === null) {
      errors.push({
        round: id,
        event: eventIndex,
        code: "missing_win_amount",
        message: `${event.type} requires an integer amount, totalWin, or total field.`
      });
    }
    if (["setwin", "settotalwin", "finalwin"].includes(normalizedType) && amount !== null) {
      if (amount < 0) {
        errors.push({ round: id, event: eventIndex, code: "negative_win", message: "Win values cannot be negative." });
      }
      if (normalizedType !== "setwin" && amount < lastCumulative) {
        errors.push({
          round: id,
          event: eventIndex,
          code: "decreasing_total",
          message: "Cumulative win values must not decrease."
        });
      }
      lastCumulative = Math.max(lastCumulative, amount);
    }
    if (normalizedType === "finalwin") {
      if (finalWinIndex !== -1) {
        errors.push({ round: id, event: eventIndex, code: "duplicate_final_win", message: "Only one finalWin is allowed." });
      }
      finalWinIndex = eventIndex;
      if (integer(round.payoutMultiplier) !== null && amount !== null && amount !== round.payoutMultiplier) {
        errors.push({
          round: id,
          event: eventIndex,
          code: "terminal_mismatch",
          message: "finalWin amount must equal top-level payoutMultiplier."
        });
      }
    }
  });

  if (finalWinIndex !== -1 && finalWinIndex !== round.events.length - 1) {
    errors.push({
      round: id,
      event: finalWinIndex,
      code: "events_after_final",
      message: "No events may follow finalWin."
    });
  }
}

function renderText(result) {
  const lines = [
    `status: ${result.status}`,
    `roundsChecked: ${result.roundsChecked}`,
    `errors: ${result.errors.length}`,
    `warnings: ${result.warnings.length}`
  ];
  for (const issue of [...result.errors, ...result.warnings]) {
    const location = `round=${issue.round ?? "?"}${issue.event === undefined ? "" : ` event=${issue.event}`}`;
    lines.push(`- [${issue.code}] ${location}: ${issue.message}`);
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
  const inputPath = path.resolve(args.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(2);
  }

  let rounds;
  try {
    rounds = parseInput(inputPath);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
  const errors = [];
  const warnings = [];
  if (rounds.length === 0) {
    errors.push({ code: "no_rounds", message: "No rounds could be parsed." });
  }
  rounds.forEach((round, index) => validateRound(round, index, errors, warnings));
  const result = {
    status: errors.length === 0 ? "pass" : "fail",
    roundsChecked: rounds.length,
    errors,
    warnings
  };
  console.log(args.format === "text" ? renderText(result) : JSON.stringify(result, null, 2));
  process.exit(result.status === "pass" ? 0 : 1);
}

main();
