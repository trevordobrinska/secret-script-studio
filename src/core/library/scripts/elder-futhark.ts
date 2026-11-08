import type { WorldScript } from "../worldScript";

/** The Elder Futhark, the oldest runic alphabet (24 runes), in its usual order. */
const elderFuthark: WorldScript = {
  id: "elder-futhark",
  name: "Elder Futhark runes",
  kind: "writing",
  about:
    "Elder Futhark is the oldest set of runes, and nobody writes everyday things with it now. Germanic peoples in northern Europe carved it into wood, stone and metal almost 2,000 years ago. It is called \"futhark\" after its first six runes, F U TH A R K, the same way \"alphabet\" comes from alpha and beta!",
  characters: [
    { text: "ᚠ", name: "fehu", sound: "F" },
    { text: "ᚢ", name: "uruz", sound: "OO" },
    { text: "ᚦ", name: "thurisaz", sound: "TH (as in thin)" },
    { text: "ᚨ", name: "ansuz", sound: "AH" },
    { text: "ᚱ", name: "raidho", sound: "R" },
    { text: "ᚲ", name: "kaunan", sound: "K" },
    { text: "ᚷ", name: "gebo", sound: "G" },
    { text: "ᚹ", name: "wunjo", sound: "W" },
    { text: "ᚺ", name: "hagalaz", sound: "H" },
    { text: "ᚾ", name: "naudiz", sound: "N" },
    { text: "ᛁ", name: "isaz", sound: "EE" },
    { text: "ᛃ", name: "jera", sound: "Y (as in yes)" },
    { text: "ᛇ", name: "eihwaz", sound: "EI (nobody is quite sure)" },
    { text: "ᛈ", name: "perthro", sound: "P" },
    { text: "ᛉ", name: "algiz", sound: "Z" },
    { text: "ᛊ", name: "sowilo", sound: "S" },
    { text: "ᛏ", name: "tiwaz", sound: "T" },
    { text: "ᛒ", name: "berkanan", sound: "B" },
    { text: "ᛖ", name: "ehwaz", sound: "EH" },
    { text: "ᛗ", name: "mannaz", sound: "M" },
    { text: "ᛚ", name: "laguz", sound: "L" },
    { text: "ᛜ", name: "ingwaz", sound: "NG" },
    { text: "ᛞ", name: "dagaz", sound: "D" },
    { text: "ᛟ", name: "othala", sound: "OH" },
  ],
  numerals: [],
};

export default elderFuthark;
