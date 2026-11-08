import "./backup.css";
import type { StudioCore } from "../core/studioCore";
import { playTap } from "../sound/sound";
import { el } from "./screen";

/** Fired on window after Restore changed the Settings, so shared buttons (mute) can redraw. */
export const SETTINGS_CHANGED_EVENT = "studio-settings-changed";

/**
 * Backup and Restore, at the bottom of the My Scripts list (out of the way,
 * but anyone can use them). Backup downloads one file named with the date;
 * Restore opens a file picker and merges that file in. `restored` lets the
 * list redraw. The panel keeps its last message across the list's redraws.
 */
export function backupPanel(core: StudioCore, restored: () => void): HTMLElement {
  const panel = el("section", "bk-panel");
  panel.setAttribute("aria-label", "Backup and Restore");
  const note = el("p", "bk-note", "Keep your work safe: save a Backup file, and Restore it on any tablet.");
  const status = el("p", "bk-status");
  status.setAttribute("role", "status");

  const backup = button("Backup");
  backup.addEventListener("click", () => {
    playTap();
    const file = core.makeBackup();
    const url = URL.createObjectURL(new Blob([file.text], { type: "application/json" }));
    const link = el("a");
    link.href = url;
    link.download = file.fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    show(`Saved ${file.fileName}.`, false);
  });

  const picker = el("input", "bk-picker");
  picker.type = "file";
  picker.accept = ".json,application/json";
  picker.tabIndex = -1;
  picker.setAttribute("aria-hidden", "true");
  picker.addEventListener("change", async () => {
    const file = picker.files?.[0];
    if (!file) return;
    let text = "";
    try {
      text = await file.text();
    } catch {
      // An unreadable file falls through to the gentle message below.
    }
    picker.value = ""; // so picking the same file again still fires "change"
    const result = core.restoreBackup(text);
    if (!result.ok) {
      show("Couldn't read that backup. Nothing was changed.", true);
      return;
    }
    show(`Restored ${count(result.myScripts, "My Script")} and ${count(result.messages, "Message")}.`, false);
    window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
    restored();
  });

  const restore = button("Restore");
  restore.addEventListener("click", () => {
    playTap();
    picker.click();
  });

  const row = el("div", "bk-row");
  row.append(backup, restore);
  panel.append(note, row, status, picker);
  return panel;

  function show(text: string, problem: boolean): void {
    status.textContent = text;
    status.classList.toggle("bk-problem", problem);
  }
}

function count(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function button(text: string): HTMLButtonElement {
  const b = el("button", "ms-button ms-small bk-button", text);
  b.type = "button";
  return b;
}
