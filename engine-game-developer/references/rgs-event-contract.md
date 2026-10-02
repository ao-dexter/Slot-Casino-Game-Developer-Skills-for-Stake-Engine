# RGS Event Contract

Events are game-owned typed messages recorded in each static book. The
`events` list is returned by the play API and is the frontend's source of truth.
See <https://studio.engine.io/docs/math/source-files/events> and
<https://studio.engine.io/docs/front-end/adding-new-events>.

## Shape

Every event requires a stable `type`. Engine sample frontends also use a
contiguous `index` so playback order can be checked explicitly:

```json
{
  "index": 0,
  "type": "reveal",
  "board": []
}
```

Payload fields are event-specific. Prefer top-level typed fields that map
directly to TypeScript discriminated unions.

## Design invariants

- The event list is deterministic and ordered.
- It contains every board, symbol attribute, multiplier, win component,
  feature counter, and terminal value required for playback.
- Events never require the frontend to rerun math or random selection.
- Cumulative win events are monotonic and the terminal win equals the book
  `payoutMultiplier`.
- Maximum-win events stop later payout growth.
- A resumed active round can continue from persisted event progress.
- Unknown future event types fail visibly in development instead of being
  silently ignored.

Common sample-framework events include `reveal`, `winInfo`, `setWin`,
`setTotalWin`, `updateGlobalMult`, `updateFreeSpin`, `freeSpinEnd`, and
`finalWin`. These are examples, not a closed platform enum.

## Frontend implementation loop

For every new event:

1. Add representative event and full-book fixtures.
2. Add the event to the TypeScript `BookEvent` union.
3. Add a typed handler to the handler map.
4. Emit small component-level UI events where useful.
5. Add a focused Storybook event story.
6. Add or update an integrated book story.
7. Verify normal, fast-play, reduced-motion, replay, and resume behavior.

## Validation Command

```bash
node scripts/validate-rgs-events.mjs --input path/to/events.jsonl --format text
```

Accepted input includes JSONL book rows, an event array, an object with
`events`, or an object with `rounds`.
