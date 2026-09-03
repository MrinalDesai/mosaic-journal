import { useEffect, useState } from "react";
import { getBlob, ref } from "firebase/storage";
import type { User } from "firebase/auth";
import { getStorageClient } from "../lib/firebase";
import { answerMoment } from "../lib/api";
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

  const dateText = memory.memoryDate
    ? new Date(memory.memoryDate).toLocaleString()
    : "Captured recently";

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
      {imageUrl && <img src={imageUrl} alt="Journal artifact" className="memory-image" />}
      <div className="memory-body">
        <div className="memory-meta">
          <span>{dateText}</span>
          <span className={`status ${memory.status}`}>{memory.status.replace("_", " ")}</span>
        </div>
        <p className="memory-narrative">
          {memory.narrative ?? memory.analysis.artifactDescription}
        </p>
        <div className="tags">
          {memory.analysis.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        {pending && (
          <div className="clarifier-inline">
            <div className="eyebrow">One thing before this becomes a memory</div>
            <p className="pending-question">{memory.clarifyingQuestion}</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="One sentence is enough…"
              maxLength={600}
            />
            {error && <div className="error-banner">{error}</div>}
            <div className="composer-actions">
              <button onClick={submit} disabled={busy || !answer.trim()}>
                {busy ? "Saving…" : "Create memory"}
              </button>
            </div>
          </div>
        )}

        <button className="text-button danger" onClick={onDelete}>Delete</button>
      </div>
    </article>
  );
}
