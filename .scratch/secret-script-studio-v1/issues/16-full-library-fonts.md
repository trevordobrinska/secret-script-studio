# 16: Full Library + bundled fonts

**What to build:** The Library holds every World Script and numeral system from the spec, and every character renders on the kid's tablet. Free fonts are bundled only for the scripts the tablet test found missing.

**Blocked by:** 12 (Library starter), 15 (Run the tablet test)

**Status:** ready-for-agent

- [x] World Scripts: Greek, Cyrillic, Hangul, Hebrew, Arabic, Devanagari, Georgian, Armenian, hiragana, katakana, Elder Futhark runes, Ogham, Thai, Ethiopic, Cherokee, Tifinagh, each with character names and sounds and its numerals where it has them
- [x] Numeral systems: Roman, Mayan, Babylonian, Chinese, Eastern Arabic, Devanagari
- [ ] Free fonts (e.g. Noto, OFL) bundled, subset where practical, only for scripts ticket 15 found missing; license credits recorded
- [x] The Library content check (ticket 12) passes for all entries
- [ ] Also covers the Library V1.1 scripts (`.scratch/library-v1.1/` tickets 04 and 05); Kaktovik may need SVG-drawn digits if no free font exists
- [ ] Re-check on the tablet that nothing renders as empty boxes
- [x] Enchanting-table alphabet is **not** included

## Comments

Content part done on `secret-script-studio-v1`: 21 World Scripts and numeral systems (Hebrew/Arabic shown right to left). Fonts are not bundled yet: they wait on ticket 15's list of scripts that render as empty boxes. Status left open.

**2026-11-07 (agent, library-v1.1 ticket 05):** Kaktovik font check: a free font does seem to exist. Codepoints.net shows the Kaktovik digits (U+1D2C0 to U+1D2D3, new in Unicode 15) drawn from **Noto Sans Symbols 2** (OFL), so bundle that (subset to U+1D2C0–1D2D3) instead of drawing them. I only checked this from search results and didn't open the font file, so make sure the Noto Sans Symbols 2 release you download really has the 20 glyphs. Only if it doesn't: draw the 20 digits as SVG strokes (they're all straight lines). The other three new numeral systems will probably need fonts too: Egyptian numerals (Noto Sans Egyptian Hieroglyphs), the Attic Greek five-times forms U+10144–10147 (the other Attic numerals are plain Greek letters), and counting rods U+1D360–1D371. I haven't checked which Noto font covers the last two, so look that up when bundling.

**2026-11-07 (agent, library-v1.1 ticket 04):** Eleven more World Scripts are in the Library and their fonts are in scope here: Glagolitic, Coptic (note: seven of its letters live in Unicode's Greek and Coptic block, U+03E2–03EF, so the Coptic font must cover those too), Gothic, Phoenician (right to left), Younger Futhark (Runic, same font as Elder Futhark), Canadian syllabics, Tibetan, Bengali, Tamil, Linear B and Egyptian hieroglyphs. Noto has a font for each (Noto Sans Glagolitic, Coptic, Gothic, Phoenician, Runic, Canadian Aboriginal, Noto Serif Tibetan, Noto Sans Bengali, Tamil, Linear B, Egyptian Hieroglyphs); the hieroglyph font is big, so subset it to the signs used (the 25 one-sound signs plus the Egyptian numerals from ticket 05).
