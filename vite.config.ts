import { defineConfig } from "vitest/config";

export default defineConfig({
  // Relative base so the build works under the GitHub Pages project path
  // (https://trevordobrinska.github.io/secret-script-studio/) without hard-coding the repo name.
  base: "./",
  build: {
    rollupOptions: {
      // tabletTest is THROWAWAY (ticket 02): remove this entry with tablet-test.html after ticket 15.
      input: { main: "index.html", tabletTest: "tablet-test.html" },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
