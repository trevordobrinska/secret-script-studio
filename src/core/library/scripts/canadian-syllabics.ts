import type { WorldScript } from "../worldScript";

/**
 * Canadian syllabics as used for Inuktitut in Nunavut: the three vowels i, u and a, then each
 * consonant with i, u and a. Turning a shape changes its vowel (ᐱ pi, ᐳ pu, ᐸ pa). The small
 * "final" signs (a consonant on its own) and the dot that makes a vowel long are left out.
 * Inuktitut "j" sounds like the Y in yes.
 */
const canadianSyllabics: WorldScript = {
  id: "canadian-syllabics",
  name: "Canadian syllabics (Inuktitut)",
  kind: "writing",
  about:
    "Canadian syllabics are used to write Inuktitut, the language of the Inuit, in the far north of Canada, and also Cree and other languages. A missionary named James Evans first made them for the Cree language in 1840, and they were soon changed to fit Inuktitut too. The clever part: turning a shape changes its vowel, so ᐱ is pi, ᐳ is pu and ᐸ is pa!",
  characters: [
    { text: "ᐃ", name: "i", sound: "EE" },
    { text: "ᐅ", name: "u", sound: "OO" },
    { text: "ᐊ", name: "a", sound: "AH" },
    { text: "ᐱ", name: "pi", sound: "PEE" },
    { text: "ᐳ", name: "pu", sound: "POO" },
    { text: "ᐸ", name: "pa", sound: "PAH" },
    { text: "ᑎ", name: "ti", sound: "TEE" },
    { text: "ᑐ", name: "tu", sound: "TOO" },
    { text: "ᑕ", name: "ta", sound: "TAH" },
    { text: "ᑭ", name: "ki", sound: "KEE" },
    { text: "ᑯ", name: "ku", sound: "KOO" },
    { text: "ᑲ", name: "ka", sound: "KAH" },
    { text: "ᒋ", name: "gi", sound: "GEE" },
    { text: "ᒍ", name: "gu", sound: "GOO" },
    { text: "ᒐ", name: "ga", sound: "GAH" },
    { text: "ᒥ", name: "mi", sound: "MEE" },
    { text: "ᒧ", name: "mu", sound: "MOO" },
    { text: "ᒪ", name: "ma", sound: "MAH" },
    { text: "ᓂ", name: "ni", sound: "NEE" },
    { text: "ᓄ", name: "nu", sound: "NOO" },
    { text: "ᓇ", name: "na", sound: "NAH" },
    { text: "ᓯ", name: "si", sound: "SEE" },
    { text: "ᓱ", name: "su", sound: "SOO" },
    { text: "ᓴ", name: "sa", sound: "SAH" },
    { text: "ᓕ", name: "li", sound: "LEE" },
    { text: "ᓗ", name: "lu", sound: "LOO" },
    { text: "ᓚ", name: "la", sound: "LAH" },
    { text: "ᔨ", name: "ji", sound: "YEE" },
    { text: "ᔪ", name: "ju", sound: "YOO" },
    { text: "ᔭ", name: "ja", sound: "YAH" },
    { text: "ᕕ", name: "vi", sound: "VEE" },
    { text: "ᕗ", name: "vu", sound: "VOO" },
    { text: "ᕙ", name: "va", sound: "VAH" },
    { text: "ᕆ", name: "ri", sound: "REE (R in the throat, like a French R)" },
    { text: "ᕈ", name: "ru", sound: "ROO (R in the throat, like a French R)" },
    { text: "ᕋ", name: "ra", sound: "RAH (R in the throat, like a French R)" },
    { text: "ᕿ", name: "qi", sound: "KEE (K deep in the throat)" },
    { text: "ᖁ", name: "qu", sound: "KOO (K deep in the throat)" },
    { text: "ᖃ", name: "qa", sound: "KAH (K deep in the throat)" },
    { text: "ᖏ", name: "ngi", sound: "NGEE" },
    { text: "ᖑ", name: "ngu", sound: "NGOO" },
    { text: "ᖓ", name: "nga", sound: "NGAH" },
    { text: "ᖠ", name: "łi", sound: "LEE (a hissing L: blow air past your tongue)" },
    { text: "ᖢ", name: "łu", sound: "LOO (a hissing L: blow air past your tongue)" },
    { text: "ᖤ", name: "ła", sound: "LAH (a hissing L: blow air past your tongue)" },
  ],
  numerals: [],
};

export default canadianSyllabics;
