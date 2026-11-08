import type { WorldScript } from "../worldScript";

/** Chinese numerals (also used in Japanese): digits, then the signs for ten, hundred, thousand and ten thousand. */
const chineseNumerals: WorldScript = {
  id: "chinese-numerals",
  name: "Chinese numerals",
  kind: "numerals",
  voice: "zh",
  characters: [],
  numerals: [
    { text: "〇", value: 0 },
    { text: "一", value: 1 },
    { text: "二", value: 2 },
    { text: "三", value: 3 },
    { text: "四", value: 4 },
    { text: "五", value: 5 },
    { text: "六", value: 6 },
    { text: "七", value: 7 },
    { text: "八", value: 8 },
    { text: "九", value: 9 },
    { text: "十", value: 10 },
    { text: "百", value: 100 },
    { text: "千", value: 1000 },
    { text: "万", value: 10000 },
  ],
};

export default chineseNumerals;
