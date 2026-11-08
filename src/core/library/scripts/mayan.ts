import type { WorldScript } from "../worldScript";

/** Maya numerals: dots are ones, bars are fives, the shell is zero. They count in twenties. */
const mayan: WorldScript = {
  id: "mayan",
  name: "Mayan numerals",
  kind: "numerals",
  characters: [],
  numerals: [
    { text: "\u{1D2E0}", value: 0 },
    { text: "\u{1D2E1}", value: 1 },
    { text: "\u{1D2E2}", value: 2 },
    { text: "\u{1D2E3}", value: 3 },
    { text: "\u{1D2E4}", value: 4 },
    { text: "\u{1D2E5}", value: 5 },
    { text: "\u{1D2E6}", value: 6 },
    { text: "\u{1D2E7}", value: 7 },
    { text: "\u{1D2E8}", value: 8 },
    { text: "\u{1D2E9}", value: 9 },
    { text: "\u{1D2EA}", value: 10 },
    { text: "\u{1D2EB}", value: 11 },
    { text: "\u{1D2EC}", value: 12 },
    { text: "\u{1D2ED}", value: 13 },
    { text: "\u{1D2EE}", value: 14 },
    { text: "\u{1D2EF}", value: 15 },
    { text: "\u{1D2F0}", value: 16 },
    { text: "\u{1D2F1}", value: 17 },
    { text: "\u{1D2F2}", value: 18 },
    { text: "\u{1D2F3}", value: 19 },
  ],
};

export default mayan;
