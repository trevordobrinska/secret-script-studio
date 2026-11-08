import type { WorldScript } from "../worldScript";

/**
 * Egyptian hieroglyphic numerals: one sign per power of ten, repeated as needed (no zero).
 * Gardiner signs Z1 stroke, V20 heel bone (really a cattle hobble), V1 coil of rope, M12 lotus,
 * D50 finger, I8 tadpole, C11 the god Heh.
 */
const egyptianNumerals: WorldScript = {
  id: "egyptian-numerals",
  name: "Egyptian numerals",
  kind: "numerals",
  about:
    'Egyptian numerals were carved and painted by the ancient Egyptians about 5,000 years ago. There\'s a stroke for one, a heel bone for ten, a coil of rope for a hundred, a lotus flower for a thousand, a finger for ten thousand and a tadpole for a hundred thousand. A million is a god called Heh throwing up his arms, as if to say "that\'s so many!"',
  characters: [],
  numerals: [
    { text: "\u{133E4}", value: 1 },
    { text: "\u{13386}", value: 10 },
    { text: "\u{13362}", value: 100 },
    { text: "\u{131BC}", value: 1000 },
    { text: "\u{130AD}", value: 10000 },
    { text: "\u{13190}", value: 100000 },
    { text: "\u{13068}", value: 1000000 },
  ],
};

export default egyptianNumerals;
