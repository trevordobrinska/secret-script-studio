# 02: Tap a World Character to hear it

**What to build:** Tapping any World Character (letter, syllable or numeral) on a World Script page says its name aloud using the device's built-in voices, slightly slowed. It uses the script's own language if the tablet has that voice, and English otherwise. The card glows while it speaks. See spec "Pronunciation rule" and "Speech adapter".

**Blocked by:** none

**Status:** ready-for-human

- [x] Data: `WorldScript.voice?` (BCP 47 tag) and `WorldCharacter.say?` added; voice tags filled in for the existing scripts per the spec's mapping
- [x] Core: pronunciation rule (tested): native voice when a matching language is available (primary-subtag match); English fallback says the name, never the sound text; numerals say their text natively or their value in English; numeral-only systems always use English; `say` overrides; first form split off multi-form text; rate 0.8
- [x] Content check: `voice` tags are well-formed (tested)
- [x] `src/sound/speech.ts`: voice list (handles late `voiceschanged`), speak with cancel-before-speak, start/end callbacks, silent no-op without speech synthesis
- [x] Character and numeral cards become buttons; the card glows while speaking (about 600 ms when there's no speech)
- [ ] Checked by ear in Edge: Greek, Hangul, kana and Hindi speak natively if Windows has those voices; runes and Roman fall back to English; 0.8× sounds right

## Comments

- 2026-11-07 (agent): Built test-first through the core: `core.worldCharacterTap(scriptId, entry, voiceLangs)` returns `{ kind: "speak", speech: { text, lang, rate } }` (rule in `src/core/library/pronunciation.ts`; ticket 03 adds a muted variant to the `WorldCharacterTap` union). Adapter in `src/sound/speech.ts` (`startSpeech`, `voiceLangs`, `speak`, `stopSpeaking`); the page stops speaking when it is left.
- `say` added only for the eight Thai vowel letters (ะ า ำ เ แ โ ใ ไ), which read as nothing on their own; each says its Thai name (สระอะ…). Nothing else needed it without an ear check.
- Flag (spec vs itself): "numeral-only systems always use English" conflicts with the mapping giving Chinese numerals `zh` and Eastern Arabic `ar`. Built it voice-based: those two speak natively when the voice is there; Roman, Mayan and Babylonian have no voice so always say their value in English (matches DESIGN: "Roman, Mayan, Babylonian…").
- Flag (DESIGN wording): DESIGN says a Greek voice says "λάμδα"; the spec hands the voice the letter itself ("Λ"), trusting the voice to read a lone letter by its name. Worth listening for in the ear check; a `say` fixes any that read badly.
- Ear check in Edge not done: the agent cannot listen. Left unchecked for Dad.

Agent work merged on `library-v1.1` (2026-11-08), plus code-review fixes: a card glows at most 4 s even if the voice never reports `end`, and language-tag parsing is now one shared helper. Left for Dad: the ear check in Edge. Two decisions are still open: (1) Chinese and Eastern Arabic numerals speak natively because of their voice tags, even though the spec says numeral-only systems always use English; (2) whether the native voice reading the bare letter ("Λ") is good enough, or `say` should carry the letter's name ("λάμδα") as DESIGN.md's example does.
