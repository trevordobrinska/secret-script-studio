# 05: More numeral systems

**What to build:** Four new numeral-only systems in the Library, each with its numerals and values and an About. They speak their values in English.

**Blocked by:** 01 (About for every World Script), 02 (Tap a World Character to hear it)

**Status:** resolved

- [x] Kaktovik numerals: digits 0–19 (base 20; About tells how Alaskan middle-schoolers invented them in the 1990s)
- [x] Egyptian numerals: 1, 10, 100, 1000, 10 000, 100 000, 1 000 000
- [x] Attic Greek numerals: Ι Π Δ Η Χ Μ plus the combined five-times forms (code points checked against the Unicode chart)
- [x] Chinese rod numerals: units and tens forms for 1–9
- [x] Each has an About; facts double-checked
- [x] The Library content check passes; the Library list's numeral sample still fits on its card
- [x] Kaktovik font: if no free font exists, record "draw as SVG strokes" on v1 ticket 16
- [x] Abouts listed in a comment below for Dad to skim

## Comments

**2026-11-07 (agent):** Built: four new numeral-only files under `src/core/library/scripts/` (`kaktovik`, `egyptian-numerals`, `attic-greek`, `rod-numerals`). None has a `voice`, so they say their values in English. The content check now lists their ids, checks each numeral is in its own Unicode range or script, and checks a few real values.

Code points were checked against Python's `unicodedata` (Unicode 16):
- Kaktovik: U+1D2C0 KAKTOVIK NUMERAL ZERO to U+1D2D3 KAKTOVIK NUMERAL NINETEEN.
- Egyptian: U+133E4 Z001 stroke (1), U+13386 V020 heel bone (10), U+13362 V001 coil (100), U+131BC M012 lotus (1000), U+130AD D050 finger (10 000), U+13190 I008 tadpole (100 000), U+13068 C011 Heh (1 000 000).
- Attic: Greek capitals Ι Π Δ Η Χ Μ (U+0399, 03A0, 0394, 0397, 03A7, 039C) for 1, 5, 10, 100, 1000, 10 000. The five-times forms are U+10144 GREEK ACROPHONIC ATTIC FIFTY, U+10145 FIVE HUNDRED, U+10146 FIVE THOUSAND and U+10147 FIFTY THOUSAND. Unicode also has U+10143 ATTIC FIVE, the old Π with a short right leg. I used the plain Greek Π the ticket names; swap it in if you like the old shape better.
- Rods: U+1D360–1D368 units digits 1–9, U+1D369–1D371 tens digits 10–90.

Library card: the list shows the first three numerals (ef075ea), so the samples are 0 1 2 / 1 10 100 / Ι Π Δ / 1 2 3. Three glyphs at 56px fit in the 260px-minimum card, and `nowrap` + `overflow: hidden` keeps them from spilling over. No CSS change was needed. I haven't checked this by eye: none of these glyphs will render until the fonts are in (v1 ticket 16).

Kaktovik font: Noto Sans Symbols 2 (OFL) seems to cover it. That's recorded on v1 ticket 16, with SVG strokes as the fallback in case it doesn't.

"Facts double-checked" is left open. I wrote these from what I know and didn't check them against sources, so Dad's skim is the check. The facts I'd look at first:
- "Heel bone" for 10 is the usual kid-book name, but Egyptologists say the sign is really a cattle hobble (a rope for tying cows' legs).
- Kaktovik's 1994 date and "middle-school students" come from the standard story (Harold Kaveolook School, with teacher William Bartley).
- Rod numerals and negative numbers "more than a thousand years before Europe": they appear in the *Nine Chapters* (about 2,000 years ago), and Europe only accepted negatives around the 1500s–1600s.

**The new Abouts, for Dad to skim:**

- **Kaktovik numerals**: Kaktovik numerals were invented in 1994 by middle-school students in Kaktovik, a small village in Alaska. Their Iñupiaq language counts in twenties, so they made 20 digits that look like the counting: little strokes for ones, and marks on top for fives. Their numbers caught on, and in 2022 they were added to Unicode, the big list of letters and symbols every computer knows!
- **Egyptian numerals**: Egyptian numerals were carved and painted by the ancient Egyptians about 5,000 years ago. There's a stroke for one, a heel bone for ten, a coil of rope for a hundred, a lotus flower for a thousand, a finger for ten thousand and a tadpole for a hundred thousand. A million is a god called Heh throwing up his arms, as if to say "that's so many!"
- **Attic Greek numerals**: Attic numerals were used in Athens, in ancient Greece, about 2,500 years ago. Most of them are the first letter of the number's Greek word: Π for pente (five), Δ for deka (ten) and Η for hekaton (a hundred). To write fifty, the Greeks tucked a little Δ inside a Π, meaning "five tens"!
- **Chinese rod numerals**: Counting rods were little sticks of bamboo or bone that people in ancient China laid out on a board to do math, more than 2,000 years ago. Ones are rods standing up and tens are rods lying down, so you can tell the places apart, and an empty space meant zero. Chinese mathematicians even used them for negative numbers, more than a thousand years before Europe did!

Agent work merged on `library-v1.1` (2026-11-08). Left for Dad: the fact check (flagged facts listed above) and the About skim.

Resolved 2026-11-08: Dad checked it in Edge and approved the Abouts.
