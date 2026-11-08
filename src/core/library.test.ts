import { describe, expect, it } from "vitest";
import { newStudio } from "./testing";

describe("the Library", () => {
  it("lists World Scripts, starting with Greek, Cyrillic and Roman numerals", () => {
    const ids = newStudio()
      .library()
      .map((script) => script.id);
    expect(ids).toEqual(expect.arrayContaining(["greek", "cyrillic", "roman"]));
  });

  it("gives every World Script a unique id", () => {
    const ids = newStudio()
      .library()
      .map((script) => script.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every World Script a name and at least one character or numeral", () => {
    for (const script of newStudio().library()) {
      expect(script.name.trim(), script.id).not.toBe("");
      expect(script.characters.length + script.numerals.length, script.id).toBeGreaterThan(0);
    }
  });

  it("gives every World Script an About", () => {
    for (const script of newStudio().library()) {
      expect(script.about?.trim(), script.id).toBeTruthy();
    }
  });

  it("tells where Greek comes from in its About", () => {
    expect(newStudio().worldScript("greek")?.about).toMatch(/Greece/);
  });

  it("gives every writing system at least one character, each with a name and sound", () => {
    for (const script of newStudio().library()) {
      if (script.kind !== "writing") continue;
      expect(script.characters.length, script.id).toBeGreaterThan(0);
      for (const character of script.characters) {
        expect(character.text.trim(), script.id).not.toBe("");
        expect(character.name.trim(), `${script.id} ${character.text}`).not.toBe("");
        expect(character.sound.trim(), `${script.id} ${character.text}`).not.toBe("");
      }
    }
  });

  it("gives numerals whole-number values", () => {
    for (const script of newStudio().library()) {
      for (const numeral of script.numerals) {
        expect(numeral.text.trim(), script.id).not.toBe("");
        expect(Number.isInteger(numeral.value) && numeral.value >= 0, `${script.id} ${numeral.text}`).toBe(true);
      }
    }
  });

  it("has numeral-only systems that show only numerals", () => {
    const roman = newStudio().worldScript("roman");
    expect(roman?.kind).toBe("numerals");
    expect(roman?.characters).toEqual([]);
    expect(roman?.numerals).toContainEqual({ text: "X", value: 10 });
  });

  it("shows a character's name and sound, like Λ — lambda — L", () => {
    const greek = newStudio().worldScript("greek");
    expect(greek?.characters).toContainEqual(expect.objectContaining({ text: "Λ λ", name: "lambda", sound: "L" }));
  });

  it("holds every World Script and numeral system from the spec, and not the enchanting-table alphabet", () => {
    const ids = newStudio()
      .library()
      .map((script) => script.id);
    expect([...ids].sort()).toEqual(
      [
        ...["greek", "cyrillic", "hangul", "hebrew", "arabic", "devanagari", "georgian", "armenian"],
        ...["hiragana", "katakana", "elder-futhark", "ogham", "thai", "ethiopic", "cherokee", "tifinagh"],
        ...["roman", "mayan", "babylonian", "chinese-numerals", "eastern-arabic"],
        // Library V1.1 writing systems (ticket 04)
        ...["glagolitic", "coptic", "gothic", "phoenician", "younger-futhark", "canadian-syllabics"],
        ...["tibetan", "bengali", "tamil", "linear-b", "egyptian-hieroglyphs"],
      ].sort(),
    );
    expect(ids.join(" ")).not.toMatch(/enchant|galactic/i);
  });

  // Catches look-alike typos (a Latin "A" in Greek, a Cyrillic letter in Armenian…): every character
  // must come from that script's own Unicode letters.
  const OWN_LETTERS: Record<string, RegExp> = {
    greek: /^[\p{Script=Greek}\s]+$/u,
    cyrillic: /^[\p{Script=Cyrillic}\s]+$/u,
    hangul: /^[\p{Script=Hangul}\s]+$/u,
    hebrew: /^[\p{Script=Hebrew}\s]+$/u,
    arabic: /^[\p{Script=Arabic}\s]+$/u,
    devanagari: /^[\p{Script=Devanagari}\s]+$/u,
    georgian: /^[\p{Script=Georgian}\s]+$/u,
    armenian: /^[\p{Script=Armenian}\s]+$/u,
    hiragana: /^[\p{Script=Hiragana}\s]+$/u,
    katakana: /^[\p{Script=Katakana}\s]+$/u,
    "elder-futhark": /^[\p{Script=Runic}\s]+$/u,
    ogham: /^[\p{Script=Ogham}\s]+$/u,
    thai: /^[\p{Script=Thai}\s]+$/u,
    ethiopic: /^[\p{Script=Ethiopic}\s]+$/u,
    cherokee: /^[\p{Script=Cherokee}\s]+$/u,
    tifinagh: /^[\p{Script=Tifinagh}\s]+$/u,
    roman: /^[IVXLCDM]+$/,
    mayan: /^[\u{1D2E0}-\u{1D2F3}]$/u,
    babylonian: /^\p{Script=Cuneiform}+$/u,
    "chinese-numerals": /^\p{Script=Han}+$/u,
    "eastern-arabic": /^[٠-٩]+$/u,
    // Library V1.1 writing systems (ticket 04)
    glagolitic: /^[\p{Script=Glagolitic}\s]+$/u,
    coptic: /^[\p{Script=Coptic}\s]+$/u,
    gothic: /^[\p{Script=Gothic}\s]+$/u,
    phoenician: /^[\p{Script=Phoenician}\s]+$/u,
    "younger-futhark": /^[\p{Script=Runic}\s]+$/u,
    "canadian-syllabics": /^[\p{Script=Canadian_Aboriginal}\s]+$/u,
    tibetan: /^[\p{Script=Tibetan}\s]+$/u,
    bengali: /^[\p{Script=Bengali}\s]+$/u,
    tamil: /^[\p{Script=Tamil}\s]+$/u,
    "linear-b": /^[\p{Script=Linear_B}\s]+$/u,
    "egyptian-hieroglyphs": /^[\p{Script=Egyptian_Hieroglyphs}\s]+$/u,
  };

  it("writes every character and numeral in its own script's letters", () => {
    for (const script of newStudio().library()) {
      const own = OWN_LETTERS[script.id];
      expect(own, `no check for ${script.id}`).toBeDefined();
      for (const { text } of [...script.characters, ...script.numerals]) {
        expect(text, script.id).toMatch(own!);
      }
    }
  });

  it("never shows the same character twice in one World Script", () => {
    for (const script of newStudio().library()) {
      const texts = script.characters.map((character) => character.text);
      expect(new Set(texts).size, script.id).toBe(texts.length);
      const numerals = script.numerals.map((numeral) => numeral.text);
      expect(new Set(numerals).size, script.id).toBe(numerals.length);
    }
  });

  it("gives the numerals their real values", () => {
    const studio = newStudio();
    const numeral = (id: string, text: string) => studio.worldScript(id)?.numerals.find((n) => n.text === text)?.value;
    expect(numeral("mayan", "\u{1D2E0}")).toBe(0);
    expect(numeral("mayan", "\u{1D2F3}")).toBe(19);
    expect(numeral("babylonian", "\u{12079}")).toBe(1);
    expect(numeral("babylonian", "\u{1230B}")).toBe(10);
    expect(numeral("chinese-numerals", "七")).toBe(7);
    expect(numeral("chinese-numerals", "千")).toBe(1000);
    expect(numeral("eastern-arabic", "٧")).toBe(7);
    expect(numeral("arabic", "٤")).toBe(4);
    expect(numeral("devanagari", "५")).toBe(5);
    expect(numeral("thai", "๓")).toBe(3);
    expect(numeral("ethiopic", "፲")).toBe(10);
    expect(numeral("hebrew", "י")).toBe(10);
    expect(numeral("hebrew", "ת")).toBe(400);
    expect(numeral("bengali", "৭")).toBe(7);
    expect(numeral("tamil", "௪")).toBe(4);
  });

  it("speaks Bengali, Tamil and Tibetan in their own languages, and the old scripts in English", () => {
    const studio = newStudio();
    expect(studio.worldScript("bengali")?.voice).toBe("bn");
    expect(studio.worldScript("tamil")?.voice).toBe("ta");
    expect(studio.worldScript("tibetan")?.voice).toBe("bo");
    for (const id of ["glagolitic", "coptic", "gothic", "phoenician", "younger-futhark", "canadian-syllabics", "linear-b", "egyptian-hieroglyphs"]) {
      expect(studio.worldScript(id)?.voice, id).toBeUndefined();
    }
  });

  it("marks Hebrew and Arabic as written right to left, and the rest left to right", () => {
    const studio = newStudio();
    expect(studio.worldScript("hebrew")?.direction).toBe("rtl");
    expect(studio.worldScript("arabic")?.direction).toBe("rtl");
    expect(studio.worldScript("greek")?.direction).toBeUndefined();
    expect(studio.worldScript("hangul")?.direction).toBeUndefined();
  });

  it("gives every voice a well-formed language tag (el, ko, or el-GR style)", () => {
    for (const script of newStudio().library()) {
      if (script.voice !== undefined) expect(script.voice, script.id).toMatch(/^[a-z]{2,3}(-[A-Z]{2})?$/);
    }
  });

  it("gives any `say` some text to read", () => {
    for (const script of newStudio().library()) {
      for (const character of script.characters) {
        if (character.say !== undefined) expect(character.say.trim(), `${script.id} ${character.text}`).not.toBe("");
      }
    }
  });

  it("finds nothing for an unknown World Script", () => {
    expect(newStudio().worldScript("klingon")).toBeUndefined();
  });

  it("opens a World Script page from the list, and home comes back", () => {
    const studio = newStudio();
    studio.open({ name: "library" });
    studio.open({ name: "worldScript", scriptId: "greek" });
    expect(studio.screen()).toEqual({ name: "worldScript", scriptId: "greek" });
    studio.goHome();
    expect(studio.screen()).toEqual({ name: "home" });
  });
});
