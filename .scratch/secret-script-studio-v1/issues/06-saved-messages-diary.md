# 06: Saved Messages diary

**What to build:** Each My Script keeps a diary of its Messages. The kid saves a Message, sees the list newest first with previews, and can open, re-read, edit and delete them. Secret mode hides the plain letters. When he redraws a Glyph, every saved Message shows the new shape.

**Blocked by:** 04 (Write a Message with Missing Glyphs)

**Status:** resolved

- [x] Core: save, edit, delete Messages; list per My Script, newest first (tested)
- [x] Core: redrawing a Glyph changes the layout of existing Messages (tested)
- [x] Persistence test: Messages survive a reload
- [x] Messages list screen with Glyph previews
- [x] Secret mode toggle on the Write screen hides the plain-letter line
- [x] Delete asks for confirmation

## Comments

Implemented on integration branch `secret-script-studio-v1` (TDD through the Studio core; screens checked in Edge at 1280x800 and 800x1280). On-device feel is part of ticket 15.
