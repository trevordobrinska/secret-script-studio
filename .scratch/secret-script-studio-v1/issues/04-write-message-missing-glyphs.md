# 04: Write a Message with Missing Glyphs

**What to build:** On the Write screen of a My Script, the kid types with an on-screen keyboard whose keys are his own Glyphs (dotted boxes for undrawn ones), with space and backspace. The Message shows in his Glyphs on top and plain letters underneath. Letters without a Glyph show as Missing Glyphs (dotted boxes). Tapping one opens the Glyph canvas for that letter and comes back after saving. A space with no Glyph looks like an ordinary gap.

**Blocked by:** 03 (Draw the first Glyph)

**Status:** resolved

- [x] Core: Message layout turns text into cells (Glyph, Missing Glyph with its slot, plain gap, plain character) (tested, e.g. "he draws H and I, writes HI MOM, and the O shows as a Missing Glyph")
- [x] Lowercase is folded to uppercase; characters that aren't Glyph slots become plain characters (tested)
- [x] Glyph keyboard with every slot, plus space and backspace; the layout never shifts
- [x] Two lines: Glyphs above, plain letters below, wrapping sensibly on a tablet screen
- [x] Tapping a Missing Glyph opens the canvas for that slot and returns to the Message
- [x] The Message here is a draft; saving it is ticket 06

## Comments

Implemented on integration branch `secret-script-studio-v1` (TDD through the Studio core; screens checked in Edge at 1280x800 and 800x1280). On-device feel is part of ticket 15.
