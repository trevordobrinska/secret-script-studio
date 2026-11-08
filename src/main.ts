import "./styles.css";
import { systemClock } from "./core/deps";
import { createStudioCore } from "./core/studioCore";
import { inMemoryStudioStorage } from "./core/studioStorage";
import { startReplyPage } from "./reply/replyPage";
import { startRouter } from "./screens/router";
import { indexedDbStudioStorage } from "./storage/indexedDbStudioStorage";
import { startMuteButton } from "./sound/muteButton";
import { startSound } from "./sound/sound";

const root = document.querySelector<HTMLElement>("#screen")!;
const homeButton = document.querySelector<HTMLElement>("#home-button")!;
const muteButton = document.querySelector<HTMLButtonElement>("#mute-button")!;

// A link with a fragment is a shared Message: Reply mode (Dad's phone).
if (location.hash.length > 1) startReplyMode();
else startStudio();

registerServiceWorker();

function startStudio(): void {
  const core = createStudioCore({ storage: indexedDbStudioStorage(), clock: systemClock });
  startSound(() => core.settings().muted);
  // Draw once saved data is in (My Scripts are), so no screen shows half-loaded.
  // `core.load()` never rejects and IndexedDB is quick, so this is near-instant.
  void core.load().then(() => {
    startRouter(core, root, homeButton);
    startMuteButton(core, muteButton);
  });
}

/**
 * Reply mode: no IndexedDB, nothing saved on this phone (the core gets a
 * throwaway in-memory storage and never loads), no home or mute button.
 */
function startReplyMode(): void {
  homeButton.hidden = true;
  muteButton.hidden = true;
  const core = createStudioCore({ storage: inMemoryStudioStorage(), clock: systemClock });
  void startReplyPage(core, root, location.href);
  // Scanning another code while this page is open only changes the fragment.
  window.addEventListener("hashchange", () => location.reload());
}

/** Only there so add-to-home-screen works; see public/sw.js. */
function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  const url = new URL("sw.js", document.baseURI);
  navigator.serviceWorker.register(url).catch((e) => console.warn("Service worker not registered", e));
}
