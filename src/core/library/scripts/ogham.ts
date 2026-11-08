import type { WorldScript } from "../worldScript";

/**
 * Ogham, the old Irish tree alphabet (20 letters): notches cut along the edge of a stone,
 * read from the bottom up. Most letters are named after trees.
 */
const ogham: WorldScript = {
  id: "ogham",
  name: "Ogham",
  kind: "writing",
  about:
    "Ogham is an old Irish alphabet that people now use mostly for decoration. It was carved about 1,600 years ago in Ireland and parts of Britain, along the edges of tall standing stones. The letters are just straight notches and lines, and you read them from the bottom of the stone up!",
  characters: [
    { text: "ᚁ", name: "beith (birch)", sound: "B" },
    { text: "ᚂ", name: "luis", sound: "L" },
    { text: "ᚃ", name: "fearn (alder)", sound: "F (first W)" },
    { text: "ᚄ", name: "sail (willow)", sound: "S" },
    { text: "ᚅ", name: "nion (ash)", sound: "N" },
    { text: "ᚆ", name: "uath", sound: "H" },
    { text: "ᚇ", name: "dair (oak)", sound: "D" },
    { text: "ᚈ", name: "tinne", sound: "T" },
    { text: "ᚉ", name: "coll (hazel)", sound: "K" },
    { text: "ᚊ", name: "ceirt", sound: "KW" },
    { text: "ᚋ", name: "muin", sound: "M" },
    { text: "ᚌ", name: "gort", sound: "G" },
    { text: "ᚍ", name: "ngeadal", sound: "NG" },
    { text: "ᚎ", name: "straif", sound: "Z or ST" },
    { text: "ᚏ", name: "ruis", sound: "R" },
    { text: "ᚐ", name: "ailm", sound: "AH" },
    { text: "ᚑ", name: "onn", sound: "OH" },
    { text: "ᚒ", name: "ur", sound: "OO" },
    { text: "ᚓ", name: "eadhadh", sound: "EH" },
    { text: "ᚔ", name: "iodhadh (yew)", sound: "EE" },
  ],
  numerals: [],
};

export default ogham;
