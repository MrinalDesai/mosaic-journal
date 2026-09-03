import { useEffect, useState } from "react";
import { getBlob, ref } from "firebase/storage";
import type { User } from "firebase/auth";
import { getStorageClient } from "../lib/firebase";
import { answerMoment } from "../lib/api";
import { catalogNumber } from "../lib/catalog";
import type { Memory } from "../types";

export function MemoryCard({
  memory,
  user,
  onDelete,
  onAnswered
}: {
  memory: Memory;
  user: User;
  onDelete: () => void;
  onAnswered: () => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [listening, setListening] = useState(false);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const dictate = () => {
    const Ctor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const said = event.results?.[0]?.[0]?.transcript ?? "";
      if (said) setAnswer((prev) => (prev ? prev + " " + said : said));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    const artifact = memory.artifacts.find((a) => a.type === "image");
    if (!artifact) return;

    (async () => {
      const storage = await getStorageClient();
      const blob = await getBlob(ref(storage, artifact.storagePath), 10 * 1024 * 1024);
      objectUrl = URL.createObjectURL(blob);
      if (active) setImageUrl(objectUrl);
    })().catch(() => {
      if (active) setImageUrl(null);
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [memory.artifacts]);

  const when = memory.memoryDate ? new Date(memory.memoryDate) : null;
  const valid = when && !Number.isNaN(when.getTime());
  const dateText = valid
    ? when!.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
    : "UNDATED";
  const dayText = valid ? when!.toLocaleDateString("en-GB", { weekday: "long" }) : "";

  const pending = memory.status === "awaiting_clarification";

  const submit = async () => {
    if (!answer.trim()) return;
    setError(null);
    setBusy(true);
    try {
      await answerMoment(user, memory.id, answer.trim());
      await onAnswered();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Your answer is still here — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="memory-card">
      <div className="entry-meta">
        <div className="entry-date">{dateText}</div>
        {dayText && <div className="entry-day">{dayText}</div>}
        {memory.location && (
          <div className="entry-place">
            {memory.location.lat.toFixed(3)}, {memory.location.lng.toFixed(3)}
          </div>
        )}
        <div className="entry-kind">
          <span>{memory.type === "image" ? "▣" : "≡"}</span>
          <span>{memory.type}</span>
        </div>
      </div>

      <div className="entry-artifact">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Archived artifact"
            className="memory-image"
            onClick={() => setZoomed(true)}
          />
        ) : memory.sourceText ? (
          <div className="paper-note" aria-label="Typed note">
            <p>{memory.sourceText}</p>
          </div>
        ) : (
          <span style={{ color: "var(--ink-faint)", fontSize: ".68rem", letterSpacing: ".14em" }}>
            {memory.type === "image" ? "LOADING" : "NO ARTIFACT"}
          </span>
        )}
      </div>

      <div className="entry-body">
        <p className="memory-narrative">
          {memory.narrative ?? memory.analysis.artifactDescription}
        </p>
        <div className="tags">
          {memory.analysis.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>

      <div className="entry-catalog">
        <div className="catalog-no">{catalogNumber(memory)}</div>
        <div className="catalog-label">Catalog no.</div>
        <div className={`stamp ${pending ? "pending" : ""}`}>
          {pending ? "Awaiting" : "Catalogued"}
          <br />
          {dateText}
        </div>
        <button className="text-button danger" onClick={onDelete}>Remove</button>
      </div>

      {pending && (
        <div className="clarifier-inline">
          <div className="eyebrow">One thing before this is catalogued</div>
          <p className="pending-question">{memory.clarifyingQuestion}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="One sentence is enough…"
            maxLength={600}
          />
          {error && <div className="error-banner">{error}</div>}
          <div className="composer-actions">
            {speechSupported && (
              <button className="secondary" onClick={dictate} disabled={busy || listening} type="button">
                {listening ? "Listening…" : "Speak instead"}
              </button>
            )}
            <button onClick={submit} disabled={busy || !answer.trim()}>
              {busy ? "Saving…" : "Catalog memory"}
            </button>
          </div>
        </div>
      )}

      {zoomed && imageUrl && (
        <div className="lightbox" onClick={() => setZoomed(false)} role="dialog" aria-modal="true">
          <button className="lightbox-close" aria-label="Close">&times;</button>
          <img src={imageUrl} alt="Archived artifact, full size" />
        </div>
      )}
    </article>
  );
}
