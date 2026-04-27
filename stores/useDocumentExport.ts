import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useDocumentExport() {
  const [isLoading, setIsLoading] = useState(false);

  const download = useCallback(
    async (documentId: string, title: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/export/${documentId}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to export PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('PDF downloaded successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to download PDF';
        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { download, isLoading };
}
