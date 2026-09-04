import { useMemo, useState } from "react";
import type { Memory } from "../types";
import {
  monthlyBuckets, themeCounts, eventTypeCounts, significanceCounts,
  sentimentCounts, years, describeMonth, type MonthBucket
} from "../lib/analytics";
import { toneColor } from "../components/Marks";

function ValenceTrack({ buckets, onHover }: { buckets: MonthBucket[]; onHover: (b: MonthBucket | null) => void }) {
  const H = 150;
  const mid = H / 2;

  return (
    <div className="valence-track">
      <div className="track-axis"><span>more positive</span><span>more difficult</span></div>
      <div className="track-body" style={{ height: H }}>
        <div className="track-midline" style={{ top: mid }} />
        {buckets.map((b) => {
          const v = b.averageValence;
          const height = v === null ? 0 : Math.abs(v) * (mid - 8);
          const positive = (v ?? 0) >= 0;
          return (
            <div
              key={b.key}
              className="track-col"
              onMouseEnter={() => onHover(b)}
              onMouseLeave={() => onHover(null)}
              title={`${b.label} · ${describeMonth(b)}`}
            >
              {v !== null && (
                <div
                  className={`track-bar ${positive ? "up" : "down"}`}
                  style={{
                    height: Math.max(3, height),
                    top: positive ? mid - Math.max(3, height) : mid,
                    background: positive ? "#2E5C4A" : "#A63D2F",
                    opacity: 0.28 + Math.min(0.62, Math.abs(v ?? 0))
                  }}
                />
              )}
              {b.count === 0 && <div className="track-gap" style={{ top: mid - 1 }} />}
            </div>
          );
        })}
      </div>
      <div className="track-labels">
        {buckets.map((b) => (
          <span key={b.key} className={b.month === 1 ? "year-start" : ""}>
            {b.month === 1 ? b.year : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function Distribution<T extends string>({
  title, rows, colorFor
}: {
  title: string;
  rows: { value: T; count: number; share: number }[];
  colorFor?: (v: T) => string;
}) {
  if (rows.length === 0) return null;
  const max = rows[0].count;
  return (
    <section className="dist">
      <h3>{title}</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.value}>
            <span className="dist-label">{r.value.replace(/-/g, " ")}</span>
            <span className="dist-bar-wrap">
              <span
                className="dist-bar"
                style={{
                  width: `${(r.count / max) * 100}%`,
                  background: colorFor ? colorFor(r.value) : "var(--ink-soft)"
                }}
              />
            </span>
            <span className="dist-count">{r.count}</span>
            <span className="dist-share">{Math.round(r.share * 100)}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArcView({ memories }: { memories: Memory[] }) {
  const [year, setYear] = useState<number | "all">("all");
  const [hover, setHover] = useState<MonthBucket | null>(null);

  const allYears = useMemo(() => years(memories), [memories]);

  const scoped = useMemo(() => {
    if (year === "all") return memories;
    return memories.filter((m) => {
      const iso = m.memoryDate ?? m.createdAt ?? "";
      return iso && new Date(iso).getFullYear() === year;
    });
  }, [memories, year]);

  const buckets = useMemo(() => monthlyBuckets(memories), [memories]);
  const themes = useMemo(() => themeCounts(scoped), [scoped]);
  const events = useMemo(() => eventTypeCounts(scoped), [scoped]);
  const signif = useMemo(() => significanceCounts(scoped), [scoped]);
  const tones = useMemo(() => sentimentCounts(scoped), [scoped]);

  const classified = scoped.filter((m) => m.sentiment).length;

  if (classified === 0) {
    return (
      <div className="empty-state">
        No memories carry tone yet.<br />
        Newly catalogued moments are classified automatically, and patterns gather here.
      </div>
    );
  }

  return (
    <>
      <div className="section-heading">
        <span>Emotional arc</span>
        <span>{classified} classified of {scoped.length}</span>
      </div>

      <div className="arc-panel">
        <div className="arc-caption">
          {hover
            ? <><strong>{hover.label}</strong> — {describeMonth(hover)}</>
            : <>Memory tone across the archive. Hover a month for detail. This describes how memories read, not how you were.</>}
        </div>
        <ValenceTrack buckets={buckets} onHover={setHover} />
      </div>

      {allYears.length > 1 && (
        <div className="tier-switch">
          <button className={year === "all" ? "" : "secondary"} onClick={() => setYear("all")}>All years</button>
          {allYears.map((y) => (
            <button key={y} className={year === y ? "" : "secondary"} onClick={() => setYear(y)}>{y}</button>
          ))}
          <span className="tier-note">Distributions below follow this selection</span>
        </div>
      )}

      <div className="dist-grid">
        <Distribution title="Life themes" rows={themes} />
        <Distribution title="Event types" rows={events} />
        <Distribution title="Significance" rows={signif} />
        <Distribution title="Tone" rows={tones} colorFor={(v) => toneColor(v)} />
      </div>
    </>
  );
}
