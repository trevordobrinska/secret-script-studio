import "./myScripts.css";
import { NAME_MAX_LENGTH } from "../core/myScript";
import { playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";

/**
 * The name nudge, shown once right after making a My Script: he types his
 * name (or any word) and its letters are offered first on the grid, so
 * there's no 47-Glyph wall. "Skip" goes straight to the grid.
 */
export const nameNudgeScreen: RenderScreen<{ name: "nameNudge"; scriptId: string }> = (root, screen, { core, go }) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  root.append(el("h1", "screen-title", script.name));
  const form = el("form", "ms-form ms-nudge");
  form.append(el("p", "ms-nudge-text", "Start with the letters of your name!"));

  const word = el("input", "ms-name");
  word.type = "text";
  word.maxLength = NAME_MAX_LENGTH;
  word.placeholder = "Your name, or any word…";
  word.autocomplete = "off";
  const letters = el("div", "ms-nudge-letters");

  const actions = el("div", "ms-actions");
  const start = el("button", "ms-button ms-go", "Start drawing");
  start.type = "submit";
  const skip = el("button", "ms-button", "Skip");
  skip.type = "button";
  actions.append(start, skip);
  form.append(word, letters, actions);
  root.append(form);

  function refresh(): void {
    const slots = core.suggestedLetters(word.value);
    letters.replaceChildren(...slots.map((slot) => el("span", "ms-nudge-letter", slot)));
    start.disabled = slots.length === 0;
  }
  word.addEventListener("input", refresh);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const startWith = core.suggestedLetters(word.value);
    if (startWith.length === 0) return;
    playTap();
    go({ name: "glyphGrid", scriptId: script.id, startWith });
  });
  skip.addEventListener("click", () => {
    playTap();
    go({ name: "glyphGrid", scriptId: script.id });
  });
  refresh();
};
