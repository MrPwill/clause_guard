export type Track = 'freelancer' | 'startup' | 'creator';
export type Jurisdiction = 'NG' | 'KE' | 'GH' | 'ZA';
export type DocumentStatus = 'draft' | 'generated' | 'signed';

export const DOC_TYPES = {
  freelancer: ['service-agreement','client-nda','payment-terms','dispute-letter','ip-ownership','cross-border-contract'],
  startup:    ['shareholder-agreement','founder-vesting','employment-contract','vendor-agreement','privacy-policy','investment-term-sheet'],
  creator:    ['brand-deal-contract','exclusivity-clause','content-license','ugc-usage-rights','talent-split-agreement','collaboration-agreement'],
} as const satisfies Record<Track, string[]>;

export type DocType =
  | (typeof DOC_TYPES)['freelancer'][number]
  | (typeof DOC_TYPES)['startup'][number]
  | (typeof DOC_TYPES)['creator'][number];

export type QuestionType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox-group';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  track: Track;
  docType: DocType;
  jurisdiction: Jurisdiction;
  answers: Record<string, string | string[]>;
  content?: string;
  pdfUrl?: string;
  signedAt?: string;
  signature?: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}