/**
 * Lazy Maps JS loader. The script is fetched on first use of the map,
 * never on page load, so Archive browsing costs nothing.
 */
let loader: Promise<typeof google.maps> | null = null;

export function loadMaps(apiKey: string): Promise<typeof google.maps> {
  if (loader) return loader;

  loader = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Maps requires a browser."));
      return;
    }
    if ((window as any).google?.maps) {
      resolve((window as any).google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const maps = (window as any).google?.maps;
      if (maps) resolve(maps);
      else reject(new Error("Maps loaded but was unavailable."));
    };
    script.onerror = () => {
      loader = null;
      reject(new Error("Maps could not be loaded."));
    };
    document.head.appendChild(script);
  });

  return loader;
}
