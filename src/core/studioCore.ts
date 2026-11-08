import type { Clock } from "./deps";
import { LIBRARY } from "./library/catalog";
import type { WorldCharacter, WorldNumeral, WorldScript } from "./library/worldScript";
import { pronounce, type WorldCharacterTap } from "./library/pronunciation";
import { SETTINGS_SCHEMA_VERSION, type SettingsRecord, type StudioStorage } from "./studioStorage";
import { createMyScriptBook, type MyScriptCommands } from "./myScriptBook";
import { canHaveSound, type GlyphSlot } from "./myScript";
import { glyphSpeech, type GlyphTap } from "./glyphSound";
import { createNumberExplorer, type NumberExplorerCommands } from "./numberExplorer";
import { createWriting, type WritingCommands } from "./writing";
import { createDiary, type DiaryCommands } from "./diary";
import { backupFileName, backupText, parseBackup, type BackupCommands } from "./backup";
import { createSharing, type SharingCommands } from "./sharing";
import { createPrinting, type PrintingCommands } from "./printing";

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
  | {
      readonly name: "glyphGrid";
      readonly scriptId: string;
      /** The name nudge's letters (suggestedLetters), offered first. */
      readonly startWith?: readonly GlyphSlot[];
    }
  /** The Glyph canvas, drawing one slot of a My Script. */
  | {
      readonly name: "glyphCanvas";
      readonly scriptId: string;
      readonly slot: GlyphSlot;
      /** The name nudge's letters: "Save + next" offers these first. */
      readonly startWith?: readonly GlyphSlot[];
      /** Where Save and Back go (e.g. the Write screen or the Number Explorer); without it, the Glyph grid. */
      readonly returnTo?: Screen;
    }
  /** The name nudge for a brand-new My Script: "start with the letters of your name". */
  | { readonly name: "nameNudge"; readonly scriptId: string }
  /** The Write screen: writing a Message in a My Script with its Glyph keyboard (the draft is in the core). */
  | { readonly name: "write"; readonly scriptId: string }
  /** A My Script's diary: its saved Messages, newest first. */
  | { readonly name: "messages"; readonly scriptId: string }
  /** Re-reading one saved Message (with Edit and Delete). */
  | { readonly name: "message"; readonly messageId: string }
  /**
   * The Share screen: a big QR code for the Message `text` written in a My
   * Script. Open it from the Write screen's draft or from a saved Message;
   * Back goes to `returnTo` (without it, the Write screen).
   */
  | { readonly name: "share"; readonly scriptId: string; readonly text: string; readonly returnTo?: Screen };

export type { SharedMessage } from "./sharing";
export type { MessageCell, MessageLayout } from "./messageLayout";
export type { ScriptLook } from "./myScript";
export type { CipherKeyEntry, PrintLayout, PrintOptions } from "./printing";
export type { WorldCharacter, WorldNumeral, WorldScript } from "./library/worldScript";
export type { Speech, WorldCharacterTap } from "./library/pronunciation";
export { primaryLanguage } from "./library/pronunciation";
export type { GlyphTap } from "./glyphSound";
export { SOUND_MAX_LENGTH, canHaveSound } from "./myScript";

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
export interface StudioCore
  extends MyScriptCommands,
    WritingCommands,
    DiaryCommands,
    NumberExplorerCommands,
    BackupCommands,
    SharingCommands,
    PrintingCommands {
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
  /**
   * What tapping one of a World Script's characters or numerals does, given
   * the languages of the device's voices (the speech adapter lists them).
   * While muted it says nothing: the card glows and the mute button wiggles.
   * Undefined for an unknown script, or an entry that isn't on its page.
   */
  worldCharacterTap(
    scriptId: string,
    entry: WorldCharacter | WorldNumeral,
    voiceLangs: readonly string[],
  ): WorldCharacterTap | undefined;
  /**
   * What tapping one of his Glyphs does: the English voice says its Sound,
   * or its plain letter or digit when it has none. `trying` is the Sound
   * box's text not saved yet (the canvas's "try it" 🔊): when given, it's
   * said instead of the saved Sound (blank means the plain letter). The
   * slot needn't be drawn yet. While muted it says nothing. Undefined for
   * an unknown My Script, or space and punctuation (they have no Sound).
   */
  glyphTap(scriptId: string, slot: GlyphSlot, trying?: string): GlyphTap | undefined;
  /** Turns the sounds off (true) or on (false). Remembered across reloads. */
  setMuted(muted: boolean): void;
  /** Resolves once every save started so far has finished (or failed and been logged). */
  saved(): Promise<void>;
}

export function createStudioCore({ storage, clock }: StudioCoreDeps): StudioCore {
  let current: Screen = { name: "home" };
  let settings: SettingsView = DEFAULT_SETTINGS;
  let pending: Promise<void> = Promise.resolve();

  /**
   * Commands change the core at once and save in the background on the one
   * `pending` queue, one write after another; a failed write is logged with
   * `failure` and doesn't stop the next. `saved()` waits for them all.
   */
  function queueSave(write: () => Promise<void>, failure: string): void {
    pending = pending.then(write).catch((error) => console.warn(failure, error));
  }

  const myScriptBook = createMyScriptBook({
    clock,
    save: (record) => queueSave(() => storage.saveMyScript(record), "Couldn't save a My Script."),
    remove: (scriptId) => myScriptDeleted(scriptId),
  });

  const writing = createWriting({ myScript: myScriptBook.commands.myScript });
  const sharing = createSharing({ myScript: myScriptBook.commands.myScript });
  const printing = createPrinting({ myScript: myScriptBook.commands.myScript });

  const diary = createDiary({
    clock,
    myScript: myScriptBook.commands.myScript,
    writing,
    save: (record) => queueSave(() => storage.saveMessage(record), "Couldn't save a Message."),
    remove: (id) => queueSave(() => storage.deleteMessage(id), "Couldn't delete a Message."),
  });

  const numberExplorer = createNumberExplorer({
    clock,
    myScripts: myScriptBook.commands.myScripts,
    hintSeen: () => settings.numberHintSeen,
    markHintSeen: () => {
      settings = { ...settings, numberHintSeen: true };
      saveSettings();
    },
  });

  const worldScript = (id: string) => LIBRARY.find((script) => script.id === id);

  return {
    ...myScriptBook.commands,
    ...writing,
    ...diary.commands,
    ...numberExplorer.commands,
    ...sharing,
    ...printing,
    screen: () => current,
    homeTiles: () => HOME_TILES,
    open(screen) {
      // Coming in from home is a fresh start; coming back from the Glyph canvas keeps his place.
      if (screen.name === "numberExplorer" && current.name === "home") numberExplorer.start();
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
      try {
        diary.loaded(await storage.listMessages());
      } catch (error) {
        console.warn("Couldn't read the saved Messages.", error);
      }
    },
    settings: () => settings,
    library: () => LIBRARY,
    worldScript,
    worldCharacterTap(scriptId, entry, voiceLangs) {
      const script = worldScript(scriptId);
      const entries: readonly (WorldCharacter | WorldNumeral)[] | undefined =
        "value" in entry ? script?.numerals : script?.characters;
      const own = entries?.find((e) => e.text === entry.text);
      if (!script || !own) return undefined;
      if (settings.muted) return { kind: "muted" };
      return { kind: "speak", speech: pronounce(script, own, voiceLangs) };
    },
    glyphTap(scriptId, slot, trying) {
      const script = myScriptBook.commands.myScript(scriptId);
      if (!script || !canHaveSound(slot)) return undefined;
      if (settings.muted) return { kind: "muted" };
      return { kind: "speak", speech: glyphSpeech(slot, trying ?? script.glyphs[slot]?.sound) };
    },
    setMuted(muted) {
      settings = { ...settings, muted };
      saveSettings();
    },
    saved: () => pending,
    makeBackup() {
      const contents = { myScripts: myScriptBook.commands.myScripts(), messages: diary.all(), settings };
      return { fileName: backupFileName(clock.now()), text: backupText(contents) };
    },
    restoreBackup(text) {
      const contents = parseBackup(text);
      if (!contents) return { ok: false, reason: "unreadable" };
      myScriptBook.restored(contents.myScripts);
      diary.restored(contents.messages);
      // Nothing on this tablet is lost: its sound stays as it is, and the
      // hint counts as seen if either the tablet or the file has seen it.
      settings = { ...settings, numberHintSeen: settings.numberHintSeen || contents.settings.numberHintSeen };
      saveSettings();
      return { ok: true, myScripts: contents.myScripts.length, messages: contents.messages.length };
    },
  };

  /** A My Script was deleted: its Messages (and its draft) go with it. */
  function myScriptDeleted(scriptId: string): void {
    diary.myScriptDeleted(scriptId);
    queueSave(async () => {
      await storage.deleteMyScript(scriptId);
      await storage.deleteMessagesOfMyScript(scriptId);
    }, "Couldn't delete a My Script.");
  }

  function saveSettings(): void {
    const record: SettingsRecord = { schemaVersion: SETTINGS_SCHEMA_VERSION, ...settings };
    queueSave(() => storage.saveSettings(record), "Couldn't save the Settings.");
  }
}

function settingsFrom(record: SettingsRecord): SettingsView {
  return { muted: record.muted === true, numberHintSeen: record.numberHintSeen === true };
}
