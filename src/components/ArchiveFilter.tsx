import { useMemo } from "react";
import type { Memory } from "../types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export interface Period { year: number | null; month: number | null; }

export function ArchiveFilter({
  memories, period, onChange
}: {
  memories: Memory[];
  period: Period;
  onChange: (p: Period) => void;
}) {
  const counts = useMemo(() => {
    const byYear = new Map<number, number>();
    const byMonth = new Map<string, number>();
    for (const m of memories) {
      const iso = m.memoryDate ?? m.createdAt ?? "";
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(d.getTime())) continue;
      const y = d.getFullYear();
      byYear.set(y, (byYear.get(y) ?? 0) + 1);
      byMonth.set(`${y}-${d.getMonth()}`, (byMonth.get(`${y}-${d.getMonth()}`) ?? 0) + 1);
    }
    return { byYear, byMonth };
  }, [memories]);

  const yearList = [...counts.byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="archive-filter">
      <div className="filter-row">
        <span className="filter-label">Year</span>
        <button
          className={period.year === null ? "" : "secondary"}
          onClick={() => onChange({ year: null, month: null })}
        >
          All <em>{memories.length}</em>
        </button>
        {yearList.map((y) => (
          <button
            key={y}
            className={period.year === y ? "" : "secondary"}
            onClick={() => onChange({ year: y, month: null })}
          >
            {y} <em>{counts.byYear.get(y)}</em>
          </button>
        ))}
      </div>

      {period.year !== null && (
        <div className="filter-row months">
          <span className="filter-label">Month</span>
          <button
            className={period.month === null ? "" : "secondary"}
            onClick={() => onChange({ year: period.year, month: null })}
          >
            All
          </button>
          {MONTHS.map((label, i) => {
            const n = counts.byMonth.get(`${period.year}-${i}`) ?? 0;
            return (
              <button
                key={label}
                className={period.month === i ? "" : "secondary"}
                disabled={n === 0}
                onClick={() => onChange({ year: period.year, month: i })}
                title={n === 0 ? "No memories" : `${n} ${n === 1 ? "memory" : "memories"}`}
              >
                {label}{n > 0 && <em>{n}</em>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
