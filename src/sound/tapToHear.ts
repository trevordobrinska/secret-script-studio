/**
 * Tap to hear's glow and mute wiggle, shared by everything that speaks on
 * a tap (World Character cards, a Glyph's 🔊, Read it to me). The core
 * decides what a tap says; this says it, and glows the element (class
 * "speaking") meanwhile.
 */
import type { SpeakOrMuted } from "../core/studioCore";
import { wiggleMuteButton } from "./muteButton";
import { speak, stopSpeaking } from "./speech";

/** How long the glow lasts when nothing is spoken (muted, or no speech synthesis on this device). */
const GLOW_MS = 600;
/** The longest a short glow lasts while speaking, in case the voice never says it's finished (some browsers drop `end` after a cut-off). */
const MAX_GLOW_MS = 4000;
/** A generous time per character at SPEECH_RATE, for the safety timeout of longer speech. */
const MS_PER_CHAR = 150;

/** Turns off whatever is glowing now, if anything: only one thing glows at a time. */
let unlightCurrent: (() => void) | undefined;

/**
 * Makes a "hear" function for `glowing`: give it a tap's result and it
 * speaks it (cutting off any earlier speech) while `glowing` glows. While
 * muted it glows briefly and wiggles the mute button once. An undefined
 * tap does nothing. With `tapAgainStops` (Read it to me), a tap while it's
 * still speaking stops the speech and goes quiet instead of starting over.
 */
export function tapToHear(
  glowing: HTMLElement,
  { tapAgainStops = false } = {},
): (tap: SpeakOrMuted | undefined) => void {
  let glowTimer: number | undefined;
  /** Whether `glowing` glows because it's speaking (not just a muted glow). */
  let speaking = false;
  const unlight = () => {
    speaking = false;
    window.clearTimeout(glowTimer);
    glowing.classList.remove("speaking");
    if (unlightCurrent === unlight) unlightCurrent = undefined;
  };
  /** Glows for at most `ms`, turning off whatever else was glowing. */
  const light = (ms: number) => {
    if (unlightCurrent !== unlight) unlightCurrent?.();
    unlightCurrent = unlight;
    glowing.classList.add("speaking");
    window.clearTimeout(glowTimer);
    glowTimer = window.setTimeout(unlight, ms);
  };
  return (tap) => {
    if (!tap) return;
    if (tapAgainStops && speaking) {
      stopSpeaking();
      unlight();
      return;
    }
    if (tap.kind === "muted") wiggleMuteButton();
    // A whole Message (Read it to me) takes longer to say than one name, so its safety timeout grows with it.
    const maxGlow = tap.kind === "speak" ? Math.max(MAX_GLOW_MS, tap.speech.text.length * MS_PER_CHAR) : GLOW_MS;
    const spoken = tap.kind === "speak" && speak(tap.speech, { onStart: () => light(maxGlow), onEnd: unlight });
    light(spoken ? maxGlow : GLOW_MS);
    speaking = spoken;
  };
}
