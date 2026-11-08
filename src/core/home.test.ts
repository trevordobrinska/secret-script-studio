import { describe, expect, it } from "vitest";
import { newStudio } from "./testing";

describe("the home screen", () => {
  it("is where the app opens", () => {
    const studio = newStudio();
    expect(studio.screen()).toEqual({ name: "home" });
  });

  it("has three tiles, always in the same order: My Scripts, Library, Number Explorer", () => {
    const studio = newStudio();
    expect(studio.homeTiles()).toEqual(["myScripts", "library", "numberExplorer"]);
  });

  it("opens each section one tap from home, and the home button comes back", () => {
    const studio = newStudio();
    for (const section of ["myScripts", "library", "numberExplorer"] as const) {
      studio.open({ name: section });
      expect(studio.screen()).toEqual({ name: section });
      studio.goHome();
      expect(studio.screen()).toEqual({ name: "home" });
    }
  });
});
