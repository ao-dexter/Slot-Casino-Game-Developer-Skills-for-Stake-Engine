---
name: ai-game-designer
description: Use current reasoning, multimodal, image, voice, and tool-using models to produce validated game-design artifacts. Use for concept exploration, mechanic specifications, economy and progression contracts, visual direction, playtest synthesis, implementation handoff, or design-quality evaluation.
---

# AI Game Designer

Use AI for breadth, synthesis, and artifact iteration while retaining human
design ownership and deterministic validation.

## Workflow

1. Define the decision and evidence.
- Capture audience, platform, session, mechanic, accessibility, originality,
  fairness, and compliance constraints.
- Define the output schema and evaluation rubric before prompting.

2. Route work by capability.
- Use frontier reasoning for systems and edge cases, multimodal models for
  screenshot/storyboard critique, reference-preserving image editing for
  controlled visual iteration, and realtime voice only for consented research
  or prototypes.
- Load `references/model-capability-playbook.md`.

3. Generate competing artifacts.
- Ask independent passes for mechanic design, adversarial edge cases,
  accessibility, implementation complexity, and player communication.
- Require structured feature/state/event/economy outputs with source and
  assumption labels.

4. Validate with tools and humans.
- Run the deterministic spec validator.
- Simulate economy/math claims instead of accepting model calculations.
- Compare visual concepts against the style guide, asset provenance, and
  commercial-rights review.
- Use a separate evaluator pass that did not author the proposal.

5. Prepare engineering handoff.
- Provide typed states/events, failure paths, telemetry, fixtures, acceptance
  criteria, unresolved decisions, and rejected alternatives.

## Commands

```bash
python3 scripts/validate_game_design_spec.py \
  --input <path/to/game_design_spec.json>
```

Treat non-zero exits as blocker findings.

## Output Contract

Return:

1. `Design Map`: loops, systems, features, and constraints.
2. `Validation Findings`: pass/fail with concrete inconsistencies.
3. `Patch Plan`: docs/files that must change before implementation.
4. `Verification`: command outputs and acceptance criteria.
5. `Residual Risks`: unresolved economy or progression risks.

## References

- `references/workflow.md`: design-to-handoff process.
- `references/design-rules.md`: loop/economy/progression guardrails.
- `references/model-capability-playbook.md`: routing, tools, evals, and safety.
- `references/signoff-template.md`: release handoff template.

## Execution Rules

- Keep design constraints explicit and measurable.
- Keep loop/economy dependencies internally consistent.
- Flag exploitable or contradictory progression paths as blockers.
- Require telemetry hooks for key balance assumptions.
- Never treat generated prose, calculations, or images as approved evidence.
- Preserve prompts, model/version, source inputs, generation settings, and
  human edits for production assets.
