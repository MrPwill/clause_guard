import { createClient } from '@/lib/supabase/server';
import { openrouter, AI_MODEL } from '@/lib/ai/client';
import { buildSystemPrompt } from '@/lib/ai/prompts/system';
import { formatAnswersForPrompt } from '@/lib/ai/prompts/formatter';
import { generateRequestSchema } from '@/lib/schemas/validation';
import { NextRequest } from 'next/server';
import type { Jurisdiction, DocType } from '@/types/document';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = generateRequestSchema.safeParse(body);

    if (!validated.success) {
      return new Response(JSON.stringify({ error: 'Invalid request data', details: validated.error.format() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { documentId, docType, jurisdiction, answers } = validated.data;
    const supabase = await createClient();
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify ownership
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('id')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return new Response(JSON.stringify({ error: 'Document not found or access denied' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(jurisdiction as Jurisdiction, docType as DocType);
    const userMessage = formatAnswersForPrompt(answers);

    const stream = await openrouter.chat.completions.create({
      model: AI_MODEL,
      stream: true,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const encoder = new TextEncoder();
    let fullContent = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) {
              fullContent += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // Update document in Supabase
          await supabase
            .from('documents')
            .update({
              content: fullContent,
              status: 'generated',
              updated_at: new Date().toISOString()
            })
            .eq('id', documentId);

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
