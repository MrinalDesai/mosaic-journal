export interface Entity {
  name: string;
  type: string;
}

export const SENTIMENT_LABELS = [
  "joyful", "excited", "proud", "hopeful", "calm", "relieved",
  "nostalgic", "reflective", "neutral", "uncertain",
  "frustrated", "disappointed", "regretful", "lonely", "sad"
] as const;
export type SentimentLabel = (typeof SENTIMENT_LABELS)[number];

export const LIFE_THEMES = [
  "family", "friends", "career", "learning", "travel", "health",
  "finance", "relationships", "hobbies", "food", "achievement",
  "personal-growth", "daily-life"
] as const;
export type LifeTheme = (typeof LIFE_THEMES)[number];

export const EVENT_TYPES = [
  "milestone", "achievement", "decision", "journey", "celebration",
  "ordinary-moment", "challenge", "setback", "loss", "regret",
  "discovery", "reflection", "transition"
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const SIGNIFICANCE_LEVELS = ["routine", "notable", "important", "milestone"] as const;
export type Significance = (typeof SIGNIFICANCE_LEVELS)[number];

export const LOCATION_SOURCES = ["device", "manual", "artifact_inferred"] as const;
export type LocationSource = (typeof LOCATION_SOURCES)[number];

/**
 * Coordinates are data, never authority. `source` records provenance so
 * artifact-inferred places are never presented as GPS truth.
 */
export interface MemoryLocation {
  lat: number;
  lng: number;
  placeName: string;
  locality: string | null;
  country: string | null;
  source: LocationSource;
}

/**
 * Descriptive memory tone, not a clinical measure.
 * valence -1..1, energy 0..1, confidence 0..1.
 */
export interface Sentiment {
  valence: number;
  energy: number;
  label: SentimentLabel;
  confidence: number;
}

export interface AnalysisResult {
  artifactDescription: string;
  extractedText: string;
  entities: Entity[];
  inferredDate: string | null;
  tags: string[];
  sentiment: Sentiment;
  lifeThemes: LifeTheme[];
  eventType: EventType;
  significance: Significance;
  clarifyingQuestion: string;
}
