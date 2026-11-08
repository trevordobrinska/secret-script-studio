# Spec: Secret Script Studio V1 (MVP)

Status: ready-for-agent

Sources: `DESIGN.md` (decisions, grilled 2026-11-07) and `GLOSSARY.md` (vocabulary). Where this spec and DESIGN.md disagree, DESIGN.md wins: flag it, don't silently pick.

## Problem Statement

My 10-year-old son loves foreign alphabets, number systems, math and Minecraft. He wants to invent his own scripts, but they end up on scraps of paper and never get used: he can't write in them easily, can't trade secret notes in them, and can't count in his own digits. He also loves looking up real scripts and copying them out by hand, but that means searching the web each time.

## Solution

A calm, tablet-first web app with three sections on its home screen:

- **My Scripts**: he invents as many My Scripts as he likes and draws a Glyph for each letter, digit and mark with his finger. A My Script works from the very first Glyph: anything he hasn't drawn yet shows as a Missing Glyph (a dotted box) that he can tap to draw. In each My Script he writes and saves Messages with a keyboard of his own Glyphs. He can share a Message with Dad as a QR code (Dad's phone opens it, sees it in his Glyphs, and can type a reply in his Glyphs), or print it with a separate Cipher Key page.
- **Number Explorer**: he counts in his own digits. A "How many digits?" control lets him change the Digit Count from 2 to 16, and blocks snapping into Stacks show what each digit is worth. No jargon, timers or quizzes.
- **Library**: a reference book of World Scripts (real alphabets and numeral systems), with each character shown big along with its name and sound, for him to copy onto paper.

There are no timers, scores, fail states, randomness or locked features. Everything saves on his tablet, with a Backup/Restore file.

## User Stories

Actors: **the kid** (my 10yo son, on his tablet) and **Dad** (me, usually on my phone).

### Home and navigation
1. As the kid, I want the app to open on three big tiles (My Scripts, Library, Number Explorer), so that I always know where I am and how to get anywhere.
2. As the kid, I want every screen to have a way back home in the same spot, so that I never get lost.
3. As the kid, I want buttons to stay in the same place every time, so that the app feels predictable.
4. As the kid, I want soft click sounds I can mute, and for muting to be remembered, so that the app sounds the way I like.
5. As the kid, I want to add the app to my home screen and have it open fullscreen, so that it feels like a real app.

### My Scripts
6. As the kid, I want to create a new My Script and give it a name, so that I can invent as many writing systems as I want.
7. As the kid, I want to pick an ink color and stroke width when I create a My Script, so that all of its Glyphs match and it looks like a real script.
8. As the kid, I want to see a list of all my My Scripts with their names and a preview of a few of their Glyphs, so that I can pick one quickly.
9. As the kid, I want to rename a My Script, so that I can change my mind about its name.
10. As the kid, I want to delete a My Script after confirming, so that I can clear out ones I don't want, without losing one by accident.
11. As the kid, I want to see every Glyph slot in a My Script (A–Z, 0–9, the extra digits ten to fifteen, space and punctuation), with drawn ones shown and empty ones as dotted boxes, so that I can see how far along my script is.
12. As the kid, when I make a brand-new My Script, I want it to suggest drawing the letters of my name first, so that I can write something real within minutes.

### Drawing Glyphs
13. As the kid, I want to draw a Glyph with my finger on a big square canvas, so that drawing my own letters feels natural.
14. As the kid, I want faint baseline and x-height guide lines on the canvas, so that my Glyphs line up with each other.
15. As the kid, I want undo and clear while drawing a Glyph, so that I can fix mistakes.
16. As the kid, I want to see which letter or digit I'm drawing (in plain letters), so that I know what the Glyph stands for.
17. As the kid, I want to redraw any Glyph whenever I like, and for the new one to show up everywhere straight away, so that my script can change as I improve it.
18. As the kid, I want finger drawing to feel smooth on my tablet, so that my Glyphs come out the way I meant.
19. As the kid, after saving a Glyph I want to go straight to the next empty one, or back to where I came from, so that drawing a whole script flows nicely.

### Missing Glyphs
20. As the kid, I want any letter I haven't drawn yet to show as a dotted box, so that a Message always works even if my script isn't finished.
21. As the kid, I want to tap a dotted box to open the canvas for that letter, so that missing letters become invitations instead of dead ends.
22. As the kid, I want a space with no Glyph to look like an ordinary gap, so that words still look like words.

### Writing Messages
23. As the kid, I want a Write screen with my Glyphs on top and the plain letters underneath, so that I can see what I'm writing in both.
24. As the kid, I want a secret mode that hides the plain letters, so that only my Glyphs show.
25. As the kid, I want an on-screen keyboard whose keys are my own Glyphs (dotted boxes for undrawn ones), so that I type in my own script.
26. As the kid, I want a backspace and a space key, so that I can edit normally.
27. As the kid, I want to save a Message, so that I can come back to it later.
28. As the kid, I want each My Script to keep a list of its Messages (newest first, with a preview), so that it works like a secret diary.
29. As the kid, I want to open, re-read, edit and delete my saved Messages, so that I'm in charge of my diary.
30. As the kid, I want my old Messages to show my newest Glyph shapes, so that everything matches after I redraw a letter.

### Sharing with Dad
31. As the kid, I want to show a QR code for a Message, so that Dad can scan it with his phone and read it.
32. As the kid, if a Message is too long to fit in a QR code, I want a friendly note saying to split it into shorter Messages, so that it never just breaks.
33. As Dad, I want to scan the QR code with my phone camera and see the Message in his Glyphs, so that I can read his secret note the way he wrote it.
34. As Dad, I want to tap to show the plain-letter decoding, so that I can read it even if I haven't learned his script.
35. As Dad, I want to type a reply on my phone's keyboard and see it in his Glyphs, so that I can answer in his script.
36. As Dad, I want to hand him my phone or print my reply, so that he gets my answer without accounts or messaging apps.
37. As Dad, if the link is broken or cut off, I want a gentle "this secret note couldn't be opened" message instead of an error, so that nothing feels broken.
38. As Dad, I want the shared page to work without his tablet or any server, so that the link holds everything needed.

### Printing
39. As the kid, I want to print a Message as a page of big, crisp Glyphs, so that I can leave secret notes on paper.
40. As the kid, I want to choose whether to also print a Cipher Key on a separate page, so that I can hand over the Message and keep the key.
41. As the kid, I want the Cipher Key to show each Glyph next to its letter (only the Glyphs he has drawn), so that someone can decode the Message with it.
42. As Dad, I want to print a Message from the PC by opening its QR link there, so that printing works even if the tablet can't print.

### Number Explorer
43. As the kid, I want to choose which of my My Scripts the Number Explorer uses (my most recent one by default), so that I count in my own digits.
44. As the kid, I want big + and − buttons that count up and down, with the digits rolling over like an odometer, so that I can watch numbers being built.
45. As the kid, I want − to do nothing at zero instead of complaining, so that nothing ever feels like a mistake.
46. As the kid, I want to see the number as blocks that snap into Stacks, and Stacks of Stacks, so that I can see what each digit is worth.
47. As the kid, I want each column of the number to be color-matched to its blocks and Stacks, so that I can tell which digit counts which pile.
48. As the kid, I want a "How many digits?" control showing my own digit Glyphs, where I tap to add or remove one (from 2 up to 16), so that I can invent number systems with fewer or more digits.
49. As the kid, when I change the Digit Count, I want the same amount of blocks shown in the new digits, so that I see that the same quantity can be written differently.
50. As the kid, I want the Number Explorer to always open with 10 digits, so that it starts with familiar counting.
51. As the kid, I want a one-time hint saying "Try fewer digits!", so that I discover the control without a tutorial.
52. As the kid, I want a small caption like "base 8" next to the digit control, so that I learn the real word if I'm curious.
53. As the kid, I want to type a regular number and see it written in my digits, so that I can translate any number I like.
54. As the kid, I want digits I haven't drawn to show as Missing Glyphs that I can tap to draw, so that higher Digit Counts invite me to draw the extra digits.

### Library
55. As the kid, I want a list of World Scripts to browse, so that I can find one to copy out.
56. As the kid, I want each World Script to show all its characters big and clear, so that I can copy them onto paper easily.
57. As the kid, I want each character's name and sound (e.g. "Λ — lambda — L"), so that I know what I'm writing.
58. As the kid, I want to see a World Script's own numerals with their values, where it has them, so that I can compare number systems.
59. As the kid, I want numeral-only systems (Roman, Mayan, Babylonian, Chinese, Eastern Arabic) in the Library too, so that I can explore how other cultures write numbers.
60. As the kid, I want every character to render properly on my tablet, so that no script shows as empty boxes.
61. As the kid, I want the Library to be calm and read-only, with no quizzes or tracing, so that it's a reference book I can flip through.

### Saving and backup
62. As the kid, I want everything (My Scripts, Glyphs, Messages, settings) saved automatically on my tablet, so that I never lose work by closing the app.
63. As the kid, I want my work to survive reboots and days away, so that the app is always where I left it.
64. As the kid, I want a Backup button that saves everything to a file, so that hours of drawing are protected.
65. As the kid, I want a Restore button that loads a backup file, so that I can get my scripts back on a new or reset tablet.
66. As Dad, I want Restore to add the backup's contents without deleting anything already on the tablet, so that a restore can't wipe out newer work.

### Arcade
67. As the kid, I want to reach Secret Script Studio from the Arcade home page, so that all my games live in one place.
68. As Dad, I want this app's saved data kept separate from the other Arcade games' data, so that the games never interfere with each other.

## Implementation Decisions

### Modules
- **Studio core (deep module, the one test seam).** A single factory that takes injected dependencies (storage, clock) and returns a plain object of commands and read-only views, in the style of the Doodle Monsters game core. Commands return results instead of throwing. Every rule lives here: My Scripts, Glyphs, Missing Glyphs, Messages and their layout, the share-link encoding, the Number Explorer, print layout, the Library catalog, backup/restore and settings. It doesn't touch the DOM.
- **Storage adapter.** An async interface the core depends on (save/load/list/delete for My Scripts, Messages and settings, plus export/import of everything). There are two implementations: IndexedDB for the app (database named `secret-script-studio`, following the Arcade storage rule) and in memory for tests.
- **Glyph renderer.** Draws Glyph strokes onto a canvas at any size (for screens) and turns them into SVG (for printing and the Cipher Key). It works only from the core's views and contains no rules.
- **Drawing canvas.** Finger stroke capture, reusing the approach from Doodle Monsters (strokes as point lists plus width), with undo, clear, and baseline and x-height guides. Strokes are saved normalized to the canvas square (0–1), so Glyphs scale to any size.
- **Screens.** Home, My Scripts list, a My Script's Glyph grid, Glyph canvas, Write, Messages list, Share (QR), Print, Number Explorer, Library list, World Script page, Backup/Restore, and the shared-link Reply page. Screens are thin: they read views and call commands.
- **Library content.** Static data: for each World Script, its name, its characters (Unicode text plus name plus sound) and its numerals (character plus value). Free fonts (e.g. Noto) are bundled only for scripts the tablet can't render.
- **QR rendering.** A small third-party QR encoder turns the share-link string into an image. The share link itself is built and parsed by the core.

### Data shapes (kept stable and documented, so Glyph Mines can read them later)
- **My Script:** id, name, ink color, stroke width, created/updated times, a schema version, and a map from Glyph slot to Glyph.
- **Glyph slot:** one of A–Z, 0–9, the extra digits ten to fifteen (named so they can't clash with letters), space, and the punctuation marks `. , ? !`.
- **Glyph:** a list of strokes (each a list of normalized points; the width comes from the My Script) plus an updated time.
- **Message:** id, My Script id, text, created/updated times. The text is stored as plain characters, with lowercase folded to uppercase. Glyphs are looked up live when drawing, so redrawing a Glyph updates every Message.
- **Settings:** muted, and whether the Number Explorer's first-time hint has been seen.

### Message layout
- The core turns a Message into a sequence of cells, each either a Glyph, a Missing Glyph (knowing its slot, so a tap can open the canvas), a plain gap (a space with no Glyph), or a plain character (anything that isn't a Glyph slot, e.g. from Dad's phone keyboard). The screen, the printout and the Reply page all draw from this one layout.

### Share link
- Format: the app's address plus the URL **fragment**, so nothing is sent to a server. The fragment holds a version number, the My Script's name, ink and width, the Message text, and **only the Glyphs that Message uses**.
- Strokes are made compact before packing (simplified and snapped to a coarse grid), then compressed and base64url-encoded.
- The core reports a "too long" result if the packed link won't fit in a QR code at an error-correction level a phone camera reads reliably. The UI then gently suggests splitting the Message.
- Opening a link: the core decodes it into a read-only shared Message (its own Glyphs plus the text). A broken or cut-off link gives a gentle "couldn't open" result, never an exception.
- **The Reply page** is the same app opened with a link fragment. It uses the core with no storage, shows the shared Message, and lets Dad type a reply that's laid out in the shared Glyphs. The reply can be printed. Getting a reply back into the tablet waits for V2.

### Number Explorer
- State: the My Script chosen, the Digit Count (2–16, always 10 when opened) and a non-negative whole number (0 to 999 in the MVP, so Stacks stay drawable).
- The view gives, for each column: its digit slot (a Glyph or Missing Glyph from the chosen My Script), its digit value, and how many items to draw at that column's size (loose blocks, Stacks, Stacks of Stacks…), plus which columns rolled over on the last step (to drive the animation).
- Changing the Digit Count keeps the same number and rewrites it in the new digits.
- − at zero and + at the maximum are simply disabled, with no message.
- "Type a number": he enters an ordinary number with a 0–9 keypad and it becomes the current number.

### Printing
- The core gives a print layout: a Message page (the layout cells, large) and an optional Cipher Key page (each drawn Glyph paired with its slot, in alphabetical then digit order). The renderer draws it as SVG on a print-only page and calls the browser's print.

### Backup/Restore
- Backup exports every My Script, Message and setting as one versioned JSON file download. Restore reads a file and **merges by id**: items in the file are added, or overwrite the same id; nothing on the tablet is deleted. Anyone can use both buttons (no parent gate).

### Hosting and platform
- Vite + TypeScript, a plain canvas, no game framework. Served from GitHub Pages at the project path under `trevordobrinska.github.io`, and linked from the Arcade. A PWA manifest makes add-to-home-screen work.
- The target is his tablet (probably a Fire with Silk in an Amazon Kids profile; the model is still unknown). Develop in desktop Chrome's device toolbar until the tablet test.

## Testing Decisions

- **What makes a good test:** it only touches the Studio core's public commands and views, never the internals, the DOM or the IndexedDB code. Tests read like stories of the kid using the app ("he draws H and I, writes HI MOM, and the O shows as a Missing Glyph"). The same in-memory storage shared across two cores simulates reloading the app.
- **Tested through the core:**
  - My Scripts: create, rename, delete, list; the name nudge's suggested letters (unique letters of a name, in order, ignoring non-letters).
  - Glyphs: saving, redrawing (live update in existing Message layouts), and which slots are missing.
  - Message layout: Glyph, Missing Glyph, plain gap and plain character cells; lowercase folding.
  - Messages: save, edit, delete, newest-first list per My Script.
  - Share link: round trip (link → shared Message equals the original text and Glyphs); only the used Glyphs are packed; "too long" result; broken or cut-off links give "couldn't open"; a link with an unknown version.
  - Number Explorer: digits and Stack counts for every Digit Count from 2 to 16 at several values; roll-over reporting; the Digit Count change keeps the number; the zero and maximum limits; the default of 10 on every open; the first-time hint shown only once.
  - Printing: Message page cells; Cipher Key page present only when chosen; the key lists only drawn Glyphs, in order.
  - Library: every World Script has a name and at least one character; every character has a name and sound; numerals have whole-number values.
  - Backup/Restore: export → import into fresh storage gives an identical state; import merges without deleting; settings survive.
  - Persistence: everything survives a "reload" (a new core on the same storage).
- **Not unit-tested (checked by eye on the device):** the canvas drawing feel, rendering strokes to canvas and SVG, animations (odometer, Stacks snapping), QR image generation, font rendering, the IndexedDB adapter, printing on the tablet.
- **Test helpers:** fake clock, builders (a new core with a My Script that already has some Glyphs) and sample strokes, following the Doodle Monsters test-helper pattern.
- **Prior art:** the Doodle Monsters core tests (its game core with injected clock and dice, in-memory Zoo storage, builders and drivers in its testing helper), run with Vitest.

## Out of Scope

- Accounts, servers, online sharing, multiplayer.
- Fonts installable across the system.
- Timers, scores, fail states, randomness.
- Syllable blocks or non-alphabetic My Scripts (like Hangul blocks).
- Tracing practice in the Library (V2).
- Scanning a QR code back into the tablet (V2).
- Sums with carries in the Number Explorer (V1.1).
- Counting in World Script numerals in the Number Explorer, e.g. Mayan or Babylonian (V1.1).
- The enchanting-table alphabet in the Library (he can make it as a My Script).
- Building the Arcade home page itself (its own project). This app only needs to be linkable from it.
- Glyph Mines integration (decided when Glyph Mines is grilled; this spec only keeps the data shapes stable).

## Further Notes

- **Calls made while writing the spec, not settled in the grilling.** Overrule any of them:
  - Restore merges by id instead of replacing everything.
  - The Number Explorer is capped at 999 for the MVP.
  - The punctuation set is `. , ? !`.
  - Characters from Dad's phone keyboard that aren't Glyph slots show as plain characters.
  - "Too long" means suggesting a split.
  - A small QR library instead of a hand-written QR encoder.
- **Do the tablet test early.** The tablet model is unknown. The checklist in DESIGN.md (loads in the Kids profile, add-to-home-screen, saved data lasts, backup download and file picker, drawing smoothness, printing, which World Script fonts render, QR scanned by phone) should run as soon as there's a deployed build. Its results may change printing (print from the PC instead) and which fonts get bundled.
- **Arcade storage rule:** Doodle Monsters already names its database `doodle-monsters`, so it follows the rule.
- **Weekend scope:** the MVP is meant to take about a weekend. If it runs long, cut in this order: Library breadth (start with a handful of World Scripts), then printing (rely on the QR link plus printing from the PC), then the "type a number" feature.
