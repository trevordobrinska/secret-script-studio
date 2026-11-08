import "./messageView.css";
import { messageWords, type MessageCell } from "../core/messageLayout";
import type { GlyphSlot } from "../core/myScript";
import { glyphImage, type GlyphInk } from "./glyphRenderer";

export interface MessageViewOptions {
  /** The Glyph square's side in CSS pixels. */
  readonly cellSize: number;
  /** Called when a Missing Glyph is tapped. Without it, Missing Glyphs are plain dotted boxes. */
  readonly onMissingGlyph?: (slot: GlyphSlot) => void;
  /** Show the plain letters under the Glyphs (default true). Secret mode turns them off. */
  readonly plainLetters?: boolean;
}

/**
 * A Message laid out as DOM: one column per cell, the Glyph (or dotted
 * box, or gap) on top and its plain character underneath. Words never
 * split across lines; lines break only at spaces. Used by the Write
 * screen, and meant for the Reply page too (`look` can be a My Script or
 * a shared Message's ink and width).
 */
export function messageView(cells: readonly MessageCell[], look: GlyphInk, options: MessageViewOptions): HTMLElement {
  const { cellSize, onMissingGlyph, plainLetters = true } = options;
  const view = document.createElement("div");
  view.className = "mv-message";
  view.style.setProperty("--mv-cell", `${cellSize}px`);
  for (const word of messageWords(cells)) {
    const w = document.createElement("span");
    w.className = "mv-word";
    for (const cell of word) w.append(cellView(cell));
    view.append(w);
  }
  return view;

  function cellView(cell: MessageCell): HTMLElement {
    const tappable = cell.kind === "missingGlyph" && onMissingGlyph;
    const c = document.createElement(tappable ? "button" : "span");
    c.className = `mv-cell mv-${cell.kind}`;
    const box = document.createElement("span");
    box.className = "mv-box";
    if (cell.kind === "glyph") box.append(glyphImage(cell.glyph.strokes, look, cellSize));
    if (cell.kind === "plain") box.textContent = cell.char;
    c.append(box);
    if (plainLetters) {
      const letter = document.createElement("span");
      letter.className = "mv-letter";
      letter.textContent = cell.kind === "plain" ? "" : cell.char;
      c.append(letter);
    }
    if (tappable && cell.kind === "missingGlyph") {
      (c as HTMLButtonElement).type = "button";
      c.setAttribute("aria-label", `Draw ${cell.char}`);
      c.addEventListener("click", () => onMissingGlyph(cell.slot));
    }
    return c;
  }
}
