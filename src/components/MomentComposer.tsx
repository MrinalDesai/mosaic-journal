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
  const [listening, setListening] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const dictate = (target: "text" | "answer") => {
    const Ctor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const said = event.results?.[0]?.[0]?.transcript ?? "";
      if (!said) return;
      if (target === "text") {
        setFile(null);
        setText((prev) => (prev ? prev + " " + said : said));
      } else {
        setAnswer((prev) => (prev ? prev + " " + said : said));
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

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
      setError(e instanceof Error ? e.message : "Could not read this item.");
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
      setError(e instanceof Error ? e.message : "Could not catalog this memory. Your answer has been kept here so you can retry.");
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
      <section className="composer">
        <div className="composer-head">
          <h2>One more thing</h2>
          <div className="intake-note">
            <strong>Intake desk</strong>
            The item has been read. A little context makes it findable later.
          </div>
        </div>
        <div className="intake-bay">
          <div className="eyebrow">Clarification</div>
          <p className="pending-question">{question}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="One sentence is enough…"
            maxLength={600}
          />
          {error && <div className="error-banner">{error}</div>}
          <div className="composer-actions">
            <button className="secondary" onClick={reset} disabled={busy}>Discard</button>
            {speechSupported && (
              <button className="secondary" onClick={() => dictate("answer")} disabled={busy || listening} type="button">
                {listening ? "Listening…" : "Speak instead"}
              </button>
            )}
            <button onClick={compose} disabled={busy || !answer.trim()}>
              {busy ? "Cataloguing…" : "Catalog memory"}
            </button>
          </div>
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
      <div className="composer-head">
        <h1>Add a moment</h1>
        <div className="intake-note">
          <strong>Intake desk</strong>
          New items are catalogued before they become part of your archive.
        </div>
      </div>

      <div className="intake-bay">
        <div className="eyebrow">Drop an image here, or write what you want to remember</div>

        {file ? (
          <div className="selected-artifact">
            <span>▣</span>
            <div>
              <strong>{file.name}</strong>
              <small>{Math.round(file.size / 1024)} KB · awaiting intake</small>
            </div>
            <button className="text-button" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
              Remove
            </button>
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
          {speechSupported && (
            <button
              className="secondary"
              onClick={(e) => { e.stopPropagation(); dictate("text"); }}
              disabled={busy || listening}
              type="button"
            >
              {listening ? "Listening…" : "Speak it"}
            </button>
          )}
          <button onClick={analyse} disabled={busy || (!file && !text.trim())}>
            {busy ? "Reading…" : "Turn into a memory"}
          </button>
        </div>
      </div>
    </section>
  );
}
