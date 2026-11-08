import type { Clock } from "./deps";
import { createStudioCore, type StudioCore } from "./studioCore";
import { inMemoryStudioStorage, type StudioStorage } from "./studioStorage";
import type { NewMyScript } from "./myScriptBook";
import type { GlyphSlot, MyScript, Stroke } from "./myScript";

/** 7 November 2026, noon UTC: when the fake clock starts unless told otherwise. */
export const A_DAY = Date.UTC(2026, 10, 7, 12);

/** A clock that only moves when the test says so. */
export function fakeClock(start = A_DAY): Clock & { advance(ms: number): void } {
  let t = start;
  return {
    now: () => t,
    advance(ms: number) {
      t += ms;
    },
  };
}

export interface StudioOptions {
  /** Pass the same storage to a second core to "reload the app". */
  storage?: StudioStorage;
  clock?: Clock;
}

/** A Studio core with a fake clock and in-memory storage, opened on the home screen like the app. */
export function newStudio({ storage = inMemoryStudioStorage(), clock = fakeClock() }: StudioOptions = {}): StudioCore {
  return createStudioCore({ storage, clock });
}

/** A stroke straight down the middle of the Glyph square (normalized points). */
export const A_DOWN_STROKE: Stroke = [
  { x: 0.5, y: 0.2 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 0.8 },
];
/** A stroke across the middle of the Glyph square. */
export const AN_ACROSS_STROKE: Stroke = [
  { x: 0.2, y: 0.5 },
  { x: 0.8, y: 0.5 },
];

/** The My Script the builders make unless told otherwise. */
export const A_NEW_MY_SCRIPT: NewMyScript = { name: "Sky Runes", ink: "#3b6fd1", strokeWidth: 0.07 };

/**
 * A loaded Studio core with one My Script, which already has a Glyph
 * (a single down stroke) for each of `drawn`. Throws if a step fails.
 */
export async function studioWithMyScript(
  { drawn = [], details = A_NEW_MY_SCRIPT, ...options }: StudioOptions & { drawn?: readonly GlyphSlot[]; details?: NewMyScript } = {},
): Promise<{ studio: StudioCore; script: MyScript }> {
  const studio = await loadedStudio(options);
  const created = studio.createMyScript(details);
  if (!created.ok) throw new Error(`Couldn't create the My Script: ${created.reason}`);
  for (const slot of drawn) {
    const result = studio.saveGlyph(created.script.id, slot, [A_DOWN_STROKE]);
    if (result !== "saved") throw new Error(`Couldn't draw ${slot}: ${result}`);
  }
  return { studio, script: studio.myScript(created.script.id)! };
}

/** Presses + in the Number Explorer until it shows `n`. Throws if it can't get there. */
export function countTo(studio: StudioCore, n: number): void {
  while (studio.numberExplorer().number < n) {
    if (!studio.countUp()) throw new Error(`Couldn't count up to ${n}`);
  }
  if (studio.numberExplorer().number !== n) throw new Error(`Counted past ${n}`);
}

/** A Studio core that has finished loading from storage, as the app does at start-up. */
export async function loadedStudio(options: StudioOptions = {}): Promise<StudioCore> {
  const studio = newStudio(options);
  await studio.load();
  return studio;
}

/**
 * Strokes the way a finger really draws them: `strokes` curvy strokes of
 * `points` closely spaced points each (wobbly arcs, different per `seed`).
 * Much heavier than A_DOWN_STROKE, for share-link size stories.
 */
export function fingerDrawnStrokes(seed: number, { strokes = 2, points = 40 } = {}): Stroke[] {
  return Array.from({ length: strokes }, (_, s) =>
    Array.from({ length: points }, (_, i) => {
      const t = i / (points - 1);
      const angle = seed * 0.7 + s * 2.1 + t * Math.PI * 1.4;
      const radius = 0.3 + 0.04 * Math.sin(t * 17 + seed + s);
      return { x: 0.5 + radius * Math.cos(angle), y: 0.5 + radius * Math.sin(angle) };
    }),
  );
}

/**
 * A loaded Studio core with one My Script where each of `drawn` holds
 * finger-drawn strokes (fingerDrawnStrokes). Throws if a step fails.
 */
export async function studioWithFingerDrawnScript(
  drawn: readonly GlyphSlot[],
  shape: { strokes?: number; points?: number } = {},
): Promise<{ studio: StudioCore; script: MyScript }> {
  const { studio, script } = await studioWithMyScript();
  drawn.forEach((slot, i) => {
    const result = studio.saveGlyph(script.id, slot, fingerDrawnStrokes(i + 1, shape));
    if (result !== "saved") throw new Error(`Couldn't draw ${slot}: ${result}`);
  });
  return { studio, script: studio.myScript(script.id)! };
}
