# 05: Many My Scripts

**What to build:** The My Scripts tile opens a list of all his My Scripts, each with its name and a preview of a few Glyphs. He can create more, rename one, or delete one after confirming. A brand-new My Script suggests drawing the letters of his name first. After saving a Glyph he can go straight to the next empty slot.

**Blocked by:** 03 (Draw the first Glyph)

**Status:** resolved

- [x] Core: list, rename, delete My Scripts (tested); deleting a My Script removes its Messages
- [x] Core: suggested letters for a name: unique letters in order, ignoring non-letters (tested)
- [x] List screen with Glyph previews; create button in a fixed spot
- [x] Rename and delete-with-confirmation (no accidental loss)
- [x] New-script nudge: he types his name (or a word), and those letters' slots are offered first
- [x] After saving a Glyph: "next empty one" or back to where he came from

## Comments

Implemented on integration branch `secret-script-studio-v1` (TDD through the Studio core; screens checked in Edge at 1280x800 and 800x1280). On-device feel is part of ticket 15.
