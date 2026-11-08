import type { WorldScript } from "../worldScript";

/**
 * Kaktovik Iñupiaq numerals (Unicode 15): one digit for each of 0 to 19, because Iñupiaq counts in
 * twenties. Strokes below are ones, marks on top are fives.
 */
const kaktovik: WorldScript = {
  id: "kaktovik",
  name: "Kaktovik numerals",
  kind: "numerals",
  about:
    "Kaktovik numerals were invented in 1994 by middle-school students in Kaktovik, a small village in Alaska. Their Iñupiaq language counts in twenties, so they made 20 digits that look like the counting: little strokes for ones, and marks on top for fives. Their numbers caught on, and in 2022 they were added to Unicode, the big list of letters and symbols every computer knows!",
  characters: [],
  numerals: [
    { text: "\u{1D2C0}", value: 0 },
    { text: "\u{1D2C1}", value: 1 },
    { text: "\u{1D2C2}", value: 2 },
    { text: "\u{1D2C3}", value: 3 },
    { text: "\u{1D2C4}", value: 4 },
    { text: "\u{1D2C5}", value: 5 },
    { text: "\u{1D2C6}", value: 6 },
    { text: "\u{1D2C7}", value: 7 },
    { text: "\u{1D2C8}", value: 8 },
    { text: "\u{1D2C9}", value: 9 },
    { text: "\u{1D2CA}", value: 10 },
    { text: "\u{1D2CB}", value: 11 },
    { text: "\u{1D2CC}", value: 12 },
    { text: "\u{1D2CD}", value: 13 },
    { text: "\u{1D2CE}", value: 14 },
    { text: "\u{1D2CF}", value: 15 },
    { text: "\u{1D2D0}", value: 16 },
    { text: "\u{1D2D1}", value: 17 },
    { text: "\u{1D2D2}", value: 18 },
    { text: "\u{1D2D3}", value: 19 },
  ],
};

export default kaktovik;
