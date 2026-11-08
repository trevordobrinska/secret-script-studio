import type { Clock } from "./deps";
import type { SettingsRecord, StudioStorage } from "./studioStorage";

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
export type Screen = { readonly name: "home" } | { readonly name: Section };

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
export interface StudioCore {
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
}

export function createStudioCore({ storage }: StudioCoreDeps): StudioCore {
  let current: Screen = { name: "home" };
  let settings: SettingsView = DEFAULT_SETTINGS;

  return {
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
    },
    settings: () => settings,
  };
}

function settingsFrom(record: SettingsRecord): SettingsView {
  return { muted: record.muted === true, numberHintSeen: record.numberHintSeen === true };
}
