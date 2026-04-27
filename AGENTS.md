# ClauseGuard MVP

> **ClauseGuard Africa** · Protect your work. Get paid.  
> Africa-first legal SaaS · AI-generated contracts · jurisdiction-aware · plain-language

This file is the single source of truth for how Coding Agent should understand, build, and extend this project. Read it fully before touching any file.

---

## Product Identity

| Property | Value |
|---|---|
| **Product name** | ClauseGuard |
| **Tagline** | Protect your work. Get paid. |
| **Sub-brand** | AFRICA |
| **Font** | Inter (all weights via `next/font/google`) |
| **Primary** | Ocean Blue `#2D9CFF` — trust, clarity, professionalism |
| **Secondary** | Teal `#00C2B8` — balance, growth, confidence |
| **Accent Green** | Fresh Green `#4ED37A` — protection, success, positivity |
| **Accent Lime** | Lime Green `#A6E22E` — energy, optimism, opportunity |
| **Accent Yellow** | Sunshine Yellow `#FFC83D` — warmth, friendliness, creativity |
| **Neutral** | Light Gray `#F3F6F9` — clean, neutral, focus |
| **Dark text** | `#1A2B4A` (navy — derived from logo wordmark) |

### Tailwind Color Extension

Add to `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    blue:   '#2D9CFF',
    teal:   '#00C2B8',
    green:  '#4ED37A',
    lime:   '#A6E22E',
    yellow: '#FFC83D',
    gray:   '#F3F6F9',
    dark:   '#1A2B4A',
  }
}
```

### Track Badge Colors

| Track | Color | Hex |
|---|---|---|
| Freelancer | Teal | `#00C2B8` |
| Startup / SME | Ocean Blue | `#2D9CFF` |
| Creator / Influencer | Fresh Green | `#4ED37A` |

### Logo Usage

- **On light backgrounds:** Shield icon (blue→green gradient) + "ClauseGuard" wordmark (dark navy) + "AFRICA" in teal small-caps
- **On dark/gradient backgrounds:** White wordmark variant
- Store at `public/logo.svg` and `public/logo-white.svg`
- Favicon: shield icon only (32×32 and 180×180 Apple touch icon)

---

## Project Overview

**ClauseGuard** is a legal document generation platform built for African freelancers, startups/SMEs, and content creators/influencers. Users select a document type, answer a plain-language questionnaire, and receive a jurisdiction-aware, AI-generated legal document they can download and e-sign.

**MVP scope:** Document generation + e-signature + user accounts. No billing integration yet.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Full-stack, file-based routing, API routes, SSR |
| Language | **TypeScript** (strict mode) | Type safety for doc schemas and API contracts |
| Styling | **Tailwind CSS** + **shadcn/ui** | Fast, consistent, accessible components |
| Font | **Inter** via `next/font/google` | Brand-specified typeface |
| Database + Auth | **Supabase** (Postgres + Auth) | Row-level security, African-friendly pricing |
| AI / Doc Generation | **OpenRouter API** — model: `openai/gpt-oss-120b` | Accessed via `openai` npm SDK |
| PDF Generation | **@react-pdf/renderer** | Styled PDFs from React components |
| E-Signature | **react-signature-canvas** | Canvas-based signature, stored as base64 |
| File Storage | **Supabase Storage** | Store generated PDFs per user |
| Validation | **Zod** | Schema validation for all inputs and API payloads |
| State | **Zustand** | Lightweight client state (wizard steps, form data) |
| Testing | **Vitest** + **React Testing Library** | Unit and component tests |

---

## OpenRouter API Integration

ClauseGuard uses **OpenRouter** as the LLM gateway with model **`openai/gpt-oss-120b`**.  
OpenRouter exposes an OpenAI-compatible API — use the `openai` npm package with a custom base URL.

### Install

```bash
npm install openai
```

Do NOT install `@anthropic-ai/sdk`. Do NOT use any Anthropic imports anywhere.

### Client Setup

```typescript
// lib/ai/client.ts
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
```

### Streaming Pattern (used in API routes)

```typescript
import { openrouter, AI_MODEL } from '@/lib/ai/client';

const stream = await openrouter.chat.completions.create({
  model:      AI_MODEL,
  stream:     true,
  max_tokens: 4096,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: userMessage  },
  ],
});

let fullContent = '';
const readable = new ReadableStream({
  async start(controller) {
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) {
        fullContent += text;
        controller.enqueue(new TextEncoder().encode(text));
      }
    }
    // Save completed content to Supabase after stream ends
    await supabase
      .from('documents')
      .update({ content: fullContent, status: 'generated', updated_at: new Date().toISOString() })
      .eq('id', documentId);
    controller.close();
  },
});

return new Response(readable, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
```

---

## Repository Structure

```
clause_guard/
├── AGENTS.md
├── PRD.md
├── PLAN.md
├── .env.local                       ← secrets (never commit)
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── logo.svg
│   ├── logo-white.svg
│   └── favicon.ico
│
├── app/
│   ├── layout.tsx                   ← Inter font, providers, metadata
│   ├── page.tsx                     ← landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── create/
│   │   ├── page.tsx                 ← track selector
│   │   └── [docType]/page.tsx       ← questionnaire wizard
│   ├── documents/
│   │   └── [id]/
│   │       ├── page.tsx             ← viewer + actions
│   │       └── sign/page.tsx
│   └── api/
│       ├── generate/route.ts        ← OpenRouter streaming generation
│       ├── documents/route.ts
│       ├── documents/[id]/route.ts
│       ├── sign/route.ts
│       └── export/[id]/route.ts
│
├── components/
│   ├── ui/                          ← shadcn/ui primitives
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── create/
│   │   ├── TrackSelector.tsx
│   │   ├── DocTypeGrid.tsx
│   │   └── QuestionWizard.tsx
│   ├── document/
│   │   ├── DocumentViewer.tsx
│   │   ├── SignatureCanvas.tsx
│   │   └── DocumentCard.tsx
│   └── shared/
│       ├── JurisdictionBadge.tsx
│       ├── TrackBadge.tsx
│       └── EmptyState.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ai/
│   │   ├── client.ts                ← OpenRouter client
│   │   └── prompts/
│   │       ├── system.ts
│   │       └── formatter.ts
│   ├── pdf/
│   │   ├── renderer.tsx
│   │   └── styles.ts
│   ├── schemas/
│   │   ├── questions.ts
│   │   ├── validation.ts
│   │   └── jurisdiction.ts
│   └── utils.ts
│
├── stores/
│   └── wizardStore.ts
│
├── types/
│   ├── document.ts
│   ├── supabase.ts
│   └── api.ts
│
├── supabase/
│   ├── migrations/001_initial.sql
│   └── seed.sql
│
└── tests/
    ├── setup.ts
    ├── schemas.test.ts
    ├── generate.test.ts
    ├── wizard.test.ts
    └── sign.test.ts
```

---

## Database Schema

```sql
-- supabase/migrations/001_initial.sql

create extension if not exists "uuid-ossp";

create table public.documents (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  track        text not null check (track in ('freelancer', 'startup', 'creator')),
  doc_type     text not null,
  jurisdiction text not null check (jurisdiction in ('NG', 'KE', 'GH', 'ZA')),
  answers      jsonb not null default '{}',
  content      text,
  pdf_url      text,
  signed_at    timestamptz,
  signature    text,
  status       text not null default 'draft' check (status in ('draft', 'generated', 'signed')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Users can only access their own documents"
  on public.documents
  for all
  using (auth.uid() = user_id);
```

---

## Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter
OPENROUTER_API_KEY=sk-or-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Core Domain Types

```typescript
// types/document.ts

export type Track = 'freelancer' | 'startup' | 'creator';
export type Jurisdiction = 'NG' | 'KE' | 'GH' | 'ZA';
export type DocumentStatus = 'draft' | 'generated' | 'signed';

export const DOC_TYPES = {
  freelancer: ['service-agreement','client-nda','payment-terms','dispute-letter','ip-ownership','cross-border-contract'],
  startup:    ['shareholder-agreement','founder-vesting','employment-contract','vendor-agreement','privacy-policy','investment-term-sheet'],
  creator:    ['brand-deal-contract','exclusivity-clause','content-license','ugc-usage-rights','talent-split-agreement','collaboration-agreement'],
} as const satisfies Record<Track, string[]>;

export type DocType =
  | (typeof DOC_TYPES)['freelancer'][number]
  | (typeof DOC_TYPES)['startup'][number]
  | (typeof DOC_TYPES)['creator'][number];

export type QuestionType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox-group';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  track: Track;
  docType: DocType;
  jurisdiction: Jurisdiction;
  answers: Record<string, string | string[]>;
  content?: string;
  pdfUrl?: string;
  signedAt?: string;
  signature?: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

## AI Prompt System

```typescript
// lib/ai/prompts/system.ts
import { JURISDICTION_META } from '@/lib/schemas/jurisdiction';
import type { Jurisdiction, DocType } from '@/types/document';

export function buildSystemPrompt(jurisdiction: Jurisdiction, docType: DocType): string {
  const meta = JURISDICTION_META[jurisdiction];
  return `You are a legal document drafting assistant specialising in ${meta.fullName} law.

Generate a complete, professional legal document of type: ${docType.replace(/-/g, ' ')}.

JURISDICTION: ${jurisdiction} — ${meta.fullName}
GOVERNING LAW: ${meta.governingLaw}
DATA LAW: ${meta.dataLaw}
COMPANY LAW: ${meta.companyLaw}

RULES:
- Use plain English throughout. No Latin phrases unless legally required.
- Structure: Title → Parties → Background/Recitals → Numbered Clauses → Signature Block
- Clause numbers must be sequential (1, 1.1, 1.2, 2, 2.1...)
- Include a governing law clause referencing ${meta.governingLaw}
- Use exact values from user answers — no placeholders like [INSERT NAME]
- Output clean Markdown: ## for sections, **bold** for defined terms, numbered lists for clauses
- End with a SIGNATURE BLOCK for both parties
- No commentary, preamble, or post-amble — document text only`;
}
```

```typescript
// lib/ai/prompts/formatter.ts
export function formatAnswersForPrompt(answers: Record<string, string | string[]>): string {
  const lines = Object.entries(answers).map(([key, value]) => {
    const label = key.replace(/_/g, ' ');
    const val   = Array.isArray(value) ? value.join(', ') : value;
    return `${label}: ${val}`;
  });
  return `Generate the document using these details:\n\n${lines.join('\n')}`;
}
```

---

## Jurisdiction Metadata

```typescript
// lib/schemas/jurisdiction.ts
import type { Jurisdiction } from '@/types/document';

export const JURISDICTION_META: Record<Jurisdiction, {
  fullName: string; currency: string; flag: string;
  governingLaw: string; dataLaw: string; companyLaw: string;
  labourLaw: string; minAnnualLeaveDays: number;
}> = {
  NG: { fullName: 'Nigeria',      currency: 'NGN', flag: '🇳🇬', governingLaw: 'the laws of the Federal Republic of Nigeria', dataLaw: 'Nigeria Data Protection Regulation (NDPR) 2019',   companyLaw: 'Companies and Allied Matters Act (CAMA) 2020', labourLaw: 'Labour Act Cap L1 LFN 2004',           minAnnualLeaveDays: 6  },
  KE: { fullName: 'Kenya',        currency: 'KES', flag: '🇰🇪', governingLaw: 'the laws of the Republic of Kenya',               dataLaw: 'Data Protection Act 2019',                       companyLaw: 'Companies Act 2015',                          labourLaw: 'Employment Act 2007',                  minAnnualLeaveDays: 21 },
  GH: { fullName: 'Ghana',        currency: 'GHS', flag: '🇬🇭', governingLaw: 'the laws of the Republic of Ghana',               dataLaw: 'Data Protection Act 2012',                       companyLaw: 'Companies Act 2019 (Act 992)',                 labourLaw: 'Labour Act 2003 (Act 651)',             minAnnualLeaveDays: 15 },
  ZA: { fullName: 'South Africa', currency: 'ZAR', flag: '🇿🇦', governingLaw: 'the laws of the Republic of South Africa',        dataLaw: 'Protection of Personal Information Act (POPIA) 2013', companyLaw: 'Companies Act 71 of 2008',            labourLaw: 'Basic Conditions of Employment Act 75 of 1997', minAnnualLeaveDays: 15 },
};
```

---

## Key Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run typecheck    # tsc --noEmit — must pass before any commit
npm run test         # vitest run

npx supabase start   # Start local Supabase
npx supabase db push # Push migrations
npx supabase gen types typescript --linked > types/supabase.ts
```

---

## Code Conventions

- Components: named exports except `page.tsx` (Next.js requires default)
- Props: `interface [Component]Props` in the same file
- Classes: `cn()` from `lib/utils.ts` — Tailwind only, no inline styles
- API routes: Zod-validate every request before processing
- Errors: always return `{ error: string }` JSON
- Secrets: `process.env.*` only — never hardcoded, never client-exposed
- TypeScript: strict, no `any`, no `@ts-ignore`
- Naming: files `kebab-case`, components `PascalCase`, functions `camelCase`, constants `UPPER_SNAKE_CASE`
- Principle of code modularity must be applied.

---

## Legal Disclaimer (Required Everywhere)

Inject in `DocumentViewer` and every PDF footer:

```
⚠️ This document was generated by AI for informational purposes only. It does not constitute 
legal advice. Review with a qualified legal professional before use. ClauseGuard is not a law firm.
```

---

## What Coding Agent Must NOT Do

- Do NOT use `@anthropic-ai/sdk` — OpenRouter only via `openai` package
- Do NOT expose `OPENROUTER_API_KEY` to the client — server-side API routes only
- Do NOT add payment/billing — post-MVP
- Do NOT build admin dashboard — out of scope
- Do NOT implement multi-user/team accounts — single-user only
- Do NOT use `any` in TypeScript
- Do NOT store answers in localStorage — Zustand + Supabase progressive save
- Do NOT write raw SQL outside migration files

---

## Definition of Done

1. End-to-end flow works: create → generate → download → sign
2. `npm run typecheck` passes with zero errors
3. At least one unit test covers the core logic
4. Error states handled: network fail, API fail, empty state
5. Responsive: mobile 375px+ and desktop 1280px+
