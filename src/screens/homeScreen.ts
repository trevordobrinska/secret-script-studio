import type { Section } from "../core/studioCore";
import { el, type RenderScreen } from "./screen";
import { SECTION_NAMES } from "./sectionNames";

/** A little picture on each tile, made of plain text so it needs no image files. */
const TILE_ART: Record<Section, string> = {
  myScripts: "✎",
  library: "Λ Ж",
  numberExplorer: "1 2 3",
};

/** Home: three big tiles in fixed places, one tap to each section. */
export const homeScreen: RenderScreen = (root, _screen, { core, go }) => {
  root.append(el("h1", "home-title", "Secret Script Studio"));
  const tiles = el("nav", "home-tiles");
  for (const section of core.homeTiles()) {
    const tile = el("button", `tile tile-${section}`);
    tile.type = "button";
    tile.append(el("span", "tile-art", TILE_ART[section]), el("span", "tile-name", SECTION_NAMES[section]));
    tile.addEventListener("click", () => go({ name: section }));
    tiles.append(tile);
  }
  root.append(tiles);
};
