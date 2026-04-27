import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createDocumentSchema } from '@/lib/schemas/validation';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createDocumentSchema.parse(body);

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        track: validated.track,
        doc_type: validated.docType,
        jurisdiction: validated.jurisdiction,
        title: validated.title,
        answers: {},
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
