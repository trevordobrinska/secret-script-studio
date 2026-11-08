# 03: Read it to me for his own Messages

**What to build:** A **Read it to me** button on the Write screen and on a saved Message says the whole Message in his Sounds. Each word's Sounds are glued into one spoken word ("kla" + "zo" → "klazo"), with a pause at each space and punctuation mark. A letter or digit with no Sound, and a Missing Glyph, adds its plain lowercase letter or digit to the word ("kla" + B + "zo" → "klabzo"). Secret mode changes nothing. It is one utterance, so mute and cut-off work as in tap to hear. See `.scratch/glyph-sounds/spec.md`.

**Blocked by:** 01 (Give a Glyph a Sound and try it on the canvas)

**Status:** ready-for-agent

- [ ] A new core command takes a Message's text and its Glyphs (as a GlyphSet, so ticket 04 can reuse it for a SharedMessage) and returns one English Speech at SPEECH_RATE, or `muted`
- [ ] Words glue their letters' Sounds; words are separated by spaces; punctuation stays after its word so the voice pauses
- [ ] Glyphs without a Sound and Missing Glyphs add their plain letter or digit
- [ ] A Read it to me button in a fixed spot on the Write screen and on the saved-Message view; it glows while speaking and obeys mute (glow plus wiggle)
- [ ] It works the same in Secret mode
- [ ] Core tests through StudioCore cover gluing, pauses, the plain-letter fallback, digits and muted
