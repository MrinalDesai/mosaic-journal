/**
 * Public, city/area-level coordinates with a small deterministic jitter so the
 * venue tier (500 m) finds repeat visits rather than one perfect point.
 * No private addresses.
 */
const BASE = {
  pune_home:      { lat: 18.5204, lng: 73.8567, placeName: "Pune",       locality: "Shivajinagar" },
  pune_kp:        { lat: 18.5362, lng: 73.8939, placeName: "Pune",       locality: "Koregaon Park" },
  pune_fcroad:    { lat: 18.5225, lng: 73.8412, placeName: "Pune",       locality: "FC Road" },
  pune_aundh:     { lat: 18.5590, lng: 73.8070, placeName: "Pune",       locality: "Aundh" },
  pune_camp:      { lat: 18.5150, lng: 73.8790, placeName: "Pune",       locality: "Camp" },
  pune_kothrud:   { lat: 18.5074, lng: 73.8077, placeName: "Pune",       locality: "Kothrud" },
  pune_tekdi:     { lat: 18.5230, lng: 73.8280, placeName: "Pune",       locality: "Vetal Tekdi" },
  pune_shukrawar: { lat: 18.5100, lng: 73.8560, placeName: "Pune",       locality: "Shukrawar Peth" },
  pune_gahunje:   { lat: 18.6800, lng: 73.6800, placeName: "Pune",       locality: "Gahunje" },
  mumbai_fort:    { lat: 18.9340, lng: 72.8350, placeName: "Mumbai",     locality: "Fort" },
  mumbai_colaba:  { lat: 18.9220, lng: 72.8330, placeName: "Mumbai",     locality: "Colaba" },
  goa_palolem:    { lat: 15.0100, lng: 74.0233, placeName: "Goa",        locality: "Palolem" },
  goa_panaji:     { lat: 15.4909, lng: 73.8278, placeName: "Goa",        locality: "Panaji" },
  bengaluru:      { lat: 12.9716, lng: 77.5946, placeName: "Bengaluru",  locality: null },
  delhi:          { lat: 28.6139, lng: 77.2090, placeName: "Delhi",      locality: null },
  hyderabad:      { lat: 17.3850, lng: 78.4867, placeName: "Hyderabad",  locality: null }
};

/** Deterministic per-memory jitter, roughly ±150 m. */
function jitter(seed) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return ((h % 1000) / 1000 - 0.5) * 0.0028;
}

export function resolvePlace(key, seed) {
  const base = BASE[key];
  if (!base) return null;
  return {
    lat: Number((base.lat + jitter(seed + "a")).toFixed(5)),
    lng: Number((base.lng + jitter(seed + "b")).toFixed(5)),
    placeName: base.placeName,
    locality: base.locality,
    country: "India",
    source: "manual"
  };
}
