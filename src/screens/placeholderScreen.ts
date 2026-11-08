import type { Section } from "../core/studioCore";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";

/** Stands in for a section until its ticket builds the real screen. */
export const placeholderScreen: RenderScreen<{ name: Section }> = (root, screen) => {
  root.append(el("h1", "screen-title", SECTION_NAMES[screen.name]), el("p", "placeholder", "Coming soon."));
};
