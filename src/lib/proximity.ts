import type { Memory, LifeTheme } from "../types";

export interface PlaceCluster {
  id: string;
  lat: number;
  lng: number;
  label: string;
  memories: Memory[];
  count: number;
  topThemes: { theme: LifeTheme; count: number }[];
  firstVisit: string | null;
  lastVisit: string | null;
  averageValence: number | null;
}

/** Great-circle distance in metres. */
export function haversine(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Single-linkage agglomeration over coordinates.
 *
 * radiusMetres controls the tier:
 *   ~500      individual venues — the café you keep returning to
 *   ~25000    cities — Pune, Goa, Mumbai
 *
 * O(n²) is fine at a few hundred memories and avoids a dependency.
 */
export function clusterByProximity(memories: Memory[], radiusMetres: number): PlaceCluster[] {
  const located = memories.filter(
    (m) => m.location && Number.isFinite(m.location.lat) && Number.isFinite(m.location.lng)
  );
  if (located.length === 0) return [];

  const parent = located.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => { parent[find(a)] = find(b); };

  for (let i = 0; i < located.length; i += 1) {
    for (let j = i + 1; j < located.length; j += 1) {
      const a = located[i].location!;
      const b = located[j].location!;
      if (haversine(a.lat, a.lng, b.lat, b.lng) <= radiusMetres) union(i, j);
    }
  }

  const groups = new Map<number, Memory[]>();
  located.forEach((m, i) => {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(m);
  });

  return [...groups.values()]
    .map((group) => {
      const lat = group.reduce((s, m) => s + m.location!.lat, 0) / group.length;
      const lng = group.reduce((s, m) => s + m.location!.lng, 0) / group.length;

      const themeCounts = new Map<LifeTheme, number>();
      for (const m of group) {
        for (const t of m.lifeThemes ?? []) themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1);
      }
      const topThemes = [...themeCounts.entries()]
        .map(([theme, count]) => ({ theme, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const dates = group
        .map((m) => m.memoryDate)
        .filter((d): d is string => !!d)
        .sort();

      const valences = group.map((m) => m.sentiment?.valence).filter((v): v is number => typeof v === "number");

      // Prefer a name the data already carries; fall back to coordinates.
      const named = group.find((m) => m.location?.placeName)?.location?.placeName;
      const locality = group.find((m) => m.location?.locality)?.location?.locality;
      // Two clusters can share a placeName when they are far apart within the
      // same city or state — Palolem and Panaji are both "Goa", 60 km apart.
      const label = named && locality ? `${named} · ${locality}` : named || locality;

      return {
        id: `${lat.toFixed(4)},${lng.toFixed(4)}`,
        lat,
        lng,
        label: label || `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
        memories: group.sort((a, b) => (b.memoryDate ?? "").localeCompare(a.memoryDate ?? "")),
        count: group.length,
        topThemes,
        firstVisit: dates[0] ?? null,
        lastVisit: dates[dates.length - 1] ?? null,
        averageValence: valences.length
          ? valences.reduce((s, v) => s + v, 0) / valences.length
          : null
      };
    })
    .sort((a, b) => b.count - a.count);
}

export const CITY_RADIUS_M = 25000;
export const VENUE_RADIUS_M = 500;
