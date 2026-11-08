import type { WorldScript } from "../worldScript";

/**
 * Coptic: the Greek-shaped letters, then the seven extra letters borrowed from Egyptian demotic
 * writing (these live in Unicode's Greek and Coptic block). Capital and small together. Sounds are
 * the church (Bohairic) way, simplified. So (ⲋ), used only as the numeral 6, is left out.
 */
const coptic: WorldScript = {
  id: "coptic",
  name: "Coptic",
  kind: "writing",
  about:
    "Coptic is used today mostly in church services by Coptic Christians in Egypt. It was made about 1,800 years ago from the Greek alphabet, plus seven extra letters borrowed from older Egyptian writing. Coptic was the very last form of the ancient Egyptian language, and knowing it helped people finally read hieroglyphs!",
  characters: [
    { text: "Ⲁ ⲁ", name: "alfa", sound: "AH" },
    { text: "Ⲃ ⲃ", name: "vida", sound: "V (or B)" },
    { text: "Ⲅ ⲅ", name: "gamma", sound: "G" },
    { text: "Ⲇ ⲇ", name: "dalda", sound: "D" },
    { text: "Ⲉ ⲉ", name: "ei", sound: "EH" },
    { text: "Ⲍ ⲍ", name: "zata", sound: "Z" },
    { text: "Ⲏ ⲏ", name: "heta", sound: "EE (or AY)" },
    { text: "Ⲑ ⲑ", name: "theta", sound: "TH (as in thin)" },
    { text: "Ⲓ ⲓ", name: "iauda", sound: "EE" },
    { text: "Ⲕ ⲕ", name: "kappa", sound: "K" },
    { text: "Ⲗ ⲗ", name: "laula", sound: "L" },
    { text: "Ⲙ ⲙ", name: "mi", sound: "M" },
    { text: "Ⲛ ⲛ", name: "ni", sound: "N" },
    { text: "Ⲝ ⲝ", name: "eksi", sound: "KS" },
    { text: "Ⲟ ⲟ", name: "o", sound: "O (short)" },
    { text: "Ⲡ ⲡ", name: "pi", sound: "P" },
    { text: "Ⲣ ⲣ", name: "ro", sound: "R" },
    { text: "Ⲥ ⲥ", name: "sima", sound: "S" },
    { text: "Ⲧ ⲧ", name: "tau", sound: "T" },
    { text: "Ⲩ ⲩ", name: "he", sound: "EE (or OO)" },
    { text: "Ⲫ ⲫ", name: "fi", sound: "F (or P with a puff)" },
    { text: "Ⲭ ⲭ", name: "khi", sound: "K with a puff" },
    { text: "Ⲯ ⲯ", name: "epsi", sound: "PS" },
    { text: "Ⲱ ⲱ", name: "oou", sound: "OH (long)" },
    { text: "Ϣ ϣ", name: "shai", sound: "SH" },
    { text: "Ϥ ϥ", name: "fai", sound: "F" },
    { text: "Ϧ ϧ", name: "khai", sound: "KH (like the end of Bach)" },
    { text: "Ϩ ϩ", name: "hori", sound: "H" },
    { text: "Ϫ ϫ", name: "janja", sound: "J (as in jam)" },
    { text: "Ϭ ϭ", name: "chima", sound: "CH" },
    { text: "Ϯ ϯ", name: "ti", sound: "TEE" },
  ],
  numerals: [],
};

export default coptic;
