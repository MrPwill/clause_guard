'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { QuestionWizard } from '@/components/create/QuestionWizard';
import { useWizardStore } from '@/stores/wizardStore';
import { DOC_TYPE_META } from '@/lib/schemas/questions';
import { type DocType, type Track } from '@/types/document';
import { toast } from 'sonner';

interface QuestionnairePageProps {
  params: {
    track: string;
    docType: string;
  };
}

export default function QuestionnairePage({ params }: QuestionnairePageProps) {
  const router = useRouter();
  const { track, docType } = params;
  const { jurisdiction, setDocumentId, documentId } = useWizardStore();
  const [isLoading, setIsLoading] = useState(true);

  const docTypeMeta = DOC_TYPE_META[docType as DocType];

  useEffect(() => {
    async function createDraft() {
      if (documentId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track,
            docType,
            jurisdiction: jurisdiction || 'NG', // Default to NG, user can change in wizard
            title: `${docTypeMeta.label} - ${new Date().toLocaleDateString()}`,
          }),
        });

        if (!response.ok) throw new Error('Failed to create draft');

        const data = await response.json();
        setDocumentId(data.id);
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating draft:', error);
        toast.error('Failed to initialize document. Returning to dashboard.');
        router.push('/dashboard');
      }
    }

    createDraft();
  }, [track, docType, jurisdiction, documentId, setDocumentId, router, docTypeMeta.label]);

  if (isLoading) {
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
        <h1 className="text-3xl font-bold text-brand-dark mb-2">{docTypeMeta.label}</h1>
        <p className="text-gray-600">Answer a few questions to generate your document.</p>
      </div>

      <QuestionWizard 
        docType={docType as DocType} 
        documentId={documentId!} 
      />
    </div>
  );
}
