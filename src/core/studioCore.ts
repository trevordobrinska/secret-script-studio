import type { Clock } from "./deps";
import type { SettingsRecord, StudioStorage } from "./studioStorage";
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
  /** Making a new My Script: name, ink and stroke width. */
  | { readonly name: "newMyScript" }
  /** A My Script's grid of Glyph slots. */
  | { readonly name: "glyphGrid"; readonly scriptId: string }
  /** The Glyph canvas, drawing one slot of a My Script. */
  | { readonly name: "glyphCanvas"; readonly scriptId: string; readonly slot: GlyphSlot };

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
  /** Settles once everything changed so far is saved. Rejects if saving failed. */
  saved(): Promise<void>;
}

export function createStudioCore({ storage, clock }: StudioCoreDeps): StudioCore {
  let current: Screen = { name: "home" };
  let settings: SettingsView = DEFAULT_SETTINGS;

  // Commands change the core at once and save in the background, one write
  // after another; one failing doesn't stop the next. `saved()` waits for them.
  let saving: Promise<void> = Promise.resolve();
  function store(change: () => Promise<void>): void {
    saving = saving.catch(() => {}).then(change);
  }

  const myScriptBook = createMyScriptBook({
    clock,
    save: (record) => store(() => storage.saveMyScript(record)),
  });

  return {
    ...myScriptBook.commands,
    saved: () => saving,
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
  };
}

function settingsFrom(record: SettingsRecord): SettingsView {
  return { muted: record.muted === true, numberHintSeen: record.numberHintSeen === true };
}
