import type { Screen, StudioCore } from "../core/studioCore";

/** What every screen gets: the core, plus a way to move to another screen. */
export interface ScreenContext {
  readonly core: StudioCore;
  /** Tell the core to show `screen`, then redraw. Screens never switch screens by hand. */
  go(screen: Screen): void;
}

/**
 * Draws one screen into `root` (which the router has just emptied).
 * It may return a cleanup function, called when the screen is left
 * (to drop timers, listeners on window, and so on).
 */
export type RenderScreen<S extends Screen = Screen> = (
  root: HTMLElement,
  screen: S,
  context: ScreenContext,
) => void | (() => void);

/** Makes an element with a class and optional text, the screens' one DOM helper. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
