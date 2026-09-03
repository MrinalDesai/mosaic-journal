export interface Entity {
  name: string;
  type: string;
}

export interface AnalysisResult {
  artifactDescription: string;
  extractedText: string;
  entities: Entity[];
  inferredDate: string | null;
  tags: string[];
  clarifyingQuestion: string;
}
