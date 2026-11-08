# 07: Share by QR code + Reply page

**What to build:** From a Message, the kid shows a QR code. Dad scans it with his phone camera, and the app opens in Reply mode on the phone: the Message drawn in the kid's Glyphs, a tap to reveal the plain letters, and a box where Dad types a reply that appears in the kid's Glyphs, to hand over or show. Everything lives in the link: there's no server, and no storage on Dad's phone.

**Blocked by:** 04 (Write a Message with Missing Glyphs)

**Status:** resolved

- [x] Core: build a share link with the URL fragment holding the version, My Script name, ink, width, text and **only the Glyphs used** (tested)
- [x] Core: open a share link into a read-only shared Message; round trip equals the original (tested)
- [x] Strokes simplified and snapped to a coarse grid, then compressed and base64url-encoded before packing
- [x] Core: "too long" result when the link exceeds what a phone reliably scans as a QR code (tested); the UI gently suggests splitting the Message
- [x] Core: broken, cut-off or unknown-version links return "couldn't open", never throw (tested)
- [x] Share screen shows a large QR code (small third-party QR encoder)
- [x] Reply page: the same app opened with a fragment, using the core without storage; shows the Message, reveals plain letters, and lays out Dad's typed reply in the shared Glyphs (phone keyboard characters that aren't slots show as plain characters)
- [x] Gentle "this secret note couldn't be opened" screen
- [ ] Checked on a real phone: camera opens the link from the tablet's screen

## Comments

Share link packs only used Glyphs (64-grid snap + simplify, deflate-raw, base64url), QR level M, max 997 chars. QR decoded from screenshots in Edge; real phone-camera scan still to do (ticket 15 checklist). Story 37 wording follows GLOSSARY: "This secret Message couldn't be opened."
