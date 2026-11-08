# 01: Follow the Arcade's suite rules and point the docs at them

**What to build:** Check this app against the Arcade's suite rules (`C:\Users\trevo\Projects\arcade\SUITE-RULES.md`) and update DESIGN.md and CLAUDE.md as the Arcade handoff asks (`.scratch/arcade/handoff.md`). The house button is its own ticket (02).

**Blocked by:** None

**Status:** resolved

- [x] Rule 1, own path and relative URLs: `vite.config.ts` builds with `base: "./"`
- [x] Rule 2, prefixed storage: IndexedDB database `secret-script-studio`
- [x] Rule 3, service worker stays in its own path: `src/main.ts` registers `sw.js` with the default scope, `/secret-script-studio/`
- [x] Rule 4, Tile icon: `https://trevordobrinska.github.io/secret-script-studio/icon-512.png` returns 200 `image/png`
- [x] Rule 6, no install prompt: nothing in `src` asks to be installed; the manifest stays
- [x] DESIGN.md's "The Arcade" section now points at the Arcade's DESIGN.md and SUITE-RULES.md, and its tablet checklist installs the Arcade instead of this app
- [x] CLAUDE.md points at SUITE-RULES.md
- [x] Ticket 15 (tablet test) is now blocked on the Arcade going live and opens through a Test Tile

## Comments

- 2026-11-08 (agent): Checked and updated as above. Rule 7 (getting a Tile) is a change on the Arcade side: the Secret Script Studio Tile stays Coming-soon until Dad calls it Ready.
