import { describe, expect, it } from "vitest";
import { inMemoryStudioStorage, SETTINGS_SCHEMA_VERSION, type StudioStorage } from "./studioStorage";
import { loadedStudio } from "./testing";

describe("Mute", () => {
  it("turns the sounds off", async () => {
    const studio = await loadedStudio();
    studio.setMuted(true);
    expect(studio.settings().muted).toBe(true);
  });

  it("turns the sounds back on", async () => {
    const studio = await loadedStudio();
    studio.setMuted(true);
    studio.setMuted(false);
    expect(studio.settings().muted).toBe(false);
  });

  it("is remembered after the app reloads", async () => {
    const storage = inMemoryStudioStorage();
    const studio = await loadedStudio({ storage });
    studio.setMuted(true);
    await studio.saved();
    const reloaded = await loadedStudio({ storage });
    expect(reloaded.settings().muted).toBe(true);
  });

  it("leaves the Number Explorer hint setting as it was", async () => {
    const storage = inMemoryStudioStorage();
    await storage.saveSettings({ schemaVersion: SETTINGS_SCHEMA_VERSION, muted: false, numberHintSeen: true });
    const studio = await loadedStudio({ storage });
    studio.setMuted(true);
    await studio.saved();
    expect((await loadedStudio({ storage })).settings()).toEqual({ muted: true, numberHintSeen: true });
  });

  it("still works for this visit if storage can't be written", async () => {
    const broken: StudioStorage = {
      loadSettings: async () => undefined,
      saveSettings: () => Promise.reject(new Error("storage is full")),
      listMyScripts: async () => [],
      saveMyScript: () => Promise.reject(new Error("storage is full")),
    };
    const studio = await loadedStudio({ storage: broken });
    studio.setMuted(true);
    await studio.saved();
    expect(studio.settings().muted).toBe(true);
  });
});
