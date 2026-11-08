import type { Stroke } from "../core/myScript";

/** How a Glyph's strokes look: the My Script's ink and stroke width (a fraction of the square). */
export interface GlyphInk {
  readonly ink: string;
  readonly strokeWidth: number;
}

/** A square on the canvas, in canvas pixels. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

/** Where the faint guides sit on the Glyph square (fractions from the top). */
export const GUIDES = { xHeight: 0.45, baseline: 0.75 } as const;

/**
 * Draws normalized strokes into `box` at any size. Smoothed with a
 * quadratic curve through the midpoints (the Doodle Monsters way);
 * a single point is a dot.
 */
export function paintStrokes(ctx: CanvasRenderingContext2D, strokes: readonly Stroke[], look: GlyphInk, box: Box): void {
  const width = look.strokeWidth * box.size;
  const at = (p: { x: number; y: number }) => ({ x: box.x + p.x * box.size, y: box.y + p.y * box.size });
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = look.ink;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    const pts = stroke.map(at);
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, width / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const mid = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 };
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mid.x, mid.y);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Faint x-height (dashed) and baseline guides across `box`. */
export function paintGuides(ctx: CanvasRenderingContext2D, box: Box, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, box.size / 300);
  for (const [y, dash] of [
    [GUIDES.xHeight, [box.size / 60, box.size / 60]],
    [GUIDES.baseline, []],
  ] as const) {
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(box.x, box.y + y * box.size);
    ctx.lineTo(box.x + box.size, box.y + y * box.size);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Makes `canvas` sharp at its current on-screen size (device pixels) and
 * returns a context scaled to CSS pixels, plus that size.
 */
export function fitCanvas(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; size: number } {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(1, Math.min(rect.width, rect.height));
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, size };
}

/** A canvas of `cssSize` pixels showing one Glyph, for grids and lists. */
export function glyphImage(strokes: readonly Stroke[], look: GlyphInk, cssSize: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.height = Math.round(cssSize * dpr);
  canvas.style.width = canvas.style.height = `${cssSize}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  paintStrokes(ctx, strokes, look, { x: 0, y: 0, size: cssSize });
  return canvas;
}
