import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getAuthClient, googleProvider } from "./lib/firebase";
import { deleteMemory, getMemories } from "./lib/api";
import { MomentComposer } from "./components/MomentComposer";
import { MemoryCard } from "./components/MemoryCard";
import type { Memory } from "./types";
import "./styles.css";

const NAV = [
  { label: "Archive", active: true },
  { label: "Timeline", active: false },
  { label: "Tags", active: false },
  { label: "Locations", active: false }
];

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

  if (!authReady) return <main className="center-screen">Opening the archive…</main>;

  if (!user) {
    return (
      <main className="landing">
        <div className="landing-copy">
          <span className="brand">MOSAIC</span>
          <span className="brand-sub">Personal memory archive</span>
          <h1>Your life doesn't happen in text boxes.</h1>
          <p>
            Drop in a photograph, a receipt, a handwritten note, or a passing thought.
            Each one is read, catalogued, and kept as a memory you can find again.
          </p>
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

  const initial = (user.displayName ?? user.email ?? "M").trim().charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).toUpperCase();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <span className="brand">MOSAIC</span>
          <span className="brand-sub">Personal memory archive</span>
        </div>

        <nav className="nav-list">
          {NAV.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? "active" : "upcoming"}`}
              aria-current={item.active ? "page" : undefined}
            >
              <span>{item.label}</span>
              {item.active && <span className="nav-count">{memories.length}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-note">
          Catalog · Preserve · Remember<br />
          Every fragment tells a story.
          <span className="today">{today}</span>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{initial}</div>
          <div>
            <small>Signed in as</small>
            <strong>{user.email}</strong>
          </div>
        </div>
        <div style={{ marginTop: ".8rem" }}>
          <button
            className="secondary"
            style={{ width: "100%" }}
            onClick={async () => signOut(await getAuthClient())}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div>
        <div className="topbar">
          <div className="topbar-field">
            <small>Archivist</small>
            <strong>{user.displayName ?? user.email}</strong>
          </div>
          <div className="topbar-field">
            <small>Collection</small>
            <strong>Private</strong>
          </div>
          <div className="topbar-field">
            <div className="archive-no">
              <small>Archive no.</small>
              <strong>M-{new Date().getFullYear()}</strong>
            </div>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <MomentComposer user={user} onSaved={refresh} />

        <div className="section-heading">
          <span>Catalogued memories</span>
          <span>{memories.length} {memories.length === 1 ? "item" : "items"}</span>
        </div>

        {memories.length === 0 ? (
          <div className="empty-state">
            The archive is empty.<br />
            Your first item can be a photograph, a note, or a sentence.
          </div>
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

        <div className="archive-footer">
          <span>{memories.length} items in archive</span>
          <span>Catalogued with care</span>
        </div>
      </div>
    </main>
  );
}
