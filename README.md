# Engine Casino Game Development Skills

Production-oriented AI skills for designing, building, validating, and publishing
games on [Engine](https://studio.engine.io/docs). The collection covers the
static-math game format, Engine RGS integration, frontend event playback,
simulation and optimization, approval gates, and AI-assisted studio workflows.

The Engine-specific guidance was reviewed against the live documentation on
2026-10-02. External AI capability references are limited to sources published
within the previous three months. See [docs/SOURCES.md](docs/SOURCES.md).

## Start here

- **`engine-game-developer`**: Canonical end-to-end Engine workflow. Use this
  first for a new game or a release-readiness review.
- **`senior-game-math-engineer`**: Math model, simulation diversity, RTP,
  volatility, tail-risk, and publication evidence.
- **`book-generator`**: Engine-compatible compressed books, lookup tables, and
  index metadata.
- **`pixi-svelte-integrator`**: Event-driven PixiJS and Svelte frontend
  integration.
- **`slot-qa-engineer`**: Math, RGS, replay, UI, performance, and jurisdiction
  test planning.

`stake-game-developer` remains as a compatibility alias for existing users.
New projects should use `engine-game-developer`.

## Skill catalog

### Engine platform

| Skill | Purpose |
| --- | --- |
| `engine-game-developer` | Build and validate an Engine game from brief through approval. |
| `stake-game-developer` | Backward-compatible alias for `engine-game-developer`. |
| `engine-platform-architect` | Design RGS, frontend, math, security, and release boundaries. |
| `stake-platform-architect` | Backward-compatible alias for `engine-platform-architect`. |
| `provider-integration` | Implement provider adapters, resilience, and contract checks. |
| `game-info-author` | Produce current game rules, mode disclosures, and disclaimer copy. |

### Game design and math

| Skill | Purpose |
| --- | --- |
| `game-math-director` | Set targets, governance, evidence, and release gates. |
| `senior-game-math-engineer` | Design and audit Engine-compatible game math. |
| `slot-mechanics-designer` | Specify mechanics, states, triggers, and edge cases. |
| `rtp-optimizer` | Tune RTP and distribution targets with simulation evidence. |
| `auto-balancer` | Iterate parameters against explicit metric constraints. |
| `book-generator` | Generate and validate weighted outcome books. |
| `rng-crypto-specialist` | Audit RNG and provably-fair workflows where applicable. |

### Frontend, UX, and media

| Skill | Purpose |
| --- | --- |
| `pixi-svelte-integrator` | Integrate PixiJS rendering with Svelte lifecycle and events. |
| `event-animation-designer` | Map ordered book events to deterministic animation. |
| `slot-ui-studio` | Build reusable production UI systems. |
| `ui-slot-ux-designer` | Specify responsive and accessible player flows. |
| `autoplay-system-designer` | Define autoplay confirmations and stop conditions. |
| `turbo-spin-designer` | Define fast-play timing without changing outcomes. |
| `css-motion-designer` | Design CSS motion with reduced-motion support. |
| `slot-audio-engineer` | Design and validate audio behavior. |
| `slot-vfx-artist` | Design and validate visual-effects behavior. |
| `ux-retention-designer` | Design ethical, measurable engagement loops. |

### AI-assisted development

| Skill | Purpose |
| --- | --- |
| `ai-game-designer` | Use multimodal, tool-using models to produce testable design artifacts. |
| `ai-game-developer` | Build AI features with typed tools, evals, routing, and fallbacks. |
| `ai-slot-game-developer` | Apply AI without putting payout-critical logic at risk. |
| `multi-agent-orchestrator` | Coordinate parallel specialists and independent verification. |
| `fraud-detection-ai` | Design anomaly detection with calibrated review and audit trails. |
| `freud-detection-ai` | Backward-compatible alias for `fraud-detection-ai`. |

### Engineering and operations

| Skill | Purpose |
| --- | --- |
| `cpp-engine-core` | Develop stable C++ engine components. |
| `cpp-performance-engineer` | Profile and optimize measured bottlenecks. |
| `low-latency-systems` | Improve p50/p95/p99 request paths. |
| `parallel-computing` | Scale CPU and worker workloads safely. |
| `wasm-integration` | Integrate and validate WebAssembly artifacts. |
| `telemetry-analytics` | Define trustworthy events, metrics, and anomaly checks. |
| `slot-qa-engineer` | Plan and execute game release validation. |
| `studio-scaling` | Improve studio throughput and release governance. |

## Installation

Canonical skill directories contain their operating instructions and local
support files:

```text
<skill-name>/
├── SKILL.md
├── agents/openai.yaml        # when an OpenAI-compatible UI descriptor is used
├── references/               # deeper rules and templates
└── scripts/                  # deterministic validators
```

Copy the complete skill directory into the skills location supported by your
agent or IDE. Keep `references/` and `scripts/` beside `SKILL.md`; copying only
the prompt removes the deterministic checks that make the skill reliable.
Compatibility aliases intentionally point to their canonical sibling and should
be installed with it.

Common patterns:

- **Claude Code / agent skill clients**: copy the directory into the client's
  project or user skills directory.
- **OpenAI-compatible coding agents**: install the directory as a skill and
  retain `agents/openai.yaml`.
- **Cursor, Windsurf, and similar IDEs**: add the skill directory to the
  project's agent/rules context and invoke it by name.
- **Chat interfaces**: attach the complete directory or paste `SKILL.md` plus
  only the referenced files needed for the task.

## Example

```text
Use engine-game-developer and senior-game-math-engineer to design a 96% RTP
slot. Produce the mode contract, simulation plan, book/event schema, frontend
event map, approval checklist, and commands that verify every generated
artifact. Do not implement payout-critical behavior with a generative model.
```

## Repository validation

```bash
python3 scripts/validate_repository.py
```

The validator checks skill metadata, folder/name alignment, referenced local
files, command targets, malformed merge artifacts, and README catalog entries.

## Project

- Repository: https://github.com/ao-dexter/Slot-Casino-Game-Developer-Skills-for-Stake-Engine
- Engine documentation: https://studio.engine.io/docs
