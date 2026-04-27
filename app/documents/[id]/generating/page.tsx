'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWizardStore } from '@/stores/wizardStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function GeneratingPage() {
  const router = useRouter();
  const params = useParams();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { docType, jurisdiction, answers } = useWizardStore();
  
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'loading' | 'streaming' | 'completed' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(10);
  
  const hasStarted = useRef(false);

  const startGeneration = async () => {
    if (!docType || !jurisdiction || !documentId) {
      setError('Missing document information. Please try starting again from the dashboard.');
      setStatus('error');
      return;
    }

    setStatus('streaming');
    setProgress(30);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          docType,
          jurisdiction,
          answers,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate document');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Response stream not available');
      }

      setProgress(60);
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setContent(fullText);
        // Slowly increase progress as we stream
        setProgress(prev => Math.min(prev + 0.5, 95));
      }

      setStatus('completed');
      setProgress(100);
      
      // Auto-navigate after a short delay
      setTimeout(() => {
        router.push(`/documents/${documentId}`);
      }, 1500);

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An unexpected error occurred during generation.');
      setStatus('error');
    }
  };

  useEffect(() => {
    async function init() {
      if (!hasStarted.current) {
        hasStarted.current = true;
        const { id } = await params;
        const resolvedId = Array.isArray(id) ? id[0] : id;
        setDocumentId(resolvedId ? resolvedId : null);
      }
    }
    init();
  }, [params]);

  useEffect(() => {
    if (documentId && status === 'loading') {
      startGeneration();
    }
  }, [documentId, status]);

  return (
    <div className="container max-w-3xl py-12">
      <Card className="border-brand-gray shadow-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-brand-blue" />
          </div>
          <CardTitle className="text-2xl font-bold text-brand-dark">
            {status === 'completed' ? 'Document Generated!' : 'Generating Your Document'}
          </CardTitle>
          <p className="text-muted-foreground">
            Our AI is drafting your {docType?.replace(/-/g, ' ')} for {jurisdiction}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{status === 'error' ? 'Failed' : status === 'completed' ? 'Complete' : 'Processing...'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {status === 'error' ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <div className="mt-4">
                <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </Alert>
          ) : (
            <div className="relative">
              <div className="bg-brand-gray/50 rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap border border-brand-gray">
                {content || (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                    <p>Connecting to AI engine...</p>
                  </div>
                )}
                {status === 'completed' && (
                  <div className="mt-4 flex items-center text-brand-green font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Finalising and saving document...
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-gray/50 to-transparent pointer-events-none rounded-b-lg" />
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground italic">
            ⚠️ This may take up to 30 seconds. Do not refresh or close this page.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
