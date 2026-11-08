import type { WorldScript } from "../worldScript";

/**
 * Devanagari as used for Hindi: the vowels, then the consonants. Each consonant says its sound
 * plus a short "uh" (क = "kuh") unless a vowel mark changes it. "With a puff" means a breath of
 * air after the sound; "tongue curled back" means the tip of the tongue touches the roof of the mouth.
 */
const devanagari: WorldScript = {
  id: "devanagari",
  name: "Devanagari (Hindi)",
  kind: "writing",
  about:
    "Devanagari is used to write Hindi, Marathi and Nepali in India and Nepal, and the ancient language Sanskrit. It is more than 1,000 years old and grew out of an older Indian script called Brahmi. Most letters hang from a line drawn along the top, like laundry on a clothesline!",
  characters: [
    { text: "अ", name: "a", sound: "UH (as in sun)" },
    { text: "आ", name: "aa", sound: "AH (as in father)" },
    { text: "इ", name: "i", sound: "I (as in sit)" },
    { text: "ई", name: "ii", sound: "EE" },
    { text: "उ", name: "u", sound: "U (as in put)" },
    { text: "ऊ", name: "uu", sound: "OO" },
    { text: "ऋ", name: "ri", sound: "RI" },
    { text: "ए", name: "e", sound: "AY (as in say)" },
    { text: "ऐ", name: "ai", sound: "A (as in cat)" },
    { text: "ओ", name: "o", sound: "OH" },
    { text: "औ", name: "au", sound: "AW (as in saw)" },
    { text: "क", name: "ka", sound: "K" },
    { text: "ख", name: "kha", sound: "K with a puff" },
    { text: "ग", name: "ga", sound: "G" },
    { text: "घ", name: "gha", sound: "G with a puff" },
    { text: "ङ", name: "nga", sound: "NG" },
    { text: "च", name: "cha", sound: "CH" },
    { text: "छ", name: "chha", sound: "CH with a puff" },
    { text: "ज", name: "ja", sound: "J" },
    { text: "झ", name: "jha", sound: "J with a puff" },
    { text: "ञ", name: "nya", sound: "NY" },
    { text: "ट", name: "ṭa", sound: "T (tongue curled back)" },
    { text: "ठ", name: "ṭha", sound: "T with a puff (tongue curled back)" },
    { text: "ड", name: "ḍa", sound: "D (tongue curled back)" },
    { text: "ढ", name: "ḍha", sound: "D with a puff (tongue curled back)" },
    { text: "ण", name: "ṇa", sound: "N (tongue curled back)" },
    { text: "त", name: "ta", sound: "T (tongue on the teeth)" },
    { text: "थ", name: "tha", sound: "T with a puff (tongue on the teeth)" },
    { text: "द", name: "da", sound: "D (tongue on the teeth)" },
    { text: "ध", name: "dha", sound: "D with a puff (tongue on the teeth)" },
    { text: "न", name: "na", sound: "N" },
    { text: "प", name: "pa", sound: "P" },
    { text: "फ", name: "pha", sound: "P with a puff (or F)" },
    { text: "ब", name: "ba", sound: "B" },
    { text: "भ", name: "bha", sound: "B with a puff" },
    { text: "म", name: "ma", sound: "M" },
    { text: "य", name: "ya", sound: "Y" },
    { text: "र", name: "ra", sound: "R (tapped)" },
    { text: "ल", name: "la", sound: "L" },
    { text: "व", name: "va", sound: "V or W" },
    { text: "श", name: "sha", sound: "SH" },
    { text: "ष", name: "ṣha", sound: "SH (tongue curled back)" },
    { text: "स", name: "sa", sound: "S" },
    { text: "ह", name: "ha", sound: "H" },
  ],
  numerals: [
    { text: "०", value: 0 },
    { text: "१", value: 1 },
    { text: "२", value: 2 },
    { text: "३", value: 3 },
    { text: "४", value: 4 },
    { text: "५", value: 5 },
    { text: "६", value: 6 },
    { text: "७", value: 7 },
    { text: "८", value: 8 },
    { text: "९", value: 9 },
  ],
};

export default devanagari;
