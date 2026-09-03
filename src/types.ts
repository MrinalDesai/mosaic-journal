export type MemoryStatus = "awaiting_clarification" | "complete";
export type MemoryType = "text" | "image";

export interface Entity {
  name: string;
  type: string;
}

export interface ArtifactRef {
  artifactId: string;
  type: "image";
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
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
  location: null | { lat: number; lng: number };
}
