import type { WorldScript } from "./worldScript";

/**
 * Every World Script in the Library. Each lives in its own file under
 * ./scripts/ and default-exports a WorldScript; adding a file adds it here.
 * Order: writing systems first, then numeral-only systems, each by name.
 */
const modules = import.meta.glob<WorldScript>("./scripts/*.ts", { eager: true, import: "default" });

export const LIBRARY: readonly WorldScript[] = Object.values(modules).sort((a, b) =>
  a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "writing" ? -1 : 1,
);
