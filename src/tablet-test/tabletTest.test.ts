// THROWAWAY (ticket 02): delete with the rest of src/tablet-test/.
import { describe, expect, it } from "vitest";
import { FONT_SAMPLES } from "./fontSamples";
import { describeAge } from "./visitLog";

describe("tablet test font check", () => {
  it("covers every World Script and numeral system from the spec", () => {
    const scripts = ["Greek", "Cyrillic", "Hangul", "Hebrew", "Arabic", "Devanagari", "Georgian", "Armenian", "Hiragana", "Katakana", "Elder Futhark runes", "Ogham", "Thai", "Ethiopic", "Cherokee", "Tifinagh"];
    const numerals = ["Roman", "Mayan", "Babylonian", "Chinese", "Eastern Arabic", "Devanagari"];
    expect(FONT_SAMPLES.filter((f) => f.kind === "script").map((f) => f.name)).toEqual(scripts);
    expect(FONT_SAMPLES.filter((f) => f.kind === "numerals").map((f) => f.name)).toEqual(numerals);
    for (const f of FONT_SAMPLES) expect(f.sample.trim().length).toBeGreaterThan(0);
  });
});

describe("tablet test storage age", () => {
  it("describes seconds, minutes, hours and days", () => {
    expect(describeAge(0, 5_000)).toBe("5s ago");
    expect(describeAge(0, 3 * 60_000)).toBe("3 min ago");
    expect(describeAge(0, 5 * 3_600_000)).toBe("5 h ago");
    expect(describeAge(0, 3 * 86_400_000)).toBe("3 days ago");
  });
});
