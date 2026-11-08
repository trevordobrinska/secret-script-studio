import type { Clock } from "./deps";
import {
  GLYPH_SLOTS,
  INK_COLORS,
  MY_SCRIPT_SCHEMA_VERSION,
  STROKE_WIDTHS,
  type GlyphSlot,
  type MyScript,
  type MyScriptRecord,
  type Point,
  type Stroke,
} from "./myScript";

/** What he picks when making a new My Script. */
export interface NewMyScript {
  readonly name: string;
  /** One of INK_COLORS. */
  readonly ink: string;
  /** One of the STROKE_WIDTHS values. */
  readonly strokeWidth: number;
}

export type CreateMyScriptResult =
  | { readonly ok: true; readonly script: MyScript }
  | { readonly ok: false; readonly reason: "needsName" | "unknownInk" | "unknownStrokeWidth" };

/** "saved", or why the Glyph wasn't: no such My Script, or nothing was drawn. */
export type SaveGlyphResult = "saved" | "noScript" | "empty";

/** The My Scripts part of the Studio core's interface. */
export interface MyScriptCommands {
  /** Every My Script, oldest first. */
  myScripts(): readonly MyScript[];
  /** One My Script, or undefined if there's no such id. */
  myScript(id: string): MyScript | undefined;
  /** Makes a new, empty My Script. The name is trimmed and must not be blank. */
  createMyScript(details: NewMyScript): CreateMyScriptResult;
  /**
   * Saves the strokes he drew for one slot (points normalized to the
   * canvas square, 0–1). Saving a slot that already has a Glyph redraws it.
   * Points are clamped into the square; strokes with no points are dropped.
   */
  saveGlyph(scriptId: string, slot: GlyphSlot, strokes: readonly Stroke[]): SaveGlyphResult;
  /** The slots with no Glyph yet, in grid order (empty for an unknown id). */
  missingSlots(scriptId: string): readonly GlyphSlot[];
}

interface MyScriptBookDeps {
  clock: Clock;
  /** Queue a write to storage (the core's `saved()` waits for it). */
  save(record: MyScriptRecord): void;
}

/** The core's My Scripts rules. Not exported from the core: tests go through StudioCore. */
export function createMyScriptBook({ clock, save }: MyScriptBookDeps) {
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
      const trimmed = name.trim();
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
    saveGlyph(scriptId, slot, strokes) {
      const script = scripts.get(scriptId);
      if (!script) return "noScript";
      const kept = strokes.filter((s) => s.length > 0).map((s) => s.map(clampPoint));
      if (kept.length === 0) return "empty";
      const now = clock.now();
      put({ ...script, updatedAt: now, glyphs: { ...script.glyphs, [slot]: { strokes: kept, updatedAt: now } } });
      return "saved";
    },
    missingSlots(scriptId) {
      const script = scripts.get(scriptId);
      return script ? GLYPH_SLOTS.filter((slot) => !script.glyphs[slot]) : [];
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
