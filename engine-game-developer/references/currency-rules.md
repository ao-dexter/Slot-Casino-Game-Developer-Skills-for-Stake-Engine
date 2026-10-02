# Engine Amount and Multiplier Scales

Engine uses two integer scales. They represent different units and must never be
interchanged.

| Context | Integer scale | Example |
| --- | --- | --- |
| Wallet/RGS money | \(10^6\) micro-units per currency unit | `1_000_000` = `1.000000` unit |
| Static-book payout multiplier | \(10^2\) hundredths of `x` | `1150` = `11.50x` |

## Wallet amounts

`balance.amount`, wallet play amounts, and authenticated bet configuration are
integer micro-units.

```text
display units = wallet integer / 1_000_000
wallet integer = exact decimal units × 1_000_000
```

Parse decimal input as text, reject more than six fractional digits, and create
the integer exactly. Do not use `Math.floor(display * 1_000_000)` as a general
conversion rule: binary floating-point error can silently undercharge or
overcharge.

Use the currency code returned by RGS with an appropriate locale-aware
formatter. Social currencies can require different labels and no fiat symbol.

## Book multipliers

Every static round contains an integer `payoutMultiplier`. The third column of
the lookup CSV must contain the identical integer for the same round ID.

```text
multiplier x = payoutMultiplier / 100
```

Example:

```json
{"id":1,"events":[],"payoutMultiplier":1150}
```

This round represents `11.5x`; it does not represent a wallet amount.

For display only:

```text
base-bet win in wallet micro-units =
  base-bet micro-units × payoutMultiplier / 100
```

Settlement remains RGS-owned. The frontend may calculate a display preview from
recorded values, but must not mutate balance or replace the returned final
state.

## Checks

- [ ] Wallet values are integers and use the six-decimal scale.
- [ ] Bet validation uses authenticated min/max/step/bet levels.
- [ ] Book and lookup payout integers match by ID.
- [ ] Payout arithmetic is exact and defines rounding behavior.
- [ ] Currency formatting is separate from amount arithmetic.
- [ ] Tests cover sub-unit bets, six-decimal bets, maximum bets, and social
      currency presentation.
