import type { WorldScript } from "../worldScript";

/**
 * The Gothic alphabet (25 letters) in its usual order. Two more Gothic signs were only ever used as
 * numbers (90 and 900) and are left out.
 */
const gothic: WorldScript = {
  id: "gothic",
  name: "Gothic",
  kind: "writing",
  about:
    "Nobody speaks Gothic any more: it was the language of the Goths, a people who once fought the Roman Empire. A bishop named Wulfila made this alphabet about 1,650 years ago from Greek letters, with a few Latin letters and runes mixed in, so he could write the Bible in Gothic. The most famous Gothic book is the \"Silver Bible\", written in silver and gold ink on purple pages!",
  characters: [
    { text: "𐌰", name: "ahsa", sound: "AH" },
    { text: "𐌱", name: "bairkan", sound: "B" },
    { text: "𐌲", name: "giba", sound: "G" },
    { text: "𐌳", name: "dags", sound: "D" },
    { text: "𐌴", name: "aihvus", sound: "AY (or EH)" },
    { text: "𐌵", name: "qairthra", sound: "KW" },
    { text: "𐌶", name: "iuja", sound: "Z" },
    { text: "𐌷", name: "hagl", sound: "H" },
    { text: "𐌸", name: "thiuth", sound: "TH (as in thin)" },
    { text: "𐌹", name: "eis", sound: "EE" },
    { text: "𐌺", name: "kusma", sound: "K" },
    { text: "𐌻", name: "lagus", sound: "L" },
    { text: "𐌼", name: "manna", sound: "M" },
    { text: "𐌽", name: "nauths", sound: "N" },
    { text: "𐌾", name: "jer", sound: "Y (as in yes)" },
    { text: "𐌿", name: "urus", sound: "OO" },
    { text: "𐍀", name: "pairthra", sound: "P" },
    { text: "𐍂", name: "raida", sound: "R" },
    { text: "𐍃", name: "sauil", sound: "S" },
    { text: "𐍄", name: "teiws", sound: "T" },
    { text: "𐍅", name: "winja", sound: "W" },
    { text: "𐍆", name: "faihu", sound: "F" },
    { text: "𐍇", name: "iggws", sound: "KH (in Greek names)" },
    { text: "𐍈", name: "hwair", sound: "HW (a breathy W)" },
    { text: "𐍉", name: "othal", sound: "OH" },
  ],
  numerals: [],
};

export default gothic;
