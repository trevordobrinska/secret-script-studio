# 05: Sounds on the printed Cipher Key

**What to build:** When he prints a Message with its Cipher Key, each Glyph that has a Sound shows it under its letter, so whoever decodes the Message also learns how to say it. Glyphs without a Sound print exactly as today. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** ready-for-agent

- [ ] Each Cipher Key entry carries the Glyph's optional Sound
- [ ] The printed key shows the Sound under the letter, small and in the same layout; entries without one are unchanged
- [ ] It works for a Message printed from the tablet and for one printed from a share link once 04 lands (a shared Message without Sounds prints as today)
- [ ] Core tests through StudioCore cover Cipher Key entries with and without Sounds
