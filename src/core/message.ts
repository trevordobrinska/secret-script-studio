/**
 * The saved Message's data shape. Kept stable and documented (Glyph Mines
 * may read it). Bump MESSAGE_SCHEMA_VERSION whenever the saved shape changes.
 */
export const MESSAGE_SCHEMA_VERSION = 1;

/**
 * A Message saved in one My Script's diary. The text is plain characters,
 * already folded (lowercase to uppercase, any whitespace to a space). It
 * holds no Glyphs: they are looked up live when drawing, so redrawing a
 * Glyph changes every Message that uses it.
 */
export interface Message {
  readonly id: string;
  /** The My Script it was written in. */
  readonly scriptId: string;
  readonly text: string;
  /** ms since 1970 (clock.now()). */
  readonly createdAt: number;
  readonly updatedAt: number;
}

/** A Message as stored. Records from another schema version are skipped on load. */
export interface MessageRecord extends Message {
  readonly schemaVersion: number;
}
