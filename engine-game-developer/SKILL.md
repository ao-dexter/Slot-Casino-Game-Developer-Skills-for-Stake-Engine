---
name: engine-game-developer
description: Build or audit an Engine casino game from math model through publication. Use for current Engine RGS and wallet integration, static book generation, event-driven PixiJS/Svelte frontends, replay mode, math risk checks, social-casino language, approval preparation, or end-to-end release readiness.
---

# Engine Game Developer

Build games as deterministic static-math products: the RGS selects a recorded
outcome, the frontend renders its events, and wallet state remains server-owned.
Use the live Engine docs for platform facts; do not substitute model memory.

## Workflow

1. **Frame the product.** Record the theme, mechanic, original-asset plan,
   modes, cost multipliers, target RTP, max win, volatility, supported
   jurisdictions, distribution choice, and promotional blurb. Reject jackpots,
   gamble features, continuation, early cashout, or cross-round state.
2. **Design and simulate the math.** Load `references/math-model-structure.md`
   and `references/book-generation-validation.md`. Segment simulations by
   outcome criteria, optimize weights, and retain independently reproducible
   statistics and tail-risk evidence.
3. **Generate publication artifacts.** Produce `index.json`, one lookup CSV per
   mode, and zstd-compressed JSONL books. Run the book/index validator before
   frontend work is treated as release-ready.
4. **Define the event contract.** Load `references/rgs-event-contract.md`.
   Events contain every value needed to render the result; the frontend never
   recalculates RNG, wins, or settlement.
5. **Integrate RGS and recovery.** Load `references/engine-rgs.md`,
   `references/currency-rules.md`, and `references/engine-replay.md`.
   Authenticate first, resume active rounds, obey RGS bet/jurisdiction config,
   persist in-round progress, and keep replay sessionless.
6. **Build the frontend.** Load `references/frontend-integration.md` and
   `references/engine-frontend-checklist.md`. Add typed event stories before
   wiring each handler into the PixiJS/Svelte/XState runtime.
7. **Gate publication.** Run the deterministic validators, then complete
   `references/game-approval-checklist.md` and
   `references/compliance-checklist.md`. Any unresolved error is a release
   blocker.

## Commands

Run from this skill directory:

```bash
node scripts/validate-books-index.mjs --index <path/to/index.json> --format text
node scripts/validate-rgs-events.mjs --input <path/to/events.jsonl> --format text
node scripts/audit-checklist.mjs --rules references/compliance-rules.json --target <project-or-doc-path> --social true --format text
```

Use `--social false` only when the target is explicitly not intended for social
casino publication. Treat non-zero exits as hard blockers.

## References

- `references/workflow.md`: End-to-end process and required gates.
- `references/book-generation-validation.md`: Book generation and index validation expectations.
- `references/rgs-event-contract.md`: Required event order and field expectations.
- `references/frontend-integration.md`: Deterministic player integration patterns.
- `references/compliance-checklist.md`: Engine checklist and jurisdiction requirements.
- `references/compliance-rules.json`: Machine-readable language and disclosure checks.
- `references/game-approval-checklist.md`: Comprehensive QA/Release sign-off gates.
- `references/engine-rgs.md`: Current Engine RGS and wallet flow.
- `references/engine-replay.md`: Current public replay contract.
- `references/engine-frontend-checklist.md`: Frontend approval checklist.
- `references/currency-rules.md`: Wallet micro-units and book multiplier scale.

## Execution rules

- Fetch current platform facts from <https://studio.engine.io/docs>.
- Keep RNG, outcome selection, payout, balance mutation, and settlement
  deterministic and outside generative-model control.
- Use integer wallet amounts. Do not use binary floating point for money.
- Do not infer payout from animation state. Book events and RGS responses are
  the source of truth.
- Validate contracts before visual tuning, and visual behavior before approval.
- Report exact evidence, commands, and unresolved risks; never grant approval
  from a prompt-only review.
