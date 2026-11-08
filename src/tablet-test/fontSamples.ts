// THROWAWAY (ticket 02): delete the whole src/tablet-test/ folder and tablet-test.html after ticket 15.
// One labeled sample per World Script and numeral system from DESIGN.md / ticket 16.

export interface FontSample {
  kind: "script" | "numerals";
  name: string;
  sample: string;
}

export const FONT_SAMPLES: readonly FontSample[] = [
  { kind: "script", name: "Greek", sample: "Α Β Γ Δ Λ Ω α β γ λ ω" },
  { kind: "script", name: "Cyrillic", sample: "А Б Ж И Л Я б ж щ ы я" },
  { kind: "script", name: "Hangul", sample: "ㄱ ㄴ ㄷ ㅏ ㅗ 가 나 한 글" },
  { kind: "script", name: "Hebrew", sample: "א ב ג ד ה ש ת" },
  { kind: "script", name: "Arabic", sample: "ا ب ت ج ح س ع ي" },
  { kind: "script", name: "Devanagari", sample: "अ आ क ख ग म य ह" },
  { kind: "script", name: "Georgian", sample: "ა ბ გ დ ე ვ ზ ჰ" },
  { kind: "script", name: "Armenian", sample: "Ա Բ Գ Դ Ե ա բ գ" },
  { kind: "script", name: "Hiragana", sample: "あ い う え お か き ん" },
  { kind: "script", name: "Katakana", sample: "ア イ ウ エ オ カ キ ン" },
  { kind: "script", name: "Elder Futhark runes", sample: "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᛟ" },
  { kind: "script", name: "Ogham", sample: "ᚁ ᚂ ᚃ ᚄ ᚅ ᚆ ᚇ ᚈ" },
  { kind: "script", name: "Thai", sample: "ก ข ค ง จ ฉ ม ฮ" },
  { kind: "script", name: "Ethiopic", sample: "ሀ ለ ሐ መ ሠ ረ ሰ ቀ" },
  { kind: "script", name: "Cherokee", sample: "Ꭰ Ꭱ Ꭲ Ꭳ Ꭴ Ꭵ Ꭶ Ꮿ" },
  { kind: "script", name: "Tifinagh", sample: "ⴰ ⴱ ⴳ ⴷ ⴹ ⴻ ⴼ ⵣ" },
  { kind: "numerals", name: "Roman", sample: "I V X L C D M · Ⅰ Ⅴ Ⅹ Ⅼ Ⅽ Ⅾ Ⅿ" },
  { kind: "numerals", name: "Mayan", sample: "𝋠 𝋡 𝋢 𝋣 𝋤 𝋥 𝋦 𝋧 𝋨 𝋩 𝋪 𝋫 𝋬 𝋭 𝋮 𝋯 𝋰 𝋱 𝋲 𝋳" },
  { kind: "numerals", name: "Babylonian", sample: "𒁹 𒈫 𒐈 𒐉 𒐊 𒐋 𒐌 𒐍 𒐎 𒌋" },
  { kind: "numerals", name: "Chinese", sample: "〇 一 二 三 四 五 六 七 八 九 十 百 千 万" },
  { kind: "numerals", name: "Eastern Arabic", sample: "٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩" },
  { kind: "numerals", name: "Devanagari", sample: "० १ २ ३ ४ ५ ६ ७ ८ ९" },
];
