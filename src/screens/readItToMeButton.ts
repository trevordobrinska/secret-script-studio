import "./messages.css";
import "./myScripts.css";
import type { SpeakOrMuted } from "../core/studioCore";
import { tapToHear } from "../sound/tapToHear";
import { el } from "./screen";

/**
 * The Read it to me button (Write screen, saved Messages, and Dad's reply
 * page): says the whole Message in his Sounds. `read` asks the core what
 * to say (`core.readItToMe(text, glyphs)`), so it's always the Message as
 * it is now. It glows while speaking; tapping it again while it's speaking
 * stops it; while muted it glows and wiggles the mute button.
 * `buttonClass` is the button's look: the Studio's, or the reply page's.
 */
export function readItToMeButton(read: () => SpeakOrMuted | undefined, buttonClass = "ms-button"): HTMLButtonElement {
  const button = el("button", `${buttonClass} msg-read-aloud`, "🔊 Read it to me");
  button.type = "button";
  const hear = tapToHear(button, { tapAgainStops: true });
  button.addEventListener("click", () => hear(read()));
  return button;
}
