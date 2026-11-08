import "./messages.css";
import type { Screen, StudioCore } from "../core/studioCore";
import { playTap } from "../sound/sound";
import { el } from "./screen";
import "./myScripts.css";
import { secretToggle } from "./secretToggle";

/**
 * The Write screen's tool row: My Messages (the diary), secret mode, New
 * Message and Save. Every button is always there, so nothing moves; New
 * and Save are greyed out when there is nothing to clear or save. New
 * asks for a second tap before it throws away unsaved writing.
 * `redraw` redraws the Message; it calls `update()` back to refresh the row.
 */
export function writeTools(
  core: StudioCore,
  scriptId: string,
  go: (screen: Screen) => void,
  redraw: () => void,
): { row: HTMLElement; update(): void } {
  const row = el("div", "msg-actions wr-tools");
  let askingNew = false;

  const diary = button("Messages", "");
  diary.addEventListener("click", () => {
    playTap();
    go({ name: "messages", scriptId });
  });
  const fresh = button("New", "wr-new");
  fresh.addEventListener("click", () => {
    playTap();
    if (core.draft(scriptId).trim() !== "" && !askingNew) {
      askingNew = true;
      update();
      return;
    }
    core.clearDraft(scriptId);
    redraw();
  });
  const save = button("Save", "ms-write wr-save");
  save.addEventListener("click", () => {
    playTap();
    if (core.saveMessage(scriptId).ok) go({ name: "messages", scriptId });
  });
  row.append(diary, secretToggle(core, redraw), fresh, save);

  function update(): void {
    const draft = core.draft(scriptId);
    const editing = core.editingMessage(scriptId) !== undefined;
    if (draft.trim() === "") askingNew = false;
    fresh.textContent = askingNew ? "Clear it?" : "New";
    fresh.disabled = draft === "" && !editing;
    save.textContent = editing ? "Save changes" : "Save";
    save.disabled = draft.trim() === "";
  }

  return {
    row,
    update() {
      // Typing after the "tap again" question means he's carrying on.
      askingNew = false;
      update();
    },
  };
}

function button(text: string, className: string): HTMLButtonElement {
  const b = el("button", `ms-button ${className}`, text);
  b.type = "button";
  return b;
}
