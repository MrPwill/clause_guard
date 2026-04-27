import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DocumentViewer } from '@/components/document/DocumentViewer';
import type { Database } from '@/types/supabase';

type DocumentRow = Database['public']['Tables']['documents']['Row'];

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !document) {
    redirect('/dashboard');
  }

  if (document.status === 'draft') {
    redirect(`/create/${document.track}/${document.doc_type}`);
  }

  return (
    <DocumentViewer
      document={{
        id: document.id,
        userId: document.user_id,
        title: document.title,
        track: document.track as 'freelancer' | 'startup' | 'creator',
        docType: document.doc_type as any,
        jurisdiction: document.jurisdiction as 'NG' | 'KE' | 'GH' | 'ZA',
        answers: document.answers as Record<string, string | string[]>,
        content: document.content ?? undefined,
        pdfUrl: document.pdf_url ?? undefined,
        signedAt: document.signed_at ?? undefined,
        signature: document.signature ?? undefined,
        status: document.status as 'draft' | 'generated' | 'signed',
        createdAt: document.created_at,
        updatedAt: document.updated_at,
      }}
    />
  );
}
