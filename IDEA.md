/grill-me Secret Script Studio

Problem: My son (10, autistic) loves foreign alphabets, number systems, math and Minecraft (including the enchanting table's made-up alphabet). He wants to invent his own script, but it ends up on scraps of paper and never gets used.
User: My 10-year-old son, on his tablet, playing alone or trading secret messages with me.
MVP:
- Draw a glyph for each letter and digit with a finger (reuse the Doodle Monsters drawing code)
- The script works as soon as he's drawn a few glyphs (no 36-glyph wall before any payoff)
- An on-screen keyboard in his script: type a secret message, then share or print it with a cipher key
- Decoder mode: paste or type a message and see it in his glyphs, and the reverse
- Math in his numerals: simple problems shown in his digits, with a choice of base (e.g. 8 digits instead of 10)
- Built-in real scripts to browse and compare (Hangul, Greek, Devanagari numerals, the enchanting-table alphabet)
Out of scope:
- Accounts, online sharing, multiplayer
- Fonts installable across the system
- Timers, scores or fail states (calm and open-ended by default)
Constraints: Browser web app / PWA, Vite + TypeScript like Doodle Monsters, tablet-first touch UI. Solo build, about a weekend for the MVP.
Build vs buy: N/A. Built for fun and to sharpen coding skills. Cipher generators exist, but none let a kid draw his own script and do math in it.
Open questions:
- Will he draw 26+ glyphs before any payoff? What's the smallest set that already feels magical?
- How are glyphs stored and rendered: raw strokes, SVG paths or bitmaps? (This affects printing and scaling.)
- What does "math in his numerals" look like: a quiz, a calculator, or a puzzle?
- How much sensory and predictability tuning does he need (sound, animation, layout)?
- Later: his numerals become the secret deepest ore layer in Glyph Mines.
