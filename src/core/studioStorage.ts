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
  return {
    async loadSettings() {
      return settings && structuredClone(settings);
    },
    async saveSettings(s) {
      settings = structuredClone(s);
    },
  };
}
