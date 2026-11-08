import { describe, expect, it } from "vitest";
import type { GlyphSlot } from "./myScript";
import type { StudioCore } from "./studioCore";
import { inMemoryStudioStorage } from "./studioStorage";
import { AN_ACROSS_STROKE, fakeClock, loadedStudio, studioWithMyScript } from "./testing";

/** Types and saves a Message; throws if it isn't saved. */
function writeAndSave(studio: StudioCore, scriptId: string, text: string) {
  for (const char of text) studio.typeKey(scriptId, (char === " " ? "space" : char) as GlyphSlot);
  const result = studio.saveMessage(scriptId);
  if (!result.ok) throw new Error(`Couldn't save "${text}": ${result.reason}`);
  return result.message;
}

/** Everything he can see: every My Script with its Glyphs, every Message, the Settings. */
function everything(studio: StudioCore) {
  return {
    myScripts: studio.myScripts(),
    messages: studio.myScripts().map((s) => studio.messages(s.id)),
    settings: studio.settings(),
  };
}

/** A tablet with two My Scripts, some Glyphs, three Messages and changed Settings. */
async function aBusyTablet() {
  const clock = fakeClock();
  const storage = inMemoryStudioStorage();
  const { studio, script: sky } = await studioWithMyScript({ drawn: ["H", "I"], clock, storage });
  clock.advance(60_000);
  studio.saveGlyph(sky.id, "space", [AN_ACROSS_STROKE]);
  const made = studio.createMyScript({ name: "Moon Code", ink: "#8e44ad", strokeWidth: 0.1 });
  if (!made.ok) throw new Error("Couldn't make Moon Code");
  studio.saveGlyph(made.script.id, "7", [AN_ACROSS_STROKE]);
  writeAndSave(studio, sky.id, "HI MOM");
  clock.advance(60_000);
  writeAndSave(studio, sky.id, "HI DAD!");
  writeAndSave(studio, made.script.id, "777");
  studio.setMuted(true);
  studio.open({ name: "numberExplorer" }); // shows the hint, which marks it seen
  studio.goHome();
  await studio.saved();
  return { studio, storage, clock, sky, moon: made.script };
}

describe("Backup", () => {
  it("is one file named with the date", async () => {
    const { studio } = await aBusyTablet();
    expect(studio.makeBackup().fileName).toBe("secret-script-studio-backup-2026-11-07.json");
  });

  it("restoring it on a fresh tablet gives back every My Script, Glyph, Message and Setting", async () => {
    const { studio } = await aBusyTablet();
    const backup = studio.makeBackup();

    const storage = inMemoryStudioStorage();
    const fresh = await loadedStudio({ storage });
    fresh.setMuted(true); // this tablet is muted too, so the whole state should match
    expect(fresh.restoreBackup(backup.text)).toEqual({ ok: true, myScripts: 2, messages: 3 });
    expect(everything(fresh)).toEqual(everything(studio));
    expect(fresh.settings()).toEqual({ muted: true, numberHintSeen: true });

    await fresh.saved();
    const reloaded = await loadedStudio({ storage });
    expect(everything(reloaded)).toEqual(everything(studio));
    expect(reloaded.makeBackup().text).toBe(backup.text);
  });

  it("is plain JSON with the schema version of every record", async () => {
    const { studio } = await aBusyTablet();
    const file = JSON.parse(studio.makeBackup().text);
    expect(file).toMatchObject({ app: "secret-script-studio", schemaVersion: 1 });
    expect(file.myScripts).toHaveLength(2);
    expect(file.messages).toHaveLength(3);
    for (const record of [...file.myScripts, ...file.messages, file.settings]) expect(record.schemaVersion).toBe(1);
  });
});

describe("Restore merges by id", () => {
  it("adds what's in the file and keeps everything already on the tablet", async () => {
    const { studio: old } = await aBusyTablet();
    const backup = old.makeBackup().text;

    const clock = fakeClock();
    clock.advance(10 * 60_000);
    const { studio, script: newer } = await studioWithMyScript({ drawn: ["Z"], details: { name: "Newer", ink: "#2f8f5b", strokeWidth: 0.04 }, clock });
    writeAndSave(studio, newer.id, "ZZZ");

    expect(studio.restoreBackup(backup)).toEqual({ ok: true, myScripts: 2, messages: 3 });
    expect(studio.myScripts().map((s) => s.name)).toEqual(["Sky Runes", "Moon Code", "Newer"]);
    expect(studio.messages(newer.id).map((m) => m.text)).toEqual(["ZZZ"]);
  });

  it("overwrites a My Script or Message with the same id, and leaves the rest alone", async () => {
    const { studio, storage, clock, sky, moon } = await aBusyTablet();
    const backup = studio.makeBackup().text;
    const hiMom = studio.messages(sky.id).find((m) => m.text === "HI MOM")!;

    // After the backup he renames Sky Runes, redraws H, edits a Message and writes a new one.
    clock.advance(60_000);
    studio.renameMyScript(sky.id, "Sky Runes 2");
    studio.saveGlyph(sky.id, "H", [AN_ACROSS_STROKE]);
    studio.editMessage(hiMom.id);
    studio.typeKey(sky.id, "!");
    studio.saveMessage(sky.id);
    writeAndSave(studio, moon.id, "7 7");

    studio.restoreBackup(backup);
    const restoredSky = studio.myScript(sky.id)!;
    expect(restoredSky.name).toBe("Sky Runes");
    expect(restoredSky.glyphs.H!.strokes).not.toEqual([AN_ACROSS_STROKE]);
    expect(studio.message(hiMom.id)!.text).toBe("HI MOM");
    expect(studio.messages(moon.id).map((m) => m.text)).toEqual(["7 7", "777"]);

    await studio.saved();
    const reloaded = await loadedStudio({ storage });
    expect(everything(reloaded)).toEqual(everything(studio));
  });
});

describe("Restore and the Settings", () => {
  it("keeps the sound on this tablet the way it is now, whatever the file says", async () => {
    const { studio: muted } = await aBusyTablet();
    const mutedBackup = muted.makeBackup().text;
    const loud = await loadedStudio();
    loud.restoreBackup(mutedBackup);
    expect(loud.settings().muted).toBe(false);

    const quiet = await loadedStudio();
    const unmutedBackup = quiet.makeBackup().text;
    quiet.setMuted(true);
    quiet.restoreBackup(unmutedBackup);
    expect(quiet.settings().muted).toBe(true);
  });

  it("the 'Try fewer digits!' hint counts as seen if either the tablet or the file has seen it", async () => {
    const { studio: seen } = await aBusyTablet();
    const seenBackup = seen.makeBackup().text;
    const storage = inMemoryStudioStorage();
    const fresh = await loadedStudio({ storage });
    fresh.restoreBackup(seenBackup);
    expect(fresh.settings().numberHintSeen).toBe(true);
    await fresh.saved();
    expect((await loadedStudio({ storage })).settings()).toEqual({ muted: false, numberHintSeen: true });

    const notSeenBackup = (await loadedStudio()).makeBackup().text;
    seen.restoreBackup(notSeenBackup);
    expect(seen.settings()).toEqual({ muted: true, numberHintSeen: true });
  });
});

describe("a file that isn't a good backup", () => {
  async function tryRestoring(text: string) {
    const { studio, storage } = await aBusyTablet();
    const before = everything(studio);
    const backupBefore = studio.makeBackup().text;
    const result = studio.restoreBackup(text);
    await studio.saved();
    expect(everything(studio)).toEqual(before);
    expect((await loadedStudio({ storage })).makeBackup().text).toBe(backupBefore);
    return result;
  }

  async function goodBackup() {
    const { studio } = await aBusyTablet();
    return JSON.parse(studio.makeBackup().text);
  }

  const unreadable = { ok: false, reason: "unreadable" };

  it("isn't JSON at all (a photo, a cut-off file)", async () => {
    expect(await tryRestoring("\u0089PNG\r\n")).toEqual(unreadable);
    expect(await tryRestoring("")).toEqual(unreadable);
    const text = (await aBusyTablet()).studio.makeBackup().text;
    expect(await tryRestoring(text.slice(0, text.length / 2))).toEqual(unreadable);
  });

  it("is JSON but not a Secret Script Studio backup", async () => {
    expect(await tryRestoring("null")).toEqual(unreadable);
    expect(await tryRestoring("[]")).toEqual(unreadable);
    expect(await tryRestoring(JSON.stringify({ schemaVersion: 2, monsters: [] }))).toEqual(unreadable);
  });

  it("comes from a newer (or unknown) version of the app", async () => {
    const file = await goodBackup();
    expect(await tryRestoring(JSON.stringify({ ...file, schemaVersion: 2 }))).toEqual(unreadable);
    file.myScripts[1].schemaVersion = 99;
    expect(await tryRestoring(JSON.stringify(file))).toEqual(unreadable);
  });

  it("is missing a part, or a part has the wrong shape (and nothing in it is restored)", async () => {
    const breakages: ((file: any) => void)[] = [
      (f) => delete f.myScripts,
      (f) => delete f.messages,
      (f) => delete f.settings,
      (f) => (f.settings.muted = "yes"),
      (f) => delete f.myScripts[0].name,
      (f) => (f.myScripts[0].name = "   "),
      (f) => (f.myScripts[0].id = 7),
      (f) => (f.myScripts[0].ink = "hotpink"),
      (f) => (f.myScripts[0].strokeWidth = 5),
      (f) => (f.myScripts[0].createdAt = "yesterday"),
      (f) => (f.myScripts[0].glyphs = []),
      (f) => (f.myScripts[0].glyphs.Q9 = f.myScripts[0].glyphs.H),
      (f) => (f.myScripts[0].glyphs.H.strokes = [[{ x: 0.5 }]]),
      (f) => (f.myScripts[0].glyphs.H.strokes = [[{ x: 0.5, y: 2 }]]),
      (f) => (f.myScripts[0].glyphs.H.strokes = [[]]),
      (f) => delete f.myScripts[0].glyphs.H.updatedAt,
      (f) => f.myScripts.push(f.myScripts[0]),
      (f) => delete f.messages[0].text,
      (f) => (f.messages[0].scriptId = "script-nobody"),
      (f) => (f.messages[0].updatedAt = null),
      (f) => f.messages.push(f.messages[0]),
    ];
    for (const breakIt of breakages) {
      const file = await goodBackup();
      breakIt(file);
      expect(await tryRestoring(JSON.stringify(file)), breakIt.toString()).toEqual(unreadable);
    }
  });
});
