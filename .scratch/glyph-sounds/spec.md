# Spec: Sounds for My Script Glyphs

Status: resolved

Sources: `DESIGN.md` ("Sounds", grilled 2026-11-08) and `GLOSSARY.md` (Sound, Glyph, My Script, Message, Missing Glyph, Cipher Key). Where this spec and DESIGN.md disagree, DESIGN.md wins: flag it, don't silently pick.

## Problem Statement

My son draws his own Glyphs and writes secret Messages with them, but his My Scripts are silent. A World Character in the Library can be tapped to hear it, but his own Glyphs can't. He wants his invented scripts to *sound* like something, so a Message in Sky Runes can be spoken out loud as his own secret language, not just looked at.

## Solution

- On the Glyph drawing screen, each letter and digit Glyph gets a **Sound** box ("How does it sound?"). He types a few letters, like "kla", tries them with a 🔊 button, and they save with the Glyph.
- In the Glyph grid, each drawn Glyph's cell gets a small 🔊 button that says it aloud: its Sound, or the plain letter when it has none.
- A **Read it to me** button on the Write screen, on a saved Message and on Dad's reply page says the whole Message in his Sounds. Each word's Sounds are glued into one spoken word, with pauses between words.
- Sounds travel wherever Glyphs go: Backup/Restore, the share link (QR) and the printed Cipher Key.
- It all uses the tablet's English voice at the Library's tap-to-hear speed, with the same glow and the same mute rules.

## User Stories

1. As the kid, I want to type how one of my Glyphs sounds while I'm drawing it, so that my script has its own way of being said.
2. As the kid, I want the Sound box right under the drawing canvas, so that I don't have to go anywhere else to give a Glyph its Sound.
3. As the kid, I want a 🔊 button next to the Sound box, so that I can hear how it comes out before I save.
4. As the kid, I want the Sound to save when I press Save or Save & next, so that it works just like saving my drawing.
5. As the kid, I want to type a Sound before I've drawn anything, so that I can think up the sound first and draw the shape after.
6. As the kid, I want the box to already show a Glyph's Sound when I come back to redraw it, so that redrawing doesn't lose it.
7. As the kid, I want to change a Glyph's Sound by typing over it and saving, so that I can improve my language.
8. As the kid, I want to empty the box and save to take a Sound away, so that the Glyph goes back to saying its plain letter.
9. As the kid, I want Sounds kept short (about 12 characters), so that each Glyph stays one quick sound.
10. As the kid, I want Clear all on the canvas to clear only my drawing and leave the Sound, so that I don't lose a Sound I just typed.
11. As the kid, I want digits to have Sounds too, so that my number Glyphs can have their own names.
12. As the kid, I want space and punctuation to have no Sound box, so that the screen only asks about things that make a sound.
13. As the kid, I want a small 🔊 button on every drawn Glyph in the grid, so that I can hear any Glyph without opening it.
14. As the kid, I want tapping a grid cell to still open the canvas, so that the way I edit Glyphs doesn't change.
15. As the kid, I want the cell to glow gently while it speaks, so that I can tell which Glyph is talking.
16. As the kid, I want a Glyph without a Sound to say the plain letter it stands for ("bee"), so that nothing is ever silent and it works from day one.
17. As the kid, I want Missing Glyphs to have no 🔊 button, so that the grid only offers sounds for Glyphs I've drawn.
18. As the kid, I want a Read it to me button on the Write screen, so that I can hear what I'm writing in my language.
19. As the kid, I want Read it to me on a saved Message too, so that I can hear my secret diary entries.
20. As the kid, I want each word's Sounds glued into one spoken word ("kla" + "zo" → "klazo"), so that it sounds like a real language and not like spelling out.
21. As the kid, I want a pause at each space and punctuation mark, so that words and sentences sound separate.
22. As the kid, I want letters with no Sound, and Missing Glyphs, to be read as their plain letter inside the word, so that a half-finished script can still be read aloud.
23. As the kid, I want Read it to me to work in Secret mode, so that I can hear my Message while the plain letters stay hidden.
24. As the kid, I want tapping Read it to me again (or tapping any other 🔊) to cut off what's being said, so that sounds never pile up.
25. As the kid, I want Mute to silence Sounds and Read it to me like every other sound, so that one button keeps the tablet quiet.
26. As the kid, I want a tap while muted to still glow and give the mute button one soft wiggle, so that I can tell the sound is off, not broken.
27. As the kid, I want my Sounds spoken a little slowly (about 0.8×, like the Library), so that I can catch them.
28. As the kid, I want Sounds included in my backup file, so that restoring brings back my whole language, not just the shapes.
29. As the kid, I want the QR link to carry the Sounds of the Glyphs in my Message, so that Dad can hear it in my language too.
30. As Dad, I want Read it to me on the page my phone opens from his QR code, so that I can hear his Message in his Sounds.
31. As Dad, I want Read it to me on my reply too, since my reply renders in his Glyphs, so that I can answer in his spoken language.
32. As Dad, I want links he sent before this update to keep opening, so that old Messages aren't lost.
33. As the kid, I want the printed Cipher Key to show each Glyph's Sound under its letter, so that whoever decodes my Message also learns how to say it.
34. As the kid, I want a Cipher Key entry with no Sound to look just like it does today, so that the key isn't cluttered.
35. As the kid, I want my existing My Scripts and backups to keep working after the update, so that nothing I've already drawn is lost.
36. As the kid, I want the Number Explorer to stay quiet, so that counting doesn't turn noisy.
37. As the kid, I want the buttons in the same place every time, so that the screens stay calm and predictable.

## Implementation Decisions

- **The Glyph gains an optional Sound.** A Glyph's stored shape gets an optional `sound` text next to its strokes. It's additive: stored My Scripts and existing backup files without it load unchanged, so the My Script and backup schema versions stay where they are. "No Sound" means the field is absent, never an empty string.
- **Saving a Glyph takes a Sound too.** The core's Glyph save takes the Sound alongside the strokes. The Sound is trimmed and cut to SOUND_MAX_LENGTH (12), and a blank Sound means none. The existing results don't change: with no strokes the save is still `"empty"`, and a typed Sound isn't saved on its own, because a Sound belongs to a drawn Glyph. Only letter and digit slots keep a Sound; for space and punctuation it's ignored.
- **Glyph tap (new core command).** Like `worldCharacterTap`, the core answers "what does tapping this Glyph do": either speak a `Speech` (the Glyph's Sound, or its plain letter or digit when it has none, in `en` at `SPEECH_RATE`), or `muted`. The same command serves the grid's 🔊 and the canvas's "try it" 🔊. For "try it" it reads the unsaved text in the box, so the core takes the text to try rather than only reading what's stored.
- **Read it to me (new core command).** Given a Message's text and its Glyphs (his own My Script, or a SharedMessage's GlyphSet), the core returns one `Speech` (or `muted`):
  - Each word is the concatenation of its letters' and digits' Sounds; a letter with no Sound, or a Missing Glyph, adds its plain lowercase letter or digit.
  - Words are joined by a space, and each punctuation mark is kept after its word, so the voice pauses naturally.
  - It's one utterance, so cut-off and mute work exactly like tap to hear.
  - Secret mode doesn't change the output.
- **The speech adapter is reused as-is.** The core decides what to say, and the existing speech adapter speaks it. Glow, cut-off on the next tap, and mute stopping speech all behave as in Library V1.1. The voice is always English: no voice picker, no script voice.
- **Share link version 2.** `SHARE_LINK_VERSION` becomes 2. The v2 payload is v1's, plus each packed Glyph's Sound (a varint length then UTF-8, with length 0 meaning none) after its strokes. The decoder accepts **both** `m1.` (Glyphs come back with no Sounds) and `m2.`; any other version is still "couldn't open". Sounds count towards MAX_SHARE_LINK_LENGTH, and a too-long Message gives the existing `tooLong` result. A SharedMessage's Glyphs carry their Sounds, so the reply page's Read it to me needs nothing extra.
- **The Cipher Key.** Each Cipher Key entry gains the Glyph's optional Sound, and the printed key shows it under the letter. Entries without one render as today.
- **Screens.** The Glyph drawing screen gets the Sound box and its 🔊 for letter and digit slots. The Glyph grid gets a 🔊 corner button on drawn cells; tapping the cell itself still opens the canvas. The Write screen, the saved-Message view and the reply page get a Read it to me button in a fixed spot. All of them reuse the existing glow and mute-wiggle behavior.

## Testing Decisions

- **One seam: StudioCore**, built with `newStudio()` / `studioWithMyScript()` / `loadedStudio()`, as in every existing core test. No new seam. Tests check behavior through the core's commands and views (what gets spoken, what's saved, what a link or backup gives back), never the internals of the share-link byte layout or the storage.
- **What a good test looks like here:** "after saving A with Sound 'kla', tapping A says 'kla' in English at 0.8×", and not "the Glyph object has a `sound` field".
- **What to test:**
  - Saving and reloading a Sound (trimmed, length-capped, blank = none, kept when redrawn, ignored for punctuation). A Sound alone with no strokes is still `"empty"`.
  - A Glyph tap: its Sound; the plain letter when it has none; the unsaved "try it" text; and `muted` when muted.
  - Read it to me: gluing within words; pauses at spaces and punctuation; the plain-letter fallback for Glyphs without a Sound and for Missing Glyphs; digits; a SharedMessage; `muted`.
  - Backup/restore round trip keeps Sounds; an old backup without Sounds still restores.
  - Share link: packing and opening keeps Sounds; an `m1.` link still opens (with no Sounds); Sounds count towards `tooLong`.
  - The Cipher Key lists Sounds where they exist.
- **Prior art:** `tapToHear.test.ts` and `mute.test.ts` (speech and mute through the core), `share.test.ts` (pack and open links), `backup.test.ts` (round trips), `printing.test.ts` (Cipher Key), `myScripts.test.ts` (saving Glyphs).
- **Playtest by eye:** the Sound box, the 🔊 buttons, the glow, and how his made-up spellings sound in the tablet's English voice.

## Out of Scope

- Recording his own voice, or any recorded audio clips (they need the microphone, untested in Amazon Kids).
- A separate name for a Glyph, beyond its Sound.
- Choosing a voice or a language for a My Script.
- Speaking on every keystroke of the Write screen's keyboard.
- Sounds in the Number Explorer.
- Sounds for space and punctuation.
- Any special Secret mode rule for Read it to me.
- Playing Sounds on a printed page.

## Further Notes

- **One assumption to confirm with Dad:** inside Read it to me, a Glyph without a Sound adds its plain letter to the glued word ("kla" + B + "zo" → "klabzo"), while tapping that Glyph alone says the letter's name ("bee"). Both follow GLOSSARY's "read as the plain letter it stands for".
- Dad's phone always loads the latest site, so v2 links only need the current decoder. Opening v1 links matters for links already printed or saved.
- The tablet-test list needs no new item: English voices and the 0.8× speed are already on it.
