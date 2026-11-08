import "./digitCount.css";
import { DIGIT_SLOTS, slotLabel, type GlyphSlot } from "../core/myScript";
import { DIGIT_COUNT_MAX, DIGIT_COUNT_MIN, NUMBER_MAX, type NumberExplorerView } from "../core/numberExplorer";
import { glyphImage } from "../render/glyphRenderer";
import { playKey, playTap } from "../sound/sound";
import { el, type ScreenContext } from "./screen";

/** The size the digit tiles are drawn at (CSS shrinks them to fit). */
const TILE = 48;
/** How many keys he can type: NUMBER_MAX has this many digits. */
const MAX_TYPED = String(NUMBER_MAX).length;

/** The Number Explorer's "How many digits?" row and its type-a-number keypad. */
export interface DigitCountControl {
  /** The "How many digits?" row; the screen puts it above the number. */
  readonly row: HTMLElement;
  /** The keypad (a dialog over the screen, hidden until he opens it); the screen appends it to its root. */
  readonly keypad: HTMLElement;
  /** Redraws the row from the core's view. */
  draw(view: NumberExplorerView): void;
}

/**
 * "How many digits?": the row of all 16 digit positions is the control.
 * His digits in use show as his Glyphs (Missing ones as dashed boxes with a
 * pencil, tap to draw), the rest as faint ghost tiles: tap a ghost to add
 * digits up to it, tap the last digit in use to take it away (2 to 16).
 * Fewer / More buttons do the same one step at a time. Also a small
 * "base N" caption, the one-time "Try fewer digits!" hint, and a "Type a
 * number" button that opens a 0–9 keypad. After any change it calls
 * `redraw`, so the whole screen shows the new digits.
 */
export function digitCountControl({ core, go }: ScreenContext, redraw: () => void): DigitCountControl {
  const row = el("div", "dc-row");
  const top = el("div", "dc-top");
  const label = el("span", "dc-label", "How many digits?");
  const caption = el("span", "dc-caption");
  const hint = el("span", "dc-hint", "Try fewer digits!");
  const typeButton = el("button", "dc-type", "Type a number");
  typeButton.type = "button";
  top.append(label, caption, hint, el("span", "dc-spacer"), typeButton);

  const line = el("div", "dc-line");
  const fewer = el("button", "dc-step", "− Fewer");
  const more = el("button", "dc-step", "More +");
  fewer.type = more.type = "button";
  fewer.setAttribute("aria-label", "Fewer digits");
  more.setAttribute("aria-label", "More digits");
  const tiles = el("div", "dc-tiles");
  line.append(fewer, tiles, more);
  row.append(top, line);

  fewer.addEventListener("click", () => setCount(core.numberExplorer().digitCount - 1));
  more.addEventListener("click", () => setCount(core.numberExplorer().digitCount + 1));

  const keypad = typeANumberKeypad((typed) => {
    core.enterNumber(typed);
    redraw();
  });
  typeButton.addEventListener("click", () => {
    playTap();
    keypad.open();
  });

  function draw(view: NumberExplorerView): void {
    const { digitCount } = view;
    caption.textContent = `base ${digitCount}`;
    hint.hidden = !view.hint;
    fewer.disabled = digitCount <= DIGIT_COUNT_MIN;
    more.disabled = digitCount >= DIGIT_COUNT_MAX;
    tiles.replaceChildren(...DIGIT_SLOTS.slice(0, DIGIT_COUNT_MAX).map((slot, value) => digitTile(view, slot, value)));
  }

  /**
   * One of the 16 digit positions. Active ones (below the Digit Count) are
   * his Glyphs, or dashed Missing tiles with a pencil badge; the rest are
   * faint ghost tiles. Tapping a ghost adds digits up to it; tapping the
   * last active tile (it has a "−" badge) takes it away, down to 2.
   * Missing digits are drawn by tapping them, or, on the last tile, its
   * pencil badge.
   */
  function digitTile({ script, digitCount }: NumberExplorerView, slot: GlyphSlot, value: number): HTMLElement {
    const label = slotLabel(slot);
    const glyph = script?.glyphs[slot];
    const active = value < digitCount;
    const removable = value === digitCount - 1 && digitCount > DIGIT_COUNT_MIN;
    const missing = active && !glyph;
    const draw = () => {
      if (!script) return;
      playTap();
      go({ name: "glyphCanvas", scriptId: script.id, slot, returnTo: { name: "numberExplorer" } });
    };

    const box = el("span", "dc-slot");
    const tile = el("button", `dc-tile${active ? "" : " ghost"}${missing ? " missing" : ""}`);
    tile.type = "button";
    if (glyph && script) tile.append(glyphImage(glyph.strokes, script, TILE));
    else tile.textContent = label;
    box.append(tile);

    if (!active) {
      tile.setAttribute("aria-label", `Use digits up to ${label}`);
      tile.addEventListener("click", () => setCount(value + 1));
    } else if (removable) {
      tile.setAttribute("aria-label", `Take away the ${label}`);
      tile.addEventListener("click", () => setCount(value));
      box.append(badge("dc-badge dc-remove", "−"));
    } else if (missing) {
      tile.setAttribute("aria-label", `Draw your ${label}`);
      tile.disabled = !script;
      tile.addEventListener("click", draw);
    } else {
      // A drawn digit in the middle: nothing to do, so it isn't a button.
      tile.disabled = true;
      tile.classList.add("still");
      tile.setAttribute("aria-label", `Your ${label}`);
    }

    if (missing && script) {
      // The pencil says "draw me". On the last tile (where a tap takes it away) it's its own button.
      const pencil = removable ? el("button", "dc-badge dc-draw") : badge("dc-badge dc-draw", "");
      pencil.innerHTML = PENCIL;
      if (pencil instanceof HTMLButtonElement) {
        pencil.type = "button";
        pencil.setAttribute("aria-label", `Draw your ${label}`);
        pencil.addEventListener("click", draw);
      }
      box.append(pencil);
    }
    return box;
  }

  function setCount(count: number): void {
    if (core.setDigitCount(count)) playTap();
    redraw();
  }

  return { row, keypad: keypad.element, draw };
}

/** A small pencil, drawn as SVG so it looks the same on every tablet. */
const PENCIL =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" ' +
  'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>';

/** A decorative corner badge on a digit tile. */
function badge(className: string, text: string): HTMLElement {
  const b = el("span", className, text);
  b.setAttribute("aria-hidden", "true");
  return b;
}

/** The 0–9 keypad dialog. `onEnter` gets the regular number he typed. */
function typeANumberKeypad(onEnter: (typed: number) => void) {
  const element = el("div", "dc-keypad-backdrop");
  element.hidden = true;
  const panel = el("div", "dc-keypad");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Type a number");
  const display = el("div", "dc-display");
  const keys = el("div", "dc-keys");
  const ok = el("button", "dc-key dc-ok", "Show it");
  ok.type = "button";
  const back = el("button", "dc-key dc-back", "⌫");
  back.type = "button";
  back.setAttribute("aria-label", "Rub out");
  const cancel = el("button", "dc-cancel", "Cancel");
  cancel.type = "button";

  let typed = "";
  const show = () => {
    display.textContent = typed || " ";
    ok.disabled = typed === "";
    back.disabled = typed === "";
  };

  for (const digit of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) keys.append(digitKey(digit));
  keys.append(back, digitKey("0"), ok);
  panel.append(display, keys, cancel);
  element.append(panel);

  function digitKey(digit: string): HTMLButtonElement {
    const key = el("button", "dc-key", digit);
    key.type = "button";
    key.addEventListener("click", () => {
      playKey();
      if (typed === "0") typed = "";
      if (typed.length < MAX_TYPED) typed += digit;
      show();
    });
    return key;
  }

  back.addEventListener("click", () => {
    playKey();
    typed = typed.slice(0, -1);
    show();
  });
  ok.addEventListener("click", () => {
    if (typed === "") return;
    playTap();
    const number = Number(typed);
    close();
    onEnter(number);
  });
  cancel.addEventListener("click", () => {
    playTap();
    close();
  });
  // Tapping outside the keypad closes it too.
  element.addEventListener("click", (event) => {
    if (event.target === element) close();
  });

  function close(): void {
    element.hidden = true;
  }

  return {
    element,
    open(): void {
      typed = "";
      show();
      element.hidden = false;
    },
  };
}
