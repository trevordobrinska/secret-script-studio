import type { WorldScript } from "../worldScript";

/**
 * Chinese counting rod numerals: the units forms (rods standing up) for 1 to 9, then the tens
 * forms (rods lying down) for 10 to 90. A board alternated the two so each place stood out.
 */
const rodNumerals: WorldScript = {
  id: "rod-numerals",
  name: "Chinese rod numerals",
  kind: "numerals",
  about:
    "Counting rods were little sticks of bamboo or bone that people in ancient China laid out on a board to do math, more than 2,000 years ago. Ones are rods standing up and tens are rods lying down, so you can tell the places apart, and an empty space meant zero. Chinese mathematicians even used them for negative numbers, more than a thousand years before Europe did!",
  characters: [],
  numerals: [
    { text: "\u{1D360}", value: 1 },
    { text: "\u{1D361}", value: 2 },
    { text: "\u{1D362}", value: 3 },
    { text: "\u{1D363}", value: 4 },
    { text: "\u{1D364}", value: 5 },
    { text: "\u{1D365}", value: 6 },
    { text: "\u{1D366}", value: 7 },
    { text: "\u{1D367}", value: 8 },
    { text: "\u{1D368}", value: 9 },
    { text: "\u{1D369}", value: 10 },
    { text: "\u{1D36A}", value: 20 },
    { text: "\u{1D36B}", value: 30 },
    { text: "\u{1D36C}", value: 40 },
    { text: "\u{1D36D}", value: 50 },
    { text: "\u{1D36E}", value: 60 },
    { text: "\u{1D36F}", value: 70 },
    { text: "\u{1D370}", value: 80 },
    { text: "\u{1D371}", value: 90 },
  ],
};

export default rodNumerals;
