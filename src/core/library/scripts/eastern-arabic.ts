import type { WorldScript } from "../worldScript";

/** The digits used with Arabic writing. Numbers are still written biggest place first, left to right. */
const easternArabic: WorldScript = {
  id: "eastern-arabic",
  name: "Eastern Arabic numerals",
  kind: "numerals",
  voice: "ar",
  about:
    "Eastern Arabic numerals are used in Egypt, Iraq, Saudi Arabia and other Arabic-speaking countries. They came from India more than 1,000 years ago, and our own 0 to 9 come from the same family. Arabic words are read right to left, but numbers are still read left to right!",
  characters: [],
  numerals: [
    { text: "٠", value: 0 },
    { text: "١", value: 1 },
    { text: "٢", value: 2 },
    { text: "٣", value: 3 },
    { text: "٤", value: 4 },
    { text: "٥", value: 5 },
    { text: "٦", value: 6 },
    { text: "٧", value: 7 },
    { text: "٨", value: 8 },
    { text: "٩", value: 9 },
  ],
};

export default easternArabic;
