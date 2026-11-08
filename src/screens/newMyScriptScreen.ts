import "./myScripts.css";
import { INK_COLORS, STROKE_WIDTHS } from "../core/myScript";
import { el, type RenderScreen } from "./screen";

const WIDTH_NAMES: Record<keyof typeof STROKE_WIDTHS, string> = { thin: "Thin", medium: "Medium", thick: "Thick" };

/** Making a new My Script: a name, an ink and a stroke width, chosen once. */
export const newMyScriptScreen: RenderScreen<{ name: "newMyScript" }> = (root, _screen, { core, go }) => {
  let ink: string = INK_COLORS[0];
  let strokeWidth: number = STROKE_WIDTHS.medium;

  root.append(el("h1", "screen-title", "New My Script"));
  const form = el("form", "ms-form");

  const name = el("input", "ms-name");
  name.type = "text";
  name.maxLength = 30;
  name.placeholder = "Name it…";
  name.autocomplete = "off";
  form.append(el("label", "ms-label", "Name"), name);

  form.append(el("div", "ms-label", "Ink"));
  const inks = el("div", "ms-choices");
  for (const color of INK_COLORS) {
    const b = el("button", "ms-ink");
    b.type = "button";
    b.style.background = color;
    b.setAttribute("aria-label", `Ink ${color}`);
    b.addEventListener("click", () => {
      ink = color;
      refresh();
    });
    inks.append(b);
  }
  form.append(inks);

  form.append(el("div", "ms-label", "Pen"));
  const widths = el("div", "ms-choices");
  for (const [key, width] of Object.entries(STROKE_WIDTHS) as [keyof typeof STROKE_WIDTHS, number][]) {
    const b = el("button", "ms-width");
    b.type = "button";
    b.dataset.width = String(width);
    const line = el("span", "ms-width-line");
    line.style.height = `${Math.round(width * 120)}px`;
    b.append(line, el("span", "", WIDTH_NAMES[key]));
    b.addEventListener("click", () => {
      strokeWidth = width;
      refresh();
    });
    widths.append(b);
  }
  form.append(widths);

  const make = el("button", "ms-button ms-go", "Make it!");
  make.type = "submit";
  form.append(make);

  function refresh(): void {
    inks.querySelectorAll<HTMLElement>(".ms-ink").forEach((b, i) => b.classList.toggle("chosen", INK_COLORS[i] === ink));
    widths.querySelectorAll<HTMLElement>(".ms-width").forEach((b) => {
      b.classList.toggle("chosen", Number(b.dataset.width) === strokeWidth);
      b.querySelector<HTMLElement>(".ms-width-line")!.style.background = ink;
    });
    make.disabled = name.value.trim() === "";
  }
  name.addEventListener("input", refresh);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = core.createMyScript({ name: name.value, ink, strokeWidth });
    // A brand-new My Script nudges "start with the letters of your name".
    if (result.ok) go({ name: "nameNudge", scriptId: result.script.id });
    else name.focus();
  });

  root.append(form);
  refresh();
};
