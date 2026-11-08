# 04: Sounds in the share link and on Dad's reply page

**What to build:** The QR share link carries the Sounds of the Glyphs a Message uses, so the page Dad's phone opens has a **Read it to me** button that speaks in his Sounds. Dad's reply (which renders in his Glyphs) can be read aloud the same way. Links he sent before this update keep opening, just without Sounds. See `.scratch/glyph-sounds/spec.md` ("Share link version 2").

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas), 03 (Read it to me for his own Messages)

**Status:** ready-for-agent

- [ ] The share link version becomes 2: v1's payload plus each packed Glyph's Sound (varint length, then UTF-8, where 0 means none) after its strokes
- [ ] Opening accepts both `m1.` links (Glyphs come back with no Sounds) and `m2.` links; any other version is still "couldn't open"
- [ ] Sounds count towards the QR length limit; a Message that grows too long gives the existing "too long" result
- [ ] An opened SharedMessage's Glyphs carry their Sounds
- [ ] The reply page has Read it to me for the shared Message and for Dad's reply, using 03's core command, with the same glow and mute rules
- [ ] Core tests through StudioCore: a pack-and-open round trip keeps Sounds, an `m1.` link still opens, Sounds count towards `tooLong`, and a SharedMessage reads aloud in its Sounds
- [ ] The format comment at the top of the share-link module describes version 2
