import "./myScripts.css";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";

/**
 * My Scripts: one big button per My Script, plus "New My Script".
 * (Ticket 05 adds previews, rename and delete.)
 */
export const myScriptsScreen: RenderScreen<{ name: "myScripts" }> = (root, _screen, { core, go }) => {
  root.append(el("h1", "screen-title", SECTION_NAMES.myScripts));
  const list = el("div", "ms-list");
  for (const script of core.myScripts()) {
    const button = el("button", "ms-button ms-script");
    button.type = "button";
    const swatch = el("span", "ms-swatch");
    swatch.style.background = script.ink;
    button.append(swatch, el("span", "ms-script-name", script.name));
    button.addEventListener("click", () => go({ name: "glyphGrid", scriptId: script.id }));
    list.append(button);
  }
  const make = el("button", "ms-button ms-new", "+ New My Script");
  make.type = "button";
  make.addEventListener("click", () => go({ name: "newMyScript" }));
  list.append(make);
  if (core.myScripts().length === 0) list.prepend(el("p", "ms-hint", "Invent your own writing system!"));
  root.append(list);
};
