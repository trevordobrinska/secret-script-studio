import "./digitCount.css";
import { DIGIT_SLOTS, slotLabel } from "../core/myScript";
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
 * "How many digits?": a row of his digit Glyphs (Missing ones as dotted boxes
 * he can tap to draw), Fewer / More buttons (2 to 16), a small "base N"
 * caption, the one-time "Try fewer digits!" hint, and a "Type a number"
 * button that opens a 0–9 keypad. After any change it calls `redraw`, so
 * the whole screen shows the new digits.
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

  const changeBy = (delta: number) => {
    if (core.setDigitCount(core.numberExplorer().digitCount + delta)) playTap();
    redraw();
  };
  fewer.addEventListener("click", () => changeBy(-1));
  more.addEventListener("click", () => changeBy(+1));

  const keypad = typeANumberKeypad((typed) => {
    core.enterNumber(typed);
    redraw();
  });
  typeButton.addEventListener("click", () => {
    playTap();
    keypad.open();
  });

  function draw(view: NumberExplorerView): void {
    const { script, digitCount } = view;
    caption.textContent = `base ${digitCount}`;
    hint.hidden = !view.hint;
    fewer.disabled = digitCount <= DIGIT_COUNT_MIN;
    more.disabled = digitCount >= DIGIT_COUNT_MAX;
    tiles.replaceChildren(
      ...DIGIT_SLOTS.slice(0, digitCount).map((slot) => {
        const glyph = script?.glyphs[slot];
        if (glyph && script) {
          const tile = el("span", "dc-tile");
          tile.append(glyphImage(glyph.strokes, script, TILE));
          return tile;
        }
        // A Missing Glyph: a dotted box with the plain digit, tap to draw it.
        const tile = el("button", "dc-tile missing", slotLabel(slot));
        tile.type = "button";
        tile.disabled = !script;
        tile.setAttribute("aria-label", `Draw your ${slotLabel(slot)}`);
        if (script) {
          tile.addEventListener("click", () => {
            playTap();
            go({ name: "glyphCanvas", scriptId: script.id, slot, returnTo: { name: "numberExplorer" } });
          });
        }
        return tile;
      }),
    );
  }

  return { row, keypad: keypad.element, draw };
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
