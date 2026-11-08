# 02: Hear Glyphs from the grid

**What to build:** In a My Script's Glyph grid, every drawn Glyph's cell gets a small 🔊 corner button. Tapping it says the Glyph's Sound (or its plain letter when it has none) and glows the cell while it speaks. Tapping the cell itself still opens the drawing canvas, exactly as today. Missing Glyphs, space and punctuation cells get no 🔊. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** ready-for-human

- [x] Each drawn letter or digit cell shows a 🔊 corner button in the same fixed spot
- [x] 🔊 speaks through the Glyph-tap command from 01: its Sound, or the plain letter ("bee") when it has none
- [x] The cell glows while speaking; a new tap cuts off the last one; muted taps glow and wiggle the mute button
- [x] Tapping the cell outside 🔊 still opens the canvas for that slot
- [x] Missing Glyphs and the space and punctuation cells have no 🔊

## Comments

- 2026-11-08 (agent): The 🔊 is a sibling of the cell button (not nested inside it), in the top-right corner. It calls `core.glyphTap(id, slot)` and glows the cell via `tapToHear`. Code-review fix: leaving the grid stops speech. No new core tests (01's cover the tap rules); the DOM wiring is untested.
- Left for Dad: check by eye that 🔊 sits in the same spot on every cell, tapping the cell still opens the canvas, and Missing Glyphs, space and punctuation have no 🔊.
