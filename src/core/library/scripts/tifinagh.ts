import type { WorldScript } from "../worldScript";

/**
 * Tifinagh, the alphabet of the Berber (Amazigh) languages of North Africa, in its modern form
 * (33 letters). "Heavy" letters are said with the tongue pulled back.
 */
const tifinagh: WorldScript = {
  id: "tifinagh",
  name: "Tifinagh",
  kind: "writing",
  characters: [
    { text: "ⴰ", name: "ya", sound: "AH" },
    { text: "ⴱ", name: "yab", sound: "B" },
    { text: "ⴳ", name: "yag", sound: "G" },
    { text: "ⴳⵯ", name: "yagw", sound: "GW" },
    { text: "ⴷ", name: "yad", sound: "D" },
    { text: "ⴹ", name: "yaḍ", sound: "D (heavy)" },
    { text: "ⴻ", name: "yey", sound: "UH" },
    { text: "ⴼ", name: "yaf", sound: "F" },
    { text: "ⴽ", name: "yak", sound: "K" },
    { text: "ⴽⵯ", name: "yakw", sound: "KW" },
    { text: "ⵀ", name: "yah", sound: "H" },
    { text: "ⵃ", name: "yaḥ", sound: "H (breathy, from the throat)" },
    { text: "ⵄ", name: "yaɛ", sound: "a squeeze deep in the throat" },
    { text: "ⵅ", name: "yax", sound: "KH (like clearing your throat)" },
    { text: "ⵇ", name: "yaq", sound: "K (deep in the throat)" },
    { text: "ⵉ", name: "yi", sound: "EE" },
    { text: "ⵊ", name: "yaj", sound: "J or ZH" },
    { text: "ⵍ", name: "yal", sound: "L" },
    { text: "ⵎ", name: "yam", sound: "M" },
    { text: "ⵏ", name: "yan", sound: "N" },
    { text: "ⵓ", name: "yu", sound: "OO" },
    { text: "ⵔ", name: "yar", sound: "R" },
    { text: "ⵕ", name: "yaṛ", sound: "R (heavy)" },
    { text: "ⵖ", name: "yagh", sound: "GH (like a gargle)" },
    { text: "ⵙ", name: "yas", sound: "S" },
    { text: "ⵚ", name: "yaṣ", sound: "S (heavy)" },
    { text: "ⵛ", name: "yash", sound: "SH" },
    { text: "ⵜ", name: "yat", sound: "T" },
    { text: "ⵟ", name: "yaṭ", sound: "T (heavy)" },
    { text: "ⵡ", name: "yaw", sound: "W" },
    { text: "ⵢ", name: "yay", sound: "Y" },
    { text: "ⵣ", name: "yaz", sound: "Z" },
    { text: "ⵥ", name: "yaẓ", sound: "Z (heavy)" },
  ],
  numerals: [],
};

export default tifinagh;
