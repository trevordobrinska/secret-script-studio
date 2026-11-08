import type { WorldScript } from "../worldScript";

/**
 * The Arabic alphabet (28 letters), each shown on its own (its "alone" shape; letters join up
 * and change shape inside a word). The numerals are the Eastern Arabic digits used with it.
 */
const arabic: WorldScript = {
  id: "arabic",
  name: "Arabic",
  kind: "writing",
  voice: "ar",
  direction: "rtl",
  characters: [
    { text: "ا", name: "alif", sound: "A (as in father)" },
    { text: "ب", name: "ba", sound: "B" },
    { text: "ت", name: "ta", sound: "T" },
    { text: "ث", name: "tha", sound: "TH (as in thin)" },
    { text: "ج", name: "jim", sound: "J" },
    { text: "ح", name: "ḥa", sound: "H (breathy, from the throat)" },
    { text: "خ", name: "kha", sound: "KH (like clearing your throat)" },
    { text: "د", name: "dal", sound: "D" },
    { text: "ذ", name: "dhal", sound: "TH (as in this)" },
    { text: "ر", name: "ra", sound: "R (rolled)" },
    { text: "ز", name: "zay", sound: "Z" },
    { text: "س", name: "sin", sound: "S" },
    { text: "ش", name: "shin", sound: "SH" },
    { text: "ص", name: "ṣad", sound: "S (heavy)" },
    { text: "ض", name: "ḍad", sound: "D (heavy)" },
    { text: "ط", name: "ṭa", sound: "T (heavy)" },
    { text: "ظ", name: "ẓa", sound: "TH as in this (heavy)" },
    { text: "ع", name: "ayn", sound: "a squeeze deep in the throat" },
    { text: "غ", name: "ghayn", sound: "GH (like a gargle)" },
    { text: "ف", name: "fa", sound: "F" },
    { text: "ق", name: "qaf", sound: "K (deep in the throat)" },
    { text: "ك", name: "kaf", sound: "K" },
    { text: "ل", name: "lam", sound: "L" },
    { text: "م", name: "mim", sound: "M" },
    { text: "ن", name: "nun", sound: "N" },
    { text: "ه", name: "ha", sound: "H" },
    { text: "و", name: "waw", sound: "W (or OO)" },
    { text: "ي", name: "ya", sound: "Y (or EE)" },
  ],
  numerals: [
    { text: "٠", value: 0 },
    { text: "١", value: 1 },
    { text: "٢", value: 2 },
    { text: "٣", value: 3 },
    { text: "٤", value: 4 },
    { text: "٥", value: 5 },
    { text: "٦", value: 6 },
    { text: "٧", value: 7 },
    { text: "٨", value: 8 },
    { text: "٩", value: 9 },
  ],
};

export default arabic;
