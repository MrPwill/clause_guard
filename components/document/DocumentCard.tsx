import { useState } from 'react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import type { Document } from '@/types/document';
import { TrackBadge } from '@/components/shared/TrackBadge';
import { JurisdictionBadge } from '@/components/shared/JurisdictionBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentCardProps {
  document: Document;
  className?: string;
  onDeleted?: () => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-600',
  generated: 'bg-brand-blue/10 text-brand-blue',
  signed: 'bg-brand-green/10 text-brand-green',
};

const statusLabels = {
  draft: 'Draft',
  generated: 'Generated',
  signed: 'Signed',
};

export function DocumentCard({ document, className, onDeleted }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const formattedDocType = document.docType.replace(/-/g, ' ');

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Document deleted');
        onDeleted?.();
      }
    } catch {
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={cn('relative group', className)}>
      <Link href={`/documents/${document.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-semibold text-brand-dark line-clamp-1">{document.title}</h3>
              <span className={cn('shrink-0 px-2 py-0.5 rounded text-xs font-medium', statusColors[document.status])}>
                {statusLabels[document.status]}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <TrackBadge track={document.track} />
              <JurisdictionBadge jurisdiction={document.jurisdiction} />
            </div>
            
            <p className="text-xs text-gray-500 mt-2 capitalize">{formattedDocType}</p>
            <p className="text-xs text-gray-400 mt-1">Created {formatDate(document.createdAt)}</p>
          </CardContent>
        </Card>
      </Link>

      {onDeleted && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete document?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. "{document.title}" will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}