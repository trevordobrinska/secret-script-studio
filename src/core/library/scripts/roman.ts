import type { WorldScript } from "../worldScript";

const roman: WorldScript = {
  id: "roman",
  name: "Roman numerals",
  kind: "numerals",
  about:
    "Roman numerals were used by the ancient Romans more than 2,000 years ago. Today you still see them on clocks, in movie credits, and in kings' names like Henry VIII. They have no zero, and many clocks show four as IIII instead of IV!",
  characters: [],
  numerals: [
    { text: "I", value: 1 },
    { text: "V", value: 5 },
    { text: "X", value: 10 },
    { text: "L", value: 50 },
    { text: "C", value: 100 },
    { text: "D", value: 500 },
    { text: "M", value: 1000 },
  ],
};

export default roman;
