import type { Clock } from "./deps";
import { foldMessageText } from "./messageLayout";
import { MESSAGE_SCHEMA_VERSION, type Message, type MessageRecord } from "./message";
import type { MyScript } from "./myScript";
import type { WritingCommands } from "./writing";

export type SaveMessageResult =
  | { readonly ok: true; readonly message: Message }
  /** No such My Script, or the draft has nothing in it but spaces. */
  | { readonly ok: false; readonly reason: "noScript" | "empty" };

/** The saved Messages part of the Studio core's interface: each My Script's diary. */
export interface DiaryCommands {
  /** A My Script's saved Messages, newest first (empty for an unknown id). */
  messages(scriptId: string): readonly Message[];
  /** One saved Message, or undefined if there's no such id. */
  message(id: string): Message | undefined;
  /**
   * Saves a My Script's draft as a Message and empties the draft. If the
   * draft was editing a saved Message (editMessage), that one is updated
   * instead of a new one being added.
   */
  saveMessage(scriptId: string): SaveMessageResult;
  /** Puts a saved Message into its My Script's draft, to change it on the Write screen and save again. */
  editMessage(id: string): "editing" | "noMessage";
  /** Deletes a saved Message for good. (The screen asks him to confirm first.) */
  deleteMessage(id: string): "deleted" | "noMessage";
  /** Secret mode: the plain letters under the Glyphs are hidden. Off when the app opens. */
  secretMode(): boolean;
  setSecretMode(on: boolean): void;
}

interface DiaryDeps {
  clock: Clock;
  myScript(id: string): MyScript | undefined;
  writing: WritingCommands;
  /** Queue a write to storage (the core's `saved()` waits for it). */
  save(record: MessageRecord): void;
  /** Queue a delete from storage. */
  remove(id: string): void;
}

/** The core's saved Messages rules. Not exported from the core: tests go through StudioCore. */
export function createDiary({ clock, myScript, writing, save, remove }: DiaryDeps) {
  const messages = new Map<string, Message>();
  let secret = false;

  function put(message: Message): void {
    messages.set(message.id, message);
    save({ schemaVersion: MESSAGE_SCHEMA_VERSION, ...message });
  }

  function newId(): string {
    const base = `message-${clock.now().toString(36)}`;
    let id = base;
    for (let n = 2; messages.has(id); n++) id = `${base}-${n}`;
    return id;
  }

  const commands: DiaryCommands = {
    messages: (scriptId) =>
      [...messages.values()]
        .filter((m) => m.scriptId === scriptId)
        .sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id)),
    message: (id) => messages.get(id),
    saveMessage(scriptId) {
      if (!myScript(scriptId)) return { ok: false, reason: "noScript" };
      const text = foldMessageText(writing.draft(scriptId));
      if (text.trim() === "") return { ok: false, reason: "empty" };
      const now = clock.now();
      const old = messages.get(writing.editingMessage(scriptId) ?? "");
      const message: Message =
        old && old.scriptId === scriptId
          ? { ...old, text, updatedAt: now }
          : { id: newId(), scriptId, text, createdAt: now, updatedAt: now };
      put(message);
      writing.clearDraft(scriptId);
      return { ok: true, message };
    },
    editMessage(id) {
      const message = messages.get(id);
      if (!message || !myScript(message.scriptId)) return "noMessage";
      writing.setDraft(message.scriptId, message.text, message.id);
      return "editing";
    },
    deleteMessage(id) {
      const message = messages.get(id);
      if (!message) return "noMessage";
      messages.delete(id);
      // A draft that was editing it keeps its text but would now save as a new Message.
      if (writing.editingMessage(message.scriptId) === id) {
        writing.setDraft(message.scriptId, writing.draft(message.scriptId));
      }
      remove(id);
      return "deleted";
    },
    secretMode: () => secret,
    setSecretMode(on) {
      secret = on;
    },
  };

  return {
    commands,
    /** Takes in the Messages read from storage at start-up. Ones saved since then win. */
    loaded(records: readonly MessageRecord[]): void {
      for (const record of records) {
        if (record.schemaVersion !== MESSAGE_SCHEMA_VERSION || messages.has(record.id)) continue;
        const { schemaVersion: _, ...message } = record;
        messages.set(message.id, message);
      }
    },
    /** A My Script was deleted: forget its Messages and its draft (storage is handled by the core). */
    myScriptDeleted(scriptId: string): void {
      for (const [id, message] of messages) if (message.scriptId === scriptId) messages.delete(id);
      writing.clearDraft(scriptId);
    },
  };
}
