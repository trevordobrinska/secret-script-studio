# 01: About for every World Script

**What to build:** Each World Script page shows an About under its title: 2–3 kid-level sentences covering where the script is used today, roughly how old it is and where it came from, and one fun fact. All 21 existing World Scripts and numeral systems get one.

**Blocked by:** none

**Status:** ready-for-agent

- [x] `WorldScript.about` (required) added to the data shape
- [x] Library content check: every World Script has a non-empty About (tested through the core)
- [x] Abouts drafted for all 21 existing entries: plain words a 10-year-old reads easily, 2–3 sentences, one hook each, facts double-checked
- [x] World Script page shows the About under the title, above the right-to-left note and the grid; calm body text, not tappable
- [ ] Checked by eye in Edge at 1280x800 and 800x1280 (long Abouts don't push the grid off-screen awkwardly)
- [ ] **Dad skims every About** for accuracy and tone (human step: list them all in a comment below for easy reading)

## Comments

**2026-11-07 (agent):** Built. The About is a `<p class="world-about">` right under the "‹ Library" back button (which sits just under the title), above the right-to-left note and the grid: 22px body text, max ~46em wide, not a button. The page already scrolls (`overflow-y: auto`), so a long About pushes the grid down rather than off-screen.

Not done: the Edge check at 1280x800 and 800x1280. I couldn't open a browser from here, so that box is still open for someone to eyeball.

Facts I was least sure of, worth a closer look: Thai "44 consonant letters" (the usual count, including two that are no longer used), Arabic "grew out of an older script from the desert city of Petra" (Nabataean, a simplified version), and Tifinagh "left to right, right to left, or even from the bottom up" (true of traditional Tuareg writing).

**Every About, for Dad to skim:**

- **Greek**: Greek is used in Greece and Cyprus today. It is about 2,800 years old, and the ancient Greeks made it by borrowing letters from the Phoenicians and adding vowels. The word "alphabet" comes from its first two letters, alpha and beta!
- **Cyrillic (Russian)**: Cyrillic is used to write Russian, Ukrainian, Bulgarian, Serbian and many more languages. It was made in Bulgaria about 1,100 years ago, and lots of its letters were borrowed from Greek. It is named after a monk called Saint Cyril.
- **Hangul (Korean)**: Hangul is how people write Korean in South Korea and North Korea. King Sejong and his scholars invented it on purpose in 1443, so that everyone could learn to read, not just rich people. Some letters are drawn in the shape your mouth and tongue make when you say them!
- **Hebrew**: Hebrew is used in Israel and in Jewish prayer books all over the world. These letters are more than 2,000 years old and grew out of an older script called Aramaic. Hebrew is written right to left, and the vowels are usually left out, or shown as tiny dots under the letters.
- **Arabic**: Arabic script is used across the Middle East and North Africa, and also to write Persian and Urdu. It is about 1,500 years old and grew out of an older script from the desert city of Petra. The letters join up like handwriting, and many letters change shape depending on where they are in a word!
- **Devanagari (Hindi)**: Devanagari is used to write Hindi, Marathi and Nepali in India and Nepal, and the ancient language Sanskrit. It is more than 1,000 years old and grew out of an older Indian script called Brahmi. Most letters hang from a line drawn along the top, like laundry on a clothesline!
- **Georgian**: Georgian is used in the country of Georgia, between Europe and Asia. It is about 1,500 years old, and its curly letters look like no other alphabet in the world. Georgian has no capital letters: every letter is the same kind, even at the start of a sentence.
- **Armenian**: Armenian is used in Armenia and by Armenian families all over the world. A monk named Mesrop Mashtots invented it about 1,600 years ago. He made it on purpose so Armenians could write their own language, and it has hardly changed since!
- **Hiragana (Japanese)**: Hiragana is used every day in Japan. It is about 1,100 years old and was made by writing Chinese characters faster and rounder until they became simple shapes. Japanese mixes three kinds of writing in one sentence: hiragana, katakana and Chinese characters called kanji.
- **Katakana (Japanese)**: Katakana is used in Japan for words borrowed from other languages, like "pizza" and "ice cream", and for sound effects in comics. It is about 1,100 years old, and Buddhist monks made it from small pieces of Chinese characters. Each katakana stands for a whole syllable, like "ka" or "mi".
- **Elder Futhark runes**: Elder Futhark is the oldest set of runes, and nobody writes everyday things with it now. Germanic peoples in northern Europe carved it into wood, stone and metal almost 2,000 years ago. It is called "futhark" after its first six runes, F U TH A R K, the same way "alphabet" comes from alpha and beta!
- **Ogham**: Ogham is an old Irish alphabet that people now use mostly for decoration. It was carved about 1,600 years ago in Ireland and parts of Britain, along the edges of tall standing stones. The letters are just straight notches and lines, and you read them from the bottom of the stone up!
- **Thai**: Thai is how people write in Thailand. It is about 700 years old and grew out of the older Khmer script from Cambodia. Thai has 44 consonant letters, and it doesn't put spaces between words!
- **Ethiopic (Ge'ez)**: Ethiopic, also called Ge'ez, is used to write Amharic and other languages in Ethiopia and Eritrea. It is about 2,000 years old and came from an old script of southern Arabia. Each symbol is a whole syllable, and you change the vowel by adding a little tail, loop or line to the letter!
- **Cherokee**: Cherokee is used by the Cherokee people in Oklahoma and North Carolina. A Cherokee man named Sequoyah invented it by himself, finishing it in 1821, even though he couldn't read any language before. Each symbol is a syllable, and within a few years thousands of Cherokee people learned to read with it!
- **Tifinagh**: Tifinagh is used by the Amazigh (Berber) peoples of North Africa, and in Morocco you can see it on signs next to Arabic. Its oldest form is more than 2,000 years old. The Tuareg people of the Sahara Desert still use it, and they have written it left to right, right to left, or even from the bottom up!
- **Roman numerals**: Roman numerals were used by the ancient Romans more than 2,000 years ago. Today you still see them on clocks, in movie credits, and in kings' names like Henry VIII. They have no zero, and many clocks show four as IIII instead of IV!
- **Mayan numerals**: Mayan numerals were used by the Maya of Mexico and Central America more than 1,500 years ago. They count in twenties instead of tens, with a dot for one, a bar for five and a shell for zero. The Maya were one of the first peoples in the world to use a zero!
- **Babylonian numerals**: Babylonian numerals are about 4,000 years old, from ancient Iraq. People pressed them into wet clay with the tip of a reed, making little wedge shapes. They counted in sixties, and that's why an hour has 60 minutes and a circle has 360 degrees!
- **Chinese numerals**: Chinese numerals are used in China and Taiwan, and also in Japan and Korea. They are more than 3,000 years old: the oldest ones were carved on turtle shells and bones. One, two and three are just one, two and three lines: 一 二 三.
- **Eastern Arabic numerals**: Eastern Arabic numerals are used in Egypt, Iraq, Saudi Arabia and other Arabic-speaking countries. They came from India more than 1,000 years ago, and our own 0 to 9 come from the same family. Arabic words are read right to left, but numbers are still read left to right!
