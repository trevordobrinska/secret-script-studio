# 18: Print does nothing on the tablet

**What's wrong:** At the tablet test (ticket 15, 2026-11-08, both kids' tablets), Print sample page did nothing in Amazon Kids Browser. The app's Print buttons (Write screen, saved Message) call the same `window.print()` (`src/render/printSheet.ts`), so on his tablet they show the print choice and then nothing happens. DESIGN.md's fallback already works: Dad opens the QR link on the PC, and the reply page prints his Message (with the optional separate Cipher Key) or Dad's reply.

**Blocked by:** None

**Status:** needs-triage

To decide:
- What his Print button should do on the tablet so it never looks broken. One option is a calm "Show Dad the code to print it" that opens the Share QR, since printing on the PC starts from that link anyway. Another is to hide Print in the Kids browser.
- How to tell the browser can't print. A page can't detect that `window.print()` is blocked. Checking the user agent for `Amazon Kids Browser` is the practical signal (seen in ticket 15's Comments).
- Whether the Cipher Key's printed Sounds (Glyph Sounds ticket 05) and the Number Explorer have any print entry points that need the same treatment.
