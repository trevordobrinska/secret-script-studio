# 11: "How many digits?" control

**What to build:** A "How many digits?" control shows a row of his own digit Glyphs. He taps to add or remove one, from 2 up to 16. Changing the Digit Count keeps the same number and rewrites it in the new digits. A small "base N" caption names it for the curious, and a one-time hint says "Try fewer digits!". He can also type a regular number on a 0–9 keypad to see it in his digits.

**Blocked by:** 09 (Number Explorer counter)

**Status:** resolved

- [x] Core: set Digit Count 2–16; the number is kept and the digits are recomputed (tested for every Digit Count)
- [x] Core: the first-time hint shows once, remembered in settings (tested, including across reload)
- [x] Core: enter a regular number 0–999 as the current number (tested)
- [x] Control shows his digit Glyphs for the active digits, including the extra digits ten to fifteen as Missing Glyphs if undrawn (tappable to draw)
- [x] Small "base N" caption; the word "base" appears nowhere else
- [x] 0–9 keypad for typing a number

## Comments

After code review the digit row itself is the control (ghost tiles add, '−' badge on the last digit removes; Fewer/More kept as secondary).
