import "./myScripts.css";
import { GLYPH_SLOTS, slotLabel, type GlyphSlot, type MyScript } from "../core/myScript";
import { glyphImage } from "../render/glyphRenderer";
import { playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";

const CELL = 72;

/**
 * A My Script's grid: every Glyph slot, drawn ones in his ink, empty ones
 * as dotted boxes. Tap one to draw it. After the name nudge, his name's
 * letters are offered first in a row above the grid.
 */
export const glyphGridScreen: RenderScreen<{ name: "glyphGrid"; scriptId: string; startWith?: readonly GlyphSlot[] }> = (
  root,
  screen,
  { core, go },
) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  const { startWith } = screen;
  root.append(el("h1", "screen-title", script.name));
  const actions = el("div", "ms-grid-actions");
  const write = el("button", "ms-button ms-write", "Write a Message");
  write.type = "button";
  write.addEventListener("click", () => {
    playTap();
    go({ name: "write", scriptId: script.id });
  });
  actions.append(write);
  const diary = el("button", "ms-button", "Messages");
  diary.type = "button";
  diary.addEventListener("click", () => {
    playTap();
    go({ name: "messages", scriptId: script.id });
  });
  actions.append(diary);
  root.append(actions);
  const scroller = el("div", "ms-grid-scroller");
  const open = (slot: GlyphSlot) => go({ name: "glyphCanvas", scriptId: script.id, slot, startWith });

  if (startWith && startWith.length > 0) {
    const first = el("section", "ms-start-with");
    first.append(el("h2", "ms-label", "Start with these"));
    const row = el("div", "ms-grid ms-grid-row");
    for (const slot of startWith) row.append(slotCell(script, slot, open));
    first.append(row);
    scroller.append(first);
  }

  const grid = el("div", "ms-grid");
  for (const slot of GLYPH_SLOTS) grid.append(slotCell(script, slot, open));
  scroller.append(grid);
  root.append(scroller);
};

function slotCell(script: MyScript, slot: GlyphSlot, open: (slot: GlyphSlot) => void): HTMLButtonElement {
  const glyph = script.glyphs[slot];
  const cell = el("button", glyph ? "ms-slot" : "ms-slot missing");
  cell.type = "button";
  const box = el("span", "ms-slot-box");
  if (glyph) box.append(glyphImage(glyph.strokes, script, CELL));
  cell.append(box, el("span", "ms-slot-label", slotLabel(slot)));
  cell.addEventListener("click", () => open(slot));
  return cell;
}
