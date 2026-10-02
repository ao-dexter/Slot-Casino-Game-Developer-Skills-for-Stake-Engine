# Engine Game Delivery Workflow

## 1. Product contract

Produce a one-page contract containing:

- original theme and mechanic;
- mode names, cost multipliers, RTP targets, max win, and volatility targets;
- state diagram and event vocabulary;
- jurisdiction and localization targets;
- distribution choice and release blurb;
- explicit exclusions: jackpots, gamble features, continuation, early cashout,
  and cross-round state.

## 2. Math

Implement with the current Engine Python framework, then:

- run invariant tests;
- generate segmented simulations;
- optimize final weights;
- regenerate statistics from final weights;
- validate critical approval limits and risk tiers;
- package index, lookup CSVs, and compressed books.

## 3. Frontend contract

Before production animation:

- generate TypeScript types and fixtures from real book events;
- create one focused Storybook story per event;
- map events through deterministic handlers;
- prove skip/fast/reduced-motion parity;
- implement live RGS, active-round resume, and public replay as separate entry
  flows.

## 4. Approval evidence

Collect:

- math report and reproducibility metadata;
- hashes and sizes for publication files;
- normal, large, max, zero, and feature replay IDs for every mode;
- mobile, mini-player, language, currency, and social-casino results;
- current disclaimer, game rules, UI guide, RTP, max win, and mode costs;
- console/network review and asset provenance.

## 5. Release gates

All must pass:

1. publication file contract;
2. math critical checks;
3. tail-risk and bet-template assessment;
4. event contract and terminal payout reconciliation;
5. wallet, active-round resume, and replay behavior;
6. frontend communication and jurisdiction language;
7. final review against the live official Engine documentation.

Return blocked status with exact evidence for any unresolved gate.
