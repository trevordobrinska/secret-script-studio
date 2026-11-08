import type { Clock } from "./deps";
import {
  GLYPH_SLOTS,
  INK_COLORS,
  MY_SCRIPT_SCHEMA_VERSION,
  NAME_MAX_LENGTH,
  STROKE_WIDTHS,
  canHaveSound,
  cleanSound,
  type Glyph,
  type GlyphSlot,
  type MyScript,
  type MyScriptRecord,
  type Point,
  type ScriptLook,
  type Stroke,
} from "./myScript";

/** What he picks when making a new My Script: its look (ink from INK_COLORS, width from STROKE_WIDTHS). */
export type NewMyScript = ScriptLook;

/** A name as kept: trimmed, then cut to NAME_MAX_LENGTH characters (never splitting an emoji). */
function cleanName(name: string): string {
  return Array.from(name.trim()).slice(0, NAME_MAX_LENGTH).join("").trimEnd();
}

export type CreateMyScriptResult =
  | { readonly ok: true; readonly script: MyScript }
  | { readonly ok: false; readonly reason: "needsName" | "unknownInk" | "unknownStrokeWidth" };

/** "saved", or why the Glyph wasn't: no such My Script, or nothing was drawn. */
export type SaveGlyphResult = "saved" | "noScript" | "empty";

/** "renamed", or why not: no such My Script, or the new name is blank. */
export type RenameMyScriptResult = "renamed" | "noScript" | "needsName";

/** The My Scripts part of the Studio core's interface. */
export interface MyScriptCommands {
  /** Every My Script, oldest first. */
  myScripts(): readonly MyScript[];
  /** One My Script, or undefined if there's no such id. */
  myScript(id: string): MyScript | undefined;
  /** Makes a new, empty My Script. The name is trimmed, must not be blank, and is cut to NAME_MAX_LENGTH. */
  createMyScript(details: NewMyScript): CreateMyScriptResult;
  /**
   * Saves the strokes he drew for one slot (points normalized to the
   * canvas square, 0–1), with its Sound. Saving a slot that already has a
   * Glyph redraws it, Sound and all. Points are clamped into the square;
   * strokes with no points are dropped. The Sound is cleaned (cleanSound:
   * trimmed, cut to SOUND_MAX_LENGTH); blank or left out means no Sound,
   * and it's ignored for space and punctuation. A Sound with no strokes
   * is still "empty": a Sound belongs to a drawn Glyph.
   */
  saveGlyph(scriptId: string, slot: GlyphSlot, strokes: readonly Stroke[], sound?: string): SaveGlyphResult;
  /** Gives a My Script a new name (trimmed, must not be blank, cut to NAME_MAX_LENGTH). Its Glyphs stay. */
  renameMyScript(id: string, name: string): RenameMyScriptResult;
  /**
   * Deletes a My Script, its Glyphs and its Messages, for good. (The
   * screen asks him to confirm first.)
   */
  deleteMyScript(id: string): "deleted" | "noScript";
  /**
   * The name nudge: the letter slots to draw first for his name (or any
   * word): its unique letters in order, capitals, ignoring non-letters.
   */
  suggestedLetters(word: string): readonly GlyphSlot[];
  /** The slots with no Glyph yet, in grid order (empty for an unknown id). */
  missingSlots(scriptId: string): readonly GlyphSlot[];
  /** The slots that have a Glyph, in grid order (for previews; empty for an unknown id). */
  drawnSlots(scriptId: string): readonly GlyphSlot[];
  /**
   * "Next empty one" after he saves `after`: the first Missing Glyph among
   * `first` (e.g. his name's suggestedLetters), otherwise the next Missing
   * Glyph after `after` in grid order, going round to the start. Undefined
   * once every slot is drawn.
   */
  nextMissingSlot(scriptId: string, after: GlyphSlot, first?: readonly GlyphSlot[]): GlyphSlot | undefined;
}

interface MyScriptBookDeps {
  clock: Clock;
  /** Queue a write to storage (the core's `saved()` waits for it). */
  save(record: MyScriptRecord): void;
  /** A My Script was deleted: the core removes it (and its Messages) from storage. */
  remove(scriptId: string): void;
}

/** The core's My Scripts rules. Not exported from the core: tests go through StudioCore. */
export function createMyScriptBook({ clock, save, remove }: MyScriptBookDeps) {
  const scripts = new Map<string, MyScript>();

  function put(script: MyScript): void {
    scripts.set(script.id, script);
    save({ schemaVersion: MY_SCRIPT_SCHEMA_VERSION, ...script });
  }

  function newId(): string {
    const base = `script-${clock.now().toString(36)}`;
    let id = base;
    for (let n = 2; scripts.has(id); n++) id = `${base}-${n}`;
    return id;
  }

  const commands: MyScriptCommands = {
    myScripts: () => [...scripts.values()].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
    myScript: (id) => scripts.get(id),
    createMyScript({ name, ink, strokeWidth }) {
      const trimmed = cleanName(name);
      if (!trimmed) return { ok: false, reason: "needsName" };
      if (!(INK_COLORS as readonly string[]).includes(ink)) return { ok: false, reason: "unknownInk" };
      if (!(Object.values(STROKE_WIDTHS) as number[]).includes(strokeWidth)) {
        return { ok: false, reason: "unknownStrokeWidth" };
      }
      const now = clock.now();
      const script: MyScript = { id: newId(), name: trimmed, ink, strokeWidth, createdAt: now, updatedAt: now, glyphs: {} };
      put(script);
      return { ok: true, script };
    },
    saveGlyph(scriptId, slot, strokes, sound) {
      const script = scripts.get(scriptId);
      if (!script) return "noScript";
      const kept = strokes.filter((s) => s.length > 0).map((s) => s.map(clampPoint));
      if (kept.length === 0) return "empty";
      const now = clock.now();
      const keptSound = canHaveSound(slot) ? cleanSound(sound) : undefined;
      const glyph: Glyph = keptSound ? { strokes: kept, sound: keptSound, updatedAt: now } : { strokes: kept, updatedAt: now };
      put({ ...script, updatedAt: now, glyphs: { ...script.glyphs, [slot]: glyph } });
      return "saved";
    },
    renameMyScript(id, name) {
      const script = scripts.get(id);
      if (!script) return "noScript";
      const trimmed = cleanName(name);
      if (!trimmed) return "needsName";
      put({ ...script, name: trimmed, updatedAt: clock.now() });
      return "renamed";
    },
    deleteMyScript(id) {
      if (!scripts.delete(id)) return "noScript";
      remove(id);
      return "deleted";
    },
    suggestedLetters(word) {
      // NFD splits "ë" into "e" plus a combining mark, which the A–Z filter drops.
      const letters = word.normalize("NFD").toUpperCase().match(/[A-Z]/g) ?? [];
      return [...new Set(letters)] as GlyphSlot[];
    },
    missingSlots(scriptId) {
      const script = scripts.get(scriptId);
      return script ? GLYPH_SLOTS.filter((slot) => !script.glyphs[slot]) : [];
    },
    drawnSlots(scriptId) {
      const script = scripts.get(scriptId);
      return script ? GLYPH_SLOTS.filter((slot) => script.glyphs[slot]) : [];
    },
    nextMissingSlot(scriptId, after, first = []) {
      const script = scripts.get(scriptId);
      if (!script) return undefined;
      const isMissing = (slot: GlyphSlot) => slot !== after && !script.glyphs[slot];
      const start = GLYPH_SLOTS.indexOf(after) + 1;
      const roundFromAfter = [...GLYPH_SLOTS.slice(start), ...GLYPH_SLOTS.slice(0, start)];
      return first.find(isMissing) ?? roundFromAfter.find(isMissing);
    },
  };

  return {
    commands,
    /** Takes in the My Scripts read from storage at start-up. Ones made since then win. */
    loaded(records: readonly MyScriptRecord[]): void {
      for (const record of records) {
        const script = scriptFrom(record);
        if (script && !scripts.has(script.id)) scripts.set(script.id, script);
      }
    },
    /** Restore: each My Script is added, or replaces the one with the same id, and is saved. */
    restored(restoredScripts: readonly MyScript[]): void {
      for (const script of restoredScripts) put(script);
    },
  };
}

function clampPoint({ x, y }: Point): Point {
  return { x: clamp01(x), y: clamp01(y) };
}

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

/** A saved record as a My Script, or undefined if it's from an unknown schema. */
function scriptFrom(record: MyScriptRecord): MyScript | undefined {
  if (record.schemaVersion !== MY_SCRIPT_SCHEMA_VERSION) return undefined;
  const { schemaVersion: _, ...script } = record;
  return script;
}
