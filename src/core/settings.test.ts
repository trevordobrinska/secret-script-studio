import { describe, expect, it } from "vitest";
import { inMemoryStudioStorage, SETTINGS_SCHEMA_VERSION, type StudioStorage } from "./studioStorage";
import { loadedStudio, newStudio } from "./testing";

describe("Settings", () => {
  it("on a fresh tablet, sound is on and the Number Explorer hint hasn't been seen", async () => {
    const studio = await loadedStudio();
    expect(studio.settings()).toEqual({ muted: false, numberHintSeen: false });
  });

  it("are the defaults even before loading finishes", () => {
    expect(newStudio().settings()).toEqual({ muted: false, numberHintSeen: false });
  });

  it("saved earlier on the tablet come back when the app loads", async () => {
    const storage = inMemoryStudioStorage();
    await storage.saveSettings({ schemaVersion: SETTINGS_SCHEMA_VERSION, muted: true, numberHintSeen: true });
    const studio = await loadedStudio({ storage });
    expect(studio.settings()).toEqual({ muted: true, numberHintSeen: true });
  });

  it("fall back to the defaults, without an error, if storage can't be read", async () => {
    const broken: StudioStorage = {
      loadSettings: () => Promise.reject(new Error("storage is unavailable")),
      saveSettings: () => Promise.reject(new Error("storage is unavailable")),
    };
    const studio = await loadedStudio({ storage: broken });
    expect(studio.settings()).toEqual({ muted: false, numberHintSeen: false });
  });
});
