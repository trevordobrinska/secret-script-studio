import "./myScripts.css";
import { GLYPH_SLOTS, slotLabel } from "../core/myScript";
import { glyphImage } from "../render/glyphRenderer";
import { el, type RenderScreen } from "./screen";

const CELL = 72;

/** A My Script's grid: every Glyph slot, drawn ones in his ink, empty ones as dotted boxes. Tap one to draw it. */
export const glyphGridScreen: RenderScreen<{ name: "glyphGrid"; scriptId: string }> = (root, screen, { core, go }) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  root.append(el("h1", "screen-title", script.name));
  const grid = el("div", "ms-grid");
  for (const slot of GLYPH_SLOTS) {
    const glyph = script.glyphs[slot];
    const cell = el("button", glyph ? "ms-slot" : "ms-slot missing");
    cell.type = "button";
    const box = el("span", "ms-slot-box");
    if (glyph) box.append(glyphImage(glyph.strokes, script, CELL));
    cell.append(box, el("span", "ms-slot-label", slotLabel(slot)));
    cell.addEventListener("click", () => go({ name: "glyphCanvas", scriptId: script.id, slot }));
    grid.append(cell);
  }
  root.append(grid);
};
