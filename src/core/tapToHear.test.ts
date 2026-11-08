import { describe, expect, it } from "vitest";
import { newStudio } from "./testing";
import type { StudioCore, WorldCharacter, WorldNumeral } from "./studioCore";

/** The voice languages a typical Windows Edge has, with Greek but no Runic, Korean or Japanese. */
const EDGE_VOICES = ["en-US", "en-GB", "el-GR", "de-DE"];

function character(studio: StudioCore, scriptId: string, text: string): WorldCharacter {
  const found = studio.worldScript(scriptId)?.characters.find((c) => c.text === text);
  if (!found) throw new Error(`No ${text} in ${scriptId}`);
  return found;
}

function numeral(studio: StudioCore, scriptId: string, text: string): WorldNumeral {
  const found = studio.worldScript(scriptId)?.numerals.find((n) => n.text === text);
  if (!found) throw new Error(`No numeral ${text} in ${scriptId}`);
  return found;
}

describe("Tapping a World Character to hear it", () => {
  it("says a Greek letter in Greek when the tablet has a Greek voice", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("greek", character(studio, "greek", "Λ λ"), EDGE_VOICES);
    expect(tap).toEqual({ kind: "speak", speech: { text: "Λ", lang: "el", rate: 0.8 } });
  });

  it("matches the voice on its language alone, so a plain el voice speaks Greek too", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("greek", character(studio, "greek", "Λ λ"), ["el"]);
    expect(tap?.kind === "speak" && tap.speech.lang).toBe("el");
  });

  it("says the letter's name in English when the tablet has no voice for its language, never its sound", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("greek", character(studio, "greek", "Θ θ"), ["en-US", "fr-FR"]);
    expect(tap).toEqual({ kind: "speak", speech: { text: "theta", lang: "en", rate: 0.8 } });
  });

  it("says runes in English even when every voice is there, because no device speaks them", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("elder-futhark", studio.worldScript("elder-futhark")!.characters[0]!, [
      ...EDGE_VOICES,
      "ko-KR",
      "ja-JP",
      "is-IS",
      "no-NO",
    ]);
    expect(tap).toEqual({ kind: "speak", speech: { text: "fehu", lang: "en", rate: 0.8 } });
  });

  it("reads only the first form of a letter written several ways (Σ σ ς reads Σ)", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("greek", character(studio, "greek", "Σ σ ς"), EDGE_VOICES);
    expect(tap?.kind === "speak" && tap.speech.text).toBe("Σ");
  });

  it("reads a letter's own `say` instead when it reads badly alone, like a Thai vowel sign", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("thai", character(studio, "thai", "ะ"), ["th-TH"]);
    expect(tap).toEqual({ kind: "speak", speech: { text: "สระอะ", lang: "th", rate: 0.8 } });
  });

  it("still says the English name, not the `say`, without a Thai voice", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("thai", character(studio, "thai", "ะ"), ["en-US"]);
    expect(tap?.kind === "speak" && tap.speech.text).toBe("sara a");
  });

  it("says a writing system's numeral in its own language", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("devanagari", numeral(studio, "devanagari", "५"), ["hi-IN", "en-US"]);
    expect(tap).toEqual({ kind: "speak", speech: { text: "५", lang: "hi", rate: 0.8 } });
  });

  it("says a numeral's value in English when there's no voice for its language", () => {
    const studio = newStudio();
    const tap = studio.worldCharacterTap("devanagari", numeral(studio, "devanagari", "५"), ["en-US"]);
    expect(tap).toEqual({ kind: "speak", speech: { text: "5", lang: "en", rate: 0.8 } });
  });

  it("says Roman, Mayan and Babylonian numerals' values in English, whatever voices there are", () => {
    const studio = newStudio();
    const allVoices = [...EDGE_VOICES, "it-IT", "la", "es-MX", "ar-IQ"];
    const said = (id: string, text: string) => {
      const tap = studio.worldCharacterTap(id, numeral(studio, id, text), allVoices);
      return tap?.kind === "speak" ? [tap.speech.text, tap.speech.lang] : undefined;
    };
    expect(said("roman", "X")).toEqual(["10", "en"]);
    expect(said("mayan", "\u{1D2F3}")).toEqual(["19", "en"]);
    expect(said("babylonian", "\u{1230B}")).toEqual(["10", "en"]);
  });

  it("tells a Hebrew letter from the same letter as a numeral", () => {
    const studio = newStudio();
    const asLetter = studio.worldCharacterTap("hebrew", character(studio, "hebrew", "י"), ["en-US"]);
    const asNumeral = studio.worldCharacterTap("hebrew", numeral(studio, "hebrew", "י"), ["en-US"]);
    expect(asLetter?.kind === "speak" && asLetter.speech.text).toBe("yod");
    expect(asNumeral?.kind === "speak" && asNumeral.speech.text).toBe("10");
  });

  it("does nothing for an unknown World Script, or a character that isn't on its page", () => {
    const studio = newStudio();
    const lambda = character(studio, "greek", "Λ λ");
    expect(studio.worldCharacterTap("klingon", lambda, EDGE_VOICES)).toBeUndefined();
    expect(studio.worldCharacterTap("cyrillic", lambda, EDGE_VOICES)).toBeUndefined();
  });

  it("speaks each script in the language the spec gives it", () => {
    const voices: Record<string, string | undefined> = {};
    for (const script of newStudio().library()) voices[script.id] = script.voice;
    expect(voices).toMatchObject({
      ...{ greek: "el", cyrillic: "ru", hangul: "ko", hebrew: "he", arabic: "ar", devanagari: "hi" },
      ...{ georgian: "ka", armenian: "hy", hiragana: "ja", katakana: "ja", thai: "th", ethiopic: "am" },
      ...{ "chinese-numerals": "zh", "eastern-arabic": "ar" },
      ...{ "elder-futhark": undefined, ogham: undefined, cherokee: undefined, tifinagh: undefined },
      ...{ roman: undefined, mayan: undefined, babylonian: undefined },
    });
  });
});
