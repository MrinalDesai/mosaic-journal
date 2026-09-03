import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getAuthClient, googleProvider } from "./lib/firebase";
import { deleteMemory, getMemories } from "./lib/api";
import { MomentComposer } from "./components/MomentComposer";
import { MemoryCard } from "./components/MemoryCard";
import type { Memory } from "./types";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    getAuthClient()
      .then((auth) => {
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setAuthReady(true);
        });
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Authentication configuration failed.");
        setAuthReady(true);
      });
    return () => unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      setMemories(await getMemories(user));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load memories.");
    }
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  if (!authReady) return <main className="center-screen">Opening Mosaic…</main>;

  if (!user) {
    return (
      <main className="landing">
        <div className="landing-copy">
          <span className="brand">MOSAIC</span>
          <h1>Your life doesn't happen in text boxes.</h1>
          <p>Drop in a photograph or a thought. Gemini helps turn the artifact into a memory worth keeping.</p>
          {error && <div className="error-banner">{error}</div>}
          <button
            onClick={async () => {
              setError(null);
              try {
                const auth = await getAuthClient();
                await signInWithPopup(auth, googleProvider);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Sign-in failed.");
              }
            }}
          >
            Continue with Google
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header>
        <div>
          <span className="brand">MOSAIC</span>
          <small>Private multimodal journal</small>
        </div>
        <button className="secondary" onClick={async () => signOut(await getAuthClient())}>Sign out</button>
      </header>

      {error && <div className="error-banner page-error">{error}</div>}
      <MomentComposer user={user} onSaved={refresh} />

      <section className="timeline">
        <div className="section-heading">
          <h2>Your memories</h2>
          <span>{memories.length}</span>
        </div>
        {memories.length === 0 ? (
          <div className="empty-state">Nothing here yet. Your first moment can be a sentence or an image.</div>
        ) : (
          <div className="memory-grid">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                user={user}
                onAnswered={refresh}
                onDelete={async () => {
                  await deleteMemory(user, memory.id);
                  await refresh();
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
