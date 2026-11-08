import { describe, expect, it } from "vitest";
import type { GlyphSlot } from "./myScript";
import { SOUND_MAX_LENGTH, canHaveSound } from "./studioCore";
import { inMemoryStudioStorage } from "./studioStorage";
import { A_DOWN_STROKE, AN_ACROSS_STROKE, loadedStudio, studioWithMyScript } from "./testing";

/** What the English voice says at the Library's tap-to-hear speed. */
const english = (text: string) => ({ kind: "speak", speech: { text, lang: "en", rate: 0.8 } });

describe("Giving a Glyph a Sound", () => {
  it("after saving A with the Sound 'kla', tapping A says 'kla' in English at 0.8x", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla")).toBe("saved");
    expect(studio.glyphTap(script.id, "A")).toEqual(english("kla"));
  });

  it("is still there after the app reloads", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage });
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    await studio.saved();
    const reloaded = await loadedStudio({ storage });
    expect(reloaded.glyphTap(script.id, "A")).toEqual(english("kla"));
  });

  it("comes back with a Backup restored on another tablet", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    studio.saveGlyph(script.id, "7", [A_DOWN_STROKE], "zeb");
    const other = await loadedStudio();
    expect(other.restoreBackup(studio.makeBackup().text)).toMatchObject({ ok: true, myScripts: 1 });
    expect(other.glyphTap(script.id, "A")).toEqual(english("kla"));
    expect(other.glyphTap(script.id, "7")).toEqual(english("zeb"));
    expect(other.myScripts()).toEqual(studio.myScripts());
  });

  it("restores a Backup made before Sounds, whose Glyphs say their plain letters", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["B"] });
    const file = JSON.parse(studio.makeBackup().text);
    expect(file.myScripts[0].glyphs.B).not.toHaveProperty("sound");
    const other = await loadedStudio();
    expect(other.restoreBackup(JSON.stringify(file))).toMatchObject({ ok: true });
    expect(other.glyphTap(script.id, "B")).toEqual(english("B"));
  });

  it("refuses a Backup whose Sound isn't text, changing nothing", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["B"] });
    const file = JSON.parse(studio.makeBackup().text);
    file.myScripts[0].glyphs.B.sound = 42;
    const other = await loadedStudio();
    expect(other.restoreBackup(JSON.stringify(file))).toEqual({ ok: false, reason: "unreadable" });
    expect(other.myScript(script.id)).toBeUndefined();
  });
});

describe("The Sound a Glyph keeps", () => {
  it("is trimmed and cut to SOUND_MAX_LENGTH (12) characters", async () => {
    expect(SOUND_MAX_LENGTH).toBe(12);
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "  kla  ");
    studio.saveGlyph(script.id, "B", [A_DOWN_STROKE], "abcdefghijklmnop");
    expect(studio.glyphTap(script.id, "A")).toEqual(english("kla"));
    expect(studio.glyphTap(script.id, "B")).toEqual(english("abcdefghijkl"));
  });

  it("is none when the box is blank, so the Glyph says its plain letter", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "B", [A_DOWN_STROKE], "   ");
    expect(studio.myScript(script.id)!.glyphs.B).not.toHaveProperty("sound");
    expect(studio.glyphTap(script.id, "B")).toEqual(english("B"));
  });

  it("isn't saved on its own: with nothing drawn the save is still empty", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveGlyph(script.id, "A", [], "kla")).toBe("empty");
    expect(studio.drawnSlots(script.id)).toEqual([]);
    expect(studio.glyphTap(script.id, "A")).toEqual(english("A"));
  });

  it("is kept when he redraws with the same Sound, and changed when he types a new one", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE, AN_ACROSS_STROKE], "kla");
    expect(studio.myScript(script.id)!.glyphs.A).toMatchObject({ strokes: [A_DOWN_STROKE, AN_ACROSS_STROKE], sound: "kla" });
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "klo");
    expect(studio.glyphTap(script.id, "A")).toEqual(english("klo"));
  });

  it("goes away when he empties the box and saves", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "");
    expect(studio.glyphTap(script.id, "A")).toEqual(english("A"));
  });

  it("is ignored for space and punctuation, which are pauses", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveGlyph(script.id, "space", [A_DOWN_STROKE], "hm")).toBe("saved");
    expect(studio.saveGlyph(script.id, "?", [A_DOWN_STROKE], "huh")).toBe("saved");
    const { glyphs } = studio.myScript(script.id)!;
    expect(glyphs.space).not.toHaveProperty("sound");
    expect(glyphs["?"]).not.toHaveProperty("sound");
    expect(["A", "7", "ten", "space", "."].map((slot) => canHaveSound(slot as GlyphSlot))).toEqual([true, true, true, false, false]);
  });
});

describe("Tapping one of his Glyphs to hear it", () => {
  it("says the plain letter or digit when it has no Sound", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["B", "7", "ten"] });
    expect(studio.glyphTap(script.id, "B")).toEqual(english("B"));
    expect(studio.glyphTap(script.id, "7")).toEqual(english("7"));
    expect(studio.glyphTap(script.id, "ten")).toEqual(english("10"));
  });

  it("tries the Sound box's unsaved text, before anything is drawn or saved", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.glyphTap(script.id, "A", "  zorp ")).toEqual(english("zorp"));
    expect(studio.myScript(script.id)!.glyphs.A).toBeUndefined();
  });

  it("tries the box's text over the saved Sound, and the plain letter when the box is blank", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    expect(studio.glyphTap(script.id, "A", "klee")).toEqual(english("klee"));
    expect(studio.glyphTap(script.id, "A", "")).toEqual(english("A"));
    expect(studio.glyphTap(script.id, "A")).toEqual(english("kla"));
  });

  it("says nothing while muted", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", [A_DOWN_STROKE], "kla");
    studio.setMuted(true);
    expect(studio.glyphTap(script.id, "A")).toEqual({ kind: "muted" });
    expect(studio.glyphTap(script.id, "A", "klee")).toEqual({ kind: "muted" });
  });

  it("has nothing to say for space, punctuation or an unknown My Script", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["space", "!"] });
    expect(studio.glyphTap(script.id, "space")).toBeUndefined();
    expect(studio.glyphTap(script.id, "!")).toBeUndefined();
    expect(studio.glyphTap("no-such-script", "A")).toBeUndefined();
  });
});
