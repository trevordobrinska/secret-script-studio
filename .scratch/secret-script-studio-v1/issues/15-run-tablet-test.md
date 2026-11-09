# 15: Run the tablet test

**What to build:** Dad finds out the kid's tablet model and runs the tablet test page (ticket 02) on it, in the kid's own profile, then records the results here so later tickets can act on them.

**Blocked by:** 02 (Tablet test page); the Arcade going live (`Projects\arcade\.scratch\arcade-v1\issues\03-go-live.md`), because the tablets install only the Arcade and this test page opens through a temporary Test Tile there (`.scratch/arcade/handoff.md`). Run the Arcade's own tablet checklist (`Projects\arcade\DESIGN.md`) first in the same session.

**Status:** ready-for-human

A ticked box means the check has been **answered**, not that it passed. The result follows the dash.

- [ ] Tablet model and browser recorded — browser: Amazon Kids Browser (Chromium 138). Model still not read off the device; the screen (800×1280 physical) matches a Fire HD 8
- [x] Approve `trevordobrinska.github.io` in the Amazon Kids Parent Dashboard — done; the test page opened in the Kids profile
- [ ] App and test page load in his profile, opened from the Arcade — test page: **pass** (via its Test Tile). App: not checked yet, because its Tile is still Coming-soon
- [ ] The installed Arcade opens this app fullscreen, and the house button and system Back return to the Arcade — not checked. `display-mode` is `browser`, so nothing is running fullscreen (see Arcade ticket 05), and the house button isn't built yet (`.scratch/arcade/issues/02-house-button.md`)
- [ ] Saved data survives closing the app, rebooting and a few days — not reported yet; open the Test Tile again after a close, a reboot and a few days
- [x] Backup download and Restore file picker work — **Restore picker: FAIL** (the Choose file button does nothing). Download: not reported. Becomes ticket 17
- [x] Finger drawing is smooth on a small Glyph canvas — **pass**
- [x] Printing works or doesn't — **FAIL** (Print sample page does nothing). Printing goes through the PC via the QR link, as DESIGN.md planned. Tablet behavior becomes ticket 18
- [x] List of World Scripts and numeral systems that render as empty boxes — **only Mayan numerals**, out of the 22 on the test page. The 15 Library V1.1 additions weren't on the test page and still need checking on the tablet (ticket 16)
- [x] Dad's phone camera opens the on-screen QR code — **pass**
- [ ] Which Library languages the tablet's built-in voices speak, and whether 0.8× speed sounds right — not checked yet (needs the real app's Library)
- [x] Results added under `## Comments` below; update DESIGN.md if anything changes a decision

## Comments

**2026-11-08, both kids' tablets (Dad):** Both tablets behaved identically, so one set of results covers both. Run in the Kids profile, opened from the Arcade's "Secret Script Studio Test" Tile.

- **Browser and device:** user agent `Mozilla/5.0 … AppleWebKit/537.36 … Chrome/138.0.7204.244 Safari/537.36 Amazon Kids Browser/30200110`. Screen 601×962 CSS px; window 601×805 (in portrait, the browser's own bars take about 157 px); device pixel ratio ≈1.33, so 800×1280 physical, which matches a Fire HD 8. Touch points 5. Display mode `browser`.
- **Backup / Restore:** the file picker's Choose file button does nothing in the Kids browser. The app's Restore uses the same hidden `<input type="file">` (`src/screens/backupPanel.ts`), so **Restore doesn't work on the tablets.** Whether the download half works wasn't reported. See ticket 17.
- **Printing:** Print sample page does nothing. The app's Print uses the same `window.print()` (`src/render/printSheet.ts`), so printing from the tablet doesn't work. That's the fallback DESIGN.md already planned: print from the PC by opening the QR link. See ticket 18 for what the tablet's Print button should do instead.
- **Fonts:** everything on the test page renders except **Mayan numerals** (U+1D2E0–1D2F3). So ticket 16 bundles a font for Mayan, plus whichever V1.1 scripts turn out to be missing once they're checked.
- **QR code:** Dad's phone camera opens it. Pass.
- **Finger drawing:** smooth. Pass.

Still open: the tablet model off the device (Settings → Device Options → About), storage surviving a close, a reboot and a few days, whether the backup download works, the real app opening from the Arcade, Library voices and 0.8× speed, and the V1.1 fonts.
