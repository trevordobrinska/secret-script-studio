import type { WorldScript } from "../worldScript";

/**
 * The one-sound hieroglyphs (the "hieroglyphic alphabet"), in the order Egyptologists use. Each is
 * named after the picture it shows. The Egyptians didn't write vowels, so the sounds are how
 * Egyptologists say them today; nobody knows exactly how they sounded.
 */
const egyptianHieroglyphs: WorldScript = {
  id: "egyptian-hieroglyphs",
  name: "Egyptian hieroglyphs",
  kind: "writing",
  about:
    "Hieroglyphs were used in ancient Egypt for more than 3,000 years, starting about 5,000 years ago, carved on temples and painted in tombs. There were hundreds of signs, but these 25 each stand for just one sound, a bit like letters. After the old temples closed, nobody could read hieroglyphs for about 1,400 years, until a Frenchman named Champollion cracked them in 1822 using the Rosetta Stone!",
  characters: [
    { text: "𓄿", name: "vulture", sound: "AH (a catch in the throat)" },
    { text: "𓇋", name: "reed", sound: "EE (or AH)" },
    { text: "𓇌", name: "two reeds", sound: "Y (or EE)" },
    { text: "𓂝", name: "arm", sound: "AH (squeezed in the throat)" },
    { text: "𓅱", name: "quail chick", sound: "W (or OO)" },
    { text: "𓃀", name: "foot", sound: "B" },
    { text: "𓊪", name: "stool", sound: "P" },
    { text: "𓆑", name: "horned snake", sound: "F" },
    { text: "𓅓", name: "owl", sound: "M" },
    { text: "𓈖", name: "water", sound: "N" },
    { text: "𓂋", name: "mouth", sound: "R" },
    { text: "𓉔", name: "reed shelter", sound: "H" },
    { text: "𓎛", name: "twisted rope", sound: "H (breathy, from the throat)" },
    { text: "𓐍", name: "round sieve", sound: "KH (like the end of Bach)" },
    { text: "𓄡", name: "animal's belly", sound: "KH (a hissy KH)" },
    { text: "𓊃", name: "door bolt", sound: "Z" },
    { text: "𓋴", name: "folded cloth", sound: "S" },
    { text: "𓈙", name: "pool", sound: "SH" },
    { text: "𓈎", name: "hill", sound: "K (deep in the throat)" },
    { text: "𓎡", name: "basket", sound: "K" },
    { text: "𓎼", name: "jar stand", sound: "G" },
    { text: "𓏏", name: "bread loaf", sound: "T" },
    { text: "𓍿", name: "tying rope", sound: "CH" },
    { text: "𓂧", name: "hand", sound: "D" },
    { text: "𓆓", name: "cobra", sound: "J" },
  ],
  numerals: [],
};

export default egyptianHieroglyphs;
