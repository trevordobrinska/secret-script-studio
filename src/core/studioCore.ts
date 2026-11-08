import type { Clock } from "./deps";
import { LIBRARY } from "./library/catalog";
import type { WorldScript } from "./library/worldScript";
import { SETTINGS_SCHEMA_VERSION, type SettingsRecord, type StudioStorage } from "./studioStorage";
import { createMyScriptBook, type MyScriptCommands } from "./myScriptBook";
import type { GlyphSlot } from "./myScript";

/** Everything the Studio core needs from the outside world. */
export interface StudioCoreDeps {
  storage: StudioStorage;
  clock: Clock;
}

/** The three sections on the home screen, in tile order. */
export type Section = "myScripts" | "library" | "numberExplorer";

const HOME_TILES: readonly Section[] = ["myScripts", "library", "numberExplorer"];

/**
 * Which screen is showing. A tagged union: later tickets add screens, some
 * carrying details, e.g. `{ name: "glyphCanvas"; scriptId; slot }`.
 */
export type Screen =
  | { readonly name: "home" }
  | { readonly name: Section }
  | { readonly name: "worldScript"; readonly scriptId: string }
  /** Making a new My Script: name, ink and stroke width. */
  | { readonly name: "newMyScript" }
  /** A My Script's grid of Glyph slots. */
  | { readonly name: "glyphGrid"; readonly scriptId: string }
  /** The Glyph canvas, drawing one slot of a My Script. */
  | { readonly name: "glyphCanvas"; readonly scriptId: string; readonly slot: GlyphSlot };

export type { WorldCharacter, WorldNumeral, WorldScript } from "./library/worldScript";

/** The Settings as the screens see them. */
export interface SettingsView {
  readonly muted: boolean;
  readonly numberHintSeen: boolean;
}

const DEFAULT_SETTINGS: SettingsView = { muted: false, numberHintSeen: false };

/**
 * The Studio core: every rule of the app, with no DOM. Screens read its
 * views and call its commands. Commands return results and never throw.
 */
export interface StudioCore extends MyScriptCommands {
  /** The screen that is showing now. The app opens on home. */
  screen(): Screen;
  /** The home screen's tiles, in their fixed order. */
  homeTiles(): readonly Section[];
  /** Shows a screen. */
  open(screen: Screen): void;
  /** What the home button does: back to the home screen. */
  goHome(): void;
  /**
   * Reads everything saved on the tablet. The app calls it once at start-up.
   * It never rejects: if storage can't be read, the defaults stay.
   */
  load(): Promise<void>;
  settings(): SettingsView;
  /** The Library's World Scripts, in list order. Read-only. */
  library(): readonly WorldScript[];
  /** One World Script by id, or undefined if there is none. */
  worldScript(id: string): WorldScript | undefined;
  /** Turns the sounds off (true) or on (false). Remembered across reloads. */
  setMuted(muted: boolean): void;
  /** Resolves once every save started so far has finished (or failed and been logged). */
  saved(): Promise<void>;
}

export function createStudioCore({ storage, clock }: StudioCoreDeps): StudioCore {
  let current: Screen = { name: "home" };
  let settings: SettingsView = DEFAULT_SETTINGS;
  let pending: Promise<void> = Promise.resolve();

  // Commands change the core at once and save in the background on the one
  // `pending` queue, one write after another; a failed write is logged and
  // doesn't stop the next. `saved()` waits for them all.
  const myScriptBook = createMyScriptBook({
    clock,
    save: (record) => {
      pending = pending
        .then(() => storage.saveMyScript(record))
        .catch((error) => console.warn("Couldn't save a My Script.", error));
    },
    remove: (scriptId) => myScriptDeleted(scriptId),
  });

  return {
    ...myScriptBook.commands,
    screen: () => current,
    homeTiles: () => HOME_TILES,
    open(screen) {
      current = screen;
    },
    goHome() {
      current = { name: "home" };
    },
    async load() {
      try {
        const saved = await storage.loadSettings();
        if (saved) settings = settingsFrom(saved);
      } catch (error) {
        console.warn("Couldn't read the saved Settings; using the defaults.", error);
      }
      try {
        myScriptBook.loaded(await storage.listMyScripts());
      } catch (error) {
        console.warn("Couldn't read the saved My Scripts.", error);
      }
    },
    settings: () => settings,
    library: () => LIBRARY,
    worldScript: (id) => LIBRARY.find((script) => script.id === id),
    setMuted(muted) {
      settings = { ...settings, muted };
      saveSettings();
    },
    saved: () => pending,
  };

  /**
   * A My Script was deleted: its Messages go with it. Ticket 06 (Messages)
   * also drops that script's Messages from the core's memory here.
   */
  function myScriptDeleted(scriptId: string): void {
    pending = pending
      .then(() => storage.deleteMyScript(scriptId))
      .then(() => storage.deleteMessagesOfMyScript(scriptId))
      .catch((error) => console.warn("Couldn't delete a My Script.", error));
  }

  function saveSettings(): void {
    const record: SettingsRecord = { schemaVersion: SETTINGS_SCHEMA_VERSION, ...settings };
    pending = pending
      .then(() => storage.saveSettings(record))
      .catch((error) => console.warn("Couldn't save the Settings.", error));
  }
}

function settingsFrom(record: SettingsRecord): SettingsView {
  return { muted: record.muted === true, numberHintSeen: record.numberHintSeen === true };
}
