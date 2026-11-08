import { playTap } from "../sound/sound";
import type { Screen, StudioCore } from "../core/studioCore";
import { homeScreen } from "./homeScreen";
import { libraryScreen, worldScriptScreen } from "./libraryScreens";
import { placeholderScreen } from "./placeholderScreen";
import type { RenderScreen, ScreenContext } from "./screen";

/**
 * One renderer per screen name. Add new screens here. The type makes
 * every Screen name in the core need an entry, and hands each renderer
 * its own Screen variant.
 */
const SCREENS: { [N in Screen["name"]]: RenderScreen<Extract<Screen, { name: N }>> } = {
  home: homeScreen,
  myScripts: placeholderScreen,
  library: libraryScreen,
  worldScript: worldScriptScreen,
  numberExplorer: placeholderScreen,
};

/**
 * The screen switcher. The core's `screen()` is the source of truth;
 * the router just draws whatever it says into `root`, and keeps the
 * shared home button (`homeButton`, fixed in the same spot on every
 * screen) hidden on home and shown everywhere else.
 */
export function startRouter(core: StudioCore, root: HTMLElement, homeButton: HTMLElement): void {
  let cleanup: void | (() => void);

  const context: ScreenContext = {
    core,
    go(screen) {
      core.open(screen);
      render();
    },
  };

  function render(): void {
    cleanup?.();
    root.replaceChildren();
    const screen = core.screen();
    root.dataset.screen = screen.name;
    homeButton.hidden = screen.name === "home";
    const renderer = SCREENS[screen.name] as RenderScreen;
    cleanup = renderer(root, screen, context);
  }

  homeButton.addEventListener("click", () => {
    playTap();
    core.goHome();
    render();
  });

  render();
}
