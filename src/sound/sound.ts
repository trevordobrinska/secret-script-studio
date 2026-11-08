/**
 * Soft click sounds, synthesised live with Web Audio (no sound files).
 *
 * Call `startSound(isMuted)` once in main.ts; after that any screen can call
 * `playTap()`, `playKey()` or `playSave()`. They are silent no-ops until the
 * first touch (browser autoplay rules), while muted, or if Web Audio is missing.
 */

const VOLUME = 0.25;

let context: AudioContext | undefined;
let master: GainNode | undefined;
let muted: () => boolean = () => false;

/** Starts listening for the first touch, which is when audio is allowed to begin. */
export function startSound(isMuted: () => boolean): void {
  muted = isMuted;
  const unlock = () => {
    if (!context) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      context = new Ctor();
      master = context.createGain();
      master.gain.value = VOLUME;
      master.connect(context.destination);
    }
    if (context.state === "suspended") void context.resume();
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("pointerup", unlock, { capture: true });
}

/** A soft click for a button tap. */
export function playTap(): void {
  blip(520, 380, 0.06);
}

/** A tiny, higher tick for a key press on the keyboard. */
export function playKey(): void {
  blip(760, 640, 0.04);
}

/** A gentle two-note chime for saving a Glyph. */
export function playSave(): void {
  blip(523, 523, 0.12);
  blip(784, 784, 0.16, 0.09);
}

function blip(fromHz: number, toHz: number, seconds: number, delay = 0): void {
  if (!context || !master || muted() || context.state !== "running") return;
  const t = context.currentTime + delay;
  const osc = context.createOscillator();
  const env = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(fromHz, t);
  osc.frequency.exponentialRampToValueAtTime(toHz, t + seconds);
  // Short soft attack and decay: never a hard click or a loud edge.
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(1, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  osc.connect(env).connect(master);
  osc.start(t);
  osc.stop(t + seconds + 0.02);
}
