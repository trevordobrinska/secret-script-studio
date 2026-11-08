# 08: Printing with Cipher Key

**What to build:** The kid prints a Message as a page of big, crisp Glyphs, choosing whether to add a Cipher Key on a separate page. Dad can print the same way from the Reply page, so printing from the PC works if the tablet can't print.

**Blocked by:** 04 (Write a Message with Missing Glyphs), 07 (Share by QR code + Reply page)

**Status:** ready-for-agent

- [ ] Core: print layout with a Message page (layout cells) and an optional Cipher Key page listing only drawn Glyphs paired with their slot, letters then digits then marks (tested)
- [ ] Glyph renderer turns strokes into SVG, so prints stay crisp at any size
- [ ] Print-only page; the Cipher Key always starts on its own page
- [ ] Print option on the Write/Message screen with a "include Cipher Key" choice
- [ ] Print option on the Reply page (for the Message and for Dad's reply)
- [ ] Checked by printing (or print preview) from desktop Chrome
