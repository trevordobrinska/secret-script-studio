import "./styles.css";
import { systemClock } from "./core/deps";
import { createStudioCore } from "./core/studioCore";
import { startRouter } from "./screens/router";
import { indexedDbStudioStorage } from "./storage/indexedDbStudioStorage";

const core = createStudioCore({ storage: indexedDbStudioStorage(), clock: systemClock });

const root = document.querySelector<HTMLElement>("#screen")!;
const homeButton = document.querySelector<HTMLElement>("#home-button")!;

// Draw home straight away; nothing on it depends on saved data yet.
// Screens that do should wait for `core.load()` (it never rejects).
startRouter(core, root, homeButton);
void core.load();

registerServiceWorker();

/** Only there so add-to-home-screen works; see public/sw.js. */
function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  const url = new URL("sw.js", document.baseURI);
  navigator.serviceWorker.register(url).catch((e) => console.warn("Service worker not registered", e));
}
