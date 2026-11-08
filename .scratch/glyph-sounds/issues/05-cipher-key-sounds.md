# 05: Sounds on the printed Cipher Key

**What to build:** When he prints a Message with its Cipher Key, each Glyph that has a Sound shows it under its letter, so whoever decodes the Message also learns how to say it. Glyphs without a Sound print exactly as today. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** resolved

- [x] Each Cipher Key entry carries the Glyph's optional Sound
- [x] The printed key shows the Sound under the letter, small and in the same layout; entries without one are unchanged
- [x] It works for a Message printed from the tablet and for one printed from a share link once 04 lands (a shared Message without Sounds prints as today)
- [x] Core tests through StudioCore cover Cipher Key entries with and without Sounds

## Comments

- 2026-11-08 (agent): The printed key shows `says "kla"` small under `= A`; entries without a Sound are unchanged. `printSheet` reads `entry.glyph.sound`. Tests cover printing from the tablet and from a real share link with Sounds. The 'says' wording is the agent's choice (one string in `src/render/printSheet.ts`).
- Left for Dad: check the print preview by eye.

Resolved 2026-11-08: Dad play-tested it and approved.
