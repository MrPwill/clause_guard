export interface GenerateRequest {
  documentId: string;
  docType: string;
  jurisdiction: string;
  answers: Record<string, string | string[]>;
}

export interface SignRequest {
  documentId: string;
  signature: string;
}

export interface ApiError {
  error: string;
  code?: string;
}