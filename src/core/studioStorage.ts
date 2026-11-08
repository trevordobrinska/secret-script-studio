import type { MessageRecord } from "./message";
import type { MyScriptRecord } from "./myScript";

/**
 * The storage the Studio core depends on. It is async because the app's
 * real storage is IndexedDB (`src/storage/indexedDbStudioStorage.ts`,
 * database `secret-script-studio`). Tests use `inMemoryStudioStorage()`.
 *
 * Later tickets add methods here for My Scripts, Messages and backup.
 * Keep every record shape stable and versioned (Glyph Mines may read them).
 */
export interface StudioStorage {
  /** The saved Settings, or undefined on a fresh tablet. */
  loadSettings(): Promise<SettingsRecord | undefined>;
  saveSettings(settings: SettingsRecord): Promise<void>;
  /** Every saved My Script (any order). */
  listMyScripts(): Promise<MyScriptRecord[]>;
  /** Saves a My Script with its Glyphs, replacing any with the same id. */
  saveMyScript(script: MyScriptRecord): Promise<void>;
  /** Deletes a saved My Script (and its Glyphs). No error if it isn't there. */
  deleteMyScript(id: string): Promise<void>;
  /** Deletes every saved Message of one My Script (called when the My Script is deleted). */
  deleteMessagesOfMyScript(scriptId: string): Promise<void>;
  /** Every saved Message of every My Script (any order). */
  listMessages(): Promise<MessageRecord[]>;
  /** Saves a Message, replacing any with the same id. */
  saveMessage(message: MessageRecord): Promise<void>;
  /** Deletes one saved Message. No error if it isn't there. */
  deleteMessage(id: string): Promise<void>;
}

/** Bump when the Settings record's shape changes. */
export const SETTINGS_SCHEMA_VERSION = 1;

/** The saved Settings record. */
export interface SettingsRecord {
  readonly schemaVersion: number;
  readonly muted: boolean;
  /** Whether the Number Explorer's "Try fewer digits!" hint has been seen. */
  readonly numberHintSeen: boolean;
}

/** Storage that lives only in memory. Share one between two cores to "reload the app". */
export function inMemoryStudioStorage(): StudioStorage {
  let settings: SettingsRecord | undefined;
  const myScripts = new Map<string, MyScriptRecord>();
  const messages = new Map<string, MessageRecord>();
  return {
    async loadSettings() {
      return settings && structuredClone(settings);
    },
    async saveSettings(s) {
      settings = structuredClone(s);
    },
    async listMyScripts() {
      return [...myScripts.values()].map((r) => structuredClone(r));
    },
    async saveMyScript(script) {
      myScripts.set(script.id, structuredClone(script));
    },
    async deleteMyScript(id) {
      myScripts.delete(id);
    },
    async deleteMessagesOfMyScript(scriptId) {
      for (const [id, message] of messages) if (message.scriptId === scriptId) messages.delete(id);
    },
    async listMessages() {
      return [...messages.values()].map((r) => structuredClone(r));
    },
    async saveMessage(message) {
      messages.set(message.id, structuredClone(message));
    },
    async deleteMessage(id) {
      messages.delete(id);
    },
  };
}
