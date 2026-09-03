import { useRef, useState, type DragEvent } from "react";
import type { User } from "firebase/auth";
import { answerMoment, createImageMoment, createTextMoment } from "../lib/api";

export function MomentComposer({ user, onSaved }: { user: User; onSaved: () => Promise<void> }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [memoryId, setMemoryId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const reset = () => {
    setText("");
    setFile(null);
    setMemoryId(null);
    setQuestion(null);
    setAnswer("");
    setError(null);
  };

  const analyse = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = file
        ? await createImageMoment(user, file)
        : await createTextMoment(user, text.trim());
      setMemoryId(result.memoryId);
      setQuestion(result.question);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not analyse this moment.");
    } finally {
      setBusy(false);
    }
  };

  const compose = async () => {
    if (!memoryId || !answer.trim()) return;
    setError(null);
    setBusy(true);
    try {
      await answerMoment(user, memoryId, answer.trim());
      await onSaved();
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this memory. Your answer has been kept here so you can retry.");
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setText("");
    }
  };

  if (question) {
    return (
      <section className="composer clarifier">
        <div className="eyebrow">One thing before this becomes a memory</div>
        <h2>{question}</h2>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="One sentence is enough…"
          maxLength={600}
        />
        {error && <div className="error-banner">{error}</div>}
        <div className="composer-actions">
          <button className="secondary" onClick={reset} disabled={busy}>Cancel</button>
          <button onClick={compose} disabled={busy || !answer.trim()}>
            {busy ? "Saving…" : "Create memory"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="composer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={(e) => {
        if ((e.target as HTMLElement).dataset.pick === "true") fileInput.current?.click();
      }}
    >
      <div className="eyebrow">Capture is one gesture</div>
      <h1>Add a Moment</h1>
      <p>Drop an image here, or write what you want to remember.</p>

      {file ? (
        <div className="selected-artifact">
          <span>🖼️</span>
          <div>
            <strong>{file.name}</strong>
            <small>{Math.round(file.size / 1024)} KB</small>
          </div>
          <button className="text-button" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Remove</button>
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="A thought, a fragment, something that happened…"
          maxLength={4000}
        />
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          if (selected) { setFile(selected); setText(""); }
        }}
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="composer-actions">
        <button className="secondary" data-pick="true" type="button">Choose image</button>
        <button onClick={analyse} disabled={busy || (!file && !text.trim())}>
          {busy ? "Understanding…" : "Turn into a memory"}
        </button>
      </div>
    </section>
  );
}
