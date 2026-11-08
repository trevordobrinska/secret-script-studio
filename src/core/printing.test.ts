import { describe, expect, it } from "vitest";
import type { MessageCell } from "./messageLayout";
import { newStudio, studioWithMyScript } from "./testing";

const APP = "https://trevordobrinska.github.io/secret-script-studio/";

/** The cells as short strings, so a layout reads at a glance. */
function shapes(cells: readonly MessageCell[]): string[] {
  return cells.map((c) => `${c.kind}:${c.char}`);
}

describe("printing a Message from a My Script", () => {
  it("the Message page holds the Message's cells in his Glyphs", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I"] });
    const print = studio.printLayout(script.id, "hi a!", { cipherKey: false });
    if (!print.ok) throw new Error(print.reason);
    expect(shapes(print.layout.message.cells)).toEqual([
      "glyph:H",
      "glyph:I",
      "gap: ",
      "missingGlyph:A",
      "missingGlyph:!",
    ]);
    expect(print.layout).toMatchObject({ name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07 });
  });

  it("without a Cipher Key there is only the Message page", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I"] });
    const print = studio.printLayout(script.id, "HI", { cipherKey: false });
    if (!print.ok) throw new Error(print.reason);
    expect(print.layout.cipherKey).toBeUndefined();
  });

  it("the Cipher Key lists every drawn Glyph with its letter: letters, then digits, then marks", async () => {
    const { studio, script } = await studioWithMyScript({
      drawn: ["!", "7", "twelve", "Z", "space", "B", "0", "?", "A"],
    });
    const print = studio.printLayout(script.id, "AB", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    expect(print.layout.cipherKey?.map((entry) => entry.label)).toEqual([
      "A",
      "B",
      "Z",
      "0",
      "7",
      "12",
      "space",
      "?",
      "!",
    ]);
  });

  it("the Cipher Key pairs each Glyph with its slot and leaves out Missing Glyphs", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H"] });
    const print = studio.printLayout(script.id, "HI", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    expect(print.layout.cipherKey).toEqual([
      { slot: "H", label: "H", glyph: studio.myScript(script.id)!.glyphs.H },
    ]);
  });

  it("a Glyph he redraws prints in its new shape", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H"] });
    const dot = [[{ x: 0.5, y: 0.5 }]];
    studio.saveGlyph(script.id, "H", dot);
    const print = studio.printLayout(script.id, "H", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    const [cell] = print.layout.message.cells;
    expect(cell.kind === "glyph" && cell.glyph.strokes).toEqual(dot);
    expect(print.layout.cipherKey?.[0].glyph.strokes).toEqual(dot);
  });

  it("an empty Message, or an unknown My Script, has nothing to print", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H"] });
    expect(studio.printLayout(script.id, "   ", { cipherKey: true })).toEqual({ ok: false, reason: "empty" });
    expect(studio.printLayout("no-such-script", "HI", { cipherKey: true })).toEqual({
      ok: false,
      reason: "noScript",
    });
  });
});

describe("printing from the Reply page (a shared Message)", () => {
  async function openedLink() {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I", "A", "7"] });
    const shared = await studio.shareLink(script.id, "HI HI", APP);
    if (!shared.ok) throw new Error(`Couldn't share: ${shared.reason}`);
    // Dad's phone: a fresh core with nothing saved, only the link.
    const dad = newStudio();
    const opened = await dad.openShareLink(shared.link);
    if (!opened.ok) throw new Error(`Couldn't open: ${opened.reason}`);
    return { dad, message: opened.message };
  }

  it("Dad prints the shared Message in his Glyphs, with the My Script's name, ink and width", async () => {
    const { dad, message } = await openedLink();
    const print = dad.sharedPrintLayout(message, message.text, { cipherKey: false });
    if (!print.ok) throw new Error(print.reason);
    expect(shapes(print.layout.message.cells)).toEqual(["glyph:H", "glyph:I", "gap: ", "glyph:H", "glyph:I"]);
    expect(print.layout).toMatchObject({ name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07 });
    expect(print.layout.cipherKey).toBeUndefined();
  });

  it("the Cipher Key lists only the Glyphs that came in the link", async () => {
    const { dad, message } = await openedLink();
    const print = dad.sharedPrintLayout(message, message.text, { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    expect(print.layout.cipherKey?.map((entry) => entry.label)).toEqual(["H", "I"]);
  });

  it("Dad prints his reply in the shared Glyphs; letters not in the link are Missing Glyphs", async () => {
    const { dad, message } = await openedLink();
    const print = dad.sharedPrintLayout(message, "ha 7", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    expect(shapes(print.layout.message.cells)).toEqual(["glyph:H", "missingGlyph:A", "gap: ", "missingGlyph:7"]);
    expect(print.layout.cipherKey?.map((entry) => entry.label)).toEqual(["H", "I"]);
  });

  it("an empty reply has nothing to print", async () => {
    const { dad, message } = await openedLink();
    expect(dad.sharedPrintLayout(message, " ", { cipherKey: false })).toEqual({ ok: false, reason: "empty" });
  });
});

describe("Sounds on the printed Cipher Key", () => {
  const stroke = [[{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.8 }]];

  it("an entry's Glyph carries its Sound, and one without a Sound has none", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", stroke, "kla");
    studio.saveGlyph(script.id, "B", stroke);
    const print = studio.printLayout(script.id, "AB", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    const [a, b] = print.layout.cipherKey!;
    expect(a).toMatchObject({ label: "A", glyph: { sound: "kla" } });
    expect(b.label).toBe("B");
    expect(b.glyph).not.toHaveProperty("sound");
  });

  it("a shared Message's Glyphs print their Sounds, and those without print as today", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "A", stroke, "kla");
    studio.saveGlyph(script.id, "B", stroke);
    const shared = await studio.shareLink(script.id, "AB", APP);
    if (!shared.ok) throw new Error(shared.reason);
    const dad = newStudio();
    const opened = await dad.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    const print = dad.sharedPrintLayout(opened.message, "AB", { cipherKey: true });
    if (!print.ok) throw new Error(print.reason);
    const [a, b] = print.layout.cipherKey!;
    expect(a).toMatchObject({ label: "A", glyph: { sound: "kla" } });
    expect(b.label).toBe("B");
    expect(b.glyph).not.toHaveProperty("sound");
  });
});
