import type { MessageRecord } from "../core/message";
import type { MyScriptRecord } from "../core/myScript";
import type { SettingsRecord, StudioStorage } from "../core/studioStorage";

/** Prefixed with the app's name: every Arcade game shares one browser origin. */
const DB_NAME = "secret-script-studio";
/** Bump (and extend `upgrade`) when adding object stores or indexes. */
const DB_VERSION = 3;

const SETTINGS = "settings";
/** Added in DB_VERSION 2 (ticket 03). */
const MY_SCRIPTS = "myScripts";
/** Added in DB_VERSION 3 (ticket 06), with an index on each Message's scriptId. */
const MESSAGES = "messages";
const MESSAGES_BY_SCRIPT = "scriptId";
/** The single key the Settings record is kept under in the settings store. */
const SETTINGS_KEY = "settings";

/**
 * The app's real storage. Not unit-tested: `inMemoryStudioStorage()` stands
 * in for it in tests, so keep it a thin translation of the interface.
 */
export function indexedDbStudioStorage(): StudioStorage {
  let opening: Promise<IDBDatabase> | undefined;
  // Retry the open next time if it failed (e.g. a blocked upgrade).
  const db = () => (opening ??= open().catch((e) => {
    opening = undefined;
    throw e;
  }));

  async function run<T>(
    store: string,
    mode: IDBTransactionMode,
    makeRequest: (store: IDBObjectStore) => IDBRequest<T> | void,
  ): Promise<T | undefined> {
    const tx = (await db()).transaction(store, mode);
    const request = makeRequest(tx.objectStore(store));
    await done(tx);
    return request ? request.result : undefined;
  }

  return {
    loadSettings: () => run<SettingsRecord>(SETTINGS, "readonly", (s) => s.get(SETTINGS_KEY)),
    saveSettings: async (settings) => {
      await run(SETTINGS, "readwrite", (s) => void s.put(settings, SETTINGS_KEY));
    },
    listMyScripts: async () => (await run<MyScriptRecord[]>(MY_SCRIPTS, "readonly", (s) => s.getAll())) ?? [],
    saveMyScript: async (script) => {
      await run(MY_SCRIPTS, "readwrite", (s) => void s.put(script));
    },
    deleteMyScript: async (id) => {
      await run(MY_SCRIPTS, "readwrite", (s) => void s.delete(id));
    },
    deleteMessagesOfMyScript: async (scriptId) => {
      await run(MESSAGES, "readwrite", (s) => {
        const cursor = s.index(MESSAGES_BY_SCRIPT).openKeyCursor(IDBKeyRange.only(scriptId));
        cursor.onsuccess = () => {
          if (!cursor.result) return;
          s.delete(cursor.result.primaryKey);
          cursor.result.continue();
        };
      });
    },
    listMessages: async () => (await run<MessageRecord[]>(MESSAGES, "readonly", (s) => s.getAll())) ?? [],
    saveMessage: async (message) => {
      await run(MESSAGES, "readwrite", (s) => void s.put(message));
    },
    deleteMessage: async (id) => {
      await run(MESSAGES, "readwrite", (s) => void s.delete(id));
    },
  };
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => upgrade(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("IndexedDB upgrade blocked by another open tab"));
  });
}

function upgrade(db: IDBDatabase): void {
  // Out-of-line keys: one record under SETTINGS_KEY.
  if (!db.objectStoreNames.contains(SETTINGS)) db.createObjectStore(SETTINGS);
  // One record per My Script (with all its Glyphs), keyed by its id.
  if (!db.objectStoreNames.contains(MY_SCRIPTS)) db.createObjectStore(MY_SCRIPTS, { keyPath: "id" });
  // One record per Message, keyed by its id, findable by its My Script.
  if (!db.objectStoreNames.contains(MESSAGES)) {
    db.createObjectStore(MESSAGES, { keyPath: "id" }).createIndex(MESSAGES_BY_SCRIPT, "scriptId");
  }
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}
