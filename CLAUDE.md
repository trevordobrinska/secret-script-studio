# Secret Script Studio

The design decisions are in `DESIGN.md` and the vocabulary is in `GLOSSARY.md`. Those two files are the source of truth.

This app is a Game in the Dobrinska Arcade, so it must follow the suite rules in `C:\Users\trevo\Projects\arcade\SUITE-RULES.md` (own path, prefixed storage, no install prompt, house button home). Suite-wide decisions are made on the Arcade side; don't edit its files from here.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
