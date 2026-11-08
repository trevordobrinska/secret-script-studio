import type { WorldCharacter, WorldNumeral, WorldScript } from "./worldScript";

/** How slowly tap to hear speaks, so a single letter is easy to catch (DESIGN: about 0.8×, tuned by ear). */
export const SPEECH_RATE = 0.8;

/** What the speech adapter says for one tap: the words, their language (BCP 47) and the speed. */
export interface Speech {
  readonly text: string;
  readonly lang: string;
  readonly rate: number;
}

/**
 * What a tap on a World Character does. The card always glows; `speak`
 * says `speech` while it glows; `muted` says nothing and gives the mute
 * button one soft wiggle, so the kid can tell the sound is off.
 */
export type WorldCharacterTap = { readonly kind: "speak"; readonly speech: Speech } | { readonly kind: "muted" };

/**
 * The pronunciation rule. The script's own voice reads the character
 * (`say`, or the first form of its text) when one of `voiceLangs` speaks
 * its language; otherwise English says the character's name, or the
 * numeral's value as a number ("19" is read "nineteen").
 */
export function pronounce(
  script: WorldScript,
  entry: WorldCharacter | WorldNumeral,
  voiceLangs: readonly string[],
): Speech {
  const native = script.voice !== undefined && voiceLangs.some((lang) => sameLanguage(lang, script.voice!));
  if (native) {
    const text = ("say" in entry ? entry.say : undefined) ?? firstForm(entry.text);
    return { text, lang: script.voice!, rate: SPEECH_RATE };
  }
  const text = "value" in entry ? String(entry.value) : entry.name;
  return { text, lang: "en", rate: SPEECH_RATE };
}

/** Matches on the primary subtag, so "el" matches "el-GR" (and "EL_gr", as some Android voices report it). */
function sameLanguage(a: string, b: string): boolean {
  const primary = (tag: string) => tag.split(/[-_]/)[0]!.toLowerCase();
  return primary(a) === primary(b);
}

/** "Λ λ" → "Λ": a voice reads one form, not both. */
function firstForm(text: string): string {
  return text.trim().split(/\s+/)[0]!;
}
