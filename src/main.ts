import "./styles.css";
import { systemClock } from "./core/deps";
import { createStudioCore } from "./core/studioCore";
import { startRouter } from "./screens/router";
import { indexedDbStudioStorage } from "./storage/indexedDbStudioStorage";

const core = createStudioCore({ storage: indexedDbStudioStorage(), clock: systemClock });

const root = document.querySelector<HTMLElement>("#screen")!;
const homeButton = document.querySelector<HTMLElement>("#home-button")!;

// Draw once saved data is in (My Scripts are), so no screen shows half-loaded.
// `core.load()` never rejects and IndexedDB is quick, so this is near-instant.
void core.load().then(() => startRouter(core, root, homeButton));

registerServiceWorker();

/** Only there so add-to-home-screen works; see public/sw.js. */
function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  const url = new URL("sw.js", document.baseURI);
  navigator.serviceWorker.register(url).catch((e) => console.warn("Service worker not registered", e));
}
