import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

interface PublicFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
}

let appPromise: Promise<FirebaseApp> | null = null;

async function getApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = fetch("/api/public-config")
      .then(async (res) => {
        if (!res.ok) throw new Error("Firebase client configuration is unavailable.");
        return (await res.json()) as PublicFirebaseConfig;
      })
      .then((config) => initializeApp(config));
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
