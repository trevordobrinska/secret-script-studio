import type { WorldScript } from "../worldScript";

/**
 * Babylonian cuneiform numerals, pressed into clay: upright wedges are ones, corner wedges are
 * tens. They count in sixties, so after 59 the ones wedge means 60 too.
 */
const babylonian: WorldScript = {
  id: "babylonian",
  name: "Babylonian numerals",
  kind: "numerals",
  characters: [],
  numerals: [
    { text: "\u{12079}", value: 1 },
    { text: "\u{1222B}", value: 2 },
    { text: "\u{12408}", value: 3 },
    { text: "\u{12409}", value: 4 },
    { text: "\u{1240A}", value: 5 },
    { text: "\u{1240B}", value: 6 },
    { text: "\u{1240C}", value: 7 },
    { text: "\u{1240D}", value: 8 },
    { text: "\u{1240E}", value: 9 },
    { text: "\u{1230B}", value: 10 },
    { text: "\u{12399}", value: 20 },
    { text: "\u{1230D}", value: 30 },
    { text: "\u{1240F}", value: 40 },
    { text: "\u{12410}", value: 50 },
  ],
};

export default babylonian;
