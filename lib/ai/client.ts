import OpenAI from 'openai';

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:  process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://clauseguard.africa',
    'X-Title':      'ClauseGuard Africa',
  },
});

export const AI_MODEL = 'openai/gpt-oss-120b' as const;
