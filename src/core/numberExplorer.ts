import type { Clock } from "./deps";
import { DIGIT_SLOTS, type Glyph, type GlyphSlot, type MyScript } from "./myScript";

/** The fewest digits a number system can have. */
export const DIGIT_COUNT_MIN = 2;
/** The most digits a number system can have (0–9 plus ten to fifteen). */
export const DIGIT_COUNT_MAX = 16;
/** The Number Explorer always opens on the familiar ten digits. */
export const DIGIT_COUNT_START = 10;
/** The biggest number he can count to (MVP cap, so Stacks stay drawable). */
export const NUMBER_MAX = 999;

/** One column of the number, as the Number Explorer shows it. */
export interface NumberColumn {
  /** 0 for the rightmost column (loose blocks), 1 for Stacks, 2 for Stacks of Stacks… */
  readonly place: number;
  /** The digit in this column, 0 to Digit Count − 1. */
  readonly value: number;
  /** The Glyph slot for that digit ("0"–"9", "ten"–"fifteen"). */
  readonly slot: GlyphSlot;
  /** His Glyph for that digit, or undefined for a Missing Glyph. */
  readonly glyph: Glyph | undefined;
  /**
   * A zero to the left of the number's first real digit (odometer padding,
   * e.g. the first two columns of 007). The number 0 still has its last
   * column not leading.
   */
  readonly leading: boolean;
  /** How many items to draw for this column: `value` of them. */
  readonly itemCount: number;
  /**
   * How many blocks one item in this column is: Digit Count ^ place.
   * 1 = a loose block, Digit Count = a Stack, Digit Count² = a Stack of Stacks.
   */
  readonly blocksPerItem: number;
  /** The digit changed on the last + or − (it should roll). */
  readonly changed: boolean;
  /** The digit wrapped round on the last step: past the top digit to 0 (on +) or from 0 to the top digit (on −). */
  readonly rolledOver: boolean;
}

/** Everything the Number Explorer screen shows. */
export interface NumberExplorerView {
  /** The My Script whose digits it counts in, or undefined if he has none yet. */
  readonly script: MyScript | undefined;
  /** Every My Script, for the picker (oldest first, like `myScripts()`). */
  readonly scripts: readonly MyScript[];
  /** How many digits the number system uses, 2–16. */
  readonly digitCount: number;
  /** The number, 0 to NUMBER_MAX. */
  readonly number: number;
  /**
   * The number's columns, left (most items per block) to right (loose blocks).
   * Always as many columns as NUMBER_MAX needs at this Digit Count, so the
   * layout doesn't shift while counting.
   */
  readonly columns: readonly NumberColumn[];
  /** Which way the last step went, or undefined if nothing has rolled since opening (or since the Digit Count changed). */
  readonly lastStep: "up" | "down" | undefined;
  /** Whether + works (false at NUMBER_MAX: the button is simply disabled). */
  readonly canCountUp: boolean;
  /** Whether − works (false at 0: the button is simply disabled). */
  readonly canCountDown: boolean;
}

/** The Number Explorer part of the Studio core's interface. */
export interface NumberExplorerCommands {
  /** What the Number Explorer shows now. */
  numberExplorer(): NumberExplorerView;
  /** + : counts up by one. False (and nothing changes) at NUMBER_MAX. */
  countUp(): boolean;
  /** − : counts down by one. False (and nothing changes) at 0. */
  countDown(): boolean;
  /**
   * Sets the Digit Count (a whole number from 2 to 16). The number stays the
   * same and is rewritten in the new digits. False (and nothing changes) for
   * anything else.
   */
  setDigitCount(count: number): boolean;
  /** Counts in another My Script's digits (the number stays). False for an unknown id. */
  chooseNumberScript(scriptId: string): boolean;
}

/**
 * The digits of `number` written with `digitCount` digits, padded to
 * `width` columns, most significant first.
 */
function digitsOf(number: number, digitCount: number, width: number): number[] {
  const digits: number[] = new Array(width).fill(0);
  for (let i = width - 1, n = number; i >= 0 && n > 0; i--, n = Math.floor(n / digitCount)) digits[i] = n % digitCount;
  return digits;
}

/** How many columns `number` needs when written with `digitCount` digits (at least 1). */
function widthOf(number: number, digitCount: number): number {
  let width = 1;
  for (let n = Math.floor(number / digitCount); n > 0; n = Math.floor(n / digitCount)) width++;
  return width;
}

interface NumberExplorerDeps {
  clock: Clock;
  /** Every My Script, oldest first (the My Script book's `myScripts`). */
  myScripts(): readonly MyScript[];
}

/**
 * The Number Explorer's rules. Not exported from the core: tests go through StudioCore.
 *
 * Which My Script it counts in: the one chosen when he came in, or (if that
 * one is gone, or there was none) his **most recently used** My Script.
 * "Most recently used" means the latest of the My Script's `updatedAt`
 * (made, drew a Glyph, renamed) and the moment he last picked it in the
 * Number Explorer's picker. Picks are remembered only until the app closes;
 * after a reload it's simply the latest `updatedAt`. Ties go to the newer
 * My Script.
 *
 * `start()` is a fresh start (Digit Count 10, number 0, re-choose the
 * My Script). The core calls it when he comes in from home, so coming back
 * from the Glyph canvas (after tapping a Missing digit) keeps his place.
 */
export function createNumberExplorer({ clock, myScripts }: NumberExplorerDeps) {
  let digitCount = DIGIT_COUNT_START;
  let number = 0;
  let chosenId: string | undefined;
  /** When he last picked each My Script in the picker (this visit only). */
  const pickedAt = new Map<string, number>();

  function mostRecentlyUsed(scripts: readonly MyScript[]): MyScript | undefined {
    let best: MyScript | undefined;
    let bestTime = -Infinity;
    for (const script of scripts) {
      const used = Math.max(script.updatedAt, pickedAt.get(script.id) ?? -Infinity);
      if (used >= bestTime) [best, bestTime] = [script, used];
    }
    return best;
  }

  function currentScript(scripts: readonly MyScript[]): MyScript | undefined {
    return scripts.find((s) => s.id === chosenId) ?? mostRecentlyUsed(scripts);
  }
  /** The last + or −, so the view can say which digits roll. */
  let lastStep: { direction: "up" | "down"; from: number } | undefined;

  function step(direction: "up" | "down"): boolean {
    const to = direction === "up" ? number + 1 : number - 1;
    if (to < 0 || to > NUMBER_MAX) return false;
    lastStep = { direction, from: number };
    number = to;
    return true;
  }

  function view(): NumberExplorerView {
    const scripts = myScripts();
    const script = currentScript(scripts);
    const width = widthOf(NUMBER_MAX, digitCount);
    const used = widthOf(number, digitCount);
    const digits = digitsOf(number, digitCount, width);
    const before = lastStep ? digitsOf(lastStep.from, digitCount, width) : digits;
    const top = digitCount - 1;
    const columns = digits.map((value, i): NumberColumn => {
      const place = width - 1 - i;
      const slot = DIGIT_SLOTS[value];
      const old = before[i];
      const rolledOver =
        lastStep?.direction === "up" ? old === top && value === 0 : lastStep?.direction === "down" && old === 0 && value === top;
      return {
        place,
        value,
        slot,
        glyph: script?.glyphs[slot],
        leading: place >= used,
        itemCount: value,
        blocksPerItem: digitCount ** place,
        changed: old !== value,
        rolledOver,
      };
    });
    return {
      script,
      scripts,
      digitCount,
      number,
      columns,
      lastStep: lastStep?.direction,
      canCountUp: number < NUMBER_MAX,
      canCountDown: number > 0,
    };
  }

  const commands: NumberExplorerCommands = {
    numberExplorer: view,
    countUp: () => step("up"),
    countDown: () => step("down"),
    setDigitCount(count) {
      if (!Number.isInteger(count) || count < DIGIT_COUNT_MIN || count > DIGIT_COUNT_MAX) return false;
      digitCount = count;
      lastStep = undefined;
      return true;
    },
    chooseNumberScript(scriptId) {
      if (!myScripts().some((s) => s.id === scriptId)) return false;
      chosenId = scriptId;
      pickedAt.set(scriptId, clock.now());
      return true;
    },
  };

  return {
    commands,
    /** A fresh start: Digit Count 10, zero, and his most recently used My Script. */
    start(): void {
      digitCount = DIGIT_COUNT_START;
      number = 0;
      lastStep = undefined;
      chosenId = mostRecentlyUsed(myScripts())?.id;
    },
  };
}
