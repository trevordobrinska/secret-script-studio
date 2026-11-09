# Secret Script Studio: Design (grilled 2026-11-07)

The pitch is in `IDEA.md` and the vocabulary is in `GLOSSARY.md`. This file records what was decided and why.

## Goal
My 10-year-old son invents his own scripts, then actually *uses* them: writes secret Messages, trades them with me and counts in his own digits. He also gets a reference book of real scripts to copy out by hand. It's fun for him and a way to sharpen my coding skills. Productivity doesn't matter.

Calm by default: no timers, scores, fail states, randomness or gates. He doesn't have strong sensory issues, so these are the defaults: soft click sounds (mutable), short gentle animations, and a fixed layout where buttons never move.

## Platform
- **Device:** his own tablet, a different one from Doodle Monsters'. Tested 2026-11-08: a Fire in an Amazon Kids profile, running **Amazon Kids Browser** (Chromium 138), 601×962 CSS px at ≈1.33× (800×1280, which matches a Fire HD 8; model still to read off the device). His sister's tablet behaved identically.
- **Stack:** Vite + TypeScript, a plain `<canvas>` for drawing, and Vitest for the rules. Same as Doodle Monsters. Reuse its stroke-capture code (`src/draw/drawing.ts`, where each Stroke is a list of points with a width).
- **Hosting:** GitHub Pages at `trevordobrinska.github.io/secret-script-studio/`, reached from the **Arcade** (see below).
- **Tests:** Vitest for the rules: rendering a Message with Missing Glyphs, digit conversion for Digit Counts 2–16, Stack counts, packing and unpacking the share link, and saving and loading My Scripts. Feel gets playtested by eye.

## The Arcade (suite-wide, its own project)
Secret Script Studio is one Game in the Dobrinska Arcade. The Arcade's design is in `Projects\arcade\DESIGN.md`, and the rules every Game follows are in `Projects\arcade\SUITE-RULES.md`. Those files are the source of truth for anything suite-wide. In short: the tablets install **only the Arcade**, this app never asks to be installed itself, and its Home screen has a house button back to the Arcade (`/`).

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
- **Printing:** a Message page plus an optional, **separate** Cipher Key page, so he can hand over the Message and keep the key. **Printing is blocked on the tablet** (tablet test, 2026-11-08), so it goes through the PC: Dad opens the QR link there and prints from the reply page. What the tablet's Print button does instead is ticket 18.

### Sounds (grilled 2026-11-08)
His idea: give his own Glyphs sounds, so his My Scripts can be *spoken*, not just written.
- **A Sound is typed, not recorded.** On the Glyph drawing screen there's a "How does it sound?" box (about 12 characters) with a 🔊 button to try it. It saves with **Save** / **Save & next**, along with the drawing. He can type a Sound before drawing anything. There's one field only, with no separate "name". Recording his voice was passed over: it needs the microphone, which is untested in Amazon Kids.
- **Letters and digits** can have a Sound; space and punctuation can't (they're pauses). The Number Explorer stays silent for now.
- **The voice:** always the device's English voice, at the same 0.8× as tap to hear, with the same glow and the same mute rules (silent, plus one wiggle). There's no voice picker. A made-up spelling read oddly by an English voice is part of the fun.
- **No Sound yet:** the English voice says the letter it stands for ("bee"). Nothing is ever silent or blocked.
- **The Glyph grid:** tapping a cell still opens the canvas. Each drawn Glyph's cell gets a small 🔊 corner button that speaks it and glows the cell.
- **Read it to me:** a button that says a whole Message in his Sounds. Each word's Sounds are glued into one spoken word ("kla" + "zo" → "klazo"), with a pause at each space and punctuation mark. Glyphs without a Sound and Missing Glyphs say their English letter. Secret mode changes nothing. It sits on the Write screen and on a saved Message, and Dad's reply page has it too.
- **Sounds go where Glyphs go:** Backup/Restore includes them. The share link carries the Sounds of the Glyphs it uses, which needs a new link format version, and old `m1.` links must keep opening. The printed Cipher Key shows each Glyph's Sound under its letter.

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

### Library V1.1 (grilled 2026-11-07)
- **About:** every World Script (numeral systems too) gets 2–3 short sentences under its title, written for a 10-year-old: where it's used today, roughly how old it is and where it came from, and one fun fact. Claude drafts them and Dad skims them for accuracy and tone.
- **Tap to hear:** tapping a World Character says its **name** aloud using the device's built-in voices (no recorded clips). It uses a voice for the script's own language when the tablet has one (Greek says "λάμδα"); otherwise an English voice says just the name ("lambda"), never the sound text. Numerals work the same: a writing system's numerals are said in its language, and numeral-only systems (Roman, Mayan, Babylonian…) say their value in English ("nineteen"). Speech runs a little slow (about 0.8×, to be tuned by ear). The card glows gently while it speaks.
- **Mute silences everything**, the voice included. A tap while muted still glows the card, and the mute button gives one soft wiggle (no words), so he can tell the sound is off rather than broken.
- **More World Scripts:** writing systems Glagolitic, Coptic, Gothic, Phoenician, Younger Futhark, Canadian syllabics (Inuktitut), Tibetan, Bengali, Tamil, Linear B and Egyptian hieroglyphs (the one-sound signs only); numeral systems Kaktovik (base 20, invented by Alaskan middle-schoolers), Egyptian, Attic Greek and Chinese rod numerals. Mongolian is skipped: it's written top to bottom, which the page layout doesn't do. Their fonts join the bundled-font work and wait on the tablet test like the rest.

## Data
- My Scripts and Messages live in IndexedDB on his tablet, under the `secret-script-studio` name.
- **Backup/Restore** file buttons that anyone can use, like Doodle Monsters. Hand-drawn Glyphs are hours of work, so backup matters even more here. **The Restore file picker doesn't open in Amazon Kids Browser** (tablet test, 2026-11-08). Ticket 17 decides the way around it.
- **Glyph Mines link (later):** because the Arcade shares one storage area, Glyph Mines could read his My Scripts directly. For now, keep the My Script data shape stable and documented, and decide the hookup when Glyph Mines is grilled.

## Test on his tablet
A ticked box means answered. Results are in ticket 15's Comments.
- [ ] Find out the tablet model and browser (browser: Amazon Kids Browser, Chromium 138; model still to read off the device)
- [ ] The Arcade and this app load in his Kids profile
- [ ] The installed Arcade opens this app fullscreen, and the house button and Back return to the Arcade (this app itself is never installed)
- [ ] Saved data survives closing the app, rebooting and a few days
- [x] Downloading a backup file and the Restore file picker both work: **Restore picker fails**; download not reported yet (ticket 17)
- [x] Finger drawing is smooth on a small Glyph canvas: smooth
- [x] Printing works (or not), which decides whether printing goes through the PC: **blocked**, so it goes through the PC (ticket 18)
- [ ] Which Library scripts render with built-in fonts, and which need bundled fonts: of the original 22, only **Mayan numerals** are missing; V1.1 scripts not checked yet (ticket 16)
- [ ] Which Library languages the tablet's built-in voices can speak, and whether 0.8× speed sounds right
- [x] My phone camera opens the on-screen QR code: works

## Out of scope
Accounts, a server, online sharing, multiplayer, fonts installable across the system, timers, scores, fail states, syllable blocks (like Hangul), tracing practice, scanning a QR code into the tablet (V2).
