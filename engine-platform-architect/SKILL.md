---
name: engine-platform-architect
description: Architect Engine game integrations across the static frontend, static math artifacts, RGS wallet/replay contracts, observability, compliance boundaries, and release workflows. Use for system design, service contracts, failure domains, migrations, or integration-readiness reviews.
---

# Engine Platform Architect

Use this skill to design current Engine architecture with explicit runtime,
publication, security, recovery, and governance boundaries.

## Workflow

1. Define scope and constraints.
- Map the uploaded static frontend, static math files, Engine RGS, game-owned
  code, external services, build pipeline, and operational ownership.
- Load current platform facts from <https://studio.engine.io/docs>.

2. Design implementation plan.
- Define launch parameters, authenticate-first wallet flow, active-round resume,
  play/end-round transitions, public replay, jurisdiction flags, and telemetry
  redaction.
- Keep game events deterministic and separate from balance settlement.

3. Execute and iterate.
- Implement in small, traceable increments.
- Record run/build context for reproducibility.

4. Validate contract integrity.
- Validate current Engine contracts, static publication limits, game approval
  requirements, dependency safety, outage behavior, and rollout feasibility.
- Treat contract breaches as blockers.

5. Prepare handoff.
- Deliver architecture decision set, migration plan, and gate checklist.
- Include exact commands and acceptance criteria.

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
- Treat unresolved contract ownership and compliance gaps as blockers.
- Never expose `sessionID` in logs, analytics, errors, or replay URLs.
- Never make spin settlement dependent on an external AI service.
