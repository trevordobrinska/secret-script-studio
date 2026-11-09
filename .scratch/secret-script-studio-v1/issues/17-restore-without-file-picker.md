# 17: Restore doesn't work in the Kids browser

**What's wrong:** At the tablet test (ticket 15, 2026-11-08, both kids' tablets), the Choose file button on the Restore check did nothing in Amazon Kids Browser. The app's Restore uses the same hidden `<input type="file">` (`src/screens/backupPanel.ts`), so **a Backup can't be restored on the tablets.** DESIGN.md calls backup more important here than in Doodle Monsters because hand-drawn Glyphs are hours of work.

**Blocked by:** None

**Status:** needs-triage

Questions for triage (probably a short grilling, since it changes DESIGN.md's Data section):
- **Does the download half work?** Ticket 15 didn't report it. If Backup files can't even be saved in the Kids profile, the whole Backup/Restore design needs rethinking, not just Restore.
- Is the picker blocked only in the Kids profile? Try the test page in the parent profile's browser. A parent-profile restore only helps if both profiles share the same site storage, which is unlikely and needs checking on the device.
- Other ways in that need no file picker, each to be checked on the device before choosing one:
  - a **restore link**: Dad opens a link from the PC or phone that carries the Backup, like the share link. A Backup may be too big for a URL or QR code, and a Kids profile can't type addresses.
  - a temporary Arcade **Test Tile** pointing at a restore page with the Backup built in (Dad-only, used once when a tablet is replaced or reset).
  - a paste box, if the Kids browser allows pasting.
- If nothing works on the tablet, say so in DESIGN.md. Backups can still be downloaded as insurance and restored from a normal browser later.
