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
