import "./numberExplorer.css";
import { DIGIT_SLOTS, slotLabel, type MyScript } from "../core/myScript";
import type { NumberColumn, NumberExplorerView } from "../core/numberExplorer";
import { glyphImage } from "../render/glyphRenderer";
import { playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";

/** The biggest a digit gets on screen, in CSS pixels. */
const MAX_DIGIT = 180;

/**
 * The Number Explorer: a picker of his My Scripts, the number in his own
 * digits (Missing Glyphs as dotted boxes he can tap to draw), and big
 * − / + buttons. Changed digits roll like an odometer. Everything sits in
 * fixed rows so nothing moves while he counts.
 */
export const numberExplorerScreen: RenderScreen<{ name: "numberExplorer" }> = (root, _screen, { core, go }) => {
  root.append(el("h1", "screen-title", SECTION_NAMES.numberExplorer));

  const picker = el("div", "ne-picker");
  const digits = el("div", "ne-digits");
  const controls = el("div", "ne-controls");
  const minus = bigButton("−", "Count down");
  const plus = bigButton("+", "Count up");
  controls.append(minus, plus);
  root.append(picker, digits, controls);

  minus.addEventListener("click", () => {
    if (core.countDown()) playTap();
    draw();
  });
  plus.addEventListener("click", () => {
    if (core.countUp()) playTap();
    draw();
  });

  function draw(): void {
    const view = core.numberExplorer();
    drawPicker(view);
    drawDigits(view);
    minus.disabled = !view.canCountDown;
    plus.disabled = !view.canCountUp;
  }

  function drawPicker(view: NumberExplorerView): void {
    picker.replaceChildren();
    if (view.scripts.length === 0) {
      const make = el("button", "ne-chip ne-make", "+ Make a My Script to count in its digits");
      make.type = "button";
      make.addEventListener("click", () => {
        playTap();
        go({ name: "newMyScript" });
      });
      picker.append(make);
      return;
    }
    for (const script of view.scripts) {
      const chip = el("button", script.id === view.script?.id ? "ne-chip chosen" : "ne-chip");
      chip.type = "button";
      const swatch = el("span", "ne-swatch");
      swatch.style.background = script.ink;
      chip.append(swatch, el("span", "ne-chip-name", script.name));
      chip.addEventListener("click", () => {
        playTap();
        core.chooseNumberScript(script.id);
        draw();
      });
      picker.append(chip);
    }
    picker.querySelector(".chosen")?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function drawDigits(view: NumberExplorerView): void {
    const n = view.columns.length;
    const size = Math.max(40, Math.min(MAX_DIGIT, Math.floor((digits.clientWidth - 16 * (n + 1)) / n)));
    digits.replaceChildren(...view.columns.map((column) => digitCell(view, column, size)));
  }

  function digitCell(view: NumberExplorerView, column: NumberColumn, size: number): HTMLElement {
    const { script } = view;
    const missing = !column.glyph;
    const cell = el("button", `ne-digit${missing ? " missing" : ""}${column.leading ? " leading" : ""}`);
    cell.type = "button";
    cell.disabled = !missing || !script;
    const frame = el("span", "ne-window");
    frame.style.width = frame.style.height = `${size}px`;
    const face = digitFace(script, column, size);
    frame.append(face);
    if (column.changed && view.lastStep) {
      // The odometer: the old digit slides away as the new one slides in.
      const previous = previousValue(view, column);
      const old = digitFace(script, { ...column, glyph: script?.glyphs[DIGIT_SLOTS[previous]] }, size);
      old.classList.add(`ne-out-${view.lastStep}`);
      face.classList.add(`ne-in-${view.lastStep}`);
      frame.append(old);
    }
    cell.append(frame, el("span", "ne-label", slotLabel(column.slot)));
    if (script && missing) {
      cell.addEventListener("click", () => {
        playTap();
        go({ name: "glyphCanvas", scriptId: script.id, slot: column.slot, returnTo: { name: "numberExplorer" } });
      });
    }
    return cell;
  }

  const observer = new ResizeObserver(() => drawDigits(stillView()));
  observer.observe(digits);
  draw();

  // A redraw on resize mustn't replay the roll.
  function stillView(): NumberExplorerView {
    const view = core.numberExplorer();
    return { ...view, lastStep: undefined };
  }

  return () => observer.disconnect();
};

/** What a changed column showed before the last step. */
function previousValue(view: NumberExplorerView, column: NumberColumn): number {
  const top = view.digitCount - 1;
  if (view.lastStep === "up") return column.rolledOver ? top : column.value - 1;
  return column.rolledOver ? 0 : column.value + 1;
}

function digitFace(script: MyScript | undefined, column: Pick<NumberColumn, "glyph">, size: number): HTMLElement {
  const face = el("span", column.glyph ? "ne-face" : "ne-face empty");
  if (column.glyph && script) face.append(glyphImage(column.glyph.strokes, script, size));
  return face;
}

function bigButton(text: string, label: string): HTMLButtonElement {
  const b = el("button", "ne-big", text);
  b.type = "button";
  b.setAttribute("aria-label", label);
  return b;
}
