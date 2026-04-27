'use client';

import { useRouter } from 'next/navigation';
import { Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useWizardStore } from '@/stores/wizardStore';
import { DOC_TYPE_META } from '@/lib/schemas/questions';
import { DOC_TYPES, type Track, type DocType } from '@/types/document';
import { cn } from '@/lib/utils';

interface DocTypeGridProps {
  track: Track;
}

export function DocTypeGrid({ track }: DocTypeGridProps) {
  const router = useRouter();
  const setDocType = useWizardStore((state) => state.setDocType);
  const docTypes = DOC_TYPES[track];

  const handleSelect = (docType: DocType) => {
    setDocType(docType);
    router.push(`/create/${track}/${docType}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {docTypes.map((type) => {
        const meta = DOC_TYPE_META[type];
        return (
          <Card
            key={type}
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
            onClick={() => handleSelect(type)}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-brand-dark">{meta.label}</h3>
                <div className="flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" />
                  {meta.estimatedMinutes}m
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {meta.description}
              </p>
              <div className="flex items-center text-xs font-bold text-brand-blue uppercase tracking-wider group">
                Start Questionnaire
                <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
