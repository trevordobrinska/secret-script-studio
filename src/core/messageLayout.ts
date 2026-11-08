/**
 * The Message layout: the one way a Message's text becomes something to
 * draw. The Write screen, the printout and the Reply page all use it.
 * Pure and DOM-free: it takes the text and a set of Glyphs, so it works
 * with a stored My Script (`script.glyphs`) and with the Glyphs decoded
 * from a share link alike.
 */
import { GLYPH_SLOTS, type Glyph, type GlyphSlot } from "./myScript";

/** One cell of a laid-out Message. `char` is the plain character shown under it. */
export type MessageCell =
  /** A character he has drawn a Glyph for. */
  | { readonly kind: "glyph"; readonly slot: GlyphSlot; readonly char: string; readonly glyph: Glyph }
  /** A character that has a slot but no Glyph yet: a dotted box. Tapping it can open the canvas for `slot`. */
  | { readonly kind: "missingGlyph"; readonly slot: GlyphSlot; readonly char: string }
  /** A space with no Glyph: an ordinary gap. */
  | { readonly kind: "gap"; readonly char: " " }
  /** Anything that isn't a Glyph slot (e.g. "é" or "@" from Dad's phone keyboard), shown as itself. */
  | { readonly kind: "plain"; readonly char: string };

/** The Glyphs a layout can use: a My Script's `glyphs`, or a shared Message's. */
export type GlyphSet = Readonly<Partial<Record<GlyphSlot, Glyph>>>;

/** The slots a Message can be typed with, in keyboard order: letters, digits, marks, then space. */
export const TYPEABLE_SLOTS: readonly GlyphSlot[] = [
  ...GLYPH_SLOTS.filter((slot) => slot.length === 1),
  "space",
];

/**
 * Message text as it is kept: lowercase a–z folded to uppercase, and any
 * other whitespace (tabs, new lines) turned into a plain space. Nothing
 * else changes.
 */
export function foldMessageText(text: string): string {
  return text.replace(/[a-z]/g, (c) => c.toUpperCase()).replace(/\s/g, " ");
}

/** The Glyph slot a (folded) character is written with, or undefined if it isn't one. */
export function slotForChar(char: string): GlyphSlot | undefined {
  if (char === " ") return "space";
  return char.length === 1 && (TYPEABLE_SLOTS as readonly string[]).includes(char) ? (char as GlyphSlot) : undefined;
}

/** The character a typeable slot puts into a Message ("A", "7", "?", " " for space). */
export function charForSlot(slot: GlyphSlot): string | undefined {
  if (slot === "space") return " ";
  return slot.length === 1 ? slot : undefined;
}

/** Lays out Message text in a set of Glyphs, one cell per character (lowercase folded first). */
export function layoutMessage(text: string, glyphs: GlyphSet): MessageCell[] {
  return Array.from(foldMessageText(text), (char): MessageCell => {
    const slot = slotForChar(char);
    if (!slot) return { kind: "plain", char };
    const glyph = glyphs[slot];
    if (glyph) return { kind: "glyph", slot, char, glyph };
    if (slot === "space") return { kind: "gap", char: " " };
    return { kind: "missingGlyph", slot, char };
  });
}

/**
 * The cells grouped into words, for wrapping: each run of non-space cells
 * is one word, and each space (gap, or a drawn space Glyph) is a word of
 * its own. Lines should only break between words.
 */
export function messageWords(cells: readonly MessageCell[]): MessageCell[][] {
  const words: MessageCell[][] = [];
  let word: MessageCell[] = [];
  for (const cell of cells) {
    if (cell.char === " ") {
      if (word.length > 0) words.push(word);
      words.push([cell]);
      word = [];
    } else {
      word.push(cell);
    }
  }
  if (word.length > 0) words.push(word);
  return words;
}
