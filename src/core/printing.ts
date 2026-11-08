import { foldedMessageText, layoutMessage, type GlyphSet, type MessageLayout } from "./messageLayout";
import { GLYPH_SLOTS, slotLabel, type Glyph, type GlyphSlot, type MyScript, type ScriptLook } from "./myScript";
import type { SharedMessage } from "./shareLink";

/** What to print besides the Message page. */
export interface PrintOptions {
  /** Add a Cipher Key page (it always starts on its own page). */
  readonly cipherKey: boolean;
}

/**
 * A printout: a Message page and, when chosen, a Cipher Key page. The
 * renderer draws it as SVG on a print-only page.
 */
export interface PrintLayout extends ScriptLook {
  /** The Message page: the same layout (cells and words) the screens draw. */
  readonly message: MessageLayout;
  /**
   * The Cipher Key page, only when chosen: each drawn Glyph with the
   * letter, digit or mark it stands for. Letters A–Z, then digits 0–9 and
   * 10–15, then space and the marks. Missing Glyphs aren't listed.
   */
  readonly cipherKey?: readonly CipherKeyEntry[];
}

/** One row of the Cipher Key: a Glyph and what it stands for. */
export interface CipherKeyEntry {
  readonly slot: GlyphSlot;
  /** The plain letter, digit or mark, as the kid sees it: "A", "7", "12", "space", "?". */
  readonly label: string;
  readonly glyph: Glyph;
}

export type PrintLayoutResult =
  | { readonly ok: true; readonly layout: PrintLayout }
  | { readonly ok: false; readonly reason: "empty" | "noScript" };

/** The printing part of the Studio core's interface. */
export interface PrintingCommands {
  /** A printout of `text` written in one of his My Scripts (the draft or a saved Message). */
  printLayout(scriptId: string, text: string, options: PrintOptions): PrintLayoutResult;
  /**
   * A printout from the Reply page: `text` (the shared Message itself, or
   * Dad's reply) in a shared Message's Glyphs. Its Cipher Key lists only
   * the Glyphs that came in the link. Needs no stored My Script.
   */
  sharedPrintLayout(shared: SharedMessage, text: string, options: PrintOptions): PrintLayoutResult;
}

interface PrintingDeps {
  myScript(id: string): MyScript | undefined;
}

/** The core's printing rules. Not exported from the core: tests go through StudioCore. */
export function createPrinting({ myScript }: PrintingDeps): PrintingCommands {
  return {
    printLayout(scriptId, text, options) {
      const script = myScript(scriptId);
      if (!script) return { ok: false, reason: "noScript" };
      return printout(script, text, script.glyphs, options);
    },
    sharedPrintLayout: (shared, text, options) => printout(shared, text, shared.glyphs, options),
  };
}

function printout(
  { name, ink, strokeWidth }: ScriptLook,
  text: string,
  glyphs: GlyphSet,
  { cipherKey }: PrintOptions,
): PrintLayoutResult {
  const folded = foldedMessageText(text);
  if (folded === undefined) return { ok: false, reason: "empty" };
  return {
    ok: true,
    layout: {
      name,
      ink,
      strokeWidth,
      message: layoutMessage(folded, glyphs),
      ...(cipherKey ? { cipherKey: cipherKeyOf(glyphs) } : {}),
    },
  };
}

/** Every drawn Glyph in `glyphs`, in grid order (letters, digits, then space and marks). */
function cipherKeyOf(glyphs: GlyphSet): CipherKeyEntry[] {
  return GLYPH_SLOTS.flatMap((slot) => {
    const glyph = glyphs[slot];
    return glyph ? [{ slot, label: slotLabel(slot), glyph }] : [];
  });
}
