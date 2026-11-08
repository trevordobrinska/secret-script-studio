import type { WorldScript } from "../worldScript";

/**
 * The modern Georgian alphabet (Mkhedruli, 33 letters, no capitals). "Sharp" letters are said
 * with a little pop in the throat; "with a puff" ones with a breath of air.
 */
const georgian: WorldScript = {
  id: "georgian",
  name: "Georgian",
  kind: "writing",
  voice: "ka",
  characters: [
    { text: "ა", name: "ani", sound: "AH" },
    { text: "ბ", name: "bani", sound: "B" },
    { text: "გ", name: "gani", sound: "G" },
    { text: "დ", name: "doni", sound: "D" },
    { text: "ე", name: "eni", sound: "EH (as in bed)" },
    { text: "ვ", name: "vini", sound: "V" },
    { text: "ზ", name: "zeni", sound: "Z" },
    { text: "თ", name: "tani", sound: "T (with a puff)" },
    { text: "ი", name: "ini", sound: "EE" },
    { text: "კ", name: "k'ani", sound: "K (sharp)" },
    { text: "ლ", name: "lasi", sound: "L" },
    { text: "მ", name: "mani", sound: "M" },
    { text: "ნ", name: "nari", sound: "N" },
    { text: "ო", name: "oni", sound: "OH" },
    { text: "პ", name: "p'ari", sound: "P (sharp)" },
    { text: "ჟ", name: "zhani", sound: "ZH (like s in treasure)" },
    { text: "რ", name: "rae", sound: "R (rolled)" },
    { text: "ს", name: "sani", sound: "S" },
    { text: "ტ", name: "t'ari", sound: "T (sharp)" },
    { text: "უ", name: "uni", sound: "OO" },
    { text: "ფ", name: "pari", sound: "P (with a puff)" },
    { text: "ქ", name: "kani", sound: "K (with a puff)" },
    { text: "ღ", name: "ghani", sound: "GH (like a gargle)" },
    { text: "ყ", name: "q'ari", sound: "K (sharp, deep in the throat)" },
    { text: "შ", name: "shini", sound: "SH" },
    { text: "ჩ", name: "chini", sound: "CH (with a puff)" },
    { text: "ც", name: "tsani", sound: "TS (with a puff)" },
    { text: "ძ", name: "dzili", sound: "DZ" },
    { text: "წ", name: "ts'ili", sound: "TS (sharp)" },
    { text: "ჭ", name: "ch'ari", sound: "CH (sharp)" },
    { text: "ხ", name: "khani", sound: "KH (like clearing your throat)" },
    { text: "ჯ", name: "jani", sound: "J" },
    { text: "ჰ", name: "hae", sound: "H" },
  ],
  numerals: [],
};

export default georgian;
