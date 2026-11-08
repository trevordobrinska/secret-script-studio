# 03: Read it to me for his own Messages

**What to build:** A **Read it to me** button on the Write screen and on a saved Message says the whole Message in his Sounds. Each word's Sounds are glued into one spoken word ("kla" + "zo" → "klazo"), with a pause at each space and punctuation mark. A letter or digit with no Sound, and a Missing Glyph, adds its plain lowercase letter or digit to the word ("kla" + B + "zo" → "klabzo"). Secret mode changes nothing. It is one utterance, so mute and cut-off work as in tap to hear. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** resolved

- [x] A new core command takes a Message's text and its Glyphs (as a GlyphSet, so ticket 04 can reuse it for a SharedMessage) and returns one English Speech at SPEECH_RATE, or `muted`
- [x] Words glue their letters' Sounds; words are separated by spaces; punctuation stays after its word so the voice pauses
- [x] Glyphs without a Sound and Missing Glyphs add their plain letter or digit
- [x] A Read it to me button in a fixed spot on the Write screen and on the saved-Message view; it glows while speaking and obeys mute (glow plus wiggle)
- [x] It works the same in Secret mode
- [x] Core tests through StudioCore cover gluing, pauses, the plain-letter fallback, digits and muted

## Comments

- 2026-11-08 (agent): `messageSpeech(text, glyphs)` in `src/core/glyphSound.ts` and `core.readItToMe(text, glyphs)`; the button is `readItToMeButton` in `src/screens/readItToMeButton.ts`, on the Write screen (after the Secret switch) and the saved-Message view. Tests: `src/core/readItToMe.test.ts`. Code-review fixes: a second tap while it's speaking goes quiet instead of restarting (story 24); leaving the screen stops speech; a Message of only marks says nothing. Agent decision: characters that aren't Glyph slots (such as 'é' from Dad's keyboard) are read as themselves.
- Open decision for Dad (spec Further Notes): inside a word, a Glyph without a Sound adds its plain lowercase letter ('kla' + B + 'zo' → 'klabzo'), while tapping it alone says 'bee'. DESIGN.md only says such Glyphs 'say their English letter'.
- Left for Dad: listen to Read it to me on the tablet and confirm the pauses at spaces and punctuation sound right.

Resolved 2026-11-08: Dad play-tested it and approved the 'klabzo' rule (a Glyph without a Sound adds its plain lowercase letter inside a word).
