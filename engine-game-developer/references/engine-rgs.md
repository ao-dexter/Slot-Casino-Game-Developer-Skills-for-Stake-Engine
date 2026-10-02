# Engine RGS and Wallet Contract

Reviewed against:

- <https://studio.engine.io/docs/rgs>
- <https://studio.engine.io/docs/rgs/wallet>
- <https://studio.engine.io/docs/rgs/example>

## Launch contract

Engine serves the uploaded static frontend with a URL shaped like:

```text
https://{{.TeamName}}.cdn.engine.io/{{.GameID}}/{{.GameVersion}}/index.html?sessionID={{.SessionID}}&lang={{.Lang}}&device={{.Device}}&rgs_url={{.RgsUrl}}
```

Parse and validate:

| Parameter | Rule |
| --- | --- |
| `sessionID` | Opaque player session token. Do not log or persist it. |
| `lang` | Runtime language selection. Do not assume English. |
| `device` | `mobile` or `desktop`. Responsive layout still decides from actual dimensions. |
| `rgs_url` | Base URL for every RGS request. Never hard-code an environment host. |

Replay has a separate public, sessionless launch contract. See
`engine-replay.md`.

## Required live-session sequence

1. **Authenticate first**

   ```http
   POST {rgs_url}/wallet/authenticate
   Content-Type: application/json

   {"sessionID":"..."}
   ```

   Every other wallet endpoint requires successful authentication. Otherwise
   Engine returns `ERR_IS`.

2. **Hydrate server-owned state**

   Read:

   - `balance.amount` and `balance.currency`;
   - `config.minBet`, `maxBet`, `stepBet`, `defaultBetLevel`, and `betLevels`;
   - `config.jurisdiction`, including flags such as `socialCasino`,
     `disabledFullscreen`, and `disabledTurbo`;
   - `round`.

   The returned round can be active or the last completed round. If it is
   active, resume it before enabling a new play.

3. **Start a round**

   ```http
   POST {rgs_url}/wallet/play

   {"amount":1000000,"sessionID":"...","mode":"BASE"}
   ```

   Validate the amount against the authenticated min/max/step/bet-level
   contract. The actual debit is:

   ```text
   base bet amount × selected mode cost multiplier
   ```

   Render the returned round events; do not recalculate the outcome.

4. **Persist in-round progress when needed**

   ```http
   POST {rgs_url}/bet/event

   {"sessionID":"...","event":"..."}
   ```

   Use this for resumable player actions within an active round.

5. **End the round**

   ```http
   POST {rgs_url}/wallet/end-round

   {"sessionID":"..."}
   ```

   Refresh the displayed balance from the response.

6. **Refresh balance when required**

   ```http
   POST {rgs_url}/wallet/balance

   {"sessionID":"..."}
   ```

## Amount contract

- Wallet amounts are integers with six decimal places of precision.
- `1_000_000` represents one currency unit.
- Use integer arithmetic and explicit decimal parsing.
- Never infer wallet currency or use a symbol hard-coded for USD.

## Errors

| HTTP class | Code | Handling |
| --- | --- | --- |
| 400 | `ERR_VAL` | Reject the request and surface a safe validation message. |
| 400 | `ERR_IPB` | Stop play and refresh balance. |
| 400 | `ERR_IS` | Stop requests and re-authenticate through the host flow. |
| 400 | `ERR_ATE` | Treat authentication as expired. |
| 400 | `ERR_GLE` | Stop play; do not offer bypass or automatic retry. |
| 400 | `ERR_LOC` | Stop play for the current location. |
| 500 | `ERR_GEN` | Preserve state and allow a bounded retry. |
| 500 | `ERR_MAINTENANCE` | Disable play and show maintenance state. |

## Non-negotiable invariants

- Never send wallet calls before authentication.
- Never expose `sessionID` in logs, analytics, error reports, or replay URLs.
- Never unlock controls that the jurisdiction config disables.
- Never start another play while a round is active.
- Never update balance from animation timing or locally calculated payout.
