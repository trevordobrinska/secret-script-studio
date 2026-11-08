# 01: Give a Glyph a Sound and try it on the canvas

**What to build:** On the Glyph drawing screen, each letter and digit slot gets a "How does it sound?" box (about 12 characters) with a 🔊 "try it" button next to it. He types a Sound, like "kla", taps 🔊, and the tablet's English voice says it at 0.8×. The Sound saves with **Save** / **Save & next** together with his drawing. It's already in the box when he comes back to redraw the Glyph, and it survives reloading the app and a Backup/Restore round trip. This ticket adds the core's Glyph-tap command (what tapping a Glyph says), which tickets 02 and 03 build on. See `.scratch/glyph-sounds/spec.md` and DESIGN.md "Sounds".

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A Glyph can carry an optional Sound; stored My Scripts and existing backup files without Sounds load unchanged (no schema version bump)
- [ ] Saving a Glyph takes its Sound: trimmed, cut to 12 characters, and a blank box means no Sound
- [ ] Saving with no strokes is still "empty", even with a Sound typed (a Sound belongs to a drawn Glyph)
- [ ] Redrawing keeps the Sound shown in the box; emptying the box and saving removes it; Clear all clears only the drawing
- [ ] Space and punctuation slots have no Sound box, and a Sound passed for them is ignored
- [ ] The Glyph-tap command returns English speech at SPEECH_RATE for the given text (the unsaved box text for "try it"), or the plain letter or digit when there's no Sound, or `muted` when muted
- [ ] 🔊 glows while speaking, cuts off any earlier speech, and while muted it still glows and wiggles the mute button once
- [ ] Core tests through StudioCore cover saving and reloading Sounds, the save rules above, the tap results and a backup/restore round trip with Sounds
