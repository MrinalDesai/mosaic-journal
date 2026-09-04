import { MEMORIES_2024 } from "./memories2024.mjs";
import { MEMORIES_2025 } from "./memories2025.mjs";
import { MEMORIES_2026 } from "./memories2026.mjs";
import { MEMORIES_ROUTINE } from "./memoriesRoutine.mjs";

/** Chronological, so seeding reads like a journal rather than three blocks. */
export const MEMORIES = [
  ...MEMORIES_2024,
  ...MEMORIES_2025,
  ...MEMORIES_2026,
  ...MEMORIES_ROUTINE
].sort((a, b) => a.date.localeCompare(b.date));
