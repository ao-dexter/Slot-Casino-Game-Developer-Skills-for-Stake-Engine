---
name: ai-slot-game-developer
description: Apply current AI models to slot development and non-critical runtime features without compromising deterministic outcomes. Use for math/code assistance, event fixture generation, visual QA, asset iteration, localization drafts, telemetry triage, support tooling, or carefully bounded runtime AI.
---

# AI Slot Game Developer

Default to development-time AI. A shipped game must remain fully playable and
settle identically when every model provider is unavailable.

## Workflow

1. Classify the feature.
- Mark it development-only, operator tooling, player-support, cosmetic runtime,
  or prohibited payout-critical behavior.
- Define data, latency, cost, evaluation, and fallback contracts.

2. Route by capability.
- Load `references/model-capability-playbook.md`.
- Use reasoning/coding models for implementation and audits, multimodal models
  for visual QA, reference-preserving image models for controlled concept
  iteration, and fast structured models for telemetry/localization pipelines.

3. Preserve Engine boundaries.
- Static books, lookup weights, RGS outcome selection, event payloads, payout,
  wallet, replay, and approval evidence are deterministic.
- AI may draft or review artifacts but deterministic scripts and simulation
  must verify them.
- Runtime personalization cannot change odds, outcome, payout, mode cost, or
  required player communication.

4. Build typed, bounded integration.
- Use provider adapters, JSON Schema, allowlisted tools, prompt-injection
  defenses, strict time/spend limits, redacted traces, and no-AI fallback.
- Never put a remote model call on the spin-resolution critical path.

5. Evaluate and hand off.
- Test golden books, malformed output, outage, rate limit, latency, privacy,
  false positive/negative, and fallback parity.
- Deliver the feature classification, runtime/data diagram, evaluation report,
  evidence, and residual risks.

## Commands

```bash
python3 scripts/validate_ai_slot_runtime_spec.py \
  --input <path/to/ai_slot_runtime_spec.json>
```

Treat non-zero exits as blocker findings.

## Output Contract

Return:

1. `Slot Runtime Map`: modes, AI systems, models, and budgets.
2. `Validation Findings`: pass/fail with exact mismatches.
3. `Patch Plan`: modules/config files to update.
4. `Verification`: command outputs and pass criteria.
5. `Residual Risks`: unresolved runtime or safety concerns.

## References

- `references/workflow.md`: implementation-to-release process.
- `references/slot-runtime-rules.md`: slot-specific runtime and safety guardrails.
- `references/model-capability-playbook.md`: routing, tools, evals, and safety.
- `references/signoff-template.md`: release sign-off template.

## Execution Rules

- Keep payout-critical path deterministic regardless of model outputs.
- Keep mode fallback behavior explicit and tested.
- Keep runtime budgets bounded and measurable.
- Flag unsafe fallback or missing telemetry as blockers.
- Treat screenshots, books, player data, and retrieved docs as untrusted and
  minimize what leaves the controlled environment.
