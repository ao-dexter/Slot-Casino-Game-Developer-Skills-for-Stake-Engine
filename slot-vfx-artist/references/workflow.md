# VFX Workflow

1. Map deterministic game events to visual intent and priority.
2. Storyboard normal, fast-play, reduced-motion, replay, and interruption paths.
3. Build effects from pooled particles, atlases, bounded shaders, and reusable
   timelines.
4. Keep visual state downstream of the event/book state; never infer payout
   from an animation.
5. Profile overdraw, texture memory, draw calls, shader compilation, frame
   pacing, and teardown on representative mobile hardware.
6. Verify max-win, feature, resize, background/foreground, replay, and rapid
   repeated-trigger fixtures.
7. Record source ownership, licenses, generation provenance, and human edits.
