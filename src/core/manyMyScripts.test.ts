import { describe, expect, it } from "vitest";
import { inMemoryStudioStorage } from "./studioStorage";
import { A_DAY, A_DOWN_STROKE, fakeClock, loadedStudio, studioWithMyScript } from "./testing";

describe("renaming a My Script", () => {
  it("he changes his mind about the name, and the new one is remembered", async () => {
    const storage = inMemoryStudioStorage();
    const clock = fakeClock();
    const { studio, script } = await studioWithMyScript({ storage, clock, drawn: ["H"] });
    clock.advance(60_000);
    expect(studio.renameMyScript(script.id, "  Moon Marks ")).toBe("renamed");
    expect(studio.myScript(script.id)).toMatchObject({ name: "Moon Marks", updatedAt: A_DAY + 60_000, createdAt: A_DAY });
    expect(studio.myScript(script.id)?.glyphs.H).toBeDefined();
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.myScript(script.id)?.name).toBe("Moon Marks");
  });

  it("needs a name that isn't blank, and keeps the old one if it is", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.renameMyScript(script.id, "   ")).toBe("needsName");
    expect(studio.myScript(script.id)?.name).toBe(script.name);
  });

  it("keeps a long new name to 30 characters, like a new My Script's", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.renameMyScript(script.id, "The Very Secret Runes of the Northern Sky")).toBe("renamed");
    expect(studio.myScript(script.id)?.name).toBe("The Very Secret Runes of the N");
  });

  it("of a My Script that doesn't exist does nothing", async () => {
    const studio = await loadedStudio();
    expect(studio.renameMyScript("nope", "Anything")).toBe("noScript");
    expect(studio.myScripts()).toEqual([]);
  });
});

describe("deleting a My Script", () => {
  it("it's gone from the list, and stays gone after reopening the app", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script: doomed } = await studioWithMyScript({ storage, drawn: ["H"] });
    const kept = studio.createMyScript({ name: "Keeper", ink: "#c0392b", strokeWidth: 0.1 });
    expect(studio.deleteMyScript(doomed.id)).toBe("deleted");
    expect(studio.myScript(doomed.id)).toBeUndefined();
    expect(studio.myScripts().map((s) => s.name)).toEqual(["Keeper"]);
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.myScripts().map((s) => s.id)).toEqual([kept.ok && kept.script.id]);
  });

  it("right after drawing in it still deletes it from the tablet", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage, drawn: ["A", "B"] });
    studio.deleteMyScript(script.id);
    await studio.saved();
    expect((await loadedStudio({ storage })).myScripts()).toEqual([]);
  });

  it("of a My Script that doesn't exist does nothing", async () => {
    const { studio } = await studioWithMyScript();
    expect(studio.deleteMyScript("nope")).toBe("noScript");
    expect(studio.myScripts()).toHaveLength(1);
  });
});

describe("the name nudge's suggested letters", () => {
  it("are the unique letters of his name, in order", async () => {
    const studio = await loadedStudio();
    expect(studio.suggestedLetters("Hannah")).toEqual(["H", "A", "N"]);
  });

  it("fold small letters to capitals and skip spaces, digits and marks", async () => {
    const studio = await loadedStudio();
    expect(studio.suggestedLetters(" max 2-go!")).toEqual(["M", "A", "X", "G", "O"]);
  });

  it("read accented letters as their plain letter, and skip letters from other alphabets", async () => {
    const studio = await loadedStudio();
    expect(studio.suggestedLetters("Zoë Λ")).toEqual(["Z", "O", "E"]);
  });

  it("are none for a word with no letters", async () => {
    const studio = await loadedStudio();
    expect(studio.suggestedLetters("  42 ?")).toEqual([]);
  });
});

describe("the next empty one, after saving a Glyph", () => {
  it("is the next Missing Glyph in grid order", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["A", "C"] });
    expect(studio.nextMissingSlot(script.id, "A")).toBe("B");
    expect(studio.nextMissingSlot(script.id, "B")).toBe("D");
  });

  it("goes round to the start after the last slot", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["B", "!"] });
    expect(studio.nextMissingSlot(script.id, "!")).toBe("A");
  });

  it("offers his name's letters first, then carries on in grid order", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["T"] });
    const name = studio.suggestedLetters("Trev");
    expect(studio.nextMissingSlot(script.id, "T", name)).toBe("R");
    studio.saveGlyph(script.id, "R", [A_DOWN_STROKE]);
    studio.saveGlyph(script.id, "E", [A_DOWN_STROKE]);
    studio.saveGlyph(script.id, "V", [A_DOWN_STROKE]);
    expect(studio.nextMissingSlot(script.id, "V", name)).toBe("W");
  });

  it("is none once every slot has a Glyph", async () => {
    const { studio, script } = await studioWithMyScript();
    for (const slot of studio.missingSlots(script.id)) studio.saveGlyph(script.id, slot, [A_DOWN_STROKE]);
    expect(studio.nextMissingSlot(script.id, "A")).toBeUndefined();
    expect(studio.nextMissingSlot("nope", "A")).toBeUndefined();
  });
});

describe("the list of My Scripts", () => {
  it("shows every My Script, oldest first", async () => {
    const clock = fakeClock();
    const { studio } = await studioWithMyScript({ clock });
    clock.advance(1000);
    studio.createMyScript({ name: "Second", ink: "#c0392b", strokeWidth: 0.1 });
    clock.advance(1000);
    studio.createMyScript({ name: "Third", ink: "#2f8f5b", strokeWidth: 0.04 });
    expect(studio.myScripts().map((s) => s.name)).toEqual(["Sky Runes", "Second", "Third"]);
  });

  it("previews a few of a My Script's Glyphs: the drawn slots, in grid order", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["Z", "7", "H", "?", "A"] });
    expect(studio.drawnSlots(script.id)).toEqual(["A", "H", "Z", "7", "?"]);
    expect(studio.drawnSlots("nope")).toEqual([]);
  });
});
