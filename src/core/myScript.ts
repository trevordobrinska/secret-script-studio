/**
 * The My Script data shapes. Keep these stable and documented: they are
 * what is saved on the tablet, and Glyph Mines may read them one day.
 * Bump MY_SCRIPT_SCHEMA_VERSION whenever a saved shape changes.
 */

/** Bump when the saved My Script record's shape changes. */
export const MY_SCRIPT_SCHEMA_VERSION = 1;

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] as const;
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
/** The digits past nine, for Digit Counts up to 16. Spelled out so they can't clash with letters. */
const EXTRA_DIGITS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"] as const;
const MARKS = ["space", ".", ",", "?", "!"] as const;

/**
 * Which letter, digit or mark a Glyph stands for: `"A"`–`"Z"`, `"0"`–`"9"`,
 * `"ten"`–`"fifteen"`, `"space"`, and the punctuation marks `. , ? !`.
 */
export type GlyphSlot =
  | (typeof LETTERS)[number]
  | (typeof DIGITS)[number]
  | (typeof EXTRA_DIGITS)[number]
  | (typeof MARKS)[number];

/** Every Glyph slot of a My Script, in the order its grid shows them. */
export const GLYPH_SLOTS: readonly GlyphSlot[] = [...LETTERS, ...DIGITS, ...EXTRA_DIGITS, ...MARKS];

/** The digit slots in value order: index n is the slot for digit value n (0–15). */
export const DIGIT_SLOTS: readonly GlyphSlot[] = [...DIGITS, ...EXTRA_DIGITS];

/** Whether a string is a Glyph slot (e.g. when reading saved data). */
export function isGlyphSlot(value: string): value is GlyphSlot {
  return (GLYPH_SLOTS as readonly string[]).includes(value);
}

/** How a slot is shown to the kid in plain letters: "A", "7", "10", "space", "?". */
export function slotLabel(slot: GlyphSlot): string {
  const extra = (EXTRA_DIGITS as readonly string[]).indexOf(slot);
  return extra >= 0 ? String(10 + extra) : slot;
}

/** A point on the Glyph canvas, normalized to its square: (0,0) top-left, (1,1) bottom-right. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** One finger stroke: its points in order. Its width comes from the My Script. */
export type Stroke = readonly Point[];

/** The shape he drew for one Glyph slot. */
export interface Glyph {
  readonly strokes: readonly Stroke[];
  /** When it was last drawn, in ms since 1970 (like `Date.now()`). */
  readonly updatedAt: number;
}

/** The ink colors a My Script can have (all Glyphs in it share one). */
export const INK_COLORS = ["#2f3a56", "#3b6fd1", "#2f8f5b", "#c0392b", "#8e44ad", "#d97a1e"] as const;
export type InkColor = (typeof INK_COLORS)[number];

/** The stroke widths a My Script can have, as a fraction of the Glyph square's side. */
export const STROKE_WIDTHS = { thin: 0.04, medium: 0.07, thick: 0.1 } as const;
export type StrokeWidth = (typeof STROKE_WIDTHS)[keyof typeof STROKE_WIDTHS];

/** A writing system he invented, with the Glyphs drawn so far. */
export interface MyScript {
  readonly id: string;
  readonly name: string;
  /** A CSS hex color, one of INK_COLORS. */
  readonly ink: string;
  /** Stroke width as a fraction of the Glyph square's side (one of STROKE_WIDTHS). */
  readonly strokeWidth: number;
  /** ms since 1970. */
  readonly createdAt: number;
  /** ms since 1970: last change to the name, ink, width or any Glyph. */
  readonly updatedAt: number;
  /** Only drawn slots have an entry; a slot with no entry is a Missing Glyph. */
  readonly glyphs: Readonly<Partial<Record<GlyphSlot, Glyph>>>;
}

/** A My Script as saved on the tablet: the same shape plus its schema version. */
export interface MyScriptRecord extends MyScript {
  readonly schemaVersion: number;
}
