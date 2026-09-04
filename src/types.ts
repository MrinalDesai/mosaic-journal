export type MemoryStatus = "awaiting_clarification" | "complete";
export type MemoryType = "text" | "image";

export type SentimentLabel =
  | "joyful" | "excited" | "proud" | "hopeful" | "calm" | "relieved"
  | "nostalgic" | "reflective" | "neutral" | "uncertain"
  | "frustrated" | "disappointed" | "regretful" | "lonely" | "sad";

export type LifeTheme =
  | "family" | "friends" | "career" | "learning" | "travel" | "health"
  | "finance" | "relationships" | "hobbies" | "food" | "achievement"
  | "personal-growth" | "daily-life";

export type EventType =
  | "milestone" | "achievement" | "decision" | "journey" | "celebration"
  | "ordinary-moment" | "challenge" | "setback" | "loss" | "regret"
  | "discovery" | "reflection" | "transition";

export type Significance = "routine" | "notable" | "important" | "milestone";
export type LocationSource = "device" | "manual" | "artifact_inferred";

export interface Entity { name: string; type: string; }

export interface ArtifactRef {
  artifactId: string;
  type: "image";
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
}

export interface MemoryLocation {
  lat: number;
  lng: number;
  placeName: string;
  locality: string | null;
  country: string | null;
  source: LocationSource;
}

export interface Sentiment {
  valence: number;
  energy: number;
  label: SentimentLabel;
  confidence: number;
}

export interface Analysis {
  artifactDescription: string;
  extractedText: string;
  entities: Entity[];
  inferredDate: string | null;
  tags: string[];
}

export interface Memory {
  id: string;
  schemaVersion: number;
  type: MemoryType;
  status: MemoryStatus;
  createdAt?: string | null;
  memoryDate?: string | null;
  analysis: Analysis;
  sourceText?: string | null;
  clarifyingQuestion: string;
  clarifyingAnswer?: string | null;
  narrative?: string | null;
  artifacts: ArtifactRef[];

  /* schemaVersion 2 — all optional, absent on v1 memories */
  location?: MemoryLocation | null;
  sentiment?: Sentiment | null;
  lifeThemes?: LifeTheme[];
  eventType?: EventType | null;
  significance?: Significance | null;
  clusterId?: number | null;
  demoSeedVersion?: string | null;
}

export interface MemoryCluster {
  clusterId: number;
  title: string;
  description: string;
  memoryCount: number;
  firstDate?: string | null;
  lastDate?: string | null;
}

/** Normalises a v1 or v2 document so views never branch on schemaVersion. */
export function normaliseMemory(raw: Memory): Required<
  Pick<Memory, "lifeThemes" | "location" | "sentiment" | "eventType" | "significance" | "clusterId">
> & Memory {
  const legacy = raw.location as unknown as { lat: number; lng: number } | null | undefined;
  const location: MemoryLocation | null =
    legacy && !("source" in (legacy as object))
      ? { lat: legacy.lat, lng: legacy.lng, placeName: "", locality: null, country: null, source: "manual" }
      : (raw.location ?? null);

  return {
    ...raw,
    location,
    sentiment: raw.sentiment ?? null,
    lifeThemes: raw.lifeThemes ?? [],
    eventType: raw.eventType ?? null,
    significance: raw.significance ?? null,
    clusterId: raw.clusterId ?? null
  };
}
