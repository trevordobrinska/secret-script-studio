import type { WorldScript } from "../worldScript";

/** The Russian alphabet, the best-known Cyrillic alphabet. */
const cyrillic: WorldScript = {
  id: "cyrillic",
  name: "Cyrillic (Russian)",
  kind: "writing",
  voice: "ru",
  about:
    "Cyrillic is used to write Russian, Ukrainian, Bulgarian, Serbian and many more languages. It was made in Bulgaria about 1,100 years ago, and lots of its letters were borrowed from Greek. It is named after a monk called Saint Cyril.",
  characters: [
    { text: "А а", name: "a", sound: "A" },
    { text: "Б б", name: "be", sound: "B" },
    { text: "В в", name: "ve", sound: "V" },
    { text: "Г г", name: "ge", sound: "G" },
    { text: "Д д", name: "de", sound: "D" },
    { text: "Е е", name: "ye", sound: "YE" },
    { text: "Ё ё", name: "yo", sound: "YO" },
    { text: "Ж ж", name: "zhe", sound: "ZH (like s in treasure)" },
    { text: "З з", name: "ze", sound: "Z" },
    { text: "И и", name: "i", sound: "EE" },
    { text: "Й й", name: "short i", sound: "Y (as in boy)" },
    { text: "К к", name: "ka", sound: "K" },
    { text: "Л л", name: "el", sound: "L" },
    { text: "М м", name: "em", sound: "M" },
    { text: "Н н", name: "en", sound: "N" },
    { text: "О о", name: "o", sound: "O" },
    { text: "П п", name: "pe", sound: "P" },
    { text: "Р р", name: "er", sound: "R (rolled)" },
    { text: "С с", name: "es", sound: "S" },
    { text: "Т т", name: "te", sound: "T" },
    { text: "У у", name: "u", sound: "OO" },
    { text: "Ф ф", name: "ef", sound: "F" },
    { text: "Х х", name: "kha", sound: "KH" },
    { text: "Ц ц", name: "tse", sound: "TS" },
    { text: "Ч ч", name: "che", sound: "CH" },
    { text: "Ш ш", name: "sha", sound: "SH" },
    { text: "Щ щ", name: "shcha", sound: "SHSH (a long, soft SH)" },
    { text: "Ъ ъ", name: "hard sign", sound: "no sound (a tiny pause)" },
    { text: "Ы ы", name: "yery", sound: "I (like i in bit, said further back)" },
    { text: "Ь ь", name: "soft sign", sound: "no sound (softens the letter before it)" },
    { text: "Э э", name: "e", sound: "E (as in pet)" },
    { text: "Ю ю", name: "yu", sound: "YOO" },
    { text: "Я я", name: "ya", sound: "YA" },
  ],
  numerals: [],
};

export default cyrillic;
