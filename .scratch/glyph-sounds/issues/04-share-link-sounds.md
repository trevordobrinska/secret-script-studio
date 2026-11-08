# 04: Sounds in the share link and on Dad's reply page

**What to build:** The QR share link carries the Sounds of the Glyphs a Message uses, so the page Dad's phone opens has a **Read it to me** button that speaks in his Sounds. Dad's reply (which renders in his Glyphs) can be read aloud the same way. Links he sent before this update keep opening, just without Sounds. See `.scratch/glyph-sounds/spec.md` ("Share link version 2").

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas), 03 (Read it to me for his own Messages)

**Status:** ready-for-human

- [x] The share link version becomes 2: v1's payload plus each packed Glyph's Sound (varint length, then UTF-8, where 0 means none) after its strokes
- [x] Opening accepts both `m1.` links (Glyphs come back with no Sounds) and `m2.` links; any other version is still "couldn't open"
- [x] Sounds count towards the QR length limit; a Message that grows too long gives the existing "too long" result
- [x] An opened SharedMessage's Glyphs carry their Sounds
- [x] The reply page has Read it to me for the shared Message and for Dad's reply, using 03's core command, with the same glow and mute rules
- [x] Core tests through StudioCore: a pack-and-open round trip keeps Sounds, an `m1.` link still opens, Sounds count towards `tooLong`, and a SharedMessage reads aloud in its Sounds
- [x] The format comment at the top of the share-link module describes version 2

## Comments

- 2026-11-08 (agent): Links are now `m2.`, with each Glyph's Sound after its strokes (`FIRST_VERSION_WITH_SOUNDS` in `shareLink.ts`). `m1.` links still open (tested with a hard-coded v1 link made by the old encoder). Sounds count towards `tooLong`. Reply page: Read it to me for the shared Message (next to 'Show the letters') and for Dad's reply (under the reply card; it reads what's typed at the time of the tap). Dad's phone has no mute button, so it's never muted there.
- Left for Dad: open a QR link on his phone and play-test both buttons.
