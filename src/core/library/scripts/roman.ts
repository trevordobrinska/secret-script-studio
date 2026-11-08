import type { WorldScript } from "../worldScript";

const roman: WorldScript = {
  id: "roman",
  name: "Roman numerals",
  kind: "numerals",
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
