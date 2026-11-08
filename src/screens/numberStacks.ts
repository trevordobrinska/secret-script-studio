import "./numberStacks.css";
import { NUMBER_MAX, type NumberColumn, type NumberExplorerView } from "../core/numberExplorer";
import { el } from "./screen";

/**
 * One color per column of the number (place 0 = loose blocks on the right).
 * The digit above and its pile below share it, so he can match them up.
 * Ten places are enough: 999 needs at most 10 columns (at Digit Count 2).
 */
export const PLACE_COLORS = [
  "#e07a5f", // coral: loose blocks
  "#3d8bd9", // blue: Stacks
  "#e9a92b", // amber: Stacks of Stacks
  "#4fa463", // green
  "#9468cf", // purple
  "#22a7a5", // teal
  "#de5f9f", // pink
  "#8a6d4b", // brown
  "#6f7fa3", // slate
  "#c24a4a", // red
] as const;

export function placeColor(place: number): string {
  return PLACE_COLORS[place % PLACE_COLORS.length];
}

/** Space between items in a pile, in CSS pixels. */
const ITEM_GAP = 6;
/** A loose block never gets bigger than this, even when there's room. */
const MAX_BLOCK = 72;
/** Below this many CSS pixels a part isn't drawn block by block any more. */
const MIN_PART = 3;
/** How long a snap takes (keep in step with numberStacks.css). */
const SNAP_MS = 320;

export interface StacksRow {
  /** The row of piles; the screen puts it under the digits. */
  readonly element: HTMLElement;
  /**
   * Draws one pile per column, `columnWidth` wide, lined up under the digits
   * (same gap, centered). Snaps if the view has a last step.
   */
  draw(view: NumberExplorerView, columnWidth: number): void;
}

/**
 * The Stacks under the number: each column's digit as that many items.
 * An item in the rightmost column is one block; one column left it's a Stack
 * (Digit Count blocks snapped together); then a Stack of Stacks, and so on.
 * Each item is drawn as the smaller items it is made of, in their colors,
 * so a Stack visibly *is* a bundle of the blocks to its right.
 */
export function stacksRow(): StacksRow {
  const element = el("div", "ne-stacks");
  return {
    element,
    draw(view, columnWidth) {
      const height = element.clientHeight;
      // Lay out from the loose blocks leftwards: a block inside a Stack is never
      // drawn bigger than a loose block, so bigger items always look bigger.
      const layouts = new Map<number, PileLayout>();
      let cap = MAX_BLOCK;
      for (const column of [...view.columns].sort((a, b) => a.place - b.place)) {
        const layout = pileLayout(view.digitCount, column.place, columnWidth, height, cap);
        layouts.set(column.place, layout);
        cap = Math.max(layout.scale, 0.5);
      }
      element.replaceChildren(...view.columns.map((column) => pile(view, column, columnWidth, height, layouts.get(column.place)!.slots)));
    },
  };
}

function pile(view: NumberExplorerView, column: NumberColumn, width: number, height: number, slots: readonly Slot[]): HTMLElement {
  const box = el("div", "ne-pile");
  box.style.width = `${width}px`;
  box.style.setProperty("--place", placeColor(column.place));
  if (width < 8 || height < 8) return box;

  const base = view.digitCount;
  const old = previousItems(view, column);

  for (let i = 0; i < column.itemCount; i++) {
    const item = itemCanvas(base, column.place, slots[i]);
    if (view.lastStep && column.changed) {
      if (column.rolledOver) {
        // On − a bigger item split into these: they spring out from the left.
        item.classList.add("ne-st-split-in");
        item.style.animationDelay = `${i * 20}ms`;
      } else if (view.lastStep === "up" && i === column.itemCount - 1) {
        // On + the smaller items snapped into this one: it arrives from the right
        // (or simply pops in when nothing rolled over).
        item.classList.add(rolledRight(view, column) ? "ne-st-combine-in" : "ne-st-pop-in");
      }
    }
    box.append(item);
  }

  if (view.lastStep && column.changed) {
    if (column.rolledOver && view.lastStep === "up") {
      // The full pile snaps together and slides off to the left.
      for (let i = 0; i < old; i++) box.append(ghost(base, column.place, slots[i], "ne-st-combine-out"));
    } else if (!column.rolledOver && view.lastStep === "down") {
      // One item breaks apart into the next column (or just goes, for a block).
      const into = column.place > 0 ? "ne-st-split-out" : "ne-st-pop-out";
      box.append(ghost(base, column.place, slots[column.itemCount], into));
    }
  }
  return box;
}

/** Whether the column to the right rolled over on this step (so its blocks combined into our new item). */
function rolledRight(view: NumberExplorerView, column: NumberColumn): boolean {
  return view.columns.some((c) => c.place === column.place - 1 && c.rolledOver);
}

/** How many items the column had before the last step. */
function previousItems(view: NumberExplorerView, column: NumberColumn): number {
  if (!view.lastStep || !column.changed) return column.itemCount;
  if (view.lastStep === "up") return column.rolledOver ? view.digitCount - 1 : column.value - 1;
  return column.rolledOver ? 0 : column.value + 1;
}

function ghost(base: number, place: number, slot: Slot | undefined, animation: string): HTMLElement {
  const g = itemCanvas(base, place, slot);
  g.classList.add("ne-st-ghost", animation);
  g.addEventListener("animationend", () => g.remove());
  setTimeout(() => g.remove(), SNAP_MS + 200);
  return g;
}

interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The size, in blocks, of one item at `place`: a block is 1×1, a Stack stands
 * up (1 wide, Digit Count tall), a Stack of Stacks lies them side by side
 * (a square), the next stands those up, and so on.
 */
function itemShape(base: number, place: number): { w: number; h: number } {
  return { w: base ** Math.floor(place / 2), h: base ** Math.ceil(place / 2) };
}

interface PileLayout {
  slots: Slot[];
  /** CSS pixels per block. */
  scale: number;
}

/**
 * Where each item of a pile goes, with at most `maxScale` pixels per block.
 * The grid is laid out for the most items the column can ever hold below
 * NUMBER_MAX (Digit Count − 1, or fewer in the leftmost columns), so items
 * never move or resize while he counts; they fill it from the top, left to right.
 */
function pileLayout(base: number, place: number, width: number, height: number, maxScale: number): PileLayout {
  const capacity = Math.max(1, Math.min(base - 1, Math.floor(NUMBER_MAX / base ** place)));
  const shape = itemShape(base, place);
  let best = { scale: 0, across: 1, rows: 1 };
  for (let across = 1; across <= capacity; across++) {
    const rows = Math.ceil(capacity / across);
    const scale = Math.min(
      (width - (across - 1) * ITEM_GAP) / (across * shape.w),
      (height - (rows - 1) * ITEM_GAP) / (rows * shape.h),
    );
    if (scale > best.scale) best = { scale, across, rows };
  }
  const scale = Math.min(best.scale, maxScale);
  const w = Math.max(1, Math.floor(shape.w * scale));
  const h = Math.max(1, Math.floor(shape.h * scale));
  const gridWidth = best.across * w + (best.across - 1) * ITEM_GAP;
  const left = (width - gridWidth) / 2;
  const slots: Slot[] = [];
  for (let i = 0; i < capacity; i++) {
    const row = Math.floor(i / best.across);
    const col = i % best.across;
    slots.push({ x: left + col * (w + ITEM_GAP), y: row * (h + ITEM_GAP), w, h });
  }
  return { slots, scale };
}

function itemCanvas(base: number, place: number, slot: Slot | undefined): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = "ne-item";
  if (!slot) return canvas;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(slot.w * dpr);
  canvas.height = Math.round(slot.h * dpr);
  Object.assign(canvas.style, { left: `${slot.x}px`, top: `${slot.y}px`, width: `${slot.w}px`, height: `${slot.h}px` });
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  paintItem(ctx, base, place, 0, 0, slot.w, slot.h);
  return canvas;
}

/**
 * Paints one item at `place` into the rectangle: a block, or a band in its
 * column's color holding Digit Count smaller items (standing in a column on
 * odd places, side by side on even ones). Parts too small to see are filled
 * with the smaller items' color instead of being drawn one by one.
 */
function paintItem(ctx: CanvasRenderingContext2D, base: number, place: number, x: number, y: number, w: number, h: number): void {
  const color = placeColor(place);
  if (place === 0) {
    const inset = Math.min(w, h) > 8 ? 1 : 0.25;
    roundRect(ctx, x + inset, y + inset, w - 2 * inset, h - 2 * inset, Math.min(w, h) * 0.18, color);
    if (Math.min(w, h) >= 14) {
      // A little shine so a block reads as a block.
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.25, h * 0.12);
    }
    return;
  }
  const pad = Math.max(1, Math.min(4, Math.min(w, h) * 0.08));
  roundRect(ctx, x, y, w, h, Math.min(w, h) * 0.12, color);
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - 2 * pad;
  const ih = h - 2 * pad;
  const upright = place % 2 === 1;
  const gap = pad / 2;
  const partW = upright ? iw : (iw - (base - 1) * gap) / base;
  const partH = upright ? (ih - (base - 1) * gap) / base : ih;
  if (Math.min(partW, partH) < MIN_PART) {
    // Too small to draw block by block: the smaller items' color, with lines where they meet if those still show.
    ctx.fillStyle = placeColor(place - 1);
    ctx.fillRect(ix, iy, iw, ih);
    const step = upright ? ih / base : iw / base;
    if (step >= 1.2) {
      ctx.fillStyle = color;
      for (let i = 1; i < base; i++) {
        const line = step >= 2 ? 1 : 0.5;
        if (upright) ctx.fillRect(ix, iy + i * step - line / 2, iw, line);
        else ctx.fillRect(ix + i * step - line / 2, iy, line, ih);
      }
    }
    return;
  }
  for (let i = 0; i < base; i++) {
    const px = upright ? ix : ix + i * (partW + gap);
    const py = upright ? iy + i * (partH + gap) : iy;
    paintItem(ctx, base, place - 1, px, py, partW, partH);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, r));
  ctx.fillStyle = fill;
  ctx.fill();
}
