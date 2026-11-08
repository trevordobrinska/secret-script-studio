# Handoff from the Dobrinska Arcade grilling (2026-11-08)

The Arcade is designed: see `C:\Users\trevo\Projects\arcade\DESIGN.md` and **`SUITE-RULES.md`** (the rules every Game follows). Turn the items below into tickets and update this repo's DESIGN.md and CLAUDE.md; don't edit them from the Arcade side.

- **Install change:** the tablets install **only the Arcade** (`trevordobrinska.github.io`). The existing manifest and pass-through service worker (scoped to `./`) can stay, but nothing should prompt him to install this app separately.
- **Replace DESIGN.md's "The Arcade" section** with a pointer to `arcade\DESIGN.md` and `SUITE-RULES.md`, and point CLAUDE.md at `SUITE-RULES.md`.
- **Tile icon:** `public/icon-512.png` already exists. Check it's served at `/secret-script-studio/icon-512.png`.
- **Add a house button** on the Home screen (next to the three big tiles) that links to `/`.
- **Storage prefix:** already passes (`secret-script-studio`).
- **Tablet test:** the Arcade goes live first. `tablet-test.html` is opened through a temporary **Test Tile** in the Arcade. The Arcade's own tablet checks run first in that session (see its DESIGN.md checklist).
- The Secret Script Studio Tile stays Coming-soon until Dad calls it Ready.
