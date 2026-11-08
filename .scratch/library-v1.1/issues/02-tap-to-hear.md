# 02: Tap a World Character to hear it

**What to build:** Tapping any World Character (letter, syllable or numeral) on a World Script page says its name aloud using the device's built-in voices, slightly slowed. It uses the script's own language if the tablet has that voice, and English otherwise. The card glows while it speaks. See spec "Pronunciation rule" and "Speech adapter".

**Blocked by:** none

**Status:** ready-for-agent

- [ ] Data: `WorldScript.voice?` (BCP 47 tag) and `WorldCharacter.say?` added; voice tags filled in for the existing scripts per the spec's mapping
- [ ] Core: pronunciation rule (tested): native voice when a matching language is available (primary-subtag match); English fallback says the name, never the sound text; numerals say their text natively or their value in English; numeral-only systems always use English; `say` overrides; first form split off multi-form text; rate 0.8
- [ ] Content check: `voice` tags are well-formed (tested)
- [ ] `src/sound/speech.ts`: voice list (handles late `voiceschanged`), speak with cancel-before-speak, start/end callbacks, silent no-op without speech synthesis
- [ ] Character and numeral cards become buttons; the card glows while speaking (about 600 ms when there's no speech)
- [ ] Checked by ear in Edge: Greek, Hangul, kana and Hindi speak natively if Windows has those voices; runes and Roman fall back to English; 0.8× sounds right

## Comments
