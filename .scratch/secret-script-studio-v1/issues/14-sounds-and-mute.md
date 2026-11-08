# 14: Sounds and mute

**What to build:** Taps, key presses and saving a Glyph make soft click sounds. A mute button in a fixed spot turns them off, and the choice is remembered.

**Blocked by:** 01 (Scaffold, deploy and home screen)

**Status:** resolved

- [x] Core: muted setting, saved and kept across reload (tested)
- [x] A few soft, short sounds (synthesized like Doodle Monsters, or generated in code); nothing loud or sudden
- [x] Mute button in the same place on every screen
- [x] Sounds play only after the first touch (browser autoplay rules)

## Comments

Implemented on integration branch `secret-script-studio-v1` (TDD through the Studio core; screens checked in Edge at 1280x800 and 800x1280). On-device feel is part of ticket 15.
