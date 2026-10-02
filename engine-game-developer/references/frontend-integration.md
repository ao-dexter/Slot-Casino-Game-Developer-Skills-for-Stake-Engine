# Frontend Integration

The frontend is a deterministic event player. It does not select outcomes,
re-run game math, settle balances, or infer wins from animation.

## Recommended current stack

The official Engine frontend framework uses PixiJS, Svelte 5, TypeScript,
Turborepo, Storybook, XState, pnpm, and an event-emitter/context architecture.
Use the framework version current in the official docs and repository rather
than pinning versions in this skill.

## Architecture

Separate:

- RGS client and launch-parameter parsing;
- authenticated session and jurisdiction state;
- typed book-event playback;
- XState game/runtime states;
- PixiJS scene components;
- Svelte HTML overlays and controls;
- audio, layout, localization, and accessibility services.

One event handler should coordinate a small set of component-level UI events.
Avoid a global handler with untyped payloads.

## Playback

1. Validate the recorded round.
2. Dispatch one typed book event.
3. Await its visual completion or deterministic skip result.
4. Update cumulative display values from event data.
5. Continue until the final event.
6. Reconcile terminal display with recorded payout and RGS balance.

Fast-play, skip, reduced-motion, replay, and resumed playback must converge on
the same terminal state.

## Test ladder

- pure component story with controlled props;
- focused event story with a single handler;
- integrated book story;
- replay URL for the exact production payload;
- mobile, mini-player, language, currency, social, turbo-disabled, and
  fullscreen-disabled variants.
