import type { WorldScript } from "../worldScript";

/**
 * Glagolitic, the oldest Slavic alphabet, in its usual order (capital and small together). A few
 * rare letters are left out. Yer and yerʹ were very short vowels that later went silent.
 */
const glagolitic: WorldScript = {
  id: "glagolitic",
  name: "Glagolitic",
  kind: "writing",
  about:
    "Glagolitic is the oldest Slavic alphabet, and today you mostly see it in old church books and as decoration in Croatia. A monk named Cyril made it about 1,150 years ago, with his brother Methodius, so Slavic people could read the Bible in their own language. Funny thing: the Cyrillic alphabet is named after Cyril, but the one he really invented was this one!",
  characters: [
    { text: "Ⰰ ⰰ", name: "az", sound: "AH" },
    { text: "Ⰱ ⰱ", name: "buky", sound: "B" },
    { text: "Ⰲ ⰲ", name: "vedi", sound: "V" },
    { text: "Ⰳ ⰳ", name: "glagoli", sound: "G" },
    { text: "Ⰴ ⰴ", name: "dobro", sound: "D" },
    { text: "Ⰵ ⰵ", name: "yest", sound: "EH" },
    { text: "Ⰶ ⰶ", name: "zhivete", sound: "ZH (as in treasure)" },
    { text: "Ⰷ ⰷ", name: "dzelo", sound: "DZ" },
    { text: "Ⰸ ⰸ", name: "zemlja", sound: "Z" },
    { text: "Ⰹ ⰹ", name: "izhe", sound: "EE" },
    { text: "Ⰻ ⰻ", name: "i", sound: "EE" },
    { text: "Ⰼ ⰼ", name: "djerv", sound: "DY (a soft J)" },
    { text: "Ⰽ ⰽ", name: "kako", sound: "K" },
    { text: "Ⰾ ⰾ", name: "ljudi", sound: "L" },
    { text: "Ⰿ ⰿ", name: "myslete", sound: "M" },
    { text: "Ⱀ ⱀ", name: "nash", sound: "N" },
    { text: "Ⱁ ⱁ", name: "on", sound: "OH" },
    { text: "Ⱂ ⱂ", name: "pokoj", sound: "P" },
    { text: "Ⱃ ⱃ", name: "rtsi", sound: "R (rolled)" },
    { text: "Ⱄ ⱄ", name: "slovo", sound: "S" },
    { text: "Ⱅ ⱅ", name: "tverdo", sound: "T" },
    { text: "Ⱆ ⱆ", name: "uk", sound: "OO" },
    { text: "Ⱇ ⱇ", name: "fert", sound: "F" },
    { text: "Ⱈ ⱈ", name: "kher", sound: "KH (like the end of Bach)" },
    { text: "Ⱉ ⱉ", name: "ot", sound: "OH" },
    { text: "Ⱋ ⱋ", name: "shta", sound: "SHT" },
    { text: "Ⱌ ⱌ", name: "tsi", sound: "TS" },
    { text: "Ⱍ ⱍ", name: "cherv", sound: "CH" },
    { text: "Ⱎ ⱎ", name: "sha", sound: "SH" },
    { text: "Ⱏ ⱏ", name: "yer", sound: "a very short UH" },
    { text: "Ⱐ ⱐ", name: "yerʹ", sound: "a very short I" },
    { text: "Ⱑ ⱑ", name: "yat", sound: "YA or EH" },
    { text: "Ⱓ ⱓ", name: "yu", sound: "YOO" },
    { text: "Ⱔ ⱔ", name: "small yus", sound: "EN (through the nose)" },
    { text: "Ⱘ ⱘ", name: "big yus", sound: "ON (through the nose)" },
    { text: "Ⱚ ⱚ", name: "fita", sound: "F (in Greek words)" },
    { text: "Ⱛ ⱛ", name: "izhitsa", sound: "EE (in Greek words)" },
  ],
  numerals: [],
};

export default glagolitic;
