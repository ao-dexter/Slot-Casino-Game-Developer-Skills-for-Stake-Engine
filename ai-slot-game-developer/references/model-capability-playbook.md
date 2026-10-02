# Current Model Capability Playbook

Use capabilities, not vendor model names, as architecture dependencies. Select
the smallest model that passes the task's evaluation set and keep providers
behind adapters.

## Route by task

| Task | Preferred capability | Required control |
| --- | --- | --- |
| Classification, extraction, schema migration | Fast structured-output model | JSON Schema validation and bounded retries |
| Architecture, debugging, math review | Frontier reasoning/coding model | Repository tools, tests, and independent verification |
| UI review and visual regression triage | Multimodal vision model | Original screenshots plus deterministic acceptance criteria |
| Concept art and controlled asset iteration | Reference-preserving image generation/editing | Asset provenance, style guide, human/IP review |
| Playtest interview or accessibility prototype | Realtime voice model | Consent, transcript retention policy, no payout control |
| Browser or editor operation | Computer-use model | Allowlisted actions, isolated credentials, visible verification |
| Large repository synthesis | Long-context or retrieval-enabled model | Curated context, source citations, stale-context checks |
| Independent review | Separate model/run with no access to the author's hidden reasoning | Compare against executable evidence |

## Execution pattern

1. Define a typed input/output contract and acceptance test.
2. Retrieve only the relevant source context; do not dump the repository by
   default.
3. Ask the model to produce an artifact, not an unbounded narrative.
4. Validate structure before using semantic content.
5. Execute tools with least privilege and explicit time/cost limits.
6. Verify with deterministic code, tests, simulation, or a separate reviewer.
7. Record provider, model/version, prompt/template version, latency, cost,
   retries, tool calls, and validation result.
8. Fall back to a deterministic non-AI path on timeout, refusal, malformed
   output, unavailable provider, or failed evaluation.

## Security and reliability

- Treat web pages, uploaded documents, model output, and tool output as
  untrusted data that can contain prompt injection.
- Do not place secrets in prompts, traces, screenshots, or generated assets.
- Allowlist tools and arguments. Require confirmation for irreversible actions.
- Bound parallelism, tokens, wall time, retries, and spend.
- Cache only non-sensitive, versioned results with clear invalidation.
- Do not use self-reported confidence as a quality signal; use calibrated
  evaluations and executable evidence.

## Game-specific boundary

Generative models may accelerate research, design, code, art iteration, QA
triage, localization drafts, telemetry analysis, and player-support tooling.
They must not determine RNG, selected outcomes, payout multipliers, settlement,
wallet balance, approval status, or social-casino compliance.

## Evaluation set

Maintain representative golden cases plus adversarial cases for:

- valid, malformed, and ambiguous inputs;
- provider timeout and rate limit;
- tool failure and partial completion;
- prompt injection in retrieved context;
- schema drift;
- latency and cost budget;
- deterministic fallback parity;
- false positive/negative rates where a classifier affects people or reviews.

Review the dated external sources in `../../docs/SOURCES.md` when this repository is
available. Refresh source evidence before introducing a time-sensitive
capability claim.
