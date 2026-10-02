# Engine Bet Replay

Reviewed against
<https://studio.engine.io/docs/approval-guidelines/game-replay-requirements>.
Replay is mandatory for new-game approval.

## Launch parameters

Required:

- `replay=true`
- `game`
- `version`
- `mode`
- `event`
- `rgs_url`

Optional:

- `currency`
- `amount`
- `lang`
- `device`
- `social`

Do not require, read, or synthesize `sessionID` in replay mode. Replay URLs are
publicly shareable and must not contain player credentials.

## Fetch contract

```http
GET {rgs_url}/bet/replay/{game}/{version}/{mode}/{event}
```

```json
{
  "payoutMultiplier": 25.0,
  "costMultiplier": 1.0,
  "state": {}
}
```

Treat `state` as the recorded round/book payload. Use the response and optional
query values for display; never call authenticate, balance, play, end-round, or
in-round event endpoints.

## Required experience

1. Detect replay before live-session initialization.
2. Parse and validate the required parameters.
3. Auto-fetch the replay payload and show loading/error states.
4. Present an explicit **Play** action.
5. Render the complete original animation, sound, and final result.
6. Hide or disable every live betting control.
7. Present **Play Again**, which replays the same payload only.

Do not allow replay to transition into real-money or social play.

## Per-mode evidence

Provide replay URLs for:

- zero payout;
- ordinary win;
- large win;
- maximum-win cap;
- feature trigger and retrigger, when supported;
- any rare event with specialized frontend handling.
