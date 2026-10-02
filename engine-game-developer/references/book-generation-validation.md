# Engine Math Publication Files

Reviewed against:

- <https://studio.engine.io/docs/math/math-file-format>
- <https://studio.engine.io/docs/math/source-files/outputs>
- <https://studio.engine.io/docs/math/game-state-structure/simulation-acceptance>

## Required files

For each game, upload:

1. `index.json`
2. one lookup-table CSV per mode
3. one zstd-compressed JSONL events/book file per mode

`index.json` has a strict shape:

```json
{
  "modes": [
    {
      "name": "base",
      "cost": 1.0,
      "events": "books_base.jsonl.zst",
      "weights": "lookUpTable_base_0.csv"
    }
  ]
}
```

Each mode requires non-empty `name`, positive `cost`, an `events` filename
ending in `.jsonl.zst`, and a `weights` filename ending in `.csv`.

## Lookup table

Each row contains unsigned integers:

```text
simulation id, probability weight, payout multiplier
```

```csv
1,199895486317,0
2,25668581149,20
3,126752606,140
```

For every recorded round:

- ID exists once in the CSV and book;
- probability is positive for selectable rounds;
- payout multiplier is non-negative;
- the CSV payout integer exactly equals the book `payoutMultiplier`.

## Book rows

Uncompressed, every JSONL row has at least:

```json
{"id":1,"events":[],"payoutMultiplier":1150}
```

`1150` represents `11.5x`. Upload the zstd-compressed `.jsonl.zst` artifact;
retain a small uncompressed sample for frontend stories and debugging.

## Diversity and size gates

- No mode contains more than `10_000_000` events.
- No compressed events file exceeds `4.2 GB`.
- Slot-type modes should normally use `100_000` to `1_000_000` simulations.
- Segment acceptance criteria for zero payouts, base wins, features, and max
  wins so rare paths have sufficient unique examples.
- Check dominant single-outcome weight, duplicate visual outcomes, zero-weight
  rows, and gaps in obtainable win ranges.

## Validation

```bash
node scripts/validate-books-index.mjs --index path/to/index.json --format text
```

The local validator checks the index contract and referenced artifact metadata.
Publication readiness also requires a streaming CSV/book comparison and
statistical report; never decompress a multi-gigabyte book fully into memory.
