# 01: Scaffold, deploy and home screen

**What to build:** The app exists and is published. Opening it on a tablet-sized screen shows the home screen with three big tiles (My Scripts, Library, Number Explorer). Each tile opens a placeholder screen with a back-to-home button in a fixed spot. Under the hood there's a Studio core skeleton (a factory with injected storage and clock), an in-memory storage, and test helpers in the Doodle Monsters style, so later tickets can add rules test-first.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Vite + TypeScript + Vitest project set up; `npm test` runs and passes with at least one core test
- [ ] Studio core factory takes injected storage and clock and is only touched by tests through its public interface
- [ ] In-memory storage plus test helpers (fake clock, a builder for a new core)
- [ ] Home screen with three big tiles that never move; each placeholder screen has a home button in the same place
- [ ] PWA manifest and icons so add-to-home-screen opens fullscreen
- [ ] Build works under the GitHub Pages project path (relative base)
- [ ] Published to GitHub Pages at `trevordobrinska.github.io/secret-script-studio/`. **Confirm with the user before creating or pushing the GitHub repo.**
- [ ] Checked in desktop Chrome's device toolbar (tablet size, touch)
