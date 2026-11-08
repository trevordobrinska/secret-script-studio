import "./myScripts.css";
import { slotLabel, type Point } from "../core/myScript";
import type { Screen } from "../core/studioCore";
import { fitCanvas, paintGuides, paintStrokes } from "../render/glyphRenderer";
import { playSave, playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";

/**
 * The Glyph canvas: a big square to draw one slot with a finger, with
 * faint guides, Undo, Clear and Save. Stroke capture follows Doodle
 * Monsters: one finger at a time, every coalesced sample, and the whole
 * drawing repainted (rAF-throttled). Points are kept normalized (0–1).
 */
export const glyphCanvasScreen: RenderScreen<Extract<Screen, { name: "glyphCanvas" }>> = (
  root,
  screen,
  { core, go },
) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  const { startWith, returnTo } = screen;
  const backToGrid = () => go(returnTo ?? { name: "glyphGrid", scriptId: script.id, startWith });

  // Redrawing starts from the Glyph he has, so he can undo or add to it.
  const strokes: Point[][] = (script.glyphs[screen.slot]?.strokes ?? []).map((s) => [...s]);

  const title = el("h1", "screen-title ms-drawing-title");
  title.append("Draw ", el("span", "ms-drawing-slot", slotLabel(screen.slot)));
  root.append(title);

  const stage = el("div", "ms-stage");
  const canvas = el("canvas", "ms-canvas");
  const tools = el("div", "ms-tools");
  const undo = toolButton("Undo", "ms-undo");
  const clear = toolButton("Clear", "ms-clear");
  const saveNext = toolButton("Save + next", "ms-save ms-save-next");
  const save = toolButton("Save", "ms-save");
  const back = toolButton("Back", "ms-back");
  tools.append(undo, clear, saveNext, save, back);
  stage.append(canvas, tools);
  root.append(stage);

  let ctx: CanvasRenderingContext2D | undefined;
  let size = 1;
  let frame = 0;
  const guideColor = getComputedStyle(document.documentElement).getPropertyValue("--line").trim() || "#d9cfb8";

  function paint(): void {
    frame = 0;
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    paintGuides(ctx, { x: 0, y: 0, size }, guideColor);
    paintStrokes(ctx, strokes, script!, { x: 0, y: 0, size });
  }
  function requestPaint(): void {
    frame ||= requestAnimationFrame(paint);
  }
  function refreshTools(): void {
    undo.disabled = clear.disabled = save.disabled = saveNext.disabled = strokes.length === 0;
    clear.classList.remove("confirming");
    clear.textContent = "Clear";
  }
  function resize(): void {
    ({ ctx, size } = fitCanvas(canvas));
    paint();
  }

  const toPoint = (e: PointerEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return { x: clamp01((e.clientX - rect.left) / rect.width), y: clamp01((e.clientY - rect.top) / rect.height) };
  };
  let current: { points: Point[]; pointerId: number } | undefined;
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (current) return; // a palm or second finger is ignored
    canvas.setPointerCapture(e.pointerId);
    current = { points: [toPoint(e)], pointerId: e.pointerId };
    strokes.push(current.points);
    refreshTools();
    requestPaint();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (current?.pointerId !== e.pointerId) return;
    const moves = e.getCoalescedEvents?.() ?? [];
    for (const m of moves.length > 0 ? moves : [e]) current.points.push(toPoint(m));
    requestPaint();
  });
  const endStroke = (e: PointerEvent) => {
    if (current?.pointerId !== e.pointerId) return;
    current = undefined;
    requestPaint();
  };
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);

  undo.addEventListener("click", () => {
    strokes.pop();
    refreshTools();
    requestPaint();
  });
  // Clear needs a second tap, so a whole Glyph isn't lost by accident.
  clear.addEventListener("click", () => {
    if (!clear.classList.contains("confirming")) {
      clear.classList.add("confirming");
      clear.textContent = "Clear all?";
      return;
    }
    strokes.length = 0;
    refreshTools();
    requestPaint();
  });
  const saveGlyph = (): boolean => {
    if (core.saveGlyph(script.id, screen.slot, strokes) !== "saved") return false;
    playSave();
    return true;
  };
  save.addEventListener("click", () => {
    if (saveGlyph()) backToGrid();
  });
  // "Next empty one": his name's letters first, then grid order; the grid once all are drawn.
  saveNext.addEventListener("click", () => {
    if (!saveGlyph()) return;
    const next = core.nextMissingSlot(script.id, screen.slot, startWith);
    if (next) go({ name: "glyphCanvas", scriptId: script.id, slot: next, startWith, returnTo });
    else backToGrid();
  });
  back.addEventListener("click", () => {
    playTap();
    backToGrid();
  });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  refreshTools();

  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
};

function toolButton(text: string, className: string): HTMLButtonElement {
  const b = el("button", `ms-button ms-tool ${className}`, text);
  b.type = "button";
  return b;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
