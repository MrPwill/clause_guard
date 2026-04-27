'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: string & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-brand-dark">Something went wrong</h2>
      <p className="text-gray-500 max-w-md">
        We encountered an error loading this page. Your data is safe.
      </p>
      <Button onClick={reset} className="bg-brand-blue hover:bg-brand-blue/90">
        Try again
      </Button>
    </div>
  );
}