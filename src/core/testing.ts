import type { Clock } from "./deps";
import { createStudioCore, type StudioCore } from "./studioCore";
import { inMemoryStudioStorage, type StudioStorage } from "./studioStorage";

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

/** A Studio core that has finished loading from storage, as the app does at start-up. */
export async function loadedStudio(options: StudioOptions = {}): Promise<StudioCore> {
  const studio = newStudio(options);
  await studio.load();
  return studio;
}
