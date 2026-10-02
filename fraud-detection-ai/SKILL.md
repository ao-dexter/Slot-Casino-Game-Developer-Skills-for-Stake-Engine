---
name: fraud-detection-ai
description: Design and validate fraud and anomaly detection for game operations with calibrated scoring, explainable evidence, privacy controls, drift monitoring, and human review. Use for feature design, thresholds, alert routing, investigation assistance, or reliability audits.
---

# Fraud Detection AI

Use statistical/ML detectors for scoring and current reasoning models to
summarize evidence or assist investigators. Do not use generative-model prose as
the underlying risk score.

## Workflow

1. Define scope and constraints.
- Define the authorized abuse/fraud scope, labeled outcomes, features, privacy
  limits, review SLA, and harm of false positives/negatives.

2. Design implementation plan.
- Separate deterministic rules, anomaly models, supervised scores, graph
  signals, generative investigation assistance, and final human decisions.
- Version features, labels, model, thresholds, and reason codes.

3. Execute and iterate.
- Calibrate scores on time-split data and set thresholds by review capacity and
  measured cost.
- Redact data before any external model call and defend against prompt
  injection in player-provided content.

4. Validate contract integrity.
- Report precision, recall, false-positive rate, false-negative rate,
  calibration, subgroup impact, alert volume, review latency, and drift.
- Backtest threshold and rule changes before rollout.

5. Prepare handoff.
- Use shadow/canary rollout, reversible actions, complete evidence trails, and
  an appeal/review path.
- Define outage fallback and model rollback.

## Output Contract

Return:

1. `Context`: goals, assumptions, constraints.
2. `Validation`: pass/fail checks and key deltas.
3. `Changes`: concrete file-level updates.
4. `Commands`: commands and expected outputs.
5. `Risks`: unresolved issues and limits.

## References

- `references/workflow.md`: detailed execution flow.
- `references/checklist.md`: sign-off checklist.

## Execution Rules

- Keep decisions measurable and reversible.
- Keep validation criteria explicit before iteration.
- Escalate unbounded false-positive risk and opaque scoring logic as blockers.
- Never let a generative model directly freeze funds, alter game outcomes, or
  make an unreviewable enforcement decision.
