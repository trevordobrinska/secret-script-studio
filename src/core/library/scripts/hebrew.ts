import type { WorldScript } from "../worldScript";

/**
 * The Hebrew alphabet (22 letters, no vowels). Five letters have a different shape at the
 * end of a word; that end form is shown after the usual one ("כ ך").
 * Hebrew also counts with its letters, so the numerals are letters too.
 */
const hebrew: WorldScript = {
  id: "hebrew",
  name: "Hebrew",
  kind: "writing",
  about:
    "Hebrew is used in Israel and in Jewish prayer books all over the world. These letters are more than 2,000 years old and grew out of an older script called Aramaic. Hebrew is written right to left, and the vowels are usually left out, or shown as tiny dots under the letters.",
  direction: "rtl",
  characters: [
    { text: "א", name: "alef", sound: "no sound (holds a vowel)" },
    { text: "ב", name: "bet", sound: "B or V" },
    { text: "ג", name: "gimel", sound: "G" },
    { text: "ד", name: "dalet", sound: "D" },
    { text: "ה", name: "he", sound: "H" },
    { text: "ו", name: "vav", sound: "V (or a vowel, O or OO)" },
    { text: "ז", name: "zayin", sound: "Z" },
    { text: "ח", name: "het", sound: "KH (in the throat)" },
    { text: "ט", name: "tet", sound: "T" },
    { text: "י", name: "yod", sound: "Y" },
    { text: "כ ך", name: "kaf", sound: "K or KH" },
    { text: "ל", name: "lamed", sound: "L" },
    { text: "מ ם", name: "mem", sound: "M" },
    { text: "נ ן", name: "nun", sound: "N" },
    { text: "ס", name: "samekh", sound: "S" },
    { text: "ע", name: "ayin", sound: "no sound today (holds a vowel)" },
    { text: "פ ף", name: "pe", sound: "P or F" },
    { text: "צ ץ", name: "tsadi", sound: "TS" },
    { text: "ק", name: "qof", sound: "K" },
    { text: "ר", name: "resh", sound: "R (in the throat)" },
    { text: "ש", name: "shin", sound: "SH or S" },
    { text: "ת", name: "tav", sound: "T" },
  ],
  numerals: [
    { text: "א", value: 1 },
    { text: "ב", value: 2 },
    { text: "ג", value: 3 },
    { text: "ד", value: 4 },
    { text: "ה", value: 5 },
    { text: "ו", value: 6 },
    { text: "ז", value: 7 },
    { text: "ח", value: 8 },
    { text: "ט", value: 9 },
    { text: "י", value: 10 },
    { text: "כ", value: 20 },
    { text: "ל", value: 30 },
    { text: "מ", value: 40 },
    { text: "נ", value: 50 },
    { text: "ס", value: 60 },
    { text: "ע", value: 70 },
    { text: "פ", value: 80 },
    { text: "צ", value: 90 },
    { text: "ק", value: 100 },
    { text: "ר", value: 200 },
    { text: "ש", value: 300 },
    { text: "ת", value: 400 },
  ],
};

export default hebrew;
