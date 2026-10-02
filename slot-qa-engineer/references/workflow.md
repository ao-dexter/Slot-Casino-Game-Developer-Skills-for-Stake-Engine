# QA Workflow

1. Freeze the game/version, modes, math artifacts, frontend build, RGS target,
   and jurisdiction matrix.
2. Trace requirements into deterministic, integration, visual, accessibility,
   recovery, replay, performance, and compliance tests.
3. Create controlled fixtures for zero, ordinary, feature, large, and
   maximum-win rounds.
4. Run automated checks before focused UI/device testing.
5. Record evidence, environment, build hash, severity, and reproducible steps.
6. Re-run affected suites after fixes and complete a final release gate.

Treat math, settlement, active-round recovery, public replay, and jurisdiction
failures as release blockers.
