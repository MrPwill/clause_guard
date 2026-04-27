import { createClient } from '@/lib/supabase/server';
import { signRequestSchema } from '@/lib/schemas/validation';
import { exportToPDF, getPDFFileName } from '@/lib/pdf-export';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = signRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: 'Invalid request', details: validation.error.format() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { documentId, signature } = validation.data;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (document.status === 'signed') {
      return new Response(JSON.stringify({ error: 'Document already signed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('documents')
      .update({
        signature: signature,
        signed_at: now,
        status: 'signed',
        updated_at: now,
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to save signature' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: updatedDoc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    let pdfUrl: string | null = null;
    try {
      const buffer = await exportToPDF({
        title: document.title,
        jurisdiction: document.jurisdiction,
        docType: document.doc_type,
        content: document.content,
        signature: signature,
        signedAt: now,
      });

      const fileName = getPDFFileName(document.title);
      const base64 = Buffer.from(buffer).toString('base64');

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${documentId}.pdf`, Buffer.from(base64, 'base64'), {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(`${user.id}/${documentId}.pdf`);

        await supabase
          .from('documents')
          .update({ pdf_url: publicUrl })
          .eq('id', documentId);

        pdfUrl = publicUrl;
      }
    } catch (pdfError) {
      console.error('Error regenerating PDF with signature:', pdfError);
    }

    return new Response(JSON.stringify({ success: true, pdfUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error signing document:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}