# 13: Backup/Restore

**What to build:** A Backup button saves every My Script, Message and setting to one file. A Restore button loads a backup file and adds its contents without deleting anything already on the tablet. Anyone can use them, with no parent gate.

**Blocked by:** 05 (Many My Scripts), 06 (Saved Messages diary)

**Status:** ready-for-agent

- [ ] Core: export everything as one versioned JSON document; import into fresh storage gives an identical state (tested)
- [ ] Core: import merges by id: items in the file are added or overwrite the same id; nothing else is deleted (tested)
- [ ] Core: an unreadable or wrong file gives a gentle "couldn't read that backup" result and changes nothing (tested)
- [ ] Backup downloads a file named with the date; Restore uses a file picker
- [ ] The buttons live somewhere reachable but out of the way (e.g. the My Scripts list)
