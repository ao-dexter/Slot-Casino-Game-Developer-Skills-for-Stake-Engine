# Source policy and review ledger

## Policy

- Engine behavior, API contracts, file formats, math limits, and approval rules
  must come from the live official documentation at
  <https://studio.engine.io/docs>.
- Engine documentation is authoritative even when individual pages do not show
  a publication date. Record the date on which the live page was reviewed.
- Any non-Engine online source used to add time-sensitive information must have
  a publication date no earlier than three months before the review date.
- Product and model names are examples, not hard dependencies. Skills should
  describe required capabilities and use adapters so the best available model
  can be selected at execution time.
- Never let a generative model determine RNG, outcome selection, payout,
  settlement, balance mutation, or compliance decisions.

## Engine documentation reviewed 2026-10-02

| Area | Official pages |
| --- | --- |
| Platform and static game format | <https://studio.engine.io/docs> |
| RGS flow, currencies, bet levels, and errors | <https://studio.engine.io/docs/rgs>, <https://studio.engine.io/docs/rgs/wallet>, <https://studio.engine.io/docs/rgs/example> |
| Math framework and publication files | <https://studio.engine.io/docs/math/quick-start>, <https://studio.engine.io/docs/math/math-file-format>, <https://studio.engine.io/docs/math/high-level-structure/game-format>, <https://studio.engine.io/docs/math/source-files/outputs> |
| Simulation and optimization | <https://studio.engine.io/docs/math/game-state-structure/simulation-acceptance>, <https://studio.engine.io/docs/math/optimization-algorithm> |
| Frontend SDK and event playback | <https://studio.engine.io/docs/front-end>, <https://studio.engine.io/docs/front-end/adding-new-events>, <https://studio.engine.io/docs/front-end/context> |
| Approval, replay, and jurisdictions | <https://studio.engine.io/docs/approval-guidelines>, <https://studio.engine.io/docs/approval-guidelines/game-replay-requirements>, <https://studio.engine.io/docs/approval-guidelines/math-verification>, <https://studio.engine.io/docs/approval-guidelines/jurisdiction-requirements> |
| Publishing economics and distribution | <https://studio.engine.io/docs/payments>, <https://studio.engine.io/docs/distribution> |

## Recent AI capability sources

All sources below were published between 2026-07-02 and 2026-10-02.

| Published | Source | Capability used by this repository |
| --- | --- | --- |
| 2026-09-29 | <https://openai.com/index/introducing-gpt-6-1-sol> | Strong coding and computer-use models make long-running implementation and UI validation workflows practical. |
| 2026-09-08 | <https://openai.com/index/introducing-chatgpt-images-2-5/> | Reference-preserving image generation and precise multi-turn edits support controlled concept and asset iteration. |
| 2026-09-10 | <https://openai.com/index/introducing-gpt-live-1-in-the-api/> | Realtime voice models can delegate deeper reasoning and tool calls while maintaining interactive sessions. |
| 2026-09-30 | <https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/> | Long-horizon reasoning, multimodal understanding, and very large contexts enable whole-repository analysis when paired with rigorous verification. |

## Maintenance

Before changing an Engine-specific fact:

1. Re-open the relevant live Engine page.
2. Update the reviewed date in this file.
3. Prefer links to exact documentation pages over copied prose.
4. If an external source is required, record its publication date and reject it
   when it falls outside the requested three-month freshness window.
