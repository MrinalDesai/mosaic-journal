import type { Memory } from "../types";

/** Deterministic archive catalogue number, e.g. M-2026-0903-014. */
export function catalogNumber(memory: Memory): string {
  const d = memory.memoryDate ? new Date(memory.memoryDate) : new Date();
  const year = Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  const mmdd = Number.isNaN(d.getTime())
    ? "0000"
    : `${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  let hash = 0;
  for (const ch of memory.id) hash = (hash * 31 + ch.charCodeAt(0)) % 999;
  return `M-${year}-${mmdd}-${String(hash + 1).padStart(3, "0")}`;
}
