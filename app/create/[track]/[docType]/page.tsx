'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { QuestionWizard } from '@/components/create/QuestionWizard';
import { useWizardStore } from '@/stores/wizardStore';
import { DOC_TYPE_META } from '@/lib/schemas/questions';
import { type DocType } from '@/types/document';
import { toast } from 'sonner';

export default function QuestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const [ready, setReady] = useState(false);
  const [track, setTrack] = useState<string | null>(null);
  const [docType, setDocType] = useState<string | null>(null);
  const { jurisdiction, setDocumentId, documentId } = useWizardStore();
  const [isLoading, setIsLoading] = useState(true);

  const docTypeMeta = docType ? DOC_TYPE_META[docType as DocType] : null;

  useEffect(() => {
    async function init() {
      const p = await params;
      const t = p.track;
      const d = p.docType;
      const resolvedTrack = Array.isArray(t) ? t[0] : t;
      const resolvedDocType = Array.isArray(d) ? d[0] : d;
      setTrack(resolvedTrack ? resolvedTrack : null);
      setDocType(resolvedDocType ? resolvedDocType : null);
      setReady(true);
    }
    init();
  }, [params]);

  useEffect(() => {
    async function createDraft() {
      if (!ready || !docType || !track || documentId) return;
      if (!docTypeMeta) return;

      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track,
            docType,
            jurisdiction: jurisdiction || 'NG',
            title: `${docTypeMeta.label} - ${new Date().toLocaleDateString()}`,
          }),
        });

        if (!response.ok) throw new Error('Failed to create draft');

        const data = await response.json();
        setDocumentId(data.id);
      } catch (error) {
        console.error('Error creating draft:', error);
        toast.error('Failed to initialize document. Returning to dashboard.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    if (ready) {
      createDraft();
    }
  }, [ready, track, docType, jurisdiction, documentId, setDocumentId, router, docTypeMeta]);

  if (isLoading || !ready || !docType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <p className="text-gray-500 font-medium">Preparing your questionnaire...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">{docTypeMeta?.label}</h1>
        <p className="text-gray-600">Answer a few questions to generate your document.</p>
      </div>

      <QuestionWizard
        docType={docType as DocType}
        documentId={documentId!}
      />
    </div>
  );
}
