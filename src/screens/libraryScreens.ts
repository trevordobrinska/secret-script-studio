import type { StudioCore, WorldCharacter, WorldNumeral } from "../core/studioCore";
import { speak, stopSpeaking, voiceLangs } from "../sound/speech";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";
import "./library.css";

/** The Library: a calm list of World Scripts, one tap to each page. */
export const libraryScreen: RenderScreen = (root, _screen, { core, go }) => {
  root.append(el("h1", "screen-title", SECTION_NAMES.library));
  const list = el("nav", "library-list");
  for (const script of core.library()) {
    const item = el("button", `library-item library-${script.kind}`);
    item.type = "button";
    // A small taste, like the writing systems' first letter: the full set lives on the World Script's page.
    const sample = script.kind === "writing" ? script.characters[0]?.text : script.numerals.slice(0, 3).map((n) => n.text).join(" ");
    item.append(el("span", `library-sample library-sample-${script.kind}`, sample ?? ""), el("span", "library-name", script.name));
    item.addEventListener("click", () => go({ name: "worldScript", scriptId: script.id }));
    list.append(item);
  }
  root.append(list);
};

/** One World Script's page: every character big, with its name and sound, then its numerals. Read-only. */
export const worldScriptScreen: RenderScreen<{ name: "worldScript"; scriptId: string }> = (root, screen, { core, go }) => {
  const script = core.worldScript(screen.scriptId);
  if (!script) {
    go({ name: "library" });
    return;
  }
  root.append(el("h1", "screen-title", script.name));
  const page = el("div", "world-script-page");
  const back = el("button", "library-back", "‹ Library");
  back.type = "button";
  back.addEventListener("click", () => go({ name: "library" }));
  page.append(back);

  if (script.characters.length > 0) {
    if (script.direction === "rtl") page.append(el("p", "world-note", "Written right to left, so the letters start on the right."));
    const grid = el("div", "world-grid");
    if (script.direction === "rtl") grid.dir = "rtl";
    for (const character of script.characters) {
      grid.append(
        worldCard(core, script.id, character, [
          el("span", "world-char", character.text),
          el("span", "world-name", character.name),
          el("span", "world-sound", character.sound),
        ]),
      );
    }
    page.append(grid);
  }

  if (script.numerals.length > 0) {
    if (script.characters.length > 0) page.append(el("h2", "world-heading", "Numbers"));
    const grid = el("div", "world-grid");
    for (const numeral of script.numerals) {
      grid.append(
        worldCard(core, script.id, numeral, [el("span", "world-char", numeral.text), el("span", "world-value", String(numeral.value))]),
      );
    }
    page.append(grid);
  }
  root.append(page);
  return stopSpeaking;
};

/** How long a card glows when nothing is spoken (no speech synthesis on this device). */
const GLOW_MS = 600;

/** A World Character card: a button that says it aloud (the core decides what), glowing while it speaks. */
function worldCard(core: StudioCore, scriptId: string, entry: WorldCharacter | WorldNumeral, parts: HTMLElement[]): HTMLButtonElement {
  const card = el("button", "world-card");
  card.type = "button";
  card.append(...parts);
  let glowTimer: number | undefined;
  const glow = (on: boolean) => card.classList.toggle("speaking", on);
  card.addEventListener("click", () => {
    const tap = core.worldCharacterTap(scriptId, entry, voiceLangs());
    if (!tap) return;
    window.clearTimeout(glowTimer);
    glow(true);
    const spoken = speak(tap.speech, { onStart: () => glow(true), onEnd: () => glow(false) });
    if (!spoken) glowTimer = window.setTimeout(() => glow(false), GLOW_MS);
  });
  return card;
}
