import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

interface PublicFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
  mapsApiKey?: string | null;
}

let appPromise: Promise<FirebaseApp> | null = null;
let configPromise: Promise<PublicFirebaseConfig> | null = null;

async function getApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    configPromise = fetch("/api/public-config").then(async (res) => {
      if (!res.ok) throw new Error("Firebase client configuration is unavailable.");
      return (await res.json()) as PublicFirebaseConfig;
    });
    appPromise = configPromise.then(({ mapsApiKey, ...config }) => initializeApp(config));
  }
  return appPromise;
}

export async function getAuthClient(): Promise<Auth> {
  return getAuth(await getApp());
}

export async function getStorageClient(): Promise<FirebaseStorage> {
  return getStorage(await getApp());
}

export const googleProvider = new GoogleAuthProvider();

/** Browser Maps key. Domain-restricted and public by design, like the Firebase config. */
export async function getMapsApiKey(): Promise<string | null> {
  if (!configPromise) await getApp();
  const config = await configPromise!;
  return config.mapsApiKey ?? null;
}
