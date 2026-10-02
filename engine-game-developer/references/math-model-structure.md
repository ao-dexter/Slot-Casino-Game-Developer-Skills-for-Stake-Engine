# Engine Math Model Structure

The official Engine math framework is Python-based. Use its sample games and
current source documentation rather than inventing a parallel framework:
<https://studio.engine.io/docs/math/quick-start>.

## Configuration

Define, per game and mode:

- symbols, paytable, board/reel rules, and special attributes;
- base and feature state transitions;
- cost multiplier, RTP allocation, maximum win, and simulation count;
- acceptance criteria for zero wins, base wins, features, and max wins;
- optimization conditions, scaling biases, and distribution parameters.

The base mode must cost `1.0x` and be the cheapest mode.

## Game state

Keep separate values for:

- current action/spin win;
- cumulative round win;
- base-game and feature contributions;
- feature counters and multipliers;
- terminal final win.

Assert at record time that the final win equals the sum of all recorded win
contributions and does not exceed the configured cap.

## Recorded round

Every book row has:

```json
{
  "id": 1,
  "events": [],
  "payoutMultiplier": 1150
}
```

Use integer hundredths for `payoutMultiplier`. Events contain all presentation
state needed by the frontend.

## Optimization and evidence

- Assign mutually exclusive simulation IDs to acceptance criteria before runs.
- Put overlapping rare criteria, such as max-win within a feature, before the
  broader criterion.
- Optimize weighted distributions only after generated outcomes pass invariant
  checks.
- Recompute RTP, hit rates, standard deviation, tail probability, CVaR,
  expected tail liability, and maximum exposure from the final lookup weights.
- Preserve seeds, config, code revision, commands, and output hashes so the
  publication package can be reproduced independently.
