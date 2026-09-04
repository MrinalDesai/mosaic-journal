import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import type { Memory, MemoryCluster, LifeTheme } from "../types";
import { getClusters } from "../lib/api";
import { toneColor } from "../components/Marks";

function span(a?: string | null, b?: string | null): string {
  const fmt = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? null
      : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase();
  };
  const from = fmt(a);
  const to = fmt(b);
  if (!from) return "—";
  return from === to ? from : `${from} — ${to}`;
}

function toneWord(v: number | null): string {
  if (v === null) return "unrecorded";
  if (v >= 0.4) return "mostly positive";
  if (v >= 0.1) return "gently positive";
  if (v > -0.1) return "mixed";
  return "more difficult";
}

export function ConstellationsView({ user, memories }: { user: User; memories: Memory[] }) {
  const [clusters, setClusters] = useState<MemoryCluster[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getClusters(user)
      .then((c) => { if (active) setClusters(c); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "Could not load constellations."); });
    return () => { active = false; };
  }, [user]);

  const byCluster = useMemo(() => {
    const map = new Map<number, Memory[]>();
    for (const m of memories) {
      if (typeof m.clusterId !== "number") continue;
      if (!map.has(m.clusterId)) map.set(m.clusterId, []);
      map.get(m.clusterId)!.push(m);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (b.memoryDate ?? "").localeCompare(a.memoryDate ?? ""));
    }
    return map;
  }, [memories]);

  if (error) return <div className="empty-state">{error}</div>;
  if (!clusters) return <div className="empty-state">Reading the constellations…</div>;
  if (clusters.length === 0) {
    return (
      <div className="empty-state">
        No constellations yet.<br />
        Clustering runs as a batch job over the whole archive, not on page load.
      </div>
    );
  }

  const unclustered = memories.filter((m) => typeof m.clusterId !== "number").length;

  return (
    <>
      <div className="section-heading">
        <span>Memory constellations</span>
        <span>{clusters.length} groupings{unclustered > 0 ? ` · ${unclustered} unassigned` : ""}</span>
      </div>

      <div className="arc-panel">
        <div className="arc-caption">
          Memories grouped by meaning rather than by date or place. Each grouping emerged
          from embeddings of the stored narratives and classifications, and was named from
          its own contents.
        </div>
      </div>

      <div className="constellation-grid">
        {clusters.map((c) => {
          const members = byCluster.get(c.clusterId) ?? [];
          const themes = new Map<LifeTheme, number>();
          const valences: number[] = [];
          const places = new Map<string, number>();
          for (const m of members) {
            for (const t of m.lifeThemes ?? []) themes.set(t, (themes.get(t) ?? 0) + 1);
            if (typeof m.sentiment?.valence === "number") valences.push(m.sentiment.valence);
            const p = m.location?.placeName;
            if (p) places.set(p, (places.get(p) ?? 0) + 1);
          }
          const avg = valences.length ? valences.reduce((s, v) => s + v, 0) / valences.length : null;
          const topThemes = [...themes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
          const topPlaces = [...places.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
          const open = openId === c.clusterId;

          return (
            <article key={c.clusterId} className="constellation">
              <div className="con-head" onClick={() => setOpenId(open ? null : c.clusterId)}>
                <div>
                  <div className="con-title">{c.title}</div>
                  <div className="con-desc">{c.description}</div>
                </div>
                <div className="place-count">
                  <strong>{c.memoryCount}</strong>
                  <small>{c.memoryCount === 1 ? "memory" : "memories"}</small>
                </div>
              </div>

              <div className="place-meta">
                <div><small>Span</small><span>{span(c.firstDate, c.lastDate)}</span></div>
                <div><small>Tone</small><span>{toneWord(avg)}</span></div>
                {topPlaces.length > 0 && (
                  <div><small>Places</small><span>{topPlaces.map(([p]) => p).join(", ")}</span></div>
                )}
              </div>

              {topThemes.length > 0 && (
                <div className="classification">
                  {topThemes.map(([t, n]) => (
                    <span key={t} className="chip theme">{t.replace(/-/g, " ")} {n}</span>
                  ))}
                </div>
              )}

              {open && (
                <ul className="place-memories">
                  {members.map((m) => (
                    <li key={m.id}>
                      <span className="pm-date">
                        {m.memoryDate
                          ? new Date(m.memoryDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase()
                          : "—"}
                      </span>
                      <span className="pm-text">{m.narrative ?? m.analysis.artifactDescription}</span>
                      {m.sentiment && (
                        <span className="chip tone" style={{ borderColor: toneColor(m.sentiment.label), color: toneColor(m.sentiment.label) }}>
                          {m.sentiment.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
