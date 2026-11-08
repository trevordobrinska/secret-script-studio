# 03: Mute silences the voice too

**What to build:** The mute button silences pronunciation as well as the clicks. A tap on a World Character while muted still glows the card, and the mute button gives one soft wiggle (no words), so the kid can tell the sound is off rather than broken.

**Blocked by:** 02 (Tap a World Character to hear it)

**Status:** ready-for-agent

- [x] Core: when muted, the pronunciation view reports "glow and wiggle, don't speak" (tested)
- [x] Muting while a letter is speaking stops it straight away
- [x] Mute button wiggle: a short, gentle one-shot animation; the button never changes position; repeated muted taps don't stack wiggles
- [ ] Checked by eye in Edge

## Comments

- 2026-11-07 (agent): Core: `worldCharacterTap` returns `{ kind: "muted" }` while muted (tested in `src/core/tapToHear.test.ts`). The card glows ~600 ms and calls `wiggleMuteButton()` (`src/sound/muteButton.ts`), which adds a `wiggle` class removed on `animationend`; adding it again mid-wiggle is a no-op, so taps don't stack. The wiggle only rotates (CSS `rotate`, not `transform`, so it doesn't fight the press-down `:active` transform); position never changes. Reduced-motion shortens it to 1 ms. Turning mute on (button or a Restore) calls `stopSpeaking()`.
- Edge check not done: the agent couldn't look at it in a browser. Left unchecked for Dad: tap a letter while muted (card glows, button wiggles once, no sound); tap fast several times; mute mid-word.
