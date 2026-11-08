import { SPEECH_RATE, type Speech } from "./library/pronunciation";
import { canHaveSound, cleanSound, slotLabel, type GlyphSlot } from "./myScript";
import { layoutMessage, type GlyphSet, type MessageCell } from "./messageLayout";

/**
 * How one Glyph is said alone, always in English at SPEECH_RATE: its
 * Sound (cleaned as when saved), or, with none, its plain letter or digit
 * ("B" is read "bee", the "ten" slot "10").
 */
export function glyphSpeech(slot: GlyphSlot, sound: string | undefined): Speech {
  return { text: cleanSound(sound) ?? slotLabel(slot), lang: "en", rate: SPEECH_RATE };
}

/**
 * How Read it to me says a whole Message written in `glyphs` (a My
 * Script's, or a SharedMessage's): one English Speech at SPEECH_RATE.
 * Each word's letters and digits are glued into one spoken word, each
 * adding its Sound or, with none (or for a Missing Glyph), its plain
 * lowercase letter or digit ("kla" + B + "zo" is "klabzo"). Words are
 * joined by one space and each punctuation mark stays after its word, so
 * the voice pauses there. Undefined when there's nothing to say: no
 * letter or digit at all (spaces and punctuation marks alone are silence).
 */
export function messageSpeech(text: string, glyphs: GlyphSet): Speech | undefined {
  const cells = layoutMessage(text, glyphs).cells;
  if (!cells.some(isSaid)) return undefined;
  const said = cells.map(saidAs).join("").replace(/ +/g, " ").trim();
  return { text: said, lang: "en", rate: SPEECH_RATE };
}

/** Whether a cell is a letter or digit: its slot can have a Sound, or it's one typed on Dad's keyboard. */
function isSaid(cell: MessageCell): boolean {
  if (cell.kind === "glyph" || cell.kind === "missingGlyph") return canHaveSound(cell.slot);
  return /[\p{L}\p{N}]/u.test(cell.char);
}

/**
 * What one cell of a Message adds to what's said: its Sound, or else its
 * plain character in lowercase (a space or punctuation mark is a pause).
 */
function saidAs(cell: MessageCell): string {
  const sound = cell.kind === "glyph" && canHaveSound(cell.slot) ? cleanSound(cell.glyph.sound) : undefined;
  return sound ?? cell.char.toLowerCase();
}
