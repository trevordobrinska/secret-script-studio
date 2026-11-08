# Secret Script Studio: Design (grilled 2026-11-07)

The pitch is in `IDEA.md` and the vocabulary is in `GLOSSARY.md`. This file records what was decided and why.

## Goal
My 10-year-old son invents his own scripts, then actually *uses* them: writes secret Messages, trades them with me and counts in his own digits. He also gets a reference book of real scripts to copy out by hand. It's fun for him and a way to sharpen my coding skills. Productivity doesn't matter.

Calm by default: no timers, scores, fail states, randomness or gates. He doesn't have strong sensory issues, so these are the defaults: soft click sounds (mutable), short gentle animations, and a fixed layout where buttons never move.

## Platform
- **Device:** his own tablet, a different one from Doodle Monsters'. Probably a Fire, model **unknown — find out**. Assume Silk (Chromium) in an Amazon Kids profile until proven otherwise.
- **Stack:** Vite + TypeScript, a plain `<canvas>` for drawing, and Vitest for the rules. Same as Doodle Monsters. Reuse its stroke-capture code (`src/draw/drawing.ts`, where each Stroke is a list of points with a width).
- **Hosting:** GitHub Pages at `trevordobrinska.github.io/secret-script-studio/`, reached from the **Arcade** (see below).
- **Tests:** Vitest for the rules: rendering a Message with Missing Glyphs, digit conversion for Digit Counts 2–16, Stack counts, packing and unpacking the share link, and saving and loading My Scripts. Feel gets playtested by eye.

## The Arcade (suite-wide, its own project)
- One home page, `Projects\arcade\` → repo `trevordobrinska.github.io`, with one big tile per game. Each game stays its own project and repo and links in at its own path.
- **One shared menu** for both kids, with no per-kid setup. Approve the domain once in the Parent Dashboard.
- **Suite rule:** every game shares one browser origin and so one storage area. **Each game prefixes its saved data with its own name** (e.g. IndexedDB database `secret-script-studio`). Doodle Monsters already does (database `doodle-monsters`).

## Home screen
Three big tiles, always in the same place: **My Scripts**, **Library**, **Number Explorer**. Everything is one tap from home.

## My Scripts
- He can make **as many My Scripts as he likes**, each with a name, an ink color and a stroke width chosen at creation. All Glyphs in a My Script match.
- A My Script has a Glyph slot for **A–Z, 0–9, extra digits ten to fifteen (for the Number Explorer), space and punctuation** (`. , ? !` at least).
- **Drawing a Glyph:** a square canvas with faint baseline and x-height guides, plus undo and clear. One ink only.
- **Glyph storage:** raw strokes (normalized points plus width) are the source of truth. They're drawn to canvas on screen and turned into SVG for printing, so they stay crisp at any size.
- **Redrawing** a Glyph updates it everywhere live, like a font. Prints and links already sent keep the old shape. No history.
- **No 36-Glyph wall:** a brand-new My Script nudges "start with the letters of your name." Any letter without a Glyph shows as a **Missing Glyph** (empty dotted box) everywhere, and tapping it opens the canvas for that letter. Nothing is ever blocked.

## Writing Messages
- **The Write screen:** his Glyphs on top and the plain letters below. **Secret mode** hides the plain letters.
- **The keyboard:** an on-screen keyboard in his Glyphs, where Missing Glyphs show as dotted boxes. Typing on it is the "reverse" decoder, too.
- **Saved Messages:** each My Script keeps a list of its Messages (open, re-read, delete). It doubles as a secret diary.
- **Sending to Dad:** his tablet shows a **QR code**. The link packs the Message *and the Glyphs it uses*, with no server involved. My phone camera opens it and the Message shows decoded.
- **Replying:** the page opened from that link lets me type a reply that renders in *his* Glyphs. I hand him my phone or print it. **Scanning a QR code back into his tablet waits for V2** (it needs camera code).
- **Printing:** a Message page plus an optional, **separate** Cipher Key page, so he can hand over the Message and keep the key. If printing is blocked on the tablet, he prints from the PC by opening the QR link.

## Number Explorer
- Uses the digits of the My Script he's chosen (his most recent by default).
- **Digit Count** control, labeled **"How many digits?"**: a row of his own digit Glyphs, tap to add or remove one, from 2 to 16. "Base N" appears only as a small caption. It always opens on **10**, and nothing is locked. The first time, a one-line hint says "Try fewer digits!"
- **Stacks:** the quantity is shown as blocks that snap into a Stack when there are as many as the Digit Count, like Minecraft item stacks. Stacks of stacks make the next column. The number's columns are color-matched to the blocks and Stacks. This is the explanation of place value, with no words needed.
- **MVP:** big + / − counter with an odometer roll-over animation and Stacks, plus "type a regular number and see it in your digits."
- **V1.1:** simple sums (two numbers stacked, with carries shown as Stacks snapping over), and counting in World Script numerals that work like an odometer (Mayan uses 20, Babylonian 60; Roman stays out).

## Library (World Scripts)
- A calm reference book he flips through and copies onto paper. **No tracing in the MVP** (it's a nice V2, reusing the canvas).
- Each World Script shows its full set of characters big and clear, each character's **name and sound** ("Λ — lambda — L"), and its **numerals** where it has its own.
- **Content:** as many free, font-based scripts as possible. Bundle free fonts (e.g. Noto, OFL) for any the tablet lacks. Starter list: Greek, Cyrillic, Hangul, Hebrew, Arabic, Devanagari, Georgian, Armenian, hiragana and katakana, Elder Futhark runes, Ogham, Thai, Ethiopic, Cherokee, Tifinagh. Numeral systems: Roman, Mayan, Babylonian, Chinese, Eastern Arabic, Devanagari.
- **The enchanting-table alphabet is skipped.** He can make it as a My Script if he wants.

## Data
- My Scripts and Messages live in IndexedDB on his tablet, under the `secret-script-studio` name.
- **Backup/Restore** file buttons that anyone can use, like Doodle Monsters. Hand-drawn Glyphs are hours of work, so backup matters even more here.
- **Glyph Mines link (later):** because the Arcade shares one storage area, Glyph Mines could read his My Scripts directly. For now, keep the My Script data shape stable and documented, and decide the hookup when Glyph Mines is grilled.

## Test on his tablet (when the model is known)
- [ ] Find out the tablet model and browser
- [ ] The Arcade and this app load in his Kids profile
- [ ] Add-to-home-screen works and opens fullscreen
- [ ] Saved data survives closing the app, rebooting and a few days
- [ ] Downloading a backup file and the Restore file picker both work
- [ ] Finger drawing is smooth on a small Glyph canvas
- [ ] Printing works (or not), which decides whether printing goes through the PC
- [ ] Which Library scripts render with built-in fonts, and which need bundled fonts
- [ ] My phone camera opens the on-screen QR code

## Out of scope
Accounts, a server, online sharing, multiplayer, fonts installable across the system, timers, scores, fail states, syllable blocks (like Hangul), tracing practice, scanning a QR code into the tablet (V2).
