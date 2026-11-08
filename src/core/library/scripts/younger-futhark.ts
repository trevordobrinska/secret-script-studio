import type { WorldScript } from "../worldScript";

/**
 * The Younger Futhark, the 16 runes of the Viking Age, in its usual order (the long-branch, or Danish,
 * shapes). With so few runes, one rune often stands for several sounds.
 */
const youngerFuthark: WorldScript = {
  id: "younger-futhark",
  name: "Younger Futhark runes",
  kind: "writing",
  about:
    "Younger Futhark is the set of runes the Vikings used in Denmark, Norway and Sweden, starting about 1,200 years ago. It grew out of the older Elder Futhark, but it has only 16 runes instead of 24, so one rune often has to stand for several sounds. Vikings carved runes wherever they went: one even scratched his name, Halfdan, into a balcony in a great church in Istanbul!",
  characters: [
    { text: "ᚠ", name: "fé", sound: "F (or V)" },
    { text: "ᚢ", name: "úr", sound: "OO (or OH, or W)" },
    { text: "ᚦ", name: "thurs", sound: "TH (as in thin or this)" },
    { text: "ᚬ", name: "áss", sound: "O (or AH through the nose)" },
    { text: "ᚱ", name: "reið", sound: "R" },
    { text: "ᚴ", name: "kaun", sound: "K (or G)" },
    { text: "ᚼ", name: "hagall", sound: "H" },
    { text: "ᚾ", name: "nauð", sound: "N" },
    { text: "ᛁ", name: "íss", sound: "EE (or EH, or Y)" },
    { text: "ᛅ", name: "ár", sound: "AH" },
    { text: "ᛋ", name: "sól", sound: "S" },
    { text: "ᛏ", name: "týr", sound: "T (or D)" },
    { text: "ᛒ", name: "bjarkan", sound: "B (or P)" },
    { text: "ᛘ", name: "maðr", sound: "M" },
    { text: "ᛚ", name: "lögr", sound: "L" },
    { text: "ᛦ", name: "yr", sound: "R (a buzzy R at the end of a word)" },
  ],
  numerals: [],
};

export default youngerFuthark;
