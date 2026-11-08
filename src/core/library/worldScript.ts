/** One character of a World Script, as the Library shows it: "Λ λ — lambda — L". */
export interface WorldCharacter {
  /** The character itself (capital and small together where the script has both, e.g. "Λ λ"). */
  readonly text: string;
  readonly name: string;
  /** Roughly how it sounds, written the way a kid reading English would say it. */
  readonly sound: string;
  /**
   * What the script's own voice reads aloud when tapped. Without it, the first
   * space-separated form of `text` ("Λ λ" reads "Λ"). Only for a lone character that reads badly.
   */
  readonly say?: string;
}

/** One numeral and the whole number it stands for. */
export interface WorldNumeral {
  readonly text: string;
  readonly value: number;
}

/**
 * A real writing system or numeral system in the Library. Read-only.
 * `kind: "numerals"` means a numeral-only system (Roman, Mayan…): no characters.
 */
export interface WorldScript {
  /** Stable id, also the data file's name (scripts/<id>.ts). */
  readonly id: string;
  readonly name: string;
  readonly kind: "writing" | "numerals";
  /** "rtl" for scripts written right to left (Hebrew, Arabic); absent means left to right. */
  readonly direction?: "rtl";
  /**
   * BCP 47 language tag of the script's spoken language ("el", "ko", "ja"…), for tap to hear.
   * Absent when no living language is likely to have a device voice (runes, Roman…): English then.
   */
  readonly voice?: string;
  readonly characters: readonly WorldCharacter[];
  readonly numerals: readonly WorldNumeral[];
}
