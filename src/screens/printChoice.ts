import "./printChoice.css";
import type { PrintLayout, PrintOptions } from "../core/studioCore";
import { printSheet } from "../render/printSheet";
import { el } from "./screen";

/**
 * The "Print" choice, a small dialog over the page: just the Message, or
 * the Message plus a Cipher Key on its own page. Picking one prints at
 * once. `makeLayout` asks the core for the print layout; when it gives
 * nothing (e.g. an empty Message) nothing prints. `tap` plays a button
 * sound (the Reply page has none).
 */
export function openPrintChoice(
  makeLayout: (options: PrintOptions) => PrintLayout | undefined,
  tap: () => void = () => {},
): void {
  document.querySelector(".pc-backdrop")?.remove();
  const backdrop = el("div", "pc-backdrop");
  const dialog = el("div", "pc-dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-label", "Print");
  dialog.append(
    el("h2", "pc-title", "Print"),
    el("p", "pc-text", "The Cipher Key prints on its own page, so you can keep it."),
  );
  const choices = el("div", "pc-choices");
  choices.append(
    choice("Just the Message", "pc-plain", { cipherKey: false }),
    choice("Message + Cipher Key", "pc-key", { cipherKey: true }),
  );
  const cancel = el("button", "pc-cancel", "Cancel");
  cancel.type = "button";
  cancel.addEventListener("click", () => {
    tap();
    backdrop.remove();
  });
  dialog.append(choices, cancel);
  backdrop.append(dialog);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
  document.body.append(backdrop);

  function choice(text: string, className: string, options: PrintOptions): HTMLButtonElement {
    const b = el("button", `pc-choice ${className}`, text);
    b.type = "button";
    b.addEventListener("click", () => {
      tap();
      backdrop.remove();
      const layout = makeLayout(options);
      if (layout) printSheet(layout);
    });
    return b;
  }
}
