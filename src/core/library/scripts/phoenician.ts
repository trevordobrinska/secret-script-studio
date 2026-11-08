import type { WorldScript } from "../worldScript";

/**
 * The 22 Phoenician letters, written right to left. Like Hebrew and Arabic, there are only consonants.
 * Many letter names are words (alep is "ox"); meanings nobody is sure of are left off. The numbers
 * are Phoenician's own number signs.
 */
const phoenician: WorldScript = {
  id: "phoenician",
  name: "Phoenician",
  kind: "writing",
  direction: "rtl",
  about:
    "Phoenician was used about 3,000 years ago by sailors and traders from what is now Lebanon, and nobody uses it today. It has only 22 letters, all consonants, written right to left. It is the great-grandparent of the Greek, Latin, Hebrew and Arabic alphabets: our letter A started as alep, an ox's head, so turn an A upside down and you can still see the horns!",
  characters: [
    { text: "𐤀", name: "alep (ox)", sound: "a catch in the throat, like the middle of uh-oh" },
    { text: "𐤁", name: "bet (house)", sound: "B" },
    { text: "𐤂", name: "gimel (camel)", sound: "G" },
    { text: "𐤃", name: "dalet (door)", sound: "D" },
    { text: "𐤄", name: "he", sound: "H" },
    { text: "𐤅", name: "waw (hook)", sound: "W" },
    { text: "𐤆", name: "zayin (weapon)", sound: "Z" },
    { text: "𐤇", name: "het (fence)", sound: "H (breathy, from the throat)" },
    { text: "𐤈", name: "tet (wheel)", sound: "T (heavy)" },
    { text: "𐤉", name: "yod (hand)", sound: "Y" },
    { text: "𐤊", name: "kap (palm of the hand)", sound: "K" },
    { text: "𐤋", name: "lamed (stick for herding cows)", sound: "L" },
    { text: "𐤌", name: "mem (water)", sound: "M" },
    { text: "𐤍", name: "nun (fish)", sound: "N" },
    { text: "𐤎", name: "samek", sound: "S" },
    { text: "𐤏", name: "ayin (eye)", sound: "a squeeze in the throat" },
    { text: "𐤐", name: "pe (mouth)", sound: "P" },
    { text: "𐤑", name: "sade", sound: "TS (or a heavy S)" },
    { text: "𐤒", name: "qop", sound: "K (deep in the throat)" },
    { text: "𐤓", name: "resh (head)", sound: "R" },
    { text: "𐤔", name: "shin (tooth)", sound: "SH" },
    { text: "𐤕", name: "taw (mark)", sound: "T" },
  ],
  numerals: [
    { text: "𐤖", value: 1 },
    { text: "𐤚", value: 2 },
    { text: "𐤛", value: 3 },
    { text: "𐤗", value: 10 },
    { text: "𐤘", value: 20 },
    { text: "𐤙", value: 100 },
  ],
};

export default phoenician;
