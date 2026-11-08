# Spec: Library V1.1 (About, tap to hear, more World Scripts)

Status: resolved

Sources: `DESIGN.md` ("Library V1.1", grilled 2026-11-07) and `GLOSSARY.md` (World Script, World Character, About). Where this spec and DESIGN.md disagree, DESIGN.md wins: flag it, don't silently pick.

## Problem Statement

The Library shows each World Script's characters with their names and sounds, but it's a silent table. My son has no idea where a script comes from or who uses it, and he can't hear how a letter is actually said. He also loves finding new scripts, and the Library has only 21 of them.

## Solution

- Every World Script page gets an **About** under its title: 2–3 kid-level sentences covering where it's used, where it came from, and one fun fact.
- Tapping any **World Character** (letter, syllable or numeral) says its name aloud with the device's built-in voices, in the script's own language when the tablet has that voice and in English otherwise. Mute silences it, like every other sound.
- Fifteen more World Scripts and numeral systems join the Library.

## User Stories

1. As the kid, I want a few sentences under a World Script's title telling me where it's used and where it came from, so that the script feels real and not just a table.
2. As the kid, I want each About to include one surprising fact, so that I have something to tell Dad.
3. As the kid, I want to tap a letter and hear its name, so that I know how to say it.
4. As the kid, I want to hear it said the way a native speaker would when the tablet can, so that it sounds right.
5. As the kid, I want a tap to still say something in English when the tablet has no voice for that language, so that no letter is silent for no reason.
6. As the kid, I want to tap a numeral and hear the number, so that I can compare how numbers sound and look.
7. As the kid, I want the voice slow enough to catch a single letter, so that I can repeat it.
8. As the kid, I want the card I tapped to glow while it speaks, so that I know which one is talking.
9. As the kid, I want mute to silence the voice too, so that mute always means quiet.
10. As the kid, when sound is muted and I tap a letter, I want the mute button to wiggle, so that I know why it's quiet.
11. As the kid, I want more scripts to explore (Glagolitic, Coptic, Gothic, Phoenician, Younger Futhark, Canadian syllabics, Tibetan, Bengali, Tamil, Linear B, Egyptian hieroglyphs), so that the Library keeps surprising me.
12. As the kid, I want more numeral systems (Kaktovik, Egyptian, Attic Greek, Chinese rod numerals), so that I can see even more ways of writing numbers.
13. As Dad, I want to skim every About before it ships, so that nothing wrong or odd reaches him.

## Implementation Decisions

### Data shape (`src/core/library/worldScript.ts`)
- `WorldScript.about: string`, required. Plain text, 2–3 sentences.
- `WorldScript.voice?: string`, a BCP 47 language tag for the script's spoken language (e.g. `"el"`, `"ko"`, `"ja"`, `"hi"`). Absent means there's no living spoken language with a likely device voice (runes, Ogham, Linear B, numeral-only systems…), so it always falls back to English.
- `WorldCharacter.say?: string`, optional text handed to the native voice. It defaults to the first space-separated form of `text` (so "Λ λ" sends "Λ"). Use it where a lone character reads badly; most entries won't need it.
- `WorldNumeral` needs nothing new: the native voice reads the numeral `text`, and English reads `value` as a number.

### Pronunciation rule (Studio core, tested)
- A new core view, roughly `core.pronunciation(scriptId, entry, availableVoiceLangs)`, returns `{ text, lang, rate }` or nothing (unknown script or entry). It's a pure rule with no DOM and no `speechSynthesis`.
  - Native voice: the script has `voice` and some available voice's language matches it (match on the primary subtag, so `el` matches `el-GR`). The result is `say ?? first form of text` in that language.
  - Otherwise English: a character says its `name`, and a numeral says `String(value)`. English voices read digits as words, so "19" is said as "nineteen".
  - `rate` is one shared constant, 0.8.
- **Muted** is decided in the core too: the view (or a sibling) reports "muted: glow + wiggle, don't speak" so the screen holds no rules.
- Voice-language mapping for today's scripts: Greek `el`, Cyrillic `ru`, Hangul `ko`, Hebrew `he`, Arabic `ar`, Devanagari `hi`, Georgian `ka`, Armenian `hy`, hiragana and katakana `ja`, Thai `th`, Ethiopic `am`, Chinese numerals `zh`, Eastern Arabic `ar`. None for Elder Futhark, Ogham, Cherokee, Tifinagh, Roman, Mayan, Babylonian.
- New scripts: Bengali `bn`, Tamil `ta`, Tibetan `bo` (rarely installed, but harmless). None for the rest.

### Speech adapter (`src/sound/speech.ts`)
- Thin wrapper over `window.speechSynthesis`. It lists the available voice languages (Chromium fills them in late, so listen for `voiceschanged`), speaks an utterance (cancelling any in-progress one first, so fast taps don't queue up), and reports when it starts and ends so the card can glow.
- Silently does nothing if speech synthesis is missing. The card still glows briefly.
- Picks a voice whose `lang` matches the rule's `lang`. For English, prefer `en-US`, then any `en`.

### Screens
- World Script page: the About sits under the title, above the "written right to left" note and the grid. It uses calm body text, isn't tappable, and isn't spoken.
- World Character cards (letters and numerals) become buttons. Tapping one glows the card (a CSS class added while speaking, or for about 600 ms when muted or silent) and speaks it.
- Mute button: a one-shot soft wiggle animation (a CSS class, removed on `animationend`), triggered by a muted tap. The button never moves position.

### Content
- New World Script files under `src/core/library/scripts/`, one per id, same shape as today plus `about` and `voice`. Character names and sounds follow the existing style ("written the way a kid reading English would say it").
- Egyptian hieroglyphs: only the ~25 one-sound signs, each with a kid name ("vulture", "reed", "owl") and its sound.
- Kaktovik numerals: the 20 digits 0–19. Attic Greek: Ι Π Δ Η Χ Μ plus the combined "five-times" forms for 50, 500, 5000 and 50 000 (from Unicode's Ancient Greek Numbers block; check the code points against the Unicode chart). Rod numerals: the 1–9 units and tens forms. Egyptian numerals: 1, 10, 100, 1000, 10 000, 100 000, 1 000 000.

## Testing Decisions

- Through the Studio core only (existing convention: `newStudio()` from `src/core/testing.ts`).
- Library content check grows: every World Script has a non-empty `about`; `voice`, if present, is a plausible tag (`/^[a-z]{2,3}(-[A-Z]{2})?$/`); every new id from this spec is present.
- Pronunciation rule: native voice used when a matching language is available (including `el` vs `el-GR`); English fallback says the name (never the sound text); numeral fallback says the value; numeral-only systems always use English; `say` overrides the first form; the first form is split off a multi-form `text`; rate is 0.8; muted reports glow-and-wiggle with no speech.
- The speech adapter and the glow and wiggle are checked by eye in Edge, then on the tablet (ticket 15).

## Out of Scope

- Recorded audio clips.
- Speaking the sound text, the About, or whole words or syllable blocks.
- Mongolian (top-to-bottom writing).
- Tracing, quizzes and any "say it back" check.
- Counting in World Script numerals in the Number Explorer (still a separate V1.1 idea in DESIGN.md).

## Further Notes

- Fonts: most new scripts won't render on a stock Fire tablet. They join v1 ticket 16 (bundled Noto fonts), which waits on ticket 15's list. Kaktovik numerals are new (Unicode 15), and a free font for them may not exist. If none does, draw the 20 digits as simple SVG strokes (they're straight-line shapes), and record that choice on ticket 16.
- Device voices: Fire tablets ship few TTS languages, so English fallback will be common there. Ticket 15 now records which languages the tablet speaks.
