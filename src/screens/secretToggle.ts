import "./messages.css";
import type { StudioCore } from "../core/studioCore";
import { playTap } from "../sound/sound";
import { el } from "./screen";

/**
 * The secret mode switch (Write screen and saved Messages): when on, the
 * plain letters under the Glyphs are hidden. The core remembers it while
 * he moves between screens; `changed` redraws whatever shows the Message.
 */
export function secretToggle(core: StudioCore, changed: () => void): HTMLButtonElement {
  const toggle = el("button", "ms-button msg-secret");
  toggle.type = "button";
  const show = () => {
    const on = core.secretMode();
    toggle.setAttribute("aria-pressed", String(on));
    toggle.textContent = on ? "Secret: on" : "Secret: off";
  };
  toggle.addEventListener("click", () => {
    playTap();
    core.setSecretMode(!core.secretMode());
    show();
    changed();
  });
  show();
  return toggle;
}
