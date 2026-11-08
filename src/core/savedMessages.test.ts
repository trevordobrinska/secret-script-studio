import { describe, expect, it } from "vitest";
import type { GlyphSlot } from "./myScript";
import type { StudioCore } from "./studioCore";
import { inMemoryStudioStorage } from "./studioStorage";
import { A_DAY, AN_ACROSS_STROKE, A_DOWN_STROKE, fakeClock, loadedStudio, studioWithMyScript } from "./testing";

/** Types text on the Glyph keyboard, one key per character. */
function type(studio: StudioCore, scriptId: string, text: string): void {
  for (const char of text) studio.typeKey(scriptId, (char === " " ? "space" : char) as GlyphSlot);
}

/** Types and saves a Message; throws if it isn't saved. */
function writeAndSave(studio: StudioCore, scriptId: string, text: string) {
  type(studio, scriptId, text);
  const result = studio.saveMessage(scriptId);
  if (!result.ok) throw new Error(`Couldn't save "${text}": ${result.reason}`);
  return result.message;
}

describe("saving a Message", () => {
  it("he writes HI MOM and saves it: it's in his diary and the Write screen is empty again", async () => {
    const { studio, script } = await studioWithMyScript();
    type(studio, script.id, "HI MOM");
    const result = studio.saveMessage(script.id);
    expect(result).toMatchObject({ ok: true });
    expect(studio.messages(script.id)).toEqual([
      { id: expect.any(String), scriptId: script.id, text: "HI MOM", createdAt: A_DAY, updatedAt: A_DAY },
    ]);
    expect(studio.draft(script.id)).toBe("");
  });

  it("doesn't save an empty Message or one that is only spaces", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.saveMessage(script.id)).toEqual({ ok: false, reason: "empty" });
    type(studio, script.id, "  ");
    expect(studio.saveMessage(script.id)).toEqual({ ok: false, reason: "empty" });
    expect(studio.messages(script.id)).toEqual([]);
    expect(studio.saveMessage("no-such-script")).toEqual({ ok: false, reason: "noScript" });
  });
});

describe("the diary (a My Script's list of Messages)", () => {
  it("shows the newest Message first", async () => {
    const clock = fakeClock();
    const { studio, script } = await studioWithMyScript({ clock });
    writeAndSave(studio, script.id, "FIRST");
    clock.advance(60_000);
    writeAndSave(studio, script.id, "SECOND");
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["SECOND", "FIRST"]);
  });

  it("two Messages saved in the same instant still both show, the later one first", async () => {
    const { studio, script } = await studioWithMyScript();
    writeAndSave(studio, script.id, "ONE");
    writeAndSave(studio, script.id, "TWO");
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["TWO", "ONE"]);
  });

  it("keeps each My Script's Messages in its own diary", async () => {
    const { studio, script } = await studioWithMyScript();
    const other = studio.createMyScript({ name: "Moon Marks", ink: "#c0392b", strokeWidth: 0.1 });
    if (!other.ok) throw new Error("setup");
    writeAndSave(studio, script.id, "SKY");
    writeAndSave(studio, other.script.id, "MOON");
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["SKY"]);
    expect(studio.messages(other.script.id).map((m) => m.text)).toEqual(["MOON"]);
    expect(studio.messages("no-such-script")).toEqual([]);
  });
});

describe("editing a saved Message", () => {
  it("he opens HI MOM, changes it to HI DAD and saves: the same Message is updated, not a new one", async () => {
    const clock = fakeClock();
    const { studio, script } = await studioWithMyScript({ clock });
    const saved = writeAndSave(studio, script.id, "HI MOM");

    clock.advance(60_000);
    expect(studio.editMessage(saved.id)).toBe("editing");
    expect(studio.draft(script.id)).toBe("HI MOM");
    expect(studio.editingMessage(script.id)).toBe(saved.id);
    for (let i = 0; i < 3; i++) studio.backspace(script.id);
    type(studio, script.id, "DAD");
    expect(studio.saveMessage(script.id)).toMatchObject({ ok: true });

    expect(studio.messages(script.id)).toEqual([
      { id: saved.id, scriptId: script.id, text: "HI DAD", createdAt: A_DAY, updatedAt: A_DAY + 60_000 },
    ]);
    expect(studio.draft(script.id)).toBe("");
    expect(studio.editingMessage(script.id)).toBeUndefined();
  });

  it("starting a new Message instead (clearing the draft) saves a second Message", async () => {
    const { studio, script } = await studioWithMyScript();
    const saved = writeAndSave(studio, script.id, "ONE");
    studio.editMessage(saved.id);
    studio.clearDraft(script.id);
    expect(studio.draft(script.id)).toBe("");
    expect(studio.editingMessage(script.id)).toBeUndefined();
    writeAndSave(studio, script.id, "TWO");
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["TWO", "ONE"]);
  });

  it("setDraft folds the text like typing does", async () => {
    const { studio, script } = await studioWithMyScript();
    studio.setDraft(script.id, "hi\tmom");
    expect(studio.draft(script.id)).toBe("HI MOM");
    expect(studio.editingMessage(script.id)).toBeUndefined();
  });

  it("editing a Message that doesn't exist does nothing", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.editMessage("nope")).toBe("noMessage");
    expect(studio.draft(script.id)).toBe("");
  });
});

describe("deleting a saved Message", () => {
  it("it's gone from the diary, and stays gone after reopening the app", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage });
    writeAndSave(studio, script.id, "KEEP");
    const doomed = writeAndSave(studio, script.id, "BIN");

    expect(studio.deleteMessage(doomed.id)).toBe("deleted");
    expect(studio.message(doomed.id)).toBeUndefined();
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["KEEP"]);
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.messages(script.id).map((m) => m.text)).toEqual(["KEEP"]);
  });

  it("deleting one that doesn't exist does nothing", async () => {
    const { studio } = await studioWithMyScript();
    expect(studio.deleteMessage("nope")).toBe("noMessage");
  });

  it("if he was editing it, his draft stays but now saves as a new Message", async () => {
    const { studio, script } = await studioWithMyScript();
    const saved = writeAndSave(studio, script.id, "OLD");
    studio.editMessage(saved.id);
    studio.deleteMessage(saved.id);
    expect(studio.draft(script.id)).toBe("OLD");
    expect(studio.editingMessage(script.id)).toBeUndefined();
    expect(studio.saveMessage(script.id)).toMatchObject({ ok: true, message: { text: "OLD" } });
    expect(studio.messages(script.id).map((m) => m.text)).toEqual(["OLD"]);
  });
});

describe("redrawing a Glyph", () => {
  it("every saved Message shows the new shape at once", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H", "I"] });
    const saved = writeAndSave(studio, script.id, "HI");

    studio.saveGlyph(script.id, "H", [AN_ACROSS_STROKE]);
    const cells = studio.messageLayout(script.id, studio.message(saved.id)!.text);
    expect(cells[0]).toMatchObject({ kind: "glyph", slot: "H", glyph: { strokes: [AN_ACROSS_STROKE] } });
  });

  it("a Missing Glyph in a saved Message becomes a Glyph once he draws it", async () => {
    const { studio, script } = await studioWithMyScript({ drawn: ["H"] });
    const { text } = writeAndSave(studio, script.id, "HI");
    expect(studio.messageLayout(script.id, text)[1]).toMatchObject({ kind: "missingGlyph", slot: "I" });
    studio.saveGlyph(script.id, "I", [A_DOWN_STROKE]);
    expect(studio.messageLayout(script.id, text)[1]).toMatchObject({ kind: "glyph", slot: "I" });
  });
});

describe("Messages are kept on the tablet", () => {
  it("they survive a reload, newest first", async () => {
    const storage = inMemoryStudioStorage();
    const clock = fakeClock();
    const { studio, script } = await studioWithMyScript({ storage, clock });
    writeAndSave(studio, script.id, "OLDER");
    clock.advance(1000);
    writeAndSave(studio, script.id, "NEWER");
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.messages(script.id)).toEqual(studio.messages(script.id));
    expect(reopened.messages(script.id).map((m) => m.text)).toEqual(["NEWER", "OLDER"]);
  });

  it("an edit survives a reload", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage });
    const saved = writeAndSave(studio, script.id, "A");
    studio.editMessage(saved.id);
    type(studio, script.id, "B");
    studio.saveMessage(script.id);
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.messages(script.id).map((m) => m.text)).toEqual(["AB"]);
  });

  it("deleting a My Script deletes its Messages too, and they don't come back after a reload", async () => {
    const storage = inMemoryStudioStorage();
    const { studio, script } = await studioWithMyScript({ storage });
    const other = studio.createMyScript({ name: "Keeper", ink: "#c0392b", strokeWidth: 0.1 });
    if (!other.ok) throw new Error("setup");
    const doomed = writeAndSave(studio, script.id, "GONE");
    writeAndSave(studio, other.script.id, "KEPT");
    type(studio, script.id, "HALF WRITTEN");

    studio.deleteMyScript(script.id);
    expect(studio.messages(script.id)).toEqual([]);
    expect(studio.message(doomed.id)).toBeUndefined();
    expect(studio.draft(script.id)).toBe("");
    await studio.saved();

    const reopened = await loadedStudio({ storage });
    expect(reopened.message(doomed.id)).toBeUndefined();
    expect(reopened.messages(script.id)).toEqual([]);
    expect(reopened.messages(other.script.id).map((m) => m.text)).toEqual(["KEPT"]);
  });
});

describe("secret mode", () => {
  it("is off when the app opens, and stays as he set it while he moves between screens", async () => {
    const { studio, script } = await studioWithMyScript();
    expect(studio.secretMode()).toBe(false);
    studio.setSecretMode(true);
    studio.open({ name: "write", scriptId: script.id });
    studio.goHome();
    expect(studio.secretMode()).toBe(true);
    studio.setSecretMode(false);
    expect(studio.secretMode()).toBe(false);
  });
});
