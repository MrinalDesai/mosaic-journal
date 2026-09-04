import { useEffect, useMemo, useState } from "react";
import type { Memory } from "../types";
import { clusterByProximity, CITY_RADIUS_M, VENUE_RADIUS_M } from "../lib/proximity";
import { PlaceMap } from "./PlaceMap";
import { getMapsApiKey } from "../lib/firebase";

function toneWord(valence: number | null): string {
  if (valence === null) return "unrecorded";
  if (valence >= 0.4) return "mostly positive";
  if (valence >= 0.1) return "gently positive";
  if (valence > -0.1) return "mixed";
  if (valence > -0.4) return "more difficult";
  return "difficult";
}

function dateLabel(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase();
}

export function PlacesView({ memories }: { memories: Memory[] }) {
  const [tier, setTier] = useState<"city" | "venue">("city");
  const [openId, setOpenId] = useState<string | null>(null);
  const [mapsKey, setMapsKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMapsApiKey().then((k) => { if (active) setMapsKey(k); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const clusters = useMemo(
    () => clusterByProximity(memories, tier === "city" ? CITY_RADIUS_M : VENUE_RADIUS_M),
    [memories, tier]
  );

  const locatedCount = memories.filter((m) => m.location).length;

  if (locatedCount === 0) {
    return (
      <div className="empty-state">
        No memories carry a location yet.<br />
        Use <strong>Add location</strong> when capturing a moment, and places will gather here.
      </div>
    );
  }

  return (
    <>
      <div className="section-heading">
        <span>Places</span>
        <span>{locatedCount} located · {clusters.length} {tier === "city" ? "areas" : "spots"}</span>
      </div>

      <div className="tier-switch">
        <button
          className={tier === "city" ? "" : "secondary"}
          onClick={() => { setTier("city"); setOpenId(null); }}
        >
          Cities
        </button>
        <button
          className={tier === "venue" ? "" : "secondary"}
          onClick={() => { setTier("venue"); setOpenId(null); }}
        >
          Individual spots
        </button>
        <span className="tier-note">
          {tier === "city"
            ? "Grouped within 25 km"
            : "Grouped within 500 m — repeat visits to the same place"}
        </span>
      </div>

      <PlaceMap clusters={clusters} apiKey={mapsKey} onSelect={setOpenId} />

      <div className="place-grid">
        {clusters.map((c) => (
          <article key={c.id} className="place-card">
            <div className="place-head" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
              <div>
                <div className="place-name">{c.label}</div>
                <div className="place-coords">{c.lat.toFixed(4)}, {c.lng.toFixed(4)}</div>
              </div>
              <div className="place-count">
                <strong>{c.count}</strong>
                <small>{c.count === 1 ? "memory" : "memories"}</small>
              </div>
            </div>

            <div className="place-meta">
              <div>
                <small>Span</small>
                <span>{dateLabel(c.firstVisit)} — {dateLabel(c.lastVisit)}</span>
              </div>
              <div>
                <small>Tone</small>
                <span>{toneWord(c.averageValence)}</span>
              </div>
            </div>

            {c.topThemes.length > 0 && (
              <div className="classification">
                {c.topThemes.map(({ theme, count }) => (
                  <span key={theme} className="chip theme">
                    {theme.replace(/-/g, " ")} {count}
                  </span>
                ))}
              </div>
            )}

            {openId === c.id && (
              <ul className="place-memories">
                {c.memories.map((m) => (
                  <li key={m.id}>
                    <span className="pm-date">{dateLabel(m.memoryDate ?? null)}</span>
                    <span className="pm-text">
                      {m.narrative ?? m.analysis.artifactDescription}
                    </span>
                    {m.sentiment && <span className="chip tone">{m.sentiment.label}</span>}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
