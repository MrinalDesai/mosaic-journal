import { useEffect, useRef, useState } from "react";
import { loadMaps } from "../lib/maps";
import type { PlaceCluster } from "../lib/proximity";

/** Archive-toned map styling, so it reads as part of the same product. */
const ARCHIVE_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#EDE6D6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5A544A" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F7F3EA" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#D8CFBD" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#E7DFCC" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#F2EDE3" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#CFD8D3" }] }
];

export function PlaceMap({
  clusters,
  apiKey,
  onSelect
}: {
  clusters: PlaceCluster[];
  apiKey: string | null;
  onSelect: (id: string) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      // Key not resolved yet on first render; wait rather than declaring failure.
      return;
    }
    setError(null);
    let cancelled = false;

    loadMaps(apiKey)
      .then((maps) => {
        if (cancelled || !holder.current) return;
        mapRef.current = new maps.Map(holder.current, {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 5,
          styles: ARCHIVE_STYLE,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });
        setReady(true);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Maps could not be loaded.");
      });

    return () => { cancelled = true; };
  }, [apiKey]);

  useEffect(() => {
    const maps = (window as any).google?.maps;
    const map = mapRef.current;
    if (!ready || !map || !maps) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (clusters.length === 0) return;
    const bounds = new maps.LatLngBounds();

    for (const c of clusters) {
      const scale = Math.min(26, 9 + Math.sqrt(c.count) * 3.4);
      const marker = new maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map,
        title: `${c.label} — ${c.count} ${c.count === 1 ? "memory" : "memories"}`,
        label: c.count > 1
          ? { text: String(c.count), color: "#F6F2E8", fontSize: "11px", fontWeight: "700" }
          : undefined,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale,
          fillColor: "#A63D2F",
          fillOpacity: 0.88,
          strokeColor: "#F7F3EA",
          strokeWeight: 2
        }
      });
      marker.addListener("click", () => onSelect(c.id));
      markersRef.current.push(marker);
      bounds.extend({ lat: c.lat, lng: c.lng });
    }

    if (clusters.length === 1) {
      map.setCenter({ lat: clusters[0].lat, lng: clusters[0].lng });
      map.setZoom(11);
    } else {
      map.fitBounds(bounds, 64);
    }
  }, [clusters, ready, onSelect]);

  if (error) {
    return <div className="map-fallback">{error} The place list below still works.</div>;
  }

  if (!apiKey) {
    return <div className="map-fallback">Loading map…</div>;
  }

  return <div ref={holder} className="place-map" aria-label="Map of located memories" />;
}
