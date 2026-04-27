import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SignatureCapture } from '@/components/document/SignatureCapture';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SignPage({ params }: PageProps) {
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

  if (document.status === 'signed') {
    redirect(`/documents/${id}`);
  }

  if (document.status === 'draft') {
    redirect(`/create/${document.track}/${document.doc_type}`);
  }

  return (
    <div className="min-h-screen bg-brand-gray py-12 px-4">
      <SignatureCapture documentId={id} documentTitle={document.title} />
    </div>
  );
}