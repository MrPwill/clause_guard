import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { exportToPDF, getPDFFileName } from '@/lib/pdf-export';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  // Export to PDF
  if (action === 'export') {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (docError || !document) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      if (!document.content) {
        return NextResponse.json({ error: 'Document has no content' }, { status: 400 });
      }

      const buffer = await exportToPDF({
        title: document.title,
        jurisdiction: document.jurisdiction,
        docType: document.doc_type,
        content: document.content,
        signature: document.signature ?? undefined,
        signedAt: document.signed_at ?? undefined,
      });

      const fileName = getPDFFileName(document.title);

      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } catch (error: unknown) {
      console.error('Error exporting PDF:', error);
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }

  // Default GET - fetch document
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error: unknown) {
    console.error('Error fetching document:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from('documents')
      .update({
        answers: body.answers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
