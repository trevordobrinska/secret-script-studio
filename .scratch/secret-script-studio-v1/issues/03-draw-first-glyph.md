# 03: Draw the first Glyph

**What to build:** The kid can create a My Script (name, ink color, stroke width), see its grid of Glyph slots (A–Z, 0–9, the extra digits ten to fifteen, space, `. , ? !`) with empty ones as dotted boxes, tap a slot, draw a Glyph with his finger, and save it. The Glyph appears in the grid and is still there after closing and reopening the app.

**Blocked by:** 01 (Scaffold, deploy and home screen)

**Status:** ready-for-agent

- [ ] Core: create a My Script; save a Glyph's strokes for a slot; redraw a slot; query which slots are missing (tested)
- [ ] Strokes are stored normalized to the canvas square (0–1); stroke width comes from the My Script
- [ ] Glyph canvas: big square, faint baseline and x-height guides, undo, clear, shows which letter or digit is being drawn; reuses the Doodle Monsters stroke-capture approach
- [ ] Glyph renderer draws strokes onto a canvas at any size, in the My Script's ink
- [ ] IndexedDB storage adapter with database `secret-script-studio` (Arcade storage rule); the app uses it, tests use in-memory
- [ ] Persistence test: a new core on the same storage sees the My Script and its Glyphs
- [ ] At least one My Script exists to reach the grid (single-script flow is fine; managing many is ticket 05)
