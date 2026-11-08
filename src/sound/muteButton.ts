import type { StudioCore } from "../core/studioCore";
import { playTap } from "./sound";
import { stopSpeaking } from "./speech";
import "./muteButton.css";

let wired: HTMLButtonElement | undefined;

/** Wires the shared `#mute-button` (index.html) to the core's muted setting. */
export function startMuteButton(core: StudioCore, button: HTMLButtonElement): void {
  wired = button;
  const show = () => {
    const muted = core.settings().muted;
    button.classList.toggle("muted", muted);
    button.setAttribute("aria-pressed", String(muted));
    button.setAttribute("aria-label", muted ? "Sound off" : "Sound on");
    if (muted) stopSpeaking(); // mute cuts off a letter mid-word
  };
  button.addEventListener("click", () => {
    core.setMuted(!core.settings().muted);
    show();
    playTap(); // only heard when sound was just turned on
  });
  button.addEventListener("animationend", () => button.classList.remove("wiggle"));
  show();
  // Restore (backupPanel.ts) can change the muted setting.
  window.addEventListener("studio-settings-changed", show);
}

/**
 * One soft wiggle of the mute button, for a tap that stays quiet because the
 * sound is off. A wiggle already running finishes as it is (they don't stack).
 */
export function wiggleMuteButton(): void {
  wired?.classList.add("wiggle");
}
