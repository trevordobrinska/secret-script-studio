import type { StudioCore } from "../core/studioCore";
import { playTap } from "./sound";
import "./muteButton.css";

/** Wires the shared `#mute-button` (index.html) to the core's muted setting. */
export function startMuteButton(core: StudioCore, button: HTMLButtonElement): void {
  const show = () => {
    const muted = core.settings().muted;
    button.classList.toggle("muted", muted);
    button.setAttribute("aria-pressed", String(muted));
    button.setAttribute("aria-label", muted ? "Sound off" : "Sound on");
  };
  button.addEventListener("click", () => {
    core.setMuted(!core.settings().muted);
    show();
    playTap(); // only heard when sound was just turned on
  });
  show();
  // Restore (backupPanel.ts) can change the muted setting.
  window.addEventListener("studio-settings-changed", show);
}
