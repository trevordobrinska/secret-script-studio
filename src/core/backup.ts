import { foldMessageText } from "./messageLayout";
import { MESSAGE_SCHEMA_VERSION, type Message, type MessageRecord } from "./message";
import {
  INK_COLORS,
  MY_SCRIPT_SCHEMA_VERSION,
  STROKE_WIDTHS,
  canHaveSound,
  cleanSound,
  isGlyphSlot,
  type Glyph,
  type GlyphSlot,
  type MyScript,
  type MyScriptRecord,
  type Point,
} from "./myScript";
import { SETTINGS_SCHEMA_VERSION, type SettingsRecord } from "./studioStorage";

/**
 * The Backup file's data shape: one JSON document with every My Script
 * (with its Glyphs), every Message and the Settings, each record carrying
 * its own schema version. Bump BACKUP_SCHEMA_VERSION when the file's
 * shape changes; a file from another version is refused, never guessed at.
 */
export const BACKUP_SCHEMA_VERSION = 1;
/** Marks a file as ours (so a Doodle Monsters backup, say, is refused). */
export const BACKUP_APP = "secret-script-studio";

export interface BackupDocument {
  readonly app: typeof BACKUP_APP;
  readonly schemaVersion: number;
  readonly myScripts: readonly MyScriptRecord[];
  readonly messages: readonly MessageRecord[];
  readonly settings: SettingsRecord;
}

/** A Backup ready to download. */
export interface BackupFile {
  /** e.g. "secret-script-studio-backup-2026-11-07.json" (the tablet's local date). */
  readonly fileName: string;
  /** The JSON document. */
  readonly text: string;
}

/** What Restore did: how many My Scripts and Messages came from the file, or that it couldn't read it (and changed nothing). */
export type RestoreResult =
  | { readonly ok: true; readonly myScripts: number; readonly messages: number }
  | { readonly ok: false; readonly reason: "unreadable" };

/** The Backup/Restore part of the Studio core's interface. */
export interface BackupCommands {
  /** Every My Script, Message and the Settings as one file to download. */
  makeBackup(): BackupFile;
  /**
   * Reads a Backup file's text and merges it in by id: each My Script and
   * Message in the file is added, or replaces the one with the same id.
   * The Settings are merged so nothing on the tablet is lost: mute stays as
   * the tablet has it, and the Number Explorer hint counts as seen if the
   * tablet or the file has seen it. Nothing else is deleted. If anything in
   * the file is wrong, nothing at all changes.
   */
  restoreBackup(text: string): RestoreResult;
}

/** What a good Backup file holds, checked and cleaned (unknown fields dropped). */
export interface BackupContents {
  readonly myScripts: readonly MyScript[];
  readonly messages: readonly Message[];
  readonly settings: { readonly muted: boolean; readonly numberHintSeen: boolean };
}

export function backupText(contents: BackupContents): string {
  const document: BackupDocument = {
    app: BACKUP_APP,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    myScripts: contents.myScripts.map((s) => ({ schemaVersion: MY_SCRIPT_SCHEMA_VERSION, ...s })),
    messages: contents.messages.map((m) => ({ schemaVersion: MESSAGE_SCHEMA_VERSION, ...m })),
    settings: { schemaVersion: SETTINGS_SCHEMA_VERSION, ...contents.settings },
  };
  return JSON.stringify(document);
}

export function backupFileName(now: number): string {
  const d = new Date(now);
  const two = (n: number) => String(n).padStart(2, "0");
  return `secret-script-studio-backup-${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}.json`;
}

/** Thrown inside parseBackup only; never leaves this module. */
class Unreadable extends Error {}

function check(ok: unknown): asserts ok {
  if (!ok) throw new Unreadable();
}

/** A Backup file's contents, or undefined if the file is unreadable, from another version, or wrong in any part. */
export function parseBackup(text: string): BackupContents | undefined {
  try {
    return readDocument(JSON.parse(text));
  } catch {
    return undefined;
  }
}

function readDocument(file: unknown): BackupContents {
  check(isObject(file) && file.app === BACKUP_APP && file.schemaVersion === BACKUP_SCHEMA_VERSION);
  check(Array.isArray(file.myScripts) && Array.isArray(file.messages));
  const myScripts = file.myScripts.map(readMyScript);
  const messages = file.messages.map(readMessage);
  check(unique(myScripts.map((s) => s.id)) && unique(messages.map((m) => m.id)));
  // A real Backup holds every My Script its Messages were written in.
  const scriptIds = new Set(myScripts.map((s) => s.id));
  check(messages.every((m) => scriptIds.has(m.scriptId)));
  return { myScripts, messages, settings: readSettings(file.settings) };
}

function readMyScript(record: unknown): MyScript {
  check(isObject(record) && record.schemaVersion === MY_SCRIPT_SCHEMA_VERSION);
  const { id, name, ink, strokeWidth, createdAt, updatedAt, glyphs } = record;
  check(isId(id) && typeof name === "string" && name.trim() !== "");
  check((INK_COLORS as readonly unknown[]).includes(ink));
  check((Object.values(STROKE_WIDTHS) as unknown[]).includes(strokeWidth));
  check(isTime(createdAt) && isTime(updatedAt) && isObject(glyphs));
  const read: Partial<Record<GlyphSlot, Glyph>> = {};
  for (const [slot, glyph] of Object.entries(glyphs)) {
    check(isGlyphSlot(slot));
    read[slot] = readGlyph(slot, glyph);
  }
  return { id, name, ink: ink as string, strokeWidth: strokeWidth as number, createdAt, updatedAt, glyphs: read };
}

function readGlyph(slot: GlyphSlot, glyph: unknown): Glyph {
  check(isObject(glyph) && isTime(glyph.updatedAt) && Array.isArray(glyph.strokes) && glyph.strokes.length > 0);
  const strokes = glyph.strokes.map((stroke: unknown) => {
    check(Array.isArray(stroke) && stroke.length > 0);
    return stroke.map(readPoint);
  });
  // A Sound is optional (files from before Sounds have none) and cleaned as when saved.
  check(glyph.sound === undefined || typeof glyph.sound === "string");
  const sound = canHaveSound(slot) ? cleanSound(glyph.sound as string | undefined) : undefined;
  return sound ? { strokes, sound, updatedAt: glyph.updatedAt } : { strokes, updatedAt: glyph.updatedAt };
}

function readPoint(point: unknown): Point {
  check(isObject(point) && isUnit(point.x) && isUnit(point.y));
  return { x: point.x, y: point.y };
}

function readMessage(record: unknown): Message {
  check(isObject(record) && record.schemaVersion === MESSAGE_SCHEMA_VERSION);
  const { id, scriptId, text, createdAt, updatedAt } = record;
  check(isId(id) && isId(scriptId) && typeof text === "string" && isTime(createdAt) && isTime(updatedAt));
  return { id, scriptId, text: foldMessageText(text), createdAt, updatedAt };
}

function readSettings(record: unknown): BackupContents["settings"] {
  check(isObject(record) && record.schemaVersion === SETTINGS_SCHEMA_VERSION);
  check(typeof record.muted === "boolean" && typeof record.numberHintSeen === "boolean");
  return { muted: record.muted, numberHintSeen: record.numberHintSeen };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isId(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}
function isTime(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function isUnit(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}
function unique(ids: readonly string[]): boolean {
  return new Set(ids).size === ids.length;
}
