# 02: Tablet test page

**What to build:** A throwaway check page, published next to the app, that Dad opens on the kid's tablet to answer the unknowns in DESIGN.md's tablet checklist. Each check shows a clear pass/fail-style result for Dad (this is a parent tool, not part of the calm kid UI).

**Blocked by:** 01 (Scaffold, deploy and home screen)

**Status:** ready-for-agent

- [ ] Shows browser/device info (user agent, screen size, device pixel ratio)
- [ ] Storage check: writes a timestamped value to IndexedDB under a test-only name; on later visits shows what survived (closing, rebooting, days)
- [ ] Backup check: a button that downloads a small file, and a file picker that reads one back
- [ ] Print check: a button that opens the browser's print with a sample page
- [ ] Font check: a sample of characters from every World Script and numeral system in the spec, each labeled, so missing fonts are visible as empty boxes
- [ ] QR check: shows a sample QR code linking back to the page, to scan with a phone camera
- [ ] Finger-drawing check: a small canvas to feel the drawing smoothness
- [ ] Marked as throwaway, to be removed after ticket 15
