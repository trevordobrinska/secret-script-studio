import "./messages.css";
import "./myScripts.css";
import type { GlyphTap } from "../core/studioCore";
import { tapToHear } from "../sound/tapToHear";
import { el } from "./screen";

/**
 * The Read it to me button (Write screen, saved Messages, and Dad's reply
 * page): says the whole Message in his Sounds. `read` asks the core what
 * to say (`core.readItToMe(text, glyphs)`), so it's always the Message as
 * it is now. It glows while speaking; tapping again cuts it off and starts
 * over; while muted it glows and wiggles the mute button.
 */
export function readItToMeButton(read: () => GlyphTap | undefined): HTMLButtonElement {
  const button = el("button", "ms-button msg-read-aloud", "🔊 Read it to me");
  button.type = "button";
  const hear = tapToHear(button);
  button.addEventListener("click", () => hear(read()));
  return button;
}
