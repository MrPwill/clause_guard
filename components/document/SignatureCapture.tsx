'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Eraser, Check } from 'lucide-react';
import Link from 'next/link';

interface SignatureCaptureProps {
  documentId: string;
  documentTitle: string;
}

export function SignatureCapture({ documentId, documentTitle }: SignatureCaptureProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const handleOnEnd = () => {
    setIsEmpty(sigCanvas.current?.isEmpty() ?? true);
  };

  const handleConfirm = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error('Please draw your signature first');
      return;
    }

    setIsSubmitting(true);
    try {
      const signature = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, signature }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign document');
      }

      toast.success('Document signed successfully');
      
      router.push(`/documents/${documentId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign document';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/documents/${documentId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-brand-blue"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Document
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-dark mb-2">
          Sign Document
        </h1>
        <p className="text-gray-600 mb-6">
          Draw your signature below to sign "{documentTitle}"
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4 bg-white">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: 'w-full h-48',
              style: { touchAction: 'none' },
            }}
            onEnd={handleOnEnd}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isEmpty || isSubmitting}
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isEmpty || isSubmitting}
            className="flex-1 bg-brand-green hover:bg-brand-green/90"
          >
            <Check className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Signing...' : 'Confirm Signature'}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          By signing, you agree that your electronic signature is legally binding.
        </p>
      </div>
    </div>
  );
}