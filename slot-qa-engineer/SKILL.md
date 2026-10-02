---
name: slot-qa-engineer
description: Design and execute test plans for slot games covering math correctness, UI logic, performance, and compliance. Use when validating game rules, running regression tests, verifying error handling, checking jurisdiction constraints, or preparing release sign-off reports.
---

# Slot QA Engineer

Use this skill to ensure game quality, stability, and compliance before release.

## Workflow

1. Analyze Requirements.
- Review math model, game rules, and UI specifications.
- Identify zero/ordinary/feature/large/max-win rounds, active-round resume,
  network failure, replay, and jurisdiction cases.

2. Design Test Plan.
- Define test cases for functional, regression, and performance testing.
- Create cheat/debug commands for triggering features.

3. Execute Testing.
- Run manual tests for UX flow and animation glitches.
- Run automated tests for math verification and stability.
- Verify Engine RGS, static books, public replay, responsive layouts,
  accessibility, performance, and current jurisdiction flags.

4. Report and Track.
- Log defects with reproduction steps and severity.
- Verify fixes and perform regression testing.

5. Final Sign-off.
- Validate against release checklist.
- Confirm all critical and high-priority bugs are resolved.

## Output Contract

Return:

1. `Test Plan`: coverage matrix and test cases.
2. `Bug Report`: list of identified issues with priority.
3. `Sign-off Report`: pass/fail status and residual risks.

## References

- `references/workflow.md`: QA process and stages.
- `references/test-plan.md`: Template for test planning.

## Execution Rules

- Use deterministic event/book fixtures for UI and replay evidence.
- Never infer settlement correctness from animation alone.
- Record game version, artifact hashes, RGS environment, device, language, and
  jurisdiction with every result.
