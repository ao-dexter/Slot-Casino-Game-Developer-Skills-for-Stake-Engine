---
name: provider-integration
description: Integrate external/internal providers, including AI model providers, through stable typed adapters and resilience controls. Use when adding or auditing APIs, normalizing contracts, validating structured outputs and tool calls, defining fallbacks, or proving integration readiness.
---

# Provider Integration

Use this skill to implement provider integrations with strict contract and fallback behavior.

## Workflow

1. Define scope and constraints.
- Define provider contract, auth model, rate limits, and error taxonomy.
- Capture data classification, residency, latency, cost, quality, and release
  blockers.

2. Design implementation plan.
- Design adapter boundaries and schema normalization rules.
- Keep ownership and dependency boundaries explicit.
- For model providers, expose capabilities rather than product names and
  validate structured outputs before domain use.

3. Execute and iterate.
- Implement in small, traceable increments.
- Record run/build context for reproducibility.

4. Validate contract integrity.
- Validate contract compliance, retry/fallback behavior, and observability.
- Test timeouts, rate limits, malformed data, schema drift, cancellation,
  idempotency, circuit breaking, and provider substitution.
- Treat contract breaches as blockers.

5. Prepare handoff.
- Deliver adapter patch plan, migration notes, and verification steps.
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
- Treat schema drift and unhandled provider errors as blockers.
- Never log credentials, session tokens, raw sensitive prompts, or unnecessary
  player data.
- Allowlist model tools and validate arguments before execution.
