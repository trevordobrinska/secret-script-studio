# 02: Hear Glyphs from the grid

**What to build:** In a My Script's Glyph grid, every drawn Glyph's cell gets a small 🔊 corner button. Tapping it says the Glyph's Sound (or its plain letter when it has none) and glows the cell while it speaks. Tapping the cell itself still opens the drawing canvas, exactly as today. Missing Glyphs, space and punctuation cells get no 🔊. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** ready-for-agent

- [ ] Each drawn letter or digit cell shows a 🔊 corner button in the same fixed spot
- [ ] 🔊 speaks through the Glyph-tap command from 01: its Sound, or the plain letter ("bee") when it has none
- [ ] The cell glows while speaking; a new tap cuts off the last one; muted taps glow and wiggle the mute button
- [ ] Tapping the cell outside 🔊 still opens the canvas for that slot
- [ ] Missing Glyphs and the space and punctuation cells have no 🔊
