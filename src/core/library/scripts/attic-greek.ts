import type { WorldScript } from "../worldScript";

/**
 * Attic (acrophonic) Greek numerals: mostly the first letter of the number's word. The
 * five-times forms (50, 500, 5000, 50 000) are Π with Δ, Η, Χ or Μ tucked inside, from
 * Unicode's Ancient Greek Numbers block (U+10144 to U+10147).
 */
const atticGreek: WorldScript = {
  id: "attic-greek",
  name: "Attic Greek numerals",
  kind: "numerals",
  about:
    'Attic numerals were used in Athens, in ancient Greece, about 2,500 years ago. Most of them are the first letter of the number\'s Greek word: Π for pente (five), Δ for deka (ten) and Η for hekaton (a hundred). To write fifty, the Greeks tucked a little Δ inside a Π, meaning "five tens"!',
  characters: [],
  numerals: [
    { text: "Ι", value: 1 },
    { text: "Π", value: 5 },
    { text: "Δ", value: 10 },
    { text: "\u{10144}", value: 50 },
    { text: "Η", value: 100 },
    { text: "\u{10145}", value: 500 },
    { text: "Χ", value: 1000 },
    { text: "\u{10146}", value: 5000 },
    { text: "Μ", value: 10000 },
    { text: "\u{10147}", value: 50000 },
  ],
};

export default atticGreek;
