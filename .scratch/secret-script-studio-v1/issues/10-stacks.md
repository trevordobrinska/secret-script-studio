# 10: Stacks

**What to build:** Next to the number, the Number Explorer shows the quantity as blocks. When there are as many blocks as the Digit Count they snap into a Stack, and enough Stacks snap into a Stack of Stacks, like Minecraft item stacks. Each column of the number is color-matched to its pile, so he can see what each digit is worth without any words.

**Blocked by:** 09 (Number Explorer counter)

**Status:** resolved

- [x] Draws loose blocks, Stacks and bigger Stacks of Stacks from the core's per-column item counts
- [x] Each number column and its pile share a color
- [x] A short snapping animation when blocks or Stacks combine (on +) and split (on −)
- [x] Stays readable at the largest case (999 at Digit Count 2 and at 16) on a tablet screen
- [x] Core tests from ticket 09 cover the counts for every Digit Count 2–16 at several values (extend if missing)

## Comments

Implemented on integration branch `secret-script-studio-v1` (TDD through the Studio core; screens checked in Edge at 1280x800 and 800x1280). On-device feel is part of ticket 15.
