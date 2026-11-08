import { describe, expect, it } from "vitest";
import { inMemoryStudioStorage, SETTINGS_SCHEMA_VERSION } from "./studioStorage";
import { countTo, loadedStudio, studioWithMyScript } from "./testing";

describe("the first-time hint \"Try fewer digits!\"", () => {
  it("shows the first time he opens the Number Explorer", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().hint).toBe(true);
  });

  it("doesn't show the next time he comes in from home", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    studio.goHome();
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().hint).toBe(false);
  });

  it("is remembered in the Settings across a reload", async () => {
    const storage = inMemoryStudioStorage();
    const first = await loadedStudio({ storage });
    first.open({ name: "numberExplorer" });
    await first.saved();
    expect(first.settings().numberHintSeen).toBe(true);

    const reloaded = await loadedStudio({ storage });
    expect(reloaded.settings().numberHintSeen).toBe(true);
    reloaded.open({ name: "numberExplorer" });
    expect(reloaded.numberExplorer().hint).toBe(false);
  });

  it("goes away once he changes the Digit Count", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    studio.setDigitCount(9);
    expect(studio.numberExplorer().hint).toBe(false);
  });

  it("an invalid Digit Count leaves the hint up", async () => {
    const studio = await loadedStudio();
    studio.open({ name: "numberExplorer" });
    studio.setDigitCount(17);
    expect(studio.numberExplorer().hint).toBe(true);
  });

  it("stays up while he draws a Missing digit and comes back", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    studio.open({ name: "glyphCanvas", scriptId: script.id, slot: "3", returnTo: { name: "numberExplorer" } });
    studio.open({ name: "numberExplorer" });
    expect(studio.numberExplorer().hint).toBe(true);
  });

  it("doesn't show if the Settings say it was seen", async () => {
    const storage = inMemoryStudioStorage();
    await storage.saveSettings({ schemaVersion: SETTINGS_SCHEMA_VERSION, muted: true, numberHintSeen: true });
    const other = await loadedStudio({ storage });
    other.open({ name: "numberExplorer" });
    expect(other.numberExplorer().hint).toBe(false);
    expect(other.settings().muted).toBe(true);
  });

  it("marking it seen keeps the mute setting", async () => {
    const storage = inMemoryStudioStorage();
    const first = await loadedStudio({ storage });
    first.setMuted(true);
    first.open({ name: "numberExplorer" });
    await first.saved();
    const reloaded = await loadedStudio({ storage });
    expect(reloaded.settings()).toEqual({ muted: true, numberHintSeen: true });
  });
});

describe("changing the Digit Count", () => {
  it("at every Digit Count 2–16, in turn up and back down, the number stays and is rewritten in the new digits", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    countTo(studio, 345);
    const counts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 7, 2];
    for (const count of counts) {
      expect(studio.setDigitCount(count)).toBe(true);
      const view = studio.numberExplorer();
      expect(view.digitCount).toBe(count);
      expect(view.number).toBe(345);
      const written = view.columns.filter((c) => !c.leading).map((c) => c.value.toString(16)).join("");
      expect(written, `345 with ${count} digits`).toBe(EXPECTED_345[count]);
    }
  });
});

/** 345 written with each Digit Count, worked out by hand (a–f stand for the digits ten to fifteen). */
const EXPECTED_345: Record<number, string> = {
  2: "101011001",
  3: "110210",
  4: "11121",
  5: "2340",
  6: "1333",
  7: "1002",
  8: "531",
  9: "423",
  10: "345",
  11: "294",
  12: "249",
  13: "207",
  14: "1a9",
  15: "180",
  16: "159",
};

describe("typing a regular number", () => {
  it("makes it the current number, shown in his digits", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    studio.setDigitCount(5);
    expect(studio.enterNumber(42)).toBe(true);
    const view = studio.numberExplorer();
    expect(view.number).toBe(42);
    expect(view.digitCount).toBe(5);
    expect(view.columns.filter((c) => !c.leading).map((c) => c.value)).toEqual([1, 3, 2]);
  });

  it("takes 0 and 999", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    expect(studio.enterNumber(999)).toBe(true);
    expect(studio.numberExplorer()).toMatchObject({ number: 999, canCountUp: false });
    expect(studio.enterNumber(0)).toBe(true);
    expect(studio.numberExplorer()).toMatchObject({ number: 0, canCountDown: false });
  });

  it("refuses anything that isn't a whole number from 0 to 999, and nothing changes", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    countTo(studio, 7);
    for (const bad of [1000, -1, 2.5, NaN, Infinity]) expect(studio.enterNumber(bad)).toBe(false);
    expect(studio.numberExplorer().number).toBe(7);
  });

  it("doesn't roll the digits like a + or − does", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    countTo(studio, 9);
    studio.countUp();
    studio.enterNumber(500);
    const view = studio.numberExplorer();
    expect(view.lastStep).toBeUndefined();
    expect(view.columns.some((c) => c.changed || c.rolledOver)).toBe(false);
  });

  it("counting carries on from the typed number", async () => {
    const { studio } = await studioWithMyScript();
    studio.open({ name: "numberExplorer" });
    studio.enterNumber(199);
    studio.countUp();
    expect(studio.numberExplorer().number).toBe(200);
  });
});
