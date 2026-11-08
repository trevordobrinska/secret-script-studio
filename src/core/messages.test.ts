import { describe, expect, it } from "vitest";
import { layoutMessage, messageWords, type MessageCell } from "./messageLayout";
import { A_DOWN_STROKE, studioWithMyScript } from "./testing";

/** The cells as short strings, so a story's layout reads at a glance. */
function shapes(cells: readonly MessageCell[]): string[] {
  return cells.map((c) => `${c.kind}:${c.char}`);
}

describe("the Message layout", () => {
  it("he draws H and I, writes HI MOM, and the O shows as a Missing Glyph", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I", "M"] });
    const cells = studio.messageLayout(script.id, "HI MOM");
    expect(shapes(cells)).toEqual([
      "glyph:H",
      "glyph:I",
      "gap: ",
      "glyph:M",
      "missingGlyph:O",
      "glyph:M",
    ]);
    expect(cells[4]).toEqual({ kind: "missingGlyph", slot: "O", char: "O" });
    expect(cells[0]).toEqual({ kind: "glyph", slot: "H", char: "H", glyph: script.glyphs.H });
  });

  it("an unknown My Script lays out nothing", async () => {
    const { studio } = await studioWithMyScript();
    expect(studio.messageLayout("no-such-script", "HI")).toEqual([]);
  });
});

describe("folding and plain characters", () => {
  it("lowercase letters are folded to uppercase and use the same Glyphs", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I"] });
    expect(shapes(studio.messageLayout(script.id, "hi Hi"))).toEqual(["glyph:H", "glyph:I", "gap: ", "glyph:H", "glyph:I"]);
  });

  it("characters that aren't Glyph slots, like Dad's é or @, stay plain characters", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["A"] });
    expect(shapes(studio.messageLayout(script.id, "é@a😀"))).toEqual(["plain:é", "plain:@", "glyph:A", "plain:😀"]);
  });

  it("digits and the marks . , ? ! are Glyph slots too", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["7", "?"] });
    expect(shapes(studio.messageLayout(script.id, "7!?."))).toEqual([
      "glyph:7",
      "missingGlyph:!",
      "glyph:?",
      "missingGlyph:.",
    ]);
  });

  it("a space he has drawn a Glyph for shows that Glyph instead of a gap", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["space"] });
    expect(studio.messageLayout(script.id, "A B")[1]).toEqual({
      kind: "glyph",
      slot: "space",
      char: " ",
      glyph: script.glyphs.space,
    });
  });

  it("new lines from Dad's keyboard become ordinary gaps", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(shapes(studio.messageLayout(script.id, "A\nB"))).toEqual(["missingGlyph:A", "gap: ", "missingGlyph:B"]);
  });
});

describe("Glyphs change live in the layout", () => {
  it("after he draws the Missing O, the same Message shows his new O", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["M"] });
    expect(studio.messageLayout(script.id, "MOM")[1].kind).toBe("missingGlyph");
    studio.saveGlyph(script.id, "O", [A_DOWN_STROKE]);
    expect(studio.messageLayout(script.id, "MOM")[1]).toMatchObject({ kind: "glyph", slot: "O" });
  });
});

describe("laying out with a shared set of Glyphs", () => {
  it("works the same with Glyphs that came from somewhere else, like a share link", () => {
    const glyphs = { H: { strokes: [A_DOWN_STROKE], updatedAt: 0 } };
    expect(shapes(layoutMessage("hi you", glyphs))).toEqual([
      "glyph:H",
      "missingGlyph:I",
      "gap: ",
      "missingGlyph:Y",
      "missingGlyph:O",
      "missingGlyph:U",
    ]);
  });
});

describe("wrapping a Message into words", () => {
  it("each word stays together, and each space is its own piece to break at", () => {
    const words = messageWords(layoutMessage("HI  MOM", {}));
    expect(words.map((w) => w.map((c) => c.char).join(""))).toEqual(["HI", " ", " ", "MOM"]);
  });
});

describe("typing on the Glyph keyboard", () => {
  it("he types H, I, space, M, O, M and the draft reads HI MOM", async () => {
    const { studio, script } = await studioWithMyScript();
    for (const slot of ["H", "I", "space", "M", "O", "M"] as const) studio.typeKey(script.id, slot);
    expect(studio.draft(script.id)).toBe("HI MOM");
  });

  it("backspace takes off the last character, and does nothing on an empty draft", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.backspace(script.id);
    expect(studio.draft(script.id)).toBe("");
    studio.typeKey(script.id, "H");
    studio.typeKey(script.id, "!");
    studio.backspace(script.id);
    expect(studio.draft(script.id)).toBe("H");
  });

  it("the draft waits while he goes off to draw a Missing Glyph and comes back", async () => {
    const { studio, script } = await studioWithMyScript();
    const write = { name: "write", scriptId: script.id } as const;
    studio.open(write);
    studio.typeKey(script.id, "O");
    studio.open({ name: "glyphCanvas", scriptId: script.id, slot: "O", returnTo: write });
    studio.saveGlyph(script.id, "O", [A_DOWN_STROKE]);
    studio.open(write);
    expect(studio.draft(script.id)).toBe("O");
    expect(studio.messageLayout(script.id, studio.draft(script.id))[0].kind).toBe("glyph");
  });

  it("each My Script has its own draft", async () => {
    const { studio, script } = await studioWithMyScript();
    const other = studio.createMyScript({ name: "Moon Marks", ink: "#2f8f5b", strokeWidth: 0.04 });
    if (!other.ok) throw new Error("couldn't make the second My Script");
    studio.typeKey(script.id, "A");
    expect(studio.draft(other.script.id)).toBe("");
  });

  it("the extra digits ten to fifteen aren't keys, so they type nothing", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.typeKey(script.id, "ten");
    expect(studio.draft(script.id)).toBe("");
  });
});
