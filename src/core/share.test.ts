import { describe, expect, it } from "vitest";
import type { MessageCell } from "./messageLayout";
import type { GlyphSlot, Point, Stroke } from "./myScript";
import { fingerDrawnStrokes, studioWithFingerDrawnScript, studioWithMyScript } from "./testing";

const APP = "https://trevordobrinska.github.io/secret-script-studio/";
/**
 * How close a shared Glyph stays to what he drew: snapping to the share
 * link's 1/64 grid plus simplifying may move a point about a step and a half.
 */
const SHAPE_TOLERANCE = 1.5 / 64;

/** The cells as short strings, so a layout reads at a glance. */
function shapes(cells: readonly MessageCell[]): string[] {
  return cells.map((c) => `${c.kind}:${c.char}`);
}

/** How far a point is from the nearest part of a stroke (as a line through its points). */
function distanceToStroke(p: Point, stroke: Stroke): number {
  if (stroke.length === 1) return Math.hypot(p.x - stroke[0].x, p.y - stroke[0].y);
  let best = Infinity;
  for (let i = 1; i < stroke.length; i++) {
    const a = stroke[i - 1];
    const b = stroke[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    best = Math.min(best, Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)));
  }
  return best;
}

async function shareAndOpen(drawn: readonly GlyphSlot[], text: string) {
  const { studio, script } = await studioWithMyScript({ drawn });
  const shared = await studio.shareLink(script.id, text, APP);
  if (!shared.ok) throw new Error(`Couldn't share: ${shared.reason}`);
  const opened = await studio.openShareLink(shared.link);
  if (!opened.ok) throw new Error(`Couldn't open: ${opened.reason}`);
  return { studio, script, link: shared.link, message: opened.message };
}

describe("sharing a Message by link", () => {
  it("Dad opens the link and sees the same Message, name, ink and width", async () => {
    const { link, message } = await shareAndOpen(["H", "I"], "HI DAD");
    expect(link.startsWith(APP + "#")).toBe(true);
    expect(message).toMatchObject({ name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07, text: "HI DAD" });
  });

  it("everything is in the fragment: the address part is just the app's", async () => {
    const { link } = await shareAndOpen(["H"], "HI");
    expect(link.split("#")[0]).toBe(APP);
  });

  it("only the Glyphs the Message uses travel in the link", async () => {
    const { message } = await shareAndOpen(["A", "B", "C", "H", "I", "7"], "HI HI");
    expect(Object.keys(message.glyphs).sort()).toEqual(["H", "I"]);
  });

  it("a drawn space travels too when the Message has a space", async () => {
    const { message } = await shareAndOpen(["H", "space"], "H H");
    expect(Object.keys(message.glyphs).sort()).toEqual(["H", "space"]);
  });

  it("letters he hasn't drawn yet still show as Missing Glyphs on Dad's side", async () => {
    const { studio, message } = await shareAndOpen(["H", "I", "M"], "HI MOM");
    expect(shapes(studio.sharedLayout(message, message.text).cells)).toEqual([
      "glyph:H",
      "glyph:I",
      "gap: ",
      "glyph:M",
      "missingGlyph:O",
      "glyph:M",
    ]);
  });

  it("the text comes back exactly, folded, with plain characters kept", async () => {
    const { message } = await shareAndOpen(["H"], "hi Dad, é @ 😀?");
    expect(message.text).toBe("HI DAD, é @ 😀?");
  });

  it("finger-drawn Glyphs come back the same shape, to within a step and a half of the grid", async () => {
    const { studio, script } = await studioWithFingerDrawnScript(["A", "B"]);
    const shared = await studio.shareLink(script.id, "AB", APP);
    if (!shared.ok) throw new Error(shared.reason);
    const opened = await studio.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    for (const slot of ["A", "B"] as const) {
      const original = script.glyphs[slot]!.strokes;
      const back = opened.message.glyphs[slot]!.strokes;
      expect(back).toHaveLength(original.length);
      original.forEach((stroke, i) => {
        for (const p of stroke) expect(distanceToStroke(p, back[i])).toBeLessThanOrEqual(SHAPE_TOLERANCE);
      });
    }
  });

  it("the strokes are made compact: far fewer points than he drew", async () => {
    const { studio, script } = await studioWithFingerDrawnScript(["A"], { strokes: 1, points: 200 });
    const shared = await studio.shareLink(script.id, "A", APP);
    if (!shared.ok) throw new Error(shared.reason);
    const opened = await studio.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(opened.message.glyphs.A!.strokes[0].length).toBeLessThan(60);
  });

  it("a single tap (a dot) survives as a dot", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, ".", [[{ x: 0.5, y: 0.7 }]]);
    const shared = await studio.shareLink(script.id, ".", APP);
    if (!shared.ok) throw new Error(shared.reason);
    const opened = await studio.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(opened.message.glyphs["."]!.strokes).toEqual([[{ x: 0.5, y: 0.703125 }]]);
  });

  it("sharing what was opened gives the very same link", async () => {
    const { studio, script } = await studioWithFingerDrawnScript(["H", "I"]);
    const first = await studio.shareLink(script.id, "HI", APP);
    if (!first.ok) throw new Error(first.reason);
    const opened = await studio.openShareLink(first.link);
    if (!opened.ok) throw new Error(opened.reason);
    // Draw the opened Glyphs into a fresh My Script and share again.
    const again = await studioWithMyScript();
    for (const [slot, glyph] of Object.entries(opened.message.glyphs)) {
      again.studio.saveGlyph(again.script.id, slot as GlyphSlot, glyph!.strokes);
    }
    const second = await again.studio.shareLink(again.script.id, "HI", APP);
    expect(second).toEqual(first);
  });

  it("an empty Message, or one of only spaces, has nothing to share", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H"] });
    expect(await studio.shareLink(script.id, "", APP)).toEqual({ ok: false, reason: "empty" });
    expect(await studio.shareLink(script.id, "   ", APP)).toEqual({ ok: false, reason: "empty" });
  });

  it("an unknown My Script can't be shared", async () => {
    const { studio } = await studioWithMyScript();
    expect(await studio.shareLink("no-such-script", "HI", APP)).toEqual({ ok: false, reason: "noScript" });
  });
});

describe("Sounds in the link", () => {
  const stroke: Stroke = [
    { x: 0.5, y: 0.2 },
    { x: 0.5, y: 0.8 },
  ];

  it("Dad's opened Glyphs carry his Sounds; those without one come back without", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.saveGlyph(script.id, "K", [stroke], "kla");
    studio.saveGlyph(script.id, "Z", [stroke], "zø 😀");
    studio.saveGlyph(script.id, "B", [stroke]);
    const shared = await studio.shareLink(script.id, "KZB", APP);
    if (!shared.ok) throw new Error(shared.reason);
    const opened = await studio.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(opened.message.glyphs.K!.sound).toBe("kla");
    expect(opened.message.glyphs.Z!.sound).toBe("zø 😀");
    expect(opened.message.glyphs.B).not.toHaveProperty("sound");
  });

  it("a link made before Sounds (version 1) still opens, with no Sounds", async () => {
    // Packed by the version 1 encoder: Sky Runes, "HI DAD", H and I each one down stroke.
    const v1Link = "https://example.com/#m1.4wzOrlQIKs1LLbbOv-jG5uGp4OLowsTOyKTAy-DDAaEA";
    const { studio } = await studioWithMyScript();
    const opened = await studio.openShareLink(v1Link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(opened.message).toMatchObject({ name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07, text: "HI DAD" });
    expect(Object.keys(opened.message.glyphs).sort()).toEqual(["H", "I"]);
    expect(opened.message.glyphs.H!.strokes).toHaveLength(1);
    expect(opened.message.glyphs.H).not.toHaveProperty("sound");
    expect(opened.message.glyphs.I).not.toHaveProperty("sound");
  });

  it("Sounds count towards the QR limit: a Message that fits without them is too long with them", async () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") as GlyphSlot[];
    const { studio, script } = await studioWithMyScript();
    for (const slot of letters) studio.saveGlyph(script.id, slot, [stroke]);
    expect((await studio.shareLink(script.id, letters.join(""), APP)).ok).toBe(true);
    // Full-length Sounds that don't compress away: pseudo-random CJK characters.
    let seed = 11;
    for (const slot of letters) {
      const sound = Array.from({ length: 12 }, () => {
        seed = (seed * 48271) % 2147483647;
        return String.fromCharCode(0x4e00 + (seed % 0x5000));
      }).join("");
      studio.saveGlyph(script.id, slot, [stroke], sound);
    }
    expect(await studio.shareLink(script.id, letters.join(""), APP)).toEqual({ ok: false, reason: "tooLong" });
  });
});

describe("too long for one QR code", () => {
  it("a short Message using a dozen finger-drawn Glyphs fits", async () => {
    const letters = ["H", "I", "D", "A", "L", "O", "V", "E", "Y", "U", "S", "T"] as const;
    const { studio, script } = await studioWithFingerDrawnScript(letters);
    const shared = await studio.shareLink(script.id, "HI DAD I LOVE YOU SO LOTS", APP);
    expect(shared.ok).toBe(true);
  });

  it("a Message using all 26 finger-drawn letters is too long", async () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") as GlyphSlot[];
    const { studio, script } = await studioWithFingerDrawnScript(letters);
    expect(await studio.shareLink(script.id, letters.join(""), APP)).toEqual({ ok: false, reason: "tooLong" });
  });

  it("a very long Message is too long even with no Glyphs drawn", async () => {
    const { studio, script } = await studioWithMyScript();
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
    let seed = 7;
    const text = Array.from({ length: 1500 }, () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return keys[seed % keys.length];
    }).join("");
    expect(await studio.shareLink(script.id, text, APP)).toEqual({ ok: false, reason: "tooLong" });
  });
});

describe("links that can't be opened", () => {
  async function aGoodLink(): Promise<string> {
    const { studio, script } = await studioWithFingerDrawnScript(["H", "I"]);
    const shared = await studio.shareLink(script.id, "HI DAD", APP);
    if (!shared.ok) throw new Error(shared.reason);
    return shared.link;
  }

  it.each([
    ["an empty link", ""],
    ["just the app", APP],
    ["just a #", APP + "#"],
    ["a fragment with no Message", APP + "#m1."],
    ["something that isn't a share link", APP + "#hello"],
    ["characters that aren't base64url", APP + "#m1.abc$%^"],
    ["base64url that isn't a packed Message", APP + "#m1.SGVsbG8gdGhlcmUgRGFk"],
  ])("%s gives a gentle couldn't open", async (_, link) => {
    const { studio } = await studioWithMyScript();
    expect(await studio.openShareLink(link)).toEqual({ ok: false, reason: "couldntOpen" });
  });

  it("a link cut off anywhere gives couldn't open, never an error", async () => {
    const link = await aGoodLink();
    const { studio } = await studioWithMyScript();
    const fragmentStart = link.indexOf("#") + 4;
    for (let end = fragmentStart; end < link.length; end += 7) {
      expect(await studio.openShareLink(link.slice(0, end))).toEqual({ ok: false, reason: "couldntOpen" });
    }
  });

  it("a link from an unknown (newer) version gives couldn't open", async () => {
    const link = await aGoodLink();
    const { studio } = await studioWithMyScript();
    expect(await studio.openShareLink(link.replace("#m2.", "#m3."))).toEqual({ ok: false, reason: "couldntOpen" });
  });

  it("the fragment alone opens too, with or without its #", async () => {
    const link = await aGoodLink();
    const { studio } = await studioWithMyScript();
    const fragment = link.slice(link.indexOf("#"));
    expect((await studio.openShareLink(fragment)).ok).toBe(true);
    expect((await studio.openShareLink(fragment.slice(1))).ok).toBe(true);
  });
});

describe("when the app opens in Reply mode", () => {
  it("a share link opens Reply mode, as the whole address or just its fragment", async () => {
    const { link, studio } = await shareAndOpen(["H"], "HI");
    expect(studio.isShareLink(link)).toBe(true);
    expect(studio.isShareLink(link.slice(link.indexOf("#")))).toBe(true);
  });

  it("a broken or newer-version share link still opens Reply mode, which then says it couldn't be opened", async () => {
    const { studio } = await studioWithMyScript();
    expect(studio.isShareLink("#m1.")).toBe(true);
    expect(studio.isShareLink("#m1.abc$%^")).toBe(true);
    expect(studio.isShareLink("#m3.SGVsbG8")).toBe(true);
  });

  it.each([
    ["no fragment", ""],
    ["just a #", "#"],
    ["the app's own address", APP],
    ["some other fragment", "#hello"],
    ["a fragment that only starts with m", "#menu"],
    ["an anchor-like fragment", "#top"],
  ])("%s starts the Studio as usual", async (_, link) => {
    const { studio } = await studioWithMyScript();
    expect(studio.isShareLink(link)).toBe(false);
  });
});

describe("Dad's reply", () => {
  it("Dad's reply is laid out in the shared Glyphs; phone characters that aren't slots stay plain", async () => {
    const { studio, message } = await shareAndOpen(["H", "I", "space"], "HI HI");
    expect(shapes(studio.sharedLayout(message, "hi Tom é!").cells)).toEqual([
      "glyph:H",
      "glyph:I",
      "glyph: ",
      "missingGlyph:T",
      "missingGlyph:O",
      "missingGlyph:M",
      "glyph: ",
      "plain:é",
      "missingGlyph:!",
    ]);
  });

  it("the reply is laid out with a fresh core that has no saved My Scripts (Dad's phone)", async () => {
    const { link } = await shareAndOpen(["H", "I"], "HI");
    const { studio: dadsPhone } = await studioWithMyScript();
    const opened = await dadsPhone.openShareLink(link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(shapes(dadsPhone.sharedLayout(opened.message, "hi").cells)).toEqual(["glyph:H", "glyph:I"]);
  });
});

// Keep the helper honest: it really makes heavy, many-point strokes.
it("fingerDrawnStrokes makes curvy strokes with many points", () => {
  const strokes = fingerDrawnStrokes(1);
  expect(strokes).toHaveLength(2);
  expect(strokes[0]).toHaveLength(40);
});
