# 09: Number Explorer counter

**What to build:** The Number Explorer tile opens a counter in the digits of one of his My Scripts (his most recent by default, with a picker to switch). Big + and − buttons count from 0 to 999 with the digits rolling over like an odometer, at a Digit Count of 10. Digits he hasn't drawn show as Missing Glyphs and can be tapped to draw.

**Blocked by:** 03 (Draw the first Glyph)

**Status:** ready-for-agent

- [ ] Core: Number Explorer state (chosen My Script, Digit Count, number); increment and decrement; the view gives each column's digit slot (Glyph or Missing Glyph) and value, plus which columns rolled over (tested)
- [ ] The view's per-column item counts (loose blocks, Stacks, Stacks of Stacks) are computed and tested here, even though ticket 10 draws them
- [ ] − at 0 and + at 999 are simply disabled (tested; no message)
- [ ] Defaults to the most recently used My Script; opens at Digit Count 10 every time (tested)
- [ ] Odometer roll-over animation, short and gentle
- [ ] Tapping a Missing digit opens the Glyph canvas for that digit
