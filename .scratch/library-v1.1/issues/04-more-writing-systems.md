# 04: More writing systems

**What to build:** Eleven new World Scripts in the Library, each with its characters (names and sounds in the existing style), its numerals where it has its own, an About, and a voice tag where one applies.

**Blocked by:** 01 (About for every World Script), 02 (Tap a World Character to hear it)

**Status:** resolved

- [x] Glagolitic, Coptic, Gothic, Phoenician, Younger Futhark, Canadian syllabics (Inuktitut), Tibetan (`bo`), Bengali (`bn`, with its digits), Tamil (`ta`, with its digits), Linear B, Egyptian hieroglyphs (one-sound signs only, with kid names like "vulture", "reed", "owl")
- [x] Syllabaries (Canadian syllabics, Linear B) list their syllables in a sensible order, each with a sound
- [x] Each has an About; facts double-checked
- [x] The Library content check (ids present, About, voice tags) passes
- [x] Mongolian is **not** included (written top to bottom)
- [x] Abouts listed in a comment below for Dad to skim
- [x] Note in v1 ticket 16 that these scripts' fonts are in scope there

## Comments

**2026-11-07 (agent):** Built. Eleven new files under `src/core/library/scripts/` (`catalog.ts` picks them up on its own, so it didn't change). Every character was generated from its official Unicode name and checked by the content test against its own Unicode script, so no look-alike letters slipped in. Voices: Bengali `bn`, Tamil `ta`, Tibetan `bo`; none for the rest.

What's in each:
- **Glagolitic**: 37 letters, capital and small (a few rare letters left out).
- **Coptic**: 24 Greek-shaped letters plus the 7 letters borrowed from demotic writing (these live at U+03E2–03EF). Sounds are the church (Bohairic) way.
- **Gothic**: 25 letters (the two signs that were only numbers, 90 and 900, left out).
- **Phoenician**: 22 letters, right to left, with letter meanings where they're well known ("alep (ox)"). Numerals: its own number signs for 1, 2, 3, 10, 20, 100.
- **Younger Futhark**: the 16 long-branch (Danish) runes.
- **Canadian syllabics**: Inuktitut (Nunavut): i, u, a, then p t k g m n s l j v r q ng ł, each with i/u/a (45). Finals and long-vowel dots left out.
- **Tibetan**: 30 consonants and the digits 0–9. The vowel marks aren't listed (they don't stand alone).
- **Bengali**: 11 vowels, 32 consonants, digits 0–9.
- **Tamil**: 12 vowels, aytham, 18 consonants, 4 Grantha letters for borrowed words; digits 0–9 plus its own 10, 100, 1000.
- **Linear B**: the 60 plain syllables (5 vowels, then d j k m n p q r s t w z with each vowel Linear B has), picture signs and rarer signs left out.
- **Egyptian hieroglyphs**: the 25 one-sound signs, in Egyptologists' order, with kid names (vulture, reed, two reeds, arm, quail chick, foot, stool, horned snake, owl, water, mouth, reed shelter, twisted rope, round sieve, animal's belly, door bolt, folded cloth, pool, hill, basket, jar stand, bread loaf, tying rope, hand, cobra).

Facts I was least sure of, worth a closer look: Bengali "about 1,000 years old" (the Bengali script took its own shape roughly 1,000 years ago, give or take a couple of centuries); Coptic "about 1,800 years ago" (2nd–3rd century); Tamil "more than 80 million people" (estimates run 80–90 million); Phoenician "gimel (camel)" (some say "throwing stick"); the Halfdan rune graffiti is on a gallery parapet in Hagia Sophia, which I called "a balcony in a great church". Sounds for dead languages (Gothic, Phoenician, Linear B, hieroglyphs) are scholars' best guesses, and the files say so where it matters.

Not checked by eye: none of these render on a stock Fire tablet yet; fonts are ticket 16's job (noted there).

**Every new About, for Dad to skim:**

- **Glagolitic**: Glagolitic is the oldest Slavic alphabet, and today you mostly see it in old church books and as decoration in Croatia. A monk named Cyril made it about 1,150 years ago, with his brother Methodius, so Slavic people could read the Bible in their own language. Funny thing: the Cyrillic alphabet is named after Cyril, but the one he really invented was this one!
- **Coptic**: Coptic is used today mostly in church services by Coptic Christians in Egypt. It was made about 1,800 years ago from the Greek alphabet, plus seven extra letters borrowed from older Egyptian writing. Coptic was the very last form of the ancient Egyptian language, and knowing it helped people finally read hieroglyphs!
- **Gothic**: Nobody speaks Gothic any more: it was the language of the Goths, a people who once fought the Roman Empire. A bishop named Wulfila made this alphabet about 1,650 years ago from Greek letters, with a few Latin letters and runes mixed in, so he could write the Bible in Gothic. The most famous Gothic book is the "Silver Bible", written in silver and gold ink on purple pages!
- **Phoenician**: Phoenician was used about 3,000 years ago by sailors and traders from what is now Lebanon, and nobody uses it today. It has only 22 letters, all consonants, written right to left. It is the great-grandparent of the Greek, Latin, Hebrew and Arabic alphabets: our letter A started as alep, an ox's head, so turn an A upside down and you can still see the horns!
- **Younger Futhark runes**: Younger Futhark is the set of runes the Vikings used in Denmark, Norway and Sweden, starting about 1,200 years ago. It grew out of the older Elder Futhark, but it has only 16 runes instead of 24, so one rune often has to stand for several sounds. Vikings carved runes wherever they went: one even scratched his name, Halfdan, into a balcony in a great church in Istanbul!
- **Canadian syllabics (Inuktitut)**: Canadian syllabics are used to write Inuktitut, the language of the Inuit, in the far north of Canada, and also Cree and other languages. A missionary named James Evans first made them for the Cree language in 1840, and they were soon changed to fit Inuktitut too. The clever part: turning a shape changes its vowel, so ᐱ is pi, ᐳ is pu and ᐸ is pa!
- **Tibetan**: Tibetan is used in Tibet, Bhutan, Nepal and northern India, and in Buddhist books all over the world. It was made about 1,400 years ago from an Indian script, for a Tibetan king who wanted his people to be able to write. Tibetan doesn't put spaces between words: instead, a tiny dot sits after every syllable!
- **Bengali**: Bengali, also called Bangla, is used in Bangladesh and eastern India by more than 200 million people. It is about 1,000 years old and, like Devanagari, grew out of the old Indian script Brahmi, so most letters hang from a line along the top. February 21 is International Mother Language Day all over the world, to remember people in Bangladesh who stood up for their right to speak Bengali!
- **Tamil**: Tamil is used in southern India, Sri Lanka and Singapore by more than 80 million people. It is one of the oldest languages still spoken, with poems more than 2,000 years old, and its letters grew out of the old Indian script Brahmi. Tamil has one letter for both K and G, and one for both P and B: which sound you say depends on where the letter sits in a word!
- **Linear B**: Linear B was used more than 3,000 years ago on the island of Crete and in mainland Greece, to write the oldest Greek we know. It was scratched on clay tablets, mostly lists of sheep, grain and olive oil, and the tablets lasted because fires burned the palaces and baked them hard! Nobody could read it until 1952, when an architect named Michael Ventris cracked the code.
- **Egyptian hieroglyphs**: Hieroglyphs were used in ancient Egypt for more than 3,000 years, starting about 5,000 years ago, carved on temples and painted in tombs. There were hundreds of signs, but these 25 each stand for just one sound, a bit like letters. After the old temples closed, nobody could read hieroglyphs for about 1,400 years, until a Frenchman named Champollion cracked them in 1822 using the Rosetta Stone!

Resolved: merged on `library-v1.1` (2026-11-08). The About skim and the flagged facts above are still worth Dad's look.
