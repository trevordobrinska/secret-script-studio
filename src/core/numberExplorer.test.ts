import { describe, expect, it } from "vitest";
import { inMemoryStudioStorage } from "./studioStorage";
import { A_DOWN_STROKE, countTo, fakeClock, loadedStudio, studioWithMyScript } from "./testing";
import type { StudioCore } from "./studioCore";

describe("opening the Number Explorer", () => {
  it("starts at zero with a Digit Count of 10", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    const view = studio.numberExplorer();
    expect(view.digitCount).toBe(10);
    expect(view.number).toBe(0);
    expect(view.columns.map((c) => c.value)).toEqual([0, 0, 0]);
  });

  it("opens at Digit Count 10 and zero every time he comes in from home", async () => {
    const studio = await explorerAt(37);
    studio.setDigitCount(4);
    studio.goHome();
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().digitCount).toBe(10);
    expect(studio.numberExplorer().number).toBe(0);
    expect(studio.numberExplorer().lastStep).toBeUndefined();
  });

  it("coming back from drawing a Missing digit keeps the Digit Count and the number", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    studio.setDigitCount(12);
    countTo(studio, 11);
    const missing = studio.numberExplorer().columns.at(-1)!;
    expect(missing).toMatchObject({ slot: "eleven", glyph: undefined });

    studio.open({ name: "glyphCanvas", scriptId: script.id, slot: missing.slot });
    studio.saveGlyph(script.id, "eleven", [A_DOWN_STROKE]);
    studio.open({ name: "numberExplorer" });

    const view = studio.numberExplorer();
    expect(view.digitCount).toBe(12);
    expect(view.number).toBe(11);
    expect(view.columns.at(-1)?.glyph?.strokes).toEqual([A_DOWN_STROKE]);
  });
});

describe("counting in the digits of his My Script", () => {
  it("drawn digits show his Glyphs and undrawn digits are Missing Glyphs", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["0", "1"] });
    studio.open({ name: "numberExplorer" });
    countTo(studio, 12);
    const view = studio.numberExplorer();
    expect(view.script?.id).toBe(script.id);
    expect(view.columns.map((c) => c.slot)).toEqual(["0", "1", "2"]);
    expect(view.columns.map((c) => c.glyph?.strokes)).toEqual([[A_DOWN_STROKE], [A_DOWN_STROKE], undefined]);
  });

  it("uses his most recently used My Script: the one he last made, drew in or renamed", async () => {
    const clock = fakeClock();
    const { studio, script: first } = await studioWithMyScript({ clock });
    clock.advance(60_000);
    const second = makeMyScript(studio, "Moon Marks");
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().script?.id).toBe(second.id);

    clock.advance(60_000);
    studio.saveGlyph(first.id, "7", [A_DOWN_STROKE]);
    studio.goHome();
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().script?.id).toBe(first.id);
  });

  it("he can switch to another My Script, and it stays his choice next time", async () => {
    const clock = fakeClock();
    const { studio, script: first } = await studioWithMyScript({ clock, drawn: ["5"] });
    clock.advance(60_000);
    makeMyScript(studio, "Moon Marks");
    studio.open({ name: "numberExplorer" });
    countTo(studio, 5);

    clock.advance(60_000);
    expect(studio.chooseNumberScript(first.id)).toBe(true);
    expect(studio.numberExplorer().script?.id).toBe(first.id);
    expect(studio.numberExplorer().number).toBe(5);
    expect(studio.numberExplorer().columns.at(-1)?.glyph).toBeDefined();

    studio.goHome();
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().script?.id).toBe(first.id);
  });

  it("the picker lists every My Script and ignores one that isn't there", async () => {
    const { studio, script } = await studioWithMyScript();
    const second = makeMyScript(studio, "Moon Marks");
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().scripts.map((s) => s.id)).toEqual([script.id, second.id]);
    expect(studio.chooseNumberScript("nope")).toBe(false);
    expect(studio.numberExplorer().script?.id).toBe(second.id);
  });

  it("after reopening the app, it uses the My Script he last drew in", async () => {
    const storage = inMemoryStudioStorage();
    const clock = fakeClock();
    const { studio, script: first } = await studioWithMyScript({ storage, clock });
    clock.advance(60_000);
    makeMyScript(studio, "Moon Marks");
    clock.advance(60_000);
    studio.saveGlyph(first.id, "3", [A_DOWN_STROKE]);
    await studio.saved();

    const reopened = await loadedStudio({ storage, clock });
    reopened.open({ name: "numberExplorer" });
    expect(reopened.numberExplorer().script?.id).toBe(first.id);
  });

  it("with no My Scripts yet, it still counts, every digit a Missing Glyph", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    studio.countUp();
    const view = studio.numberExplorer();
    expect(view.script).toBeUndefined();
    expect(view.scripts).toEqual([]);
    expect(view.number).toBe(1);
    expect(view.columns.every((c) => c.glyph === undefined)).toBe(true);
  });

  it("a My Script made after opening is picked up", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    const made = makeMyScript(studio, "Late Script");
    expect(studio.numberExplorer().script?.id).toBe(made.id);
  });
});

describe("counting with + and −", () => {
  it("+ counts up and − counts down", async () => {
    const studio = await explorerAt(0);
    expect(studio.countUp()).toBe(true);
    expect(studio.countUp()).toBe(true);
    expect(studio.numberExplorer().number).toBe(2);
    expect(studio.countDown()).toBe(true);
    expect(studio.numberExplorer().number).toBe(1);
    expect(studio.numberExplorer().columns.map((c) => c.value)).toEqual([0, 0, 1]);
  });

  it("going from 9 to 10, the last digit rolls over like an odometer and the next one ticks up", async () => {
    const studio = await explorerAt(9);
    studio.countUp();
    const view = studio.numberExplorer();
    expect(view.lastStep).toBe("up");
    expect(view.columns.map((c) => c.value)).toEqual([0, 1, 0]);
    expect(view.columns.map((c) => c.rolledOver)).toEqual([false, false, true]);
    expect(view.columns.map((c) => c.changed)).toEqual([false, true, true]);
  });

  it("going from 199 to 200, two digits roll over", async () => {
    const studio = await explorerAt(199);
    studio.countUp();
    const view = studio.numberExplorer();
    expect(view.columns.map((c) => c.value)).toEqual([2, 0, 0]);
    expect(view.columns.map((c) => c.rolledOver)).toEqual([false, true, true]);
    expect(view.columns.map((c) => c.changed)).toEqual([true, true, true]);
  });

  it("going down from 100 to 99, two digits roll back the other way", async () => {
    const studio = await explorerAt(100);
    studio.countDown();
    const view = studio.numberExplorer();
    expect(view.lastStep).toBe("down");
    expect(view.columns.map((c) => c.value)).toEqual([0, 9, 9]);
    expect(view.columns.map((c) => c.rolledOver)).toEqual([false, true, true]);
    expect(view.columns.map((c) => c.changed)).toEqual([true, true, true]);
  });

  it("an ordinary step changes only the last digit, with no roll-over", async () => {
    const studio = await explorerAt(41);
    studio.countUp();
    const view = studio.numberExplorer();
    expect(view.columns.map((c) => c.changed)).toEqual([false, false, true]);
    expect(view.columns.some((c) => c.rolledOver)).toBe(false);
  });

  it("before any step, nothing is rolling", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    const view = studio.numberExplorer();
    expect(view.lastStep).toBeUndefined();
    expect(view.columns.some((c) => c.changed || c.rolledOver)).toBe(false);
  });
});

describe("the limits", () => {
  it("− is disabled at zero and does nothing", async () => {
    const studio = await explorerAt(0);
    expect(studio.numberExplorer().canCountDown).toBe(false);
    expect(studio.numberExplorer().canCountUp).toBe(true);
    expect(studio.countDown()).toBe(false);
    expect(studio.numberExplorer().number).toBe(0);
  });

  it("+ is disabled at 999 and does nothing", async () => {
    const studio = await explorerAt(999);
    expect(studio.numberExplorer().canCountUp).toBe(false);
    expect(studio.numberExplorer().canCountDown).toBe(true);
    expect(studio.countUp()).toBe(false);
    expect(studio.numberExplorer().number).toBe(999);
    expect(studio.numberExplorer().columns.map((c) => c.value)).toEqual([9, 9, 9]);
  });

  it("a press at the limit doesn't replay the last roll-over", async () => {
    const studio = await explorerAt(0);
    studio.countUp();
    studio.countDown();
    studio.countDown();
    expect(studio.numberExplorer().lastStep).toBe("down");
    expect(studio.numberExplorer().columns.map((c) => c.changed)).toEqual([false, false, true]);
  });
});

describe("Digit Counts from 2 to 16", () => {
  it("999 in a few Digit Counts, worked out by hand", async () => {
    const studio = await explorerAt(999);
    const digitsAt = (count: number) => {
      expect(studio.setDigitCount(count)).toBe(true);
      return studio.numberExplorer().columns.map((c) => c.value);
    };
    expect(digitsAt(2)).toEqual([1, 1, 1, 1, 1, 0, 0, 1, 1, 1]);
    expect(digitsAt(3)).toEqual([1, 1, 0, 1, 0, 0, 0]);
    expect(digitsAt(5)).toEqual([1, 2, 4, 4, 4]);
    expect(digitsAt(7)).toEqual([2, 6, 2, 5]);
    expect(digitsAt(16)).toEqual([3, 14, 7]);
  });

  it("the extra digits use the slots ten to fifteen", async () => {
    const studio = await explorerAt(999);
    studio.setDigitCount(16);
    expect(studio.numberExplorer().columns.map((c) => c.slot)).toEqual(["3", "fourteen", "7"]);
    studio.setDigitCount(12);
    // 999 = 6×144 + 11×12 + 3
    expect(studio.numberExplorer().columns.map((c) => c.slot)).toEqual(["6", "eleven", "3"]);
  });

  it("there are always as many columns as 999 needs, so nothing shifts while counting", async () => {
    const studio = await explorerAt(0);
    const widths = [];
    for (let count = 2; count <= 16; count++) {
      studio.setDigitCount(count);
      widths.push(studio.numberExplorer().columns.length);
    }
    expect(widths).toEqual([10, 7, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3]);
  });

  it("zeros in front of the number are marked as leading; the number 0 still shows one real 0", async () => {
    const studio = await explorerAt(0);
    expect(studio.numberExplorer().columns.map((c) => c.leading)).toEqual([true, true, false]);
    countTo(studio, 7);
    studio.setDigitCount(2); // 111
    expect(studio.numberExplorer().columns.map((c) => c.leading)).toEqual([
      true, true, true, true, true, true, true, false, false, false,
    ]);
  });

  it("each column has as many items as its digit, and each item is a block, a Stack or a Stack of Stacks", async () => {
    const studio = await explorerAt(999);
    studio.setDigitCount(5);
    const columns = studio.numberExplorer().columns;
    expect(columns.map((c) => c.place)).toEqual([4, 3, 2, 1, 0]);
    expect(columns.map((c) => c.itemCount)).toEqual([1, 2, 4, 4, 4]);
    expect(columns.map((c) => c.blocksPerItem)).toEqual([625, 125, 25, 5, 1]);
  });

  it("for every Digit Count 2–16 at several numbers: the digits match ordinary base writing and the items add up to the number", async () => {
    const studio = await explorerAt(0);
    const numbers = [0, 1, 2, 7, 15, 16, 17, 100, 255, 256, 500, 998, 999];
    for (let count = 2; count <= 16; count++) {
      for (const n of [...numbers, count - 1, count, count + 1, count * count - 1, count * count].filter((n) => n <= 999)) {
        studio.setDigitCount(10);
        moveTo(studio, n);
        studio.setDigitCount(count);
        const view = studio.numberExplorer();
        const written = view.columns.filter((c) => !c.leading).map((c) => c.value.toString(16)).join("");
        expect(written, `${n} with ${count} digits`).toBe(n.toString(count));
        const blocks = view.columns.reduce((sum, c) => sum + c.itemCount * c.blocksPerItem, 0);
        expect(blocks, `${n} with ${count} digits`).toBe(n);
        for (const c of view.columns) {
          expect(c.value).toBeLessThan(count);
          expect(c.itemCount).toBe(c.value);
          expect(c.blocksPerItem).toBe(count ** c.place);
        }
      }
    }
  });

  it("changing the Digit Count keeps the number and stops any roll-over", async () => {
    const studio = await explorerAt(9);
    studio.countUp();
    studio.setDigitCount(4);
    const view = studio.numberExplorer();
    expect(view.number).toBe(10);
    expect(view.columns.map((c) => c.value)).toEqual([0, 0, 0, 2, 2]);
    expect(view.lastStep).toBeUndefined();
    expect(view.columns.some((c) => c.changed || c.rolledOver)).toBe(false);
  });

  it("counting rolls over at the Digit Count: with 5 digits, 4 + 1 is 10", async () => {
    const studio = await explorerAt(0);
    studio.setDigitCount(5);
    countTo(studio, 4);
    studio.countUp();
    const ones = studio.numberExplorer().columns.at(-1)!;
    const fives = studio.numberExplorer().columns.at(-2)!;
    expect([fives.value, ones.value]).toEqual([1, 0]);
    expect(ones.rolledOver).toBe(true);
    expect(fives.changed).toBe(true);
  });

  it("only takes whole Digit Counts from 2 to 16", async () => {
    const studio = await explorerAt(5);
    for (const bad of [1, 17, 0, -3, 2.5, NaN]) expect(studio.setDigitCount(bad)).toBe(false);
    expect(studio.numberExplorer().digitCount).toBe(10);
  });
});

function makeMyScript(studio: StudioCore, name: string) {
  const made = studio.createMyScript({ name, ink: "#c0392b", strokeWidth: 0.1 });
  if (!made.ok) throw new Error(made.reason);
  return made.script;
}

/** Counts up or down to `n` (any Digit Count). */
function moveTo(studio: StudioCore, n: number): void {
  while (studio.numberExplorer().number > n) studio.countDown();
  countTo(studio, n);
}

/** A loaded core with a My Script, in the Number Explorer, counted up to `n`. */
async function explorerAt(n: number) {
  const { studio } = await studioWithMyScript();
  studio.open({ name: "numberExplorer" });
  countTo(studio, n);
  return studio;
}
