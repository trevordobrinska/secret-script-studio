/** Where the core gets the time from. Injected so tests can control it. */
export interface Clock {
  /** Milliseconds since 1 January 1970 UTC, like `Date.now()`. */
  now(): number;
}

/** The real clock the app uses. */
export const systemClock: Clock = { now: () => Date.now() };
