import type { MemoryLocation } from "../types";

/**
 * Opt-in only. Never called on page load — only from an explicit user action.
 * Failure never blocks memory creation; the caller simply gets null.
 */
export async function requestCurrentLocation(): Promise<MemoryLocation | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;

  const position = await new Promise<GeolocationPosition | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });

  if (!position) return null;
  const { latitude, longitude } = position.coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return {
    lat: Number(latitude.toFixed(4)),
    lng: Number(longitude.toFixed(4)),
    placeName: "",
    locality: null,
    country: null,
    source: "device"
  };
}

export function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.geolocation;
}
