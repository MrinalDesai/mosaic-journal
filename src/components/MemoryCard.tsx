import { useEffect, useRef, useState } from "react";
import { getBlob, ref } from "firebase/storage";
import type { User } from "firebase/auth";
import { getStorageClient } from "../lib/firebase";
import { answerMoment } from "../lib/api";
import { catalogNumber } from "../lib/catalog";
import { SentimentMark, EventMark, LocationMark, toneColor, toneFamily } from "./Marks";
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
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<any>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const noteLength = memory.sourceText?.length ?? 0;
  const isLongNote = noteLength > 1200;
  const isClamped = noteLength > 180;

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stopDictating = () => {
    try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  };

  const dictate = () => {
    const Ctor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let settled = "";
      let pending = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) settled += chunk;
        else pending += chunk;
      }
      setInterim(pending);
      const add = settled.trim();
      if (add) setAnswer((prev) => (prev ? prev + " " + add : add));
    };

    recognition.onerror = () => stopDictating();
    recognition.onend = () => { recognitionRef.current = null; setListening(false); setInterim(""); };

    recognitionRef.current = recognition;
    setListening(true);
    setInterim("");
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
  const tone = memory.sentiment ? toneColor(memory.sentiment.label) : null;
  const family = memory.sentiment ? toneFamily(memory.sentiment.label) : null;

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
    <article
      className={`memory-card${family ? ` tone-${family}` : ""}`}
      style={tone ? ({ ["--tone" as string]: tone } as React.CSSProperties) : undefined}
    >
      <div className="entry-meta">
        <div className="entry-date">{dateText}</div>
        {dayText && <div className="entry-day">{dayText}</div>}
        {memory.location && (
          <div className="entry-place">
            <LocationMark inferred={memory.location.source === "artifact_inferred"} />
            {memory.location.placeName || `${memory.location.lat.toFixed(3)}, ${memory.location.lng.toFixed(3)}`}
          </div>
        )}
        <div className="entry-kind">
          <span>{memory.type === "image" ? "▣" : "≡"}</span>
          <span>{memory.type}</span>
        </div>
        {(memory.sentiment || memory.eventType) && (
          <div className="entry-marks">
            {memory.sentiment && (
              <SentimentMark label={memory.sentiment.label} valence={memory.sentiment.valence} />
            )}
            {memory.eventType && <EventMark type={memory.eventType} />}
          </div>
        )}
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
          <div className={`paper-note${noteOpen && !isLongNote ? " open" : ""}`} aria-label="Typed note">
            <p>{memory.sourceText}</p>
            {isClamped && (
              <button
                className="note-toggle"
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
              >
                {isLongNote ? "Read full note" : noteOpen ? "Show less" : "Read full note"}
              </button>
            )}
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
        {(memory.sentiment || memory.eventType || (memory.lifeThemes?.length ?? 0) > 0) && (
          <div className="classification">
            {memory.sentiment && (
              <span className="chip tone" style={{ borderColor: tone ?? undefined, color: tone ?? undefined }} title={`valence ${memory.sentiment.valence.toFixed(2)} · energy ${memory.sentiment.energy.toFixed(2)}`}>
                {memory.sentiment.label}
              </span>
            )}
            {memory.eventType && <span className="chip">{memory.eventType.replace("-", " ")}</span>}
            {memory.significance && <span className="chip">{memory.significance}</span>}
            {(memory.lifeThemes ?? []).map((t) => (
              <span key={t} className="chip theme">{t.replace("-", " ")}</span>
            ))}
          </div>
        )}
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
          {listening && (
            <div className="live-transcript" aria-live="polite">
              <span className="rec-dot" />
              <span className="rec-label">Listening</span>
              <span className="rec-text">{interim || "\u2026"}</span>
            </div>
          )}
          {error && <div className="error-banner">{error}</div>}
          <div className="composer-actions">
            {speechSupported && (
              <button
                className={listening ? "recording" : "secondary"}
                onClick={() => (listening ? stopDictating() : dictate())}
                disabled={busy}
                type="button"
              >
                {listening ? "\u25CF Stop" : "Speak instead"}
              </button>
            )}
            <button onClick={submit} disabled={busy || !answer.trim()}>
              {busy ? "Saving…" : "Catalog memory"}
            </button>
          </div>
        </div>
      )}

      {noteOpen && isLongNote && (
        <div
          className="lightbox note-lightbox"
          onClick={() => setNoteOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button className="lightbox-close" aria-label="Close">&times;</button>
          <div className="note-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="note-sheet-head">
              <span>{catalogNumber(memory)}</span>
              <span>{dateText}</span>
            </div>
            <p>{memory.sourceText}</p>
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
