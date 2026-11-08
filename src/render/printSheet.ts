import "./printSheet.css";
import type { MessageCell, PrintLayout } from "../core/studioCore";
import { glyphSvg } from "./glyphRenderer";

const SHEET_ID = "print-sheet";

/**
 * Prints a print layout: puts a print-only sheet in the page (hidden on
 * screen; while printing, it is the only thing shown) and calls the
 * browser's print. Page one is the Message; the Cipher Key, if there is
 * one, starts on a page of its own. Every Glyph is SVG, so it is crisp at
 * any size. The sheet stays until the next print or `afterprint`.
 */
export function printSheet(layout: PrintLayout): void {
  document.getElementById(SHEET_ID)?.remove();
  const sheet = div("pr-sheet");
  sheet.id = SHEET_ID;
  sheet.append(messagePage(layout));
  if (layout.cipherKey) sheet.append(cipherKeyPage(layout));
  document.body.append(sheet);
  window.addEventListener("afterprint", () => sheet.remove(), { once: true });
  window.print();
}

function messagePage(layout: PrintLayout): HTMLElement {
  const page = div("pr-page pr-message-page");
  page.append(div("pr-caption", `A secret Message in ${layout.name}`));
  const message = div("pr-message");
  for (const word of layout.message.words) {
    const w = div("pr-word");
    for (const cell of word) w.append(cellView(cell, layout));
    message.append(w);
  }
  page.append(message);
  return page;
}

function cellView(cell: MessageCell, layout: PrintLayout): HTMLElement {
  const box = div(`pr-cell pr-${cell.kind}`);
  if (cell.kind === "glyph") box.append(glyphSvg(cell.glyph.strokes, layout));
  // A Missing Glyph can't be decoded with the key, so it keeps its letter, faintly.
  else if (cell.kind === "missingGlyph" || cell.kind === "plain") box.textContent = cell.char;
  return box;
}

function cipherKeyPage(layout: PrintLayout): HTMLElement {
  const page = div("pr-page pr-key-page");
  page.append(div("pr-key-title", "Cipher Key"), div("pr-caption", `for ${layout.name}`));
  const grid = div("pr-key");
  for (const entry of layout.cipherKey ?? []) {
    const row = div("pr-key-entry");
    const glyph = div("pr-key-glyph");
    glyph.append(glyphSvg(entry.glyph.strokes, layout));
    row.append(glyph, div(`pr-key-label${entry.label.length > 2 ? " pr-key-word" : ""}`, `= ${entry.label}`));
    grid.append(row);
  }
  if (!layout.cipherKey?.length) grid.append(div("pr-caption", "No Glyphs drawn yet."));
  page.append(grid);
  return page;
}

function div(className: string, text?: string): HTMLDivElement {
  const d = document.createElement("div");
  d.className = className;
  if (text !== undefined) d.textContent = text;
  return d;
}
