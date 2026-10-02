---
name: ai-game-developer
description: Build and validate AI-assisted game systems with capability routing, typed tool calls, structured outputs, retrieval, multimodal inputs, evaluations, observability, and deterministic fallback. Use for development agents, content tooling, support features, runtime AI, provider integration, or AI release audits.
---

# AI Game Developer

Use current models through provider-neutral capability adapters. Every model
output remains untrusted until schema and domain validation pass.

## Workflow

1. Define runtime contract first.
- Specify the user value, trust boundary, data classification, latency, cost,
  quality target, tool permissions, and deterministic fallback.
- Create golden and adversarial evaluation cases before integration.

2. Route by capability.
- Load `references/model-capability-playbook.md`.
- Select fast structured-output, frontier reasoning, multimodal, image,
  realtime voice, computer-use, or long-context/retrieval capabilities by
  measured task need.
- Route to the smallest model that passes evaluations; do not hard-code a
  vendor's flagship model.

3. Build typed adapters and tools.
- Validate JSON Schema before domain logic.
- Allowlist tools and arguments, isolate credentials, and treat retrieved/model
  content as prompt-injection-capable.
- Separate provider transport, prompt/template version, retrieval, tool
  execution, validation, and product behavior.

4. Enforce budgets and fallback.
- Bound tokens, wall time, retries, queues, parallelism, and spend.
- Use circuit breakers, idempotency, cancellation, and deterministic no-AI
  behavior.
- Protect gameplay continuity and payout-critical paths from provider outages.

5. Evaluate and observe.
- Run offline task evals, malformed-output tests, prompt-injection tests,
  provider-failure tests, and cost/latency checks.
- Trace model/version, template, retrieved sources, tool calls, validation,
  fallback, latency, and cost without storing secrets or unnecessary player
  data.
- Require independent verification for high-impact changes.

## Commands

```bash
python3 scripts/validate_ai_game_runtime.py \
  --input <path/to/ai_game_runtime_spec.json>
```

Treat non-zero exits as blocker findings.

## Output Contract

Return:

1. `Runtime Map`: systems, models, providers, and budgets.
2. `Validation Findings`: pass/fail with concrete integration gaps.
3. `Patch Plan`: runtime/modules/config files requiring changes.
4. `Verification`: command outputs and acceptance criteria.
5. `Residual Risks`: unresolved latency, fallback, or safety concerns.

## References

- `references/workflow.md`: implementation-to-release process.
- `references/runtime-rules.md`: runtime guardrails and constraints.
- `references/model-capability-playbook.md`: capability routing and evaluation.
- `references/signoff-template.md`: release handoff template.

## Execution Rules

- Keep AI features optional from core gameplay continuity perspective.
- Keep fallback behavior deterministic and tested.
- Keep latency budgets explicit and enforced.
- Flag unsafe failure modes and missing telemetry as blockers.
- Never let a model determine RNG, payout, settlement, wallet balance, or
  compliance approval.
- Never execute free-form model-generated commands without allowlisting and
  argument validation.
