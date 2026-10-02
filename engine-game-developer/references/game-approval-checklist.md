# Engine Game Approval Checklist

Reviewed 2026-10-02 against
<https://studio.engine.io/docs/approval-guidelines> and its current subpages.

## Product and pre-checks

- [ ] Game is finalized and includes a short promotional blurb.
- [ ] Every play is independent of previous outcomes.
- [ ] No jackpot, gamble feature, continuation, or early cashout exists.
- [ ] Theme, title, assets, and code are original and commercially cleared.
- [ ] Production assets do not contain Stake branding or sample-SDK art.
- [ ] Theme and presentation do not target or depict underage persons.
- [ ] Submitted frontend and math versions are the exact release candidates.

## Critical math checks

- [ ] A base mode exists at `1.0x` cost and is the cheapest mode.
- [ ] Base-mode standard deviation is at least `0.6`.
- [ ] Every mode RTP is between `90.0%` and `96.7%`.
- [ ] Highest and lowest mode RTP differ by no more than `0.5` percentage
      points.
- [ ] Maximum payout multiplier is no more than `500_000x`.
- [ ] Maximum cost multiplier is no more than `2_000x`.
- [ ] Every mode has a non-zero win at least once per 50 plays.
- [ ] At least one Engine bet-level template satisfies cost and exposure limits.
- [ ] Every mode has at most `10_000_000` events.
- [ ] Every `.jsonl.zst` events file is at most `4.2 GB`.

## Distribution quality

- [ ] Cost, RTP, and maximum win in rules match final weighted statistics.
- [ ] Maximum win is realistically obtainable; Engine guidance says typically
      more frequent than 1 in `10_000_000`, depending on payout.
- [ ] Slot modes include roughly `100_000` to `1_000_000` simulations unless
      a documented design reason justifies another count.
- [ ] Non-paying results do not dominate to a misleading degree.
- [ ] No single simulation probability overwhelms expected visual diversity.
- [ ] Non-zero-weight payouts and hit-rate ranges contain no unexplained gaps.
- [ ] Lookup payout integers match book payout integers by simulation ID.

## Operator-risk checks

Calculate per mode and report the worst case across modes:

| Check | 2-Star limit | 3-Star limit |
| --- | ---: | ---: |
| Starting maximum exposure | $15,000,000 | $50,000,000 |
| Starting maximum bet cost | $100,000 | $500,000 |
| Maximum payout multiplier | 50,000x | 100,000x |
| Maximum cost multiplier | 1,000x | 2,000x |
| Maximum base standard deviation | 50.0 | 60.0 |
| CVaR per stake | 700 | 700 |
| CVaR absolute | 20,000 | 50,000 |
| \(P(\ge 5,000x)\) | 0.010 | 0.050 |
| \(P(\ge 10,000x)\) | 0.005 | 0.010 |
| ETL above 40x | 0.8 | 0.9 |
| ETL above 10,000x | 0.6 | 0.8 |
| ETL sum | 1.3 | 1.5 |

- [ ] Failed checks are grouped into Engine's six failure classes.
- [ ] Penalty-adjusted exposure and bet-cost caps are calculated.
- [ ] Worst-case payout equals max payout multiplier × max base bet and fits
      the applicable exposure cap.
- [ ] Worst-case round cost equals max cost multiplier × max base bet and fits
      the applicable bet-cost cap.
- [ ] Total bet cost never exceeds the RGS ceiling of $500,000 equivalent.
- [ ] Potential single-play payout never exceeds $50,000,000 equivalent.

## RGS and recovery

- [ ] Launch uses runtime `sessionID`, `lang`, `device`, and `rgs_url`.
- [ ] Authenticate completes before every other wallet endpoint.
- [ ] Balance, currency, min/max/step/default bet, bet levels, and jurisdiction
      flags come from authentication.
- [ ] An active authenticated round resumes before a new play is enabled.
- [ ] Mode debit uses base bet × cost multiplier.
- [ ] In-round progress is persisted when the mechanic requires recovery.
- [ ] End-round and displayed balance use RGS responses.
- [ ] Session tokens never enter logs, telemetry, or replay URLs.
- [ ] Every documented RGS error has a safe terminal or retry state.

## Frontend and communication

- [ ] Production build is static and all images/fonts load from Engine CDN
      paths.
- [ ] No broken assets, visual bugs, console errors, or game-data logging.
- [ ] Mobile and mini-player layouts keep game and controls usable.
- [ ] Fast-play keeps winning combinations, values, and pop-ups legible.
- [ ] Rules, paytable, UI guide, mode costs, RTP, max win, special values, and
      feature triggers are accessible.
- [ ] Player can select every RGS-provided bet level.
- [ ] Current balance and final non-zero win are clear.
- [ ] Multi-action payout display reaches the exact recorded final value.
- [ ] Sound can be disabled and spacebar activates play safely.
- [ ] Autoplay requires confirmation and can be stopped.
- [ ] Unique events have typed handlers and isolated/integrated stories.

## Replay

- [ ] Replay accepts required `replay`, `game`, `version`, `mode`, `event`, and
      `rgs_url` parameters.
- [ ] Replay accepts optional currency, amount, language, device, and social
      parameters.
- [ ] Replay loads publicly without authorization or player session.
- [ ] Replay fetches the documented RGS replay endpoint.
- [ ] Live wallet calls and play controls remain disabled.
- [ ] Play, full animation, final state, and Play Again work.
- [ ] Review evidence contains zero, normal, large, max, and feature IDs for
      every applicable mode.

## Jurisdiction and disclaimer

- [ ] `social=true` selects compliant language, preferably via
      `sweeps_<lang>`.
- [ ] Restricted gambling language is absent from text, images, controls,
      errors, and replay.
- [ ] SC/GC presentation and currency symbols are correct.
- [ ] Rules include this current Engine template or an equivalent message:

> Malfunction voids all wins and plays. A consistent internet connection is
> required. In the event of a disconnection, reload the game to finish any
> uncompleted rounds. The expected return is calculated over many plays. The
> game display is not representative of any physical device and is for
> illustrative purposes only. Winnings are settled according to the amount
> received from the Remote Game Server and not from events within the web
> browser. TM and © 2026 Engine.

## Post-release constraint

- [ ] Team understands that after approval only minor visual fixes are normally
      permitted; math, new modes, and gameplay-mechanic changes require explicit
      Engine direction.
