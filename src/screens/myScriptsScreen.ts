import "./myScripts.css";
import type { MyScript } from "../core/myScript";
import { glyphImage } from "../render/glyphRenderer";
import { playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";

/** How many of a My Script's Glyphs its card previews. */
const PREVIEW_GLYPHS = 6;
const PREVIEW_SIZE = 44;

/**
 * My Scripts: "+ New My Script" in a fixed spot at the top, then one card
 * per My Script (name, ink and a few of its Glyphs) with Rename and Delete.
 * Rename edits the name in place; Delete asks first, in place, so nothing
 * is lost by one stray tap.
 */
export const myScriptsScreen: RenderScreen<{ name: "myScripts" }> = (root, _screen, { core, go }) => {
  /** The card being renamed or asking "delete?", if any. */
  let editing: { scriptId: string; mode: "rename" | "delete" } | undefined;

  root.append(el("h1", "screen-title", SECTION_NAMES.myScripts));
  const make = button("+ New My Script", "ms-new");
  make.addEventListener("click", () => {
    playTap();
    go({ name: "newMyScript" });
  });
  const top = el("div", "ms-list-top");
  top.append(make);
  const list = el("div", "ms-list");
  root.append(top, list);

  function draw(): void {
    const scripts = core.myScripts();
    list.replaceChildren(
      ...(scripts.length === 0 ? [el("p", "ms-hint", "Invent your own writing system!")] : []),
      ...scripts.map(card),
    );
    list.querySelector<HTMLInputElement>(".ms-rename-input")?.focus();
  }
  function change(next: typeof editing): void {
    playTap();
    editing = next;
    draw();
  }

  function card(script: MyScript): HTMLElement {
    const box = el("div", "ms-card");
    box.dataset.scriptId = script.id;
    if (editing?.scriptId === script.id && editing.mode === "rename") box.append(renameForm(script));
    else if (editing?.scriptId === script.id && editing.mode === "delete") box.append(...deleteQuestion(script));
    else box.append(...cardFace(script));
    return box;
  }

  function cardFace(script: MyScript): HTMLElement[] {
    const open = button("", "ms-script");
    const swatch = el("span", "ms-swatch");
    swatch.style.background = script.ink;
    const preview = el("span", "ms-preview");
    const drawn = core.drawnSlots(script.id);
    for (const slot of drawn.slice(0, PREVIEW_GLYPHS)) {
      preview.append(glyphImage(script.glyphs[slot]!.strokes, script, PREVIEW_SIZE));
    }
    if (drawn.length === 0) preview.append(el("span", "ms-preview-empty", "No Glyphs yet"));
    open.append(swatch, el("span", "ms-script-name", script.name), preview);
    open.addEventListener("click", () => {
      playTap();
      go({ name: "glyphGrid", scriptId: script.id });
    });

    const rename = button("Rename", "ms-small");
    rename.addEventListener("click", () => change({ scriptId: script.id, mode: "rename" }));
    const remove = button("Delete", "ms-small ms-danger");
    remove.addEventListener("click", () => change({ scriptId: script.id, mode: "delete" }));
    const side = el("div", "ms-card-actions");
    side.append(rename, remove);
    return [open, side];
  }

  function renameForm(script: MyScript): HTMLElement {
    const form = el("form", "ms-card-form");
    const name = el("input", "ms-name ms-rename-input");
    name.type = "text";
    name.maxLength = 30;
    name.value = script.name;
    name.autocomplete = "off";
    name.setAttribute("aria-label", "New name");
    const ok = button("OK", "ms-small ms-go-small");
    ok.type = "submit";
    const cancel = button("Cancel", "ms-small");
    cancel.addEventListener("click", () => change(undefined));
    name.addEventListener("input", () => (ok.disabled = name.value.trim() === ""));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (core.renameMyScript(script.id, name.value) === "needsName") return;
      change(undefined);
    });
    const actions = el("div", "ms-card-actions");
    actions.append(ok, cancel);
    form.append(name, actions);
    return form;
  }

  function deleteQuestion(script: MyScript): HTMLElement[] {
    const question = el("p", "ms-ask");
    question.append("Delete ", el("strong", "", script.name), " and all its Messages? It can't come back.");
    const yes = button("Delete it", "ms-small ms-danger");
    yes.addEventListener("click", () => {
      core.deleteMyScript(script.id);
      change(undefined);
    });
    const no = button("Keep it", "ms-small");
    no.addEventListener("click", () => change(undefined));
    const actions = el("div", "ms-card-actions");
    actions.append(no, yes);
    return [question, actions];
  }

  draw();
};

function button(text: string, className: string): HTMLButtonElement {
  const b = el("button", `ms-button ${className}`, text);
  b.type = "button";
  return b;
}
