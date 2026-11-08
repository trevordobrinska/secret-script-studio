import type { WorldScript } from "../worldScript";

/**
 * The 30 Tibetan consonants in their usual order. Each one says its sound plus "ah" (ཀ = "kah")
 * unless a vowel mark changes it; the vowel marks (written above or below a letter) aren't listed.
 * Sounds are the written ones, simplified: in Lhasa some are said differently. Then the Tibetan digits.
 */
const tibetan: WorldScript = {
  id: "tibetan",
  name: "Tibetan",
  kind: "writing",
  voice: "bo",
  about:
    "Tibetan is used in Tibet, Bhutan, Nepal and northern India, and in Buddhist books all over the world. It was made about 1,400 years ago from an Indian script, for a Tibetan king who wanted his people to be able to write. Tibetan doesn't put spaces between words: instead, a tiny dot sits after every syllable!",
  characters: [
    { text: "ཀ", name: "ka", sound: "K" },
    { text: "ཁ", name: "kha", sound: "K with a puff" },
    { text: "ག", name: "ga", sound: "G" },
    { text: "ང", name: "nga", sound: "NG" },
    { text: "ཅ", name: "ca", sound: "CH" },
    { text: "ཆ", name: "cha", sound: "CH with a puff" },
    { text: "ཇ", name: "ja", sound: "J" },
    { text: "ཉ", name: "nya", sound: "NY" },
    { text: "ཏ", name: "ta", sound: "T" },
    { text: "ཐ", name: "tha", sound: "T with a puff" },
    { text: "ད", name: "da", sound: "D" },
    { text: "ན", name: "na", sound: "N" },
    { text: "པ", name: "pa", sound: "P" },
    { text: "ཕ", name: "pha", sound: "P with a puff" },
    { text: "བ", name: "ba", sound: "B" },
    { text: "མ", name: "ma", sound: "M" },
    { text: "ཙ", name: "tsa", sound: "TS" },
    { text: "ཚ", name: "tsha", sound: "TS with a puff" },
    { text: "ཛ", name: "dza", sound: "DZ" },
    { text: "ཝ", name: "wa", sound: "W" },
    { text: "ཞ", name: "zha", sound: "ZH (as in treasure)" },
    { text: "ཟ", name: "za", sound: "Z" },
    { text: "འ", name: "'a", sound: "AH (a quiet letter that holds a vowel)" },
    { text: "ཡ", name: "ya", sound: "Y" },
    { text: "ར", name: "ra", sound: "R" },
    { text: "ལ", name: "la", sound: "L" },
    { text: "ཤ", name: "sha", sound: "SH" },
    { text: "ས", name: "sa", sound: "S" },
    { text: "ཧ", name: "ha", sound: "H" },
    { text: "ཨ", name: "a", sound: "AH" },
  ],
  numerals: [
    { text: "༠", value: 0 },
    { text: "༡", value: 1 },
    { text: "༢", value: 2 },
    { text: "༣", value: 3 },
    { text: "༤", value: 4 },
    { text: "༥", value: 5 },
    { text: "༦", value: 6 },
    { text: "༧", value: 7 },
    { text: "༨", value: 8 },
    { text: "༩", value: 9 },
  ],
};

export default tibetan;
