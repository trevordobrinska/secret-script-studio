import { describe, expect, it } from "vitest";
import type { StudioCore } from "./studioCore";
import type { MyScript } from "./myScript";
import { A_DOWN_STROKE, studioWithMyScript } from "./testing";

/** What the English voice says at the Library's tap-to-hear speed. */
const english = (text: string) => ({ kind: "speak", speech: { text, lang: "en", rate: 0.8 } });

/** Draws each slot with its Sound, then returns the My Script as it is now. */
function withSounds(studio: StudioCore, script: MyScript, sounds: Record<string, string>): MyScript {
  for (const [slot, sound] of Object.entries(sounds)) {
    studio.saveGlyph(script.id, slot as never, [A_DOWN_STROKE], sound);
  }
  return studio.myScript(script.id)!;
}

describe("Read it to me", () => {
  it("glues a word's Sounds into one spoken word", async () => {
    const { studio, script } = await studioWithMyScript();
    const glyphs = withSounds(studio, script, { K: "kla", Z: "zo" }).glyphs;
    expect(studio.readItToMe("KZ", glyphs)).toEqual(english("klazo"));
  });

  it("pauses at each space and keeps each punctuation mark after its word", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["space", "!"] });
    const glyphs = withSounds(studio, script, { K: "kla", Z: "zo", O: "om" }).glyphs;
    expect(studio.readItToMe("KZ  O, ZO! K?", glyphs)).toEqual(english("klazo om, zoom! kla?"));
  });

  it("adds the plain lowercase letter for a Glyph with no Sound and for a Missing Glyph", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["B"] });
    const glyphs = withSounds(studio, script, { K: "kla", Z: "zo" }).glyphs;
    expect(studio.readItToMe("KBZ KQZ", glyphs)).toEqual(english("klabzo klaqzo"));
  });

  it("reads digits by their Sounds, or as the plain digit", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["2"] });
    const glyphs = withSounds(studio, script, { "7": "zeb" }).glyphs;
    expect(studio.readItToMe("72 39", glyphs)).toEqual(english("zeb2 39"));
  });

  it("says nothing while muted", async () => {
    const { studio, script } = await studioWithMyScript();
    const glyphs = withSounds(studio, script, { K: "kla" }).glyphs;
    studio.setMuted(true);
    expect(studio.readItToMe("K K", glyphs)).toEqual({ kind: "muted" });
  });

  it("says the same in Secret mode", async () => {
    const { studio, script } = await studioWithMyScript();
    const glyphs = withSounds(studio, script, { K: "kla", Z: "zo" }).glyphs;
    studio.setSecretMode(true);
    expect(studio.readItToMe("KZ B", glyphs)).toEqual(english("klazo b"));
  });

  it("reads a SharedMessage in its Sounds on Dad's phone, and Dad's reply too, lowercase typing included", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["I"] });
    withSounds(studio, script, { H: "kla", D: "zo" });
    const shared = await studio.shareLink(script.id, "HI DAD", "https://example.com/");
    if (!shared.ok) throw new Error(shared.reason);
    const { studio: dadsPhone } = await studioWithMyScript();
    const opened = await dadsPhone.openShareLink(shared.link);
    if (!opened.ok) throw new Error(opened.reason);
    expect(dadsPhone.readItToMe(opened.message.text, opened.message.glyphs)).toEqual(english("klai zoazo"));
    expect(dadsPhone.readItToMe("ok hi!", opened.message.glyphs)).toEqual(english("ok klai!"));
  });

  it("has nothing to say for an empty Message", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.readItToMe("", script.glyphs)).toBeUndefined();
    expect(studio.readItToMe("   ", script.glyphs)).toBeUndefined();
  });
});
