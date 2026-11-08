import { describe, expect, it } from "vitest";
import { GLYPH_SLOTS, slotLabel } from "./myScript";
import { inMemoryStudioStorage } from "./studioStorage";
import {
  A_DAY,
  A_DOWN_STROKE,
  AN_ACROSS_STROKE,
  fakeClock,
  loadedStudio,
  newStudio,
  studioWithMyScript,
} from "./testing";

describe("creating a My Script", () => {
  it("he names it and picks an ink and stroke width, and it starts with no Glyphs", () => {
    const studio = newStudio();
    const result = studio.createMyScript({ name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07 });
    expect(result.ok).toBe(true);
    expect(studio.myScripts()).toEqual([
      {
        id: expect.any(String),
        name: "Sky Runes",
        ink: "#3b6fd1",
        strokeWidth: 0.07,
        createdAt: A_DAY,
        updatedAt: A_DAY,
        glyphs: {},
      },
    ]);
  });

  it("needs a name that isn't blank, and trims the spaces around it", () => {
    const studio = newStudio();
    expect(studio.createMyScript({ name: "   ", ink: "#3b6fd1", strokeWidth: 0.07 })).toEqual({
      ok: false,
      reason: "needsName",
    });
    const made = studio.createMyScript({ name: "  Sky Runes ", ink: "#3b6fd1", strokeWidth: 0.07 });
    expect(made.ok && made.script.name).toBe("Sky Runes");
    expect(studio.myScripts()).toHaveLength(1);
  });

  it("only takes the offered inks and stroke widths", () => {
    const studio = newStudio();
    expect(studio.createMyScript({ name: "X", ink: "hotpink", strokeWidth: 0.07 })).toEqual({
      ok: false,
      reason: "unknownInk",
    });
    expect(studio.createMyScript({ name: "X", ink: "#3b6fd1", strokeWidth: 5 })).toEqual({
      ok: false,
      reason: "unknownStrokeWidth",
    });
    expect(studio.myScripts()).toEqual([]);
  });

  it("two made in the same moment are still two different My Scripts", () => {
    const studio = newStudio();
    studio.createMyScript({ name: "One", ink: "#3b6fd1", strokeWidth: 0.07 });
    studio.createMyScript({ name: "Two", ink: "#3b6fd1", strokeWidth: 0.07 });
    const [one, two] = studio.myScripts();
    expect(one.id).not.toBe(two.id);
    expect(studio.myScript(two.id)?.name).toBe("Two");
  });
});

describe("Glyph slots", () => {
  it("are A–Z, 0–9, the extra digits ten to fifteen, space, then . , ? !", () => {
    expect(GLYPH_SLOTS.map(slotLabel).join(" ")).toBe(
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 space . , ? !",
    );
  });

  it("in a brand-new My Script are all Missing Glyphs", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.missingSlots(script.id)).toEqual(GLYPH_SLOTS);
  });
});

describe("drawing a Glyph", () => {
  it("he draws H, and H is no longer missing", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveGlyph(script.id, "H", [A_DOWN_STROKE, AN_ACROSS_STROKE])).toBe("saved");
    expect(studio.myScript(script.id)?.glyphs.H).toEqual({ strokes: [A_DOWN_STROKE, AN_ACROSS_STROKE], updatedAt: A_DAY });
    expect(studio.missingSlots(script.id)).not.toContain("H");
    expect(studio.missingSlots(script.id)).toHaveLength(GLYPH_SLOTS.length - 1);
  });

  it("keeps points inside the canvas square", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "I", [[{ x: -0.2, y: 0.5 }, { x: 1.3, y: 2 }]]);
    expect(studio.myScript(script.id)?.glyphs.I?.strokes).toEqual([[{ x: 0, y: 0.5 }, { x: 1, y: 1 }]]);
  });

  it("with nothing drawn isn't saved, so the slot stays missing", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveGlyph(script.id, "A", [])).toBe("empty");
    expect(studio.saveGlyph(script.id, "A", [[]])).toBe("empty");
    expect(studio.missingSlots(script.id)).toContain("A");
  });

  it("for a My Script that doesn't exist does nothing", async () => {
    const studio = await loadedStudio();
    expect(studio.saveGlyph("nope", "A", [A_DOWN_STROKE])).toBe("noScript");
    expect(studio.missingSlots("nope")).toEqual([]);
  });

  it("redrawing a Glyph replaces the old shape", async () => {
    const clock = fakeClock();
    const { studio, script } = await studioWithMyScript({ clock, drawn: ["O"] });
    clock.advance(60_000);
    studio.saveGlyph(script.id, "O", [AN_ACROSS_STROKE]);
    const redrawn = studio.myScript(script.id)!;
    expect(redrawn.glyphs.O).toEqual({ strokes: [AN_ACROSS_STROKE], updatedAt: A_DAY + 60_000 });
    expect(redrawn.updatedAt).toBe(A_DAY + 60_000);
    expect(redrawn.createdAt).toBe(A_DAY);
  });

  it("the extra digits and marks are slots too", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["ten", "fifteen", "space", "?"] });
    const missing = studio.missingSlots(script.id);
    for (const slot of ["ten", "fifteen", "space", "?"] as const) expect(missing).not.toContain(slot);
    expect(missing).toContain("eleven");
  });
});

describe("My Scripts are saved on the tablet", () => {
  it("after closing and reopening the app, the My Script and its Glyphs are still there", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage, drawn: ["H", "I"] });
    studio.saveGlyph(script.id, "I", [AN_ACROSS_STROKE]);
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.myScripts()).toEqual([studio.myScript(script.id)]);
    expect(reopened.myScript(script.id)?.glyphs.I?.strokes).toEqual([AN_ACROSS_STROKE]);
    expect(reopened.missingSlots(script.id)).toHaveLength(GLYPH_SLOTS.length - 2);
  });

  it("a My Script made after reopening gets its own id", async () => {
    const storage = inMemoryStudioStorage();
    const { studio } = await studioWithMyScript({ storage });
    await studio.saved();
    const reopened = await loadedStudio({ storage });
    reopened.createMyScript({ name: "Second", ink: "#c0392b", strokeWidth: 0.1 });
    expect(new Set(reopened.myScripts().map((s) => s.id)).size).toBe(2);
  });
});
