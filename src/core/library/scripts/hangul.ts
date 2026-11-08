import type { WorldScript } from "../worldScript";

/**
 * Korean Hangul letters (jamo), one at a time. In real writing they stack into syllable blocks
 * (ㅎ + ㅏ + ㄴ = 한); the blocks aren't listed here.
 */
const hangul: WorldScript = {
  id: "hangul",
  name: "Hangul (Korean)",
  kind: "writing",
  characters: [
    { text: "ㄱ", name: "giyeok", sound: "G or K" },
    { text: "ㄴ", name: "nieun", sound: "N" },
    { text: "ㄷ", name: "digeut", sound: "D or T" },
    { text: "ㄹ", name: "rieul", sound: "R or L" },
    { text: "ㅁ", name: "mieum", sound: "M" },
    { text: "ㅂ", name: "bieup", sound: "B or P" },
    { text: "ㅅ", name: "siot", sound: "S" },
    { text: "ㅇ", name: "ieung", sound: "no sound at the start, NG at the end" },
    { text: "ㅈ", name: "jieut", sound: "J" },
    { text: "ㅊ", name: "chieut", sound: "CH" },
    { text: "ㅋ", name: "kieuk", sound: "K (with a puff)" },
    { text: "ㅌ", name: "tieut", sound: "T (with a puff)" },
    { text: "ㅍ", name: "pieup", sound: "P (with a puff)" },
    { text: "ㅎ", name: "hieut", sound: "H" },
    { text: "ㄲ", name: "ssang-giyeok", sound: "KK (tight K)" },
    { text: "ㄸ", name: "ssang-digeut", sound: "TT (tight T)" },
    { text: "ㅃ", name: "ssang-bieup", sound: "PP (tight P)" },
    { text: "ㅆ", name: "ssang-siot", sound: "SS (tight S)" },
    { text: "ㅉ", name: "ssang-jieut", sound: "JJ (tight J)" },
    { text: "ㅏ", name: "a", sound: "AH" },
    { text: "ㅑ", name: "ya", sound: "YAH" },
    { text: "ㅓ", name: "eo", sound: "UH (as in sun)" },
    { text: "ㅕ", name: "yeo", sound: "YUH" },
    { text: "ㅗ", name: "o", sound: "OH" },
    { text: "ㅛ", name: "yo", sound: "YOH" },
    { text: "ㅜ", name: "u", sound: "OO" },
    { text: "ㅠ", name: "yu", sound: "YOO" },
    { text: "ㅡ", name: "eu", sound: "UH (lips flat)" },
    { text: "ㅣ", name: "i", sound: "EE" },
    { text: "ㅐ", name: "ae", sound: "EH (as in bed)" },
    { text: "ㅒ", name: "yae", sound: "YEH" },
    { text: "ㅔ", name: "e", sound: "EH (as in bed)" },
    { text: "ㅖ", name: "ye", sound: "YEH" },
    { text: "ㅘ", name: "wa", sound: "WAH" },
    { text: "ㅙ", name: "wae", sound: "WEH" },
    { text: "ㅚ", name: "oe", sound: "WEH" },
    { text: "ㅝ", name: "wo", sound: "WUH" },
    { text: "ㅞ", name: "we", sound: "WEH" },
    { text: "ㅟ", name: "wi", sound: "WEE" },
    { text: "ㅢ", name: "ui", sound: "UH-EE" },
  ],
  numerals: [],
};

export default hangul;
