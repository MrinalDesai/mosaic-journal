import type { Memory, LifeTheme, EventType, Significance, SentimentLabel } from "../types";

export interface MonthBucket {
  key: string;          // 2026-03
  label: string;        // MAR 26
  year: number;
  month: number;
  count: number;
  averageValence: number | null;
  averageEnergy: number | null;
  positive: number;
  difficult: number;
  even: number;
}

export interface Counted<T> { value: T; count: number; share: number; }

function monthKey(iso: string): string { return iso.slice(0, 7); }

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return `${d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()} ${String(y).slice(2)}`;
}

function dated(memories: Memory[]): { m: Memory; iso: string }[] {
  return memories
    .map((m) => ({ m, iso: m.memoryDate ?? m.createdAt ?? "" }))
    .filter((x) => x.iso && !Number.isNaN(new Date(x.iso).getTime()));
}

/** Contiguous months across the archive's span, so gaps show as gaps. */
export function monthlyBuckets(memories: Memory[]): MonthBucket[] {
  const rows = dated(memories);
  if (rows.length === 0) return [];

  const keys = rows.map((r) => monthKey(r.iso)).sort();
  const [startY, startM] = keys[0].split("-").map(Number);
  const [endY, endM] = keys[keys.length - 1].split("-").map(Number);

  const grouped = new Map<string, Memory[]>();
  for (const { m, iso } of rows) {
    const k = monthKey(iso);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(m);
  }

  const out: MonthBucket[] = [];
  for (let y = startY, mo = startM; y < endY || (y === endY && mo <= endM); ) {
    const key = `${y}-${String(mo).padStart(2, "0")}`;
    const group = grouped.get(key) ?? [];
    const valences = group.map((g) => g.sentiment?.valence).filter((v): v is number => typeof v === "number");
    const energies = group.map((g) => g.sentiment?.energy).filter((v): v is number => typeof v === "number");

    out.push({
      key,
      label: monthLabel(key),
      year: y,
      month: mo,
      count: group.length,
      averageValence: valences.length ? valences.reduce((s, v) => s + v, 0) / valences.length : null,
      averageEnergy: energies.length ? energies.reduce((s, v) => s + v, 0) / energies.length : null,
      positive: valences.filter((v) => v >= 0.15).length,
      difficult: valences.filter((v) => v <= -0.15).length,
      even: valences.filter((v) => v > -0.15 && v < 0.15).length
    });

    mo += 1;
    if (mo > 12) { mo = 1; y += 1; }
  }
  return out;
}

function tally<T>(items: T[]): Counted<T>[] {
  const counts = new Map<T, number>();
  for (const i of items) counts.set(i, (counts.get(i) ?? 0) + 1);
  const total = items.length || 1;
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count, share: count / total }))
    .sort((a, b) => b.count - a.count);
}

export function themeCounts(memories: Memory[]): Counted<LifeTheme>[] {
  return tally(memories.flatMap((m) => m.lifeThemes ?? []));
}

export function eventTypeCounts(memories: Memory[]): Counted<EventType>[] {
  return tally(memories.map((m) => m.eventType).filter((v): v is EventType => !!v));
}

export function significanceCounts(memories: Memory[]): Counted<Significance>[] {
  return tally(memories.map((m) => m.significance).filter((v): v is Significance => !!v));
}

export function sentimentCounts(memories: Memory[]): Counted<SentimentLabel>[] {
  return tally(memories.map((m) => m.sentiment?.label).filter((v): v is SentimentLabel => !!v));
}

export function years(memories: Memory[]): number[] {
  const set = new Set(dated(memories).map(({ iso }) => new Date(iso).getFullYear()));
  return [...set].sort();
}

/**
 * Qualitative sentence about a month. Deliberately descriptive: this is memory
 * tone, not a wellbeing measure.
 */
export function describeMonth(b: MonthBucket): string {
  if (b.count === 0) return "No memories were catalogued.";
  const noun = b.count === 1 ? "memory" : "memories";
  if (b.averageValence === null) return `${b.count} ${noun}, tone unrecorded.`;
  if (b.difficult > b.positive) return `${b.count} ${noun} — more difficult and reflective than usual.`;
  if (b.positive > b.difficult * 2) return `${b.count} ${noun} — mostly positive in tone.`;
  return `${b.count} ${noun} — a mixed month.`;
}
