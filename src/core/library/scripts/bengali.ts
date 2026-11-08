import type { WorldScript } from "../worldScript";

/**
 * Bengali (Bangla): the vowels, then the consonants. Each consonant says its sound plus a short "aw"
 * (ক = "kaw") unless a vowel mark changes it. Letters that sound the same have longer names that
 * tell them apart. "With a puff" means a breath of air after the sound; "tongue curled back" means the
 * tip of the tongue touches the roof of the mouth.
 */
const bengali: WorldScript = {
  id: "bengali",
  name: "Bengali",
  kind: "writing",
  voice: "bn",
  about:
    "Bengali, also called Bangla, is used in Bangladesh and eastern India by more than 200 million people. It is about 1,000 years old and, like Devanagari, grew out of the old Indian script Brahmi, so most letters hang from a line along the top. February 21 is International Mother Language Day all over the world, to remember people in Bangladesh who stood up for their right to speak Bengali!",
  characters: [
    { text: "অ", name: "o", sound: "AW (as in saw)" },
    { text: "আ", name: "a", sound: "AH (as in father)" },
    { text: "ই", name: "i", sound: "EE (short)" },
    { text: "ঈ", name: "dirgho i", sound: "EE (said the same)" },
    { text: "উ", name: "u", sound: "OO (short)" },
    { text: "ঊ", name: "dirgho u", sound: "OO (said the same)" },
    { text: "ঋ", name: "ri", sound: "RI" },
    { text: "এ", name: "e", sound: "AY (or A as in cat)" },
    { text: "ঐ", name: "oi", sound: "OY" },
    { text: "ও", name: "o (long)", sound: "OH" },
    { text: "ঔ", name: "ou", sound: "OH-OO" },
    { text: "ক", name: "ko", sound: "K" },
    { text: "খ", name: "kho", sound: "K with a puff" },
    { text: "গ", name: "go", sound: "G" },
    { text: "ঘ", name: "gho", sound: "G with a puff" },
    { text: "ঙ", name: "ngo", sound: "NG" },
    { text: "চ", name: "cho", sound: "CH" },
    { text: "ছ", name: "chho", sound: "CH with a puff" },
    { text: "জ", name: "borgiyo jo", sound: "J" },
    { text: "ঝ", name: "jho", sound: "J with a puff" },
    { text: "ঞ", name: "nyo", sound: "N (or NY)" },
    { text: "ট", name: "ṭo", sound: "T (tongue curled back)" },
    { text: "ঠ", name: "ṭho", sound: "T with a puff (tongue curled back)" },
    { text: "ড", name: "ḍo", sound: "D (tongue curled back)" },
    { text: "ঢ", name: "ḍho", sound: "D with a puff (tongue curled back)" },
    { text: "ণ", name: "murdhonno no", sound: "N" },
    { text: "ত", name: "to", sound: "T (tongue on the teeth)" },
    { text: "থ", name: "tho", sound: "T with a puff (tongue on the teeth)" },
    { text: "দ", name: "do", sound: "D (tongue on the teeth)" },
    { text: "ধ", name: "dho", sound: "D with a puff (tongue on the teeth)" },
    { text: "ন", name: "donto no", sound: "N" },
    { text: "প", name: "po", sound: "P" },
    { text: "ফ", name: "pho", sound: "P with a puff (or F)" },
    { text: "ব", name: "bo", sound: "B" },
    { text: "ভ", name: "bho", sound: "B with a puff (or V)" },
    { text: "ম", name: "mo", sound: "M" },
    { text: "য", name: "ontostho jo", sound: "J" },
    { text: "র", name: "ro", sound: "R (tapped)" },
    { text: "ল", name: "lo", sound: "L" },
    { text: "শ", name: "talobbo sho", sound: "SH" },
    { text: "ষ", name: "murdhonno sho", sound: "SH" },
    { text: "স", name: "donto sho", sound: "S (or SH)" },
    { text: "হ", name: "ho", sound: "H" },
  ],
  numerals: [
    { text: "০", value: 0 },
    { text: "১", value: 1 },
    { text: "২", value: 2 },
    { text: "৩", value: 3 },
    { text: "৪", value: 4 },
    { text: "৫", value: 5 },
    { text: "৬", value: 6 },
    { text: "৭", value: 7 },
    { text: "৮", value: 8 },
    { text: "৯", value: 9 },
  ],
};

export default bengali;
