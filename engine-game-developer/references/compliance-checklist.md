# Engine Compliance Gate

Run the deterministic text audit on release rules, localization, controls, and
error messages:

```bash
node scripts/audit-checklist.mjs \
  --rules references/compliance-rules.json \
  --target <path> \
  --social true \
  --format text
```

## Review beyond text matching

- Verify `social=true` selects social-casino copy, preferably from
  `sweeps_<lang>`.
- Inspect text baked into images, Spine assets, video, and audio.
- Inspect rules, controls, confirmations, errors, insufficient-balance copy,
  autoplay, feature entry, and replay.
- Verify SC/GC labels and the absence of inappropriate fiat symbols.
- Verify all required disclosures against the current live Engine docs.
- Treat automated matches as findings to review in context; the official
  jurisdiction table is authoritative.

## Required platform checks

- Runtime `rgs_url` is used for RGS and replay requests.
- RGS bet levels, limits, balance, currency, and jurisdiction flags are obeyed.
- Replay is public and contains no player session.
- Current Engine disclaimer or an equivalent message is present.
- Game remains stateless and contains none of the prohibited mechanics.

Any unresolved violation blocks a release recommendation.
