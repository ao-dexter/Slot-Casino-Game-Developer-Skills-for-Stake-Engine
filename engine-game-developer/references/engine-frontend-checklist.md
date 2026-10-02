# Engine Frontend Approval Checklist

Reviewed against:

- <https://studio.engine.io/docs/front-end>
- <https://studio.engine.io/docs/approval-guidelines/front-end-communication>
- <https://studio.engine.io/docs/approval-guidelines/game-replay-requirements>

## Runtime and build

- [ ] Upload consists of static files and resolves assets from relative or
      Engine CDN paths.
- [ ] Images, fonts, audio, and other runtime assets do not depend on
      third-party origins.
- [ ] Production console and network logs contain no errors, credentials, or
      game/book data.
- [ ] `rgs_url` and launch parameters are read at runtime, not compiled for one
      environment.
- [ ] TypeScript book-event types are exhaustive.
- [ ] Each event handler has a focused Storybook story plus an integrated book
      story.
- [ ] XState/runtime states prevent overlapping live plays and recover active
      rounds.

## Originality and assets

- [ ] Backgrounds, symbols, animation, and audio are original and cleared for
      commercial use.
- [ ] Sample SDK assets are not shipped as production art.
- [ ] Assets do not use Stake branding or themes.
- [ ] Asset provenance and generation/edit history are retained.

## Layout and interaction

- [ ] Common mobile sizes are fully usable.
- [ ] Mini-player/popout keeps the active board and controls legible.
- [ ] Actual viewport dimensions, not only `device`, drive responsive layout.
- [ ] Fast-play still makes wins, combinations, and pop-ups legible.
- [ ] Sound can be disabled.
- [ ] Spacebar maps to the play action without breaking form controls.
- [ ] Autoplay requires confirmation and exposes stop conditions.
- [ ] Fullscreen and turbo respect RGS jurisdiction flags.
- [ ] Reduced-motion behavior preserves result comprehension.

## Rules and paytable

- [ ] Game information is accessible from the UI.
- [ ] Rules explain all mechanics, feature triggers, and special values.
- [ ] Every mode discloses cost multiplier, RTP, and maximum win.
- [ ] Symbol combinations and payouts are listed.
- [ ] UI controls have a concise guide.
- [ ] Promotional blurb matches the released game.

## Wallet and events

- [ ] Authenticate occurs before other wallet calls.
- [ ] Active rounds resume before new play is enabled.
- [ ] All authenticated bet levels are usable.
- [ ] Min, max, step, default, balance, currency, and jurisdiction config come
      from RGS.
- [ ] Displayed outcomes come only from recorded events/RGS state.
- [ ] Multi-step results increment to the exact final payout.
- [ ] Final non-zero win is clearly visible.
- [ ] Session tokens never enter logs, analytics, or error payloads.

## Replay

- [ ] Replay detects all required query parameters before live initialization.
- [ ] Replay fetches
      `GET {rgs_url}/bet/replay/{game}/{version}/{mode}/{event}`.
- [ ] Replay works without session or authorization.
- [ ] Live wallet calls and betting controls are disabled.
- [ ] Loading, error, Play, full playback, final result, and Play Again states
      are implemented.

## Release evidence

- [ ] Playtests cover multiple currencies and languages.
- [ ] Ten representative wins per mode match the published rules.
- [ ] Rare/maximum outcomes have deterministic replay URLs.
- [ ] The required current Engine disclaimer is present.
