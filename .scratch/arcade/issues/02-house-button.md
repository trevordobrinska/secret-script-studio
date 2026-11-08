# 02: House button back to the Arcade

**What to build:** A small house button on the Home screen, next to the three big tiles, that links to the Arcade at `/` (suite rule 5 in `C:\Users\trevo\Projects\arcade\SUITE-RULES.md`). The tablet's own Back is the backup. See `.scratch/arcade/handoff.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A small house button on the Home screen (`src/screens/homeScreen.ts`), always in the same spot, that doesn't crowd the three big tiles
- [ ] It links to the site root `/` (absolute, so it leaves `/secret-script-studio/`), opening in the same window so the Arcade's fullscreen window stays put
- [ ] Checked on the tablet as part of ticket 15: the house button and system Back both return to the Arcade
