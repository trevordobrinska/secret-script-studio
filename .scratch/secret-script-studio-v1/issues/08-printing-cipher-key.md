# 08: Printing with Cipher Key

**What to build:** The kid prints a Message as a page of big, crisp Glyphs, choosing whether to add a Cipher Key on a separate page. Dad can print the same way from the Reply page, so printing from the PC works if the tablet can't print.

**Blocked by:** 04 (Write a Message with Missing Glyphs), 07 (Share by QR code + Reply page)

**Status:** resolved

- [x] Core: print layout with a Message page (layout cells) and an optional Cipher Key page listing only drawn Glyphs paired with their slot, letters then digits then marks (tested)
- [x] Glyph renderer turns strokes into SVG, so prints stay crisp at any size
- [x] Print-only page; the Cipher Key always starts on its own page
- [x] Print option on the Write/Message screen with a "include Cipher Key" choice
- [x] Print option on the Reply page (for the Message and for Dad's reply)
- [x] Checked by printing (or print preview) from desktop Chrome

## Comments

Checked via headless Edge `page.pdf()` (Cipher Key on its own page, all-SVG). Missing Glyphs print as dashed boxes with their letter faintly inside. Real print dialog / tablet printing is part of ticket 15.
