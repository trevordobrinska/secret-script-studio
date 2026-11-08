import "./styles.css";
import { systemClock } from "./core/deps";
import { createStudioCore } from "./core/studioCore";
import { startRouter } from "./screens/router";
import { indexedDbStudioStorage } from "./storage/indexedDbStudioStorage";
import { startMuteButton } from "./sound/muteButton";
import { startSound } from "./sound/sound";

const core = createStudioCore({ storage: indexedDbStudioStorage(), clock: systemClock });

const root = document.querySelector<HTMLElement>("#screen")!;
const homeButton = document.querySelector<HTMLElement>("#home-button")!;

// Draw home straight away; nothing on it depends on saved data yet.
// Screens that do should wait for `core.load()` (it never rejects).
startRouter(core, root, homeButton);
startSound(() => core.settings().muted);
const muteButton = document.querySelector<HTMLButtonElement>("#mute-button")!;
void core.load().then(() => startMuteButton(core, muteButton));

registerServiceWorker();

/** Only there so add-to-home-screen works; see public/sw.js. */
function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  const url = new URL("sw.js", document.baseURI);
  navigator.serviceWorker.register(url).catch((e) => console.warn("Service worker not registered", e));
}
