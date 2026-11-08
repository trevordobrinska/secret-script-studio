/**
 * Tap to hear: the device's built-in voices, through the Web Speech API.
 *
 * A thin adapter: the core decides what to say and in which language
 * (`core.worldCharacterTap`); this only lists the voice languages and
 * speaks. Call `startSpeech()` once in main.ts. Everything is a silent
 * no-op where speech synthesis is missing.
 */
import type { Speech } from "../core/studioCore";

let voices: readonly SpeechSynthesisVoice[] = [];
/** Held so Chromium doesn't garbage-collect it mid-word (and drop its `end` event). */
let current: SpeechSynthesisUtterance | undefined;

function synth(): SpeechSynthesis | undefined {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
}

/** Reads the voice list now, and again when it arrives late (Chromium fills it in after `voiceschanged`). */
export function startSpeech(): void {
  const speech = synth();
  if (!speech) return;
  const refresh = () => {
    voices = speech.getVoices();
  };
  refresh();
  speech.addEventListener("voiceschanged", refresh);
}

/** The languages the device's voices speak ("en-US", "el-GR"…). Empty without speech synthesis. */
export function voiceLangs(): readonly string[] {
  const speech = synth();
  if (speech && voices.length === 0) voices = speech.getVoices();
  return voices.map((voice) => voice.lang);
}

export interface SpeakEvents {
  /** The voice has started saying it. */
  onStart?: () => void;
  /** It's finished, failed, or was cut off by the next tap or `stopSpeaking()`. */
  onEnd?: () => void;
}

/**
 * Says `speech`, cutting off whatever is being said (so fast taps don't
 * queue up). Returns false, and does nothing, without speech synthesis.
 */
export function speak(speech: Speech, { onStart, onEnd }: SpeakEvents = {}): boolean {
  const synthesis = synth();
  if (!synthesis) return false;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speech.text);
  utterance.lang = speech.lang;
  utterance.rate = speech.rate;
  const voice = voiceFor(speech.lang);
  if (voice) utterance.voice = voice;
  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    if (current === utterance) current = undefined;
    onEnd?.();
  };
  utterance.onstart = () => onStart?.();
  utterance.onend = end;
  utterance.onerror = end;
  current = utterance;
  synthesis.speak(utterance);
  return true;
}

/** Stops speaking at once (mute does this). */
export function stopSpeaking(): void {
  synth()?.cancel();
}

/** A voice for `lang`: an exact match first; for English en-US, then any en; otherwise any of the same language. */
function voiceFor(lang: string): SpeechSynthesisVoice | undefined {
  const tag = (voice: SpeechSynthesisVoice) => voice.lang.replace("_", "-").toLowerCase();
  const primary = lang.split("-")[0]!.toLowerCase();
  const wanted = lang.toLowerCase();
  return (
    voices.find((voice) => tag(voice) === wanted) ??
    (primary === "en" ? voices.find((voice) => tag(voice) === "en-us") : undefined) ??
    voices.find((voice) => tag(voice).split("-")[0] === primary)
  );
}
