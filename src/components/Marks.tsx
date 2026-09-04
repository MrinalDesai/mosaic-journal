import type { EventType, SentimentLabel } from "../types";

export type ToneFamily = "bright" | "warm" | "even" | "shadowed" | "heavy";

export const TONE_FAMILY: Record<SentimentLabel, ToneFamily> = {
  joyful: "bright", excited: "bright", proud: "bright",
  hopeful: "warm", relieved: "warm", calm: "warm",
  nostalgic: "even", reflective: "even", neutral: "even",
  uncertain: "shadowed", frustrated: "shadowed", disappointed: "shadowed",
  regretful: "heavy", lonely: "heavy", sad: "heavy"
};

export const TONE_COLOR: Record<ToneFamily, string> = {
  bright: "#2E5C4A",
  warm: "#6E7F4F",
  even: "#5A544A",
  shadowed: "#9A6238",
  heavy: "#A63D2F"
};

/** One glyph per label — fifteen distinct readings, no flattening. */
const TONE_EMOJI: Record<SentimentLabel, string> = {
  joyful: "😄", excited: "🤩", proud: "🏅",
  hopeful: "🌱", relieved: "😮‍💨", calm: "🍃",
  nostalgic: "📻", reflective: "🌙", neutral: "⚪",
  uncertain: "🤔", frustrated: "😤", disappointed: "😞",
  regretful: "💭", lonely: "🕯️", sad: "🌧️"
};

/** Event type is orthogonal to tone, so it gets a separate glyph. */
const EVENT_EMOJI: Record<EventType, string> = {
  milestone: "🚩",
  achievement: "🏆",
  decision: "🔀",
  journey: "🧭",
  celebration: "🎉",
  "ordinary-moment": "☕",
  challenge: "⛰️",
  setback: "🪨",
  loss: "🕊️",
  regret: "↩️",
  discovery: "🔍",
  reflection: "🪞",
  transition: "🚪"
};

export function toneColor(label: SentimentLabel): string {
  return TONE_COLOR[TONE_FAMILY[label] ?? "even"];
}

export function toneFamily(label: SentimentLabel): ToneFamily {
  return TONE_FAMILY[label] ?? "even";
}

export function SentimentMark({
  label, valence, size = 22
}: { label: SentimentLabel; valence?: number; size?: number }) {
  return (
    <span
      className="mark mark-tone emoji-mark"
      style={{ fontSize: size }}
      role="img"
      aria-label={`Tone: ${label}`}
      title={typeof valence === "number" ? `${label} · valence ${valence.toFixed(2)}` : label}
    >
      {TONE_EMOJI[label] ?? "⚪"}
    </span>
  );
}

export function EventMark({ type, size = 20 }: { type: EventType; size?: number }) {
  return (
    <span
      className="mark mark-event emoji-mark"
      style={{ fontSize: size }}
      role="img"
      aria-label={`Event: ${type}`}
      title={type.replace(/-/g, " ")}
    >
      {EVENT_EMOJI[type] ?? "•"}
    </span>
  );
}

export function LocationMark({ size = 16, inferred = false }: { size?: number; inferred?: boolean }) {
  return (
    <span
      className={`mark mark-pin emoji-mark${inferred ? " inferred" : ""}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={inferred ? "Location inferred from artifact" : "Location recorded"}
      title={inferred ? "Inferred from the artifact, not device GPS" : "Location recorded"}
    >
      📍
    </span>
  );
}
