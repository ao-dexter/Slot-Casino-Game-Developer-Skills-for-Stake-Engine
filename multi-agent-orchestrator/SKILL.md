---
name: multi-agent-orchestrator
description: Coordinate parallel and staged AI-agent work with isolated context, typed handoffs, dependency gates, budgets, and independent verification. Use when work has several judgment-heavy units, specialist/reviewer roles, or a pipeline whose outputs feed later agents.
---

# Multi-Agent Orchestrator

Use this skill to coordinate multi-agent execution with clear sequencing and dependency control.

## Workflow

1. Prove orchestration is warranted.
- Use one agent for tightly coupled work. Use parallel agents for independent
  units and pipelines only when one stage's artifact feeds the next.
- Load `references/model-capability-playbook.md`.

2. Define the graph.
- Give each agent one objective, bounded context, allowed tools, output schema,
  acceptance test, budget, and terminal states.
- Keep shared mutable state minimal; prefer immutable artifacts and explicit
  ownership.

3. Execute predictably.
- Parallelize only independent nodes.
- Log stage boundaries, artifact IDs, attempts, model/version, cost, and
  validation status.
- Resume from durable artifacts rather than replaying successful work.

4. Verify independently.
- Validate every handoff schema before downstream use.
- Use a reviewer that did not author the result and can inspect executable
  evidence.
- Resolve conflicts against source material and tests, not majority vote.

5. Handle failure.
- Bound retries and prevent retry storms, duplicate side effects, deadlocks,
  orphan tasks, and context contamination.
- Stop or degrade cleanly when a required node fails.

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
- `references/model-capability-playbook.md`: routing, security, and evaluation.

## Execution Rules

- Keep decisions measurable and reversible.
- Keep validation criteria explicit before iteration.
- Flag deadlocks, orphan tasks, or circular dependencies as blockers.
- Never let multiple agents write the same artifact concurrently.
- Do not pass hidden chain-of-thought between agents; pass concise decisions,
  evidence, assumptions, and machine-readable artifacts.
