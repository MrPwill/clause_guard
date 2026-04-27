import { create } from 'zustand';
import type { Track, DocType, Jurisdiction } from '@/types/document';

interface WizardState {
  track: Track | null;
  docType: DocType | null;
  jurisdiction: Jurisdiction | null;
  answers: Record<string, string | string[]>;
  currentStep: number;
  documentId: string | null;
  setTrack: (t: Track) => void;
  setDocType: (d: DocType) => void;
  setJurisdiction: (j: Jurisdiction) => void;
  setAnswer: (id: string, value: string | string[]) => void;
  setStep: (n: number) => void;
  setDocumentId: (id: string) => void;
  reset: () => void;
}

const initial = {
  track: null,
  docType: null,
  jurisdiction: null,
  answers: {},
  currentStep: 0,
  documentId: null,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initial,
  setTrack:        (track) => set({ track }),
  setDocType:      (docType) => set({ docType }),
  setJurisdiction: (jurisdiction) => set({ jurisdiction }),
  setAnswer:       (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
  setStep:         (currentStep) => set({ currentStep }),
  setDocumentId:   (documentId) => set({ documentId }),
  reset:           () => set(initial),
}));