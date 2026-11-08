import { defineConfig } from "vitest/config";

export default defineConfig({
  // Relative base so the build works under the GitHub Pages project path
  // (https://trevordobrinska.github.io/secret-script-studio/) without hard-coding the repo name.
  base: "./",
  test: {
    include: ["src/**/*.test.ts"],
  },
});
