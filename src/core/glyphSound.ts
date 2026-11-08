import { SPEECH_RATE, type Speech } from "./library/pronunciation";
import { cleanSound, slotLabel, type GlyphSlot } from "./myScript";

/**
 * What tapping one of his Glyphs does (the grid's 🔊 or the canvas's "try
 * it" 🔊). The same shape as a World Character tap: `speak` says `speech`
 * while the button glows; `muted` says nothing, glows, and gives the mute
 * button one soft wiggle.
 */
export type GlyphTap = { readonly kind: "speak"; readonly speech: Speech } | { readonly kind: "muted" };

/**
 * How one Glyph is said alone, always in English at SPEECH_RATE: its
 * Sound (cleaned as when saved), or, with none, its plain letter or digit
 * ("B" is read "bee", the "ten" slot "10").
 */
export function glyphSpeech(slot: GlyphSlot, sound: string | undefined): Speech {
  return { text: cleanSound(sound) ?? slotLabel(slot), lang: "en", rate: SPEECH_RATE };
}
