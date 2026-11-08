import type { WorldScript } from "../worldScript";

/**
 * Tamil: the 12 vowels, the special letter aytham, the 18 Tamil consonants, then four extra letters
 * (Grantha letters) used for words borrowed from other languages. Each consonant says its sound plus a
 * short "a" (க = "ka") unless a vowel mark changes it. One letter can make two sounds (க is K or G),
 * depending on where it sits in a word. Numerals: the digits 0 to 9, then Tamil's own signs for 10,
 * 100 and 1000.
 */
const tamil: WorldScript = {
  id: "tamil",
  name: "Tamil",
  kind: "writing",
  voice: "ta",
  about:
    "Tamil is used in southern India, Sri Lanka and Singapore by more than 80 million people. It is one of the oldest languages still spoken, with poems more than 2,000 years old, and its letters grew out of the old Indian script Brahmi. Tamil has one letter for both K and G, and one for both P and B: which sound you say depends on where the letter sits in a word!",
  characters: [
    { text: "அ", name: "a", sound: "UH (as in sun)" },
    { text: "ஆ", name: "aa", sound: "AH (as in father)" },
    { text: "இ", name: "i", sound: "I (as in sit)" },
    { text: "ஈ", name: "ii", sound: "EE" },
    { text: "உ", name: "u", sound: "U (as in put)" },
    { text: "ஊ", name: "uu", sound: "OO" },
    { text: "எ", name: "e", sound: "EH" },
    { text: "ஏ", name: "ee", sound: "AY (as in say)" },
    { text: "ஐ", name: "ai", sound: "AI (as in eye)" },
    { text: "ஒ", name: "o", sound: "O (short)" },
    { text: "ஓ", name: "oo", sound: "OH" },
    { text: "ஔ", name: "au", sound: "OW (as in cow)" },
    { text: "ஃ", name: "aytham", sound: "a breathy H (rare)" },
    { text: "க", name: "ka", sound: "K (or G)" },
    { text: "ங", name: "nga", sound: "NG" },
    { text: "ச", name: "ca", sound: "CH (or S)" },
    { text: "ஞ", name: "nya", sound: "NY" },
    { text: "ட", name: "ṭa", sound: "T or D (tongue curled back)" },
    { text: "ண", name: "ṇa", sound: "N (tongue curled back)" },
    { text: "த", name: "ta", sound: "T or D (tongue on the teeth)" },
    { text: "ந", name: "na", sound: "N (tongue on the teeth)" },
    { text: "ப", name: "pa", sound: "P (or B)" },
    { text: "ம", name: "ma", sound: "M" },
    { text: "ய", name: "ya", sound: "Y" },
    { text: "ர", name: "ra", sound: "R (tapped)" },
    { text: "ல", name: "la", sound: "L" },
    { text: "வ", name: "va", sound: "V" },
    { text: "ழ", name: "zha", sound: "a special Tamil sound, between R and L, with the tongue curled far back" },
    { text: "ள", name: "ḷa", sound: "L (tongue curled back)" },
    { text: "ற", name: "ṟa", sound: "R (rolled)" },
    { text: "ன", name: "ṉa", sound: "N" },
    { text: "ஜ", name: "ja", sound: "J (in borrowed words)" },
    { text: "ஷ", name: "sha", sound: "SH (in borrowed words)" },
    { text: "ஸ", name: "sa", sound: "S (in borrowed words)" },
    { text: "ஹ", name: "ha", sound: "H (in borrowed words)" },
  ],
  numerals: [
    { text: "௦", value: 0 },
    { text: "௧", value: 1 },
    { text: "௨", value: 2 },
    { text: "௩", value: 3 },
    { text: "௪", value: 4 },
    { text: "௫", value: 5 },
    { text: "௬", value: 6 },
    { text: "௭", value: 7 },
    { text: "௮", value: 8 },
    { text: "௯", value: 9 },
    { text: "௰", value: 10 },
    { text: "௱", value: 100 },
    { text: "௲", value: 1000 },
  ],
};

export default tamil;
