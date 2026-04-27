# PLAN.md — ClauseGuard MVP Build Plan

> **ClauseGuard Africa** · Protect your work. Get paid.  
> Execution guide for Coding Agent. Read `AGENTS.md` and `PRD.md` first.  
> Work through phases in order. Complete every task before moving to the next.  
> After every task, run the verification command listed. If it fails, fix it before continuing.

---

## Ground Rules for the Agent

1. **Never skip a verification step.** If `npm run typecheck` fails, fix it now — do not continue.
2. **Commit after every completed phase.** Message format: `feat: complete phase N — [phase name]`
3. **One file at a time.** Build → verify → move on. Do not scaffold 10 files and hope they connect.
4. **Ambiguity?** Re-read `AGENTS.md` first. Still unclear → leave a `// TODO:` comment and continue.
5. **Never hardcode secrets.** Always use `process.env.*`. Check `.env.example` for variable names.
6. **TypeScript strict.** No `any`. No `@ts-ignore`. No `as unknown as X`.
7. **OpenRouter only.** Do NOT install or import `@anthropic-ai/sdk`. Use `openai` package pointed at OpenRouter.

---

## Phase 0 — Project Scaffolding

**Goal:** Working Next.js app with all dependencies installed, ClauseGuard brand configured, Git initialised.

### Tasks

**0.1 — Bootstrap Next.js**
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

**0.2 — Install all dependencies**
```bash
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  openai \
  @react-pdf/renderer \
  react-signature-canvas \
  zustand \
  zod \
  clsx \
  tailwind-merge \
  react-markdown \
  remark-gfm \
  lucide-react

npm install --save-dev \
  @types/react-signature-canvas \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  jsdom \
  supabase
```

Note: `openai` (not `@anthropic-ai/sdk`) is the AI client — it connects to OpenRouter's OpenAI-compatible API.

**0.3 — Install and initialise shadcn/ui**
```bash
npx shadcn@latest init
# Style: Default · Base color: Neutral · CSS variables: Yes

npx shadcn@latest add button card badge input label select textarea progress separator alert dialog toast
```

**0.4 — Configure ClauseGuard brand colors in `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   '#2D9CFF',
          teal:   '#00C2B8',
          green:  '#4ED37A',
          lime:   '#A6E22E',
          yellow: '#FFC83D',
          gray:   '#F3F6F9',
          dark:   '#1A2B4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**0.5 — Configure Inter font in `app/layout.tsx`**

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-white text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
```

**0.6 — Create environment files**

`.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=sk-or-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.local` with real values. Add to `.gitignore`:
```
.env.local
.env.*.local
```

**0.7 — Create `lib/utils.ts`**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date));
}
```

**0.8 — Create `lib/ai/client.ts` (OpenRouter)**
```typescript
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

**0.9 — Configure Vitest**

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
});
```

`tests/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

Add to `package.json` scripts:
```json
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:watch": "vitest"
```

**0.10 — Initialise Supabase CLI**
```bash
npx supabase init
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Phase 0 Verification
```bash
npm run dev          # Loads at localhost:3000 with no console errors
npm run typecheck    # Zero TypeScript errors
npm run test         # Test suite runs (0 tests, 0 failures)
```

---

## Phase 1 — Types, Schemas, and Domain Models

**Goal:** All TypeScript types and Zod schemas defined. No runtime logic yet.

### Tasks

**1.1 — Create `types/document.ts`**

Define: `Track`, `Jurisdiction`, `DocumentStatus`, `DOC_TYPES`, `DocType`, `QuestionType`, `Question`, `Document`.

```typescript
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
  id: string; label: string; type: QuestionType;
  placeholder?: string; options?: string[];
  required: boolean; helpText?: string;
}

export interface Document {
  id: string; userId: string; title: string;
  track: Track; docType: DocType; jurisdiction: Jurisdiction;
  answers: Record<string, string | string[]>;
  content?: string; pdfUrl?: string;
  signedAt?: string; signature?: string;
  status: DocumentStatus; createdAt: string; updatedAt: string;
}
```

**1.2 — Create `types/api.ts`**

```typescript
export interface GenerateRequest {
  documentId: string;
  docType: string;
  jurisdiction: string;
  answers: Record<string, string | string[]>;
}

export interface SignRequest {
  documentId: string;
  signature: string; // base64 PNG data URL
}

export interface ApiError {
  error: string;
  code?: string;
}
```

**1.3 — Create `lib/schemas/jurisdiction.ts`**

Full `JURISDICTION_META` object — copy exact structure from AGENTS.md section "Jurisdiction Metadata".

**1.4 — Create `lib/schemas/questions.ts`** ← MOST IMPORTANT TASK IN PHASE 1

Define `QUESTION_SCHEMAS` (all 18 doc types) and `DOC_TYPE_META` (display label, description, estimatedMinutes for each).

Use PRD.md sections 3.3, 3.4, 3.5 "Questionnaire fields" as the exact source for each doc type's questions. Every question must have `id`, `label`, `type`, `required`. Optional: `options` (for select/checkbox-group), `helpText`.

Do not move to Phase 2 until all 18 doc types are defined.

**1.5 — Create `lib/schemas/validation.ts`**

```typescript
import { z } from 'zod';

export const generateRequestSchema = z.object({
  documentId:   z.string().uuid(),
  docType:      z.string().min(1),
  jurisdiction: z.enum(['NG', 'KE', 'GH', 'ZA']),
  answers:      z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export const signRequestSchema = z.object({
  documentId: z.string().uuid(),
  signature:  z.string().min(1),
});

export const createDocumentSchema = z.object({
  track:        z.enum(['freelancer', 'startup', 'creator']),
  docType:      z.string().min(1),
  jurisdiction: z.enum(['NG', 'KE', 'GH', 'ZA']),
  title:        z.string().min(1),
});
```

**1.6 — Create `stores/wizardStore.ts`**

```typescript
import { create } from 'zustand';
import type { Track, DocType, Jurisdiction } from '@/types/document';

interface WizardState {
  track: Track | null; docType: DocType | null;
  jurisdiction: Jurisdiction | null;
  answers: Record<string, string | string[]>;
  currentStep: number; documentId: string | null;
  setTrack: (t: Track) => void;
  setDocType: (d: DocType) => void;
  setJurisdiction: (j: Jurisdiction) => void;
  setAnswer: (id: string, value: string | string[]) => void;
  setStep: (n: number) => void;
  setDocumentId: (id: string) => void;
  reset: () => void;
}

const initial = { track: null, docType: null, jurisdiction: null, answers: {}, currentStep: 0, documentId: null };

export const useWizardStore = create<WizardState>((set) => ({
  ...initial,
  setTrack:        (track) => set({ track }),
  setDocType:      (docType) => set({ docType }),
  setJurisdiction: (jurisdiction) => set({ jurisdiction }),
  setAnswer:       (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
  setStep:         (currentStep) => set({ currentStep }),
  setDocumentId:   (documentId) => set({ documentId }),
  reset:           () => set(initial),
}));
```

**1.7 — Write tests for schemas (`tests/schemas.test.ts`)**

Test that:
- `QUESTION_SCHEMAS` has exactly 18 keys
- Every question object has `id`, `label`, `type`, `required`
- `generateRequestSchema` rejects missing `documentId`
- `generateRequestSchema` rejects invalid jurisdiction value (e.g. `'US'`)

### Phase 1 Verification
```bash
npm run typecheck    # Zero errors
npm run test         # Schema tests pass
```

---

## Phase 2 — Database and Auth

**Goal:** Supabase schema live, RLS enforced, auth pages working end-to-end.

### Tasks

**2.1 — Write migration**

Create `supabase/migrations/001_initial.sql` — copy schema from AGENTS.md "Database Schema". Then:
```bash
npx supabase db push
```

**2.2 — Generate types**
```bash
npx supabase gen types typescript --linked > types/supabase.ts
```

**2.3 — Create Supabase client helpers**

`lib/supabase/client.ts` — browser client using `createBrowserClient` from `@supabase/ssr`.  
`lib/supabase/server.ts` — server client using `createServerClient` from `@supabase/ssr` with cookie handling.

Copy the exact implementations from AGENTS.md.

**2.4 — Create auth middleware (`middleware.ts` at project root)**

Protect all routes except `/`, `/login`, `/signup`, and `/api/*`. Unauthenticated access to protected routes → redirect to `/login`.

**2.5 — Build auth pages**

`app/(auth)/login/page.tsx`:
- Email + password form
- Supabase `signInWithPassword`
- On success → redirect to `/dashboard`
- On error → inline error message
- Brand colors: primary CTA uses `bg-brand-blue`

`app/(auth)/signup/page.tsx`:
- Email + password form (password ≥ 8 chars validated client-side)
- Supabase `signUp`
- On success → redirect to `/dashboard`

Both pages:
- Centered card layout, white card on `bg-brand-gray` background
- ClauseGuard logo (wordmark) at top
- "Protect your work. Get paid." tagline
- Link between login ↔ signup

**2.6 — Auth callback route**

`app/auth/callback/route.ts` — exchanges auth code for session, redirects to `/dashboard`.

**2.7 — Manual test auth flow**

- Sign up → lands on /dashboard
- Log out → redirected to /login
- Access /dashboard without auth → redirected to /login
- Log back in → lands on /dashboard

### Phase 2 Verification
```bash
npm run typecheck    # Zero errors
npm run dev          # Auth flow works end-to-end
npx supabase db diff # No unapplied migrations
```

---

## Phase 3 — Layout and Navigation

**Goal:** App shell with navbar, sidebar, dashboard skeleton. All navigation working. ClauseGuard brand applied throughout.

### Tasks

**3.1 — Update root layout (`app/layout.tsx`)**

- Inter font configured (done in Phase 0.5)
- Add Toaster for toast notifications
- Metadata: title "ClauseGuard", description "Protect your work. Get paid. Africa's legal document platform."

**3.2 — Create `components/layout/Navbar.tsx`**

- Left: ClauseGuard logo (shield + wordmark)
- Right (logged in): "Dashboard" link + user email + "Log out" button
- Right (logged out): "Log in" + "Get Started" buttons (Get Started → `/signup`, `bg-brand-blue`)
- Sticky top, 64px height, white background, bottom border `#F3F6F9`

**3.3 — Create `components/layout/Sidebar.tsx`**

- Nav links: "My Documents" (with doc icon), "Create Document" (with plus icon)
- Active link highlighted with `text-brand-blue` and left border
- 240px wide on desktop, collapses to hamburger on mobile

**3.4 — Create `app/dashboard/layout.tsx`**

- Sidebar (240px) + main content area side by side

**3.5 — Create `app/dashboard/page.tsx`**

- Server component — fetch user's documents from Supabase
- Page heading "My Documents" + "Create Document" button (`bg-brand-blue`)
- Pass documents to `DocumentList` client component

**3.6 — Create `components/document/DocumentCard.tsx`**

Props: `document: Document`

Display:
- Title (bold, `text-brand-dark`)
- `TrackBadge`: Freelancer = `bg-brand-teal`, Startup = `bg-brand-blue`, Creator = `bg-brand-green`
- `JurisdictionBadge`: flag emoji + country name
- Status badge: Draft = gray, Generated = blue, Signed = green
- Date created (formatted)
- Full card clickable → `/documents/[id]`
- Hover: subtle shadow lift

**3.7 — Create `components/shared/TrackBadge.tsx`**

Pill badge with track-appropriate color from brand palette.

**3.8 — Create `components/shared/JurisdictionBadge.tsx`**

Pill badge: flag emoji + jurisdiction full name.

**3.9 — Create `components/shared/EmptyState.tsx`**

- Shield icon (brand blue, centered)
- "No documents yet"
- Subtext: "Generate your first contract in under 4 minutes."
- "Create Document" button → `/create`

**3.10 — Create landing page (`app/page.tsx`)**

- Hero: "Protect your work. Get paid." headline, Africa sub-brand, subheading about jurisdiction-aware legal docs
- CTA: "Get Started Free" → `/signup` (`bg-brand-blue`)
- Three track cards with brand-colored icons
- Footer: disclaimer + "ClauseGuard Africa" + © year

### Phase 3 Verification
```bash
npm run typecheck    # Zero errors
npm run dev          # Dashboard, empty state, navbar, landing page all render correctly
```

---

## Phase 4 — Document Creation Wizard

**Goal:** Full create flow — track → doc type → questionnaire → submission. No AI yet (mock response).

### Tasks

**4.1 — Create `app/create/page.tsx`** — track selector

Three large clickable cards using `TrackSelector` component. On select → store in `useWizardStore` + navigate to `/create/[track]`.

**4.2 — Create `components/create/TrackSelector.tsx`**

Card props: icon (Lucide), title, description, example doc types list, color (from brand palette).
- Freelancer → teal card accent
- Startup → blue card accent
- Creator → green card accent

**4.3 — Create doc type selector** (`app/create/[track]/page.tsx`)

Show `DocTypeGrid` for the selected track.

**4.4 — Create `components/create/DocTypeGrid.tsx`**

- 6 cards per track from `DOC_TYPE_META`
- Each card: label, description, estimated time badge
- On select → navigate to `/create/[track]/[docType]`

**4.5 — Create questionnaire page** (`app/create/[track]/[docType]/page.tsx`)

- On page load: POST to `/api/documents` to create a draft document record in Supabase
- Store `documentId` in wizard store
- Render `QuestionWizard`

**4.6 — Create `components/create/QuestionWizard.tsx`**

- Read questions from `QUESTION_SCHEMAS[docType]`
- Progress bar with step counter
- Back / Next buttons
- Validate required fields before Next
- On each step advance: `useWizardStore.setAnswer()` + PATCH draft in Supabase
- Summary step: table of all answers + "Generate Document" CTA
- On submit: navigate to `/documents/[documentId]/generating`

Input types:
- `text` → `<Input>`
- `textarea` → `<Textarea>`
- `select` → shadcn `<Select>`
- `date` → `<Input type="date">`
- `number` → `<Input type="number">`
- `checkbox-group` → list of shadcn `<Checkbox>` items

**4.7 — Write wizard tests** (`tests/wizard.test.ts`)

- Required field validation blocks step advance
- Back button returns to previous step without clearing answers
- Answers correctly stored in wizard store
- Summary step displays all entered values

### Phase 4 Verification
```bash
npm run typecheck    # Zero errors
npm run test         # Wizard tests pass
npm run dev          # Full create flow navigates correctly, answers saved to Supabase
```

---

## Phase 5 — AI Document Generation (OpenRouter)

**Goal:** OpenRouter API called server-side, response streamed to client, document saved to Supabase.

### Tasks

**5.1 — Confirm `lib/ai/client.ts` exists** (created in Phase 0.8)

Verify `openrouter` client and `AI_MODEL = 'openai/gpt-oss-120b'` are exported correctly.

**5.2 — Create `lib/ai/prompts/system.ts`**

`buildSystemPrompt(jurisdiction, docType)` — copy implementation from AGENTS.md "AI Prompt System".

**5.3 — Create `lib/ai/prompts/formatter.ts`**

`formatAnswersForPrompt(answers)` — formats the wizard answers Record into a plain-text prompt for the model.

**5.4 — Build `app/api/generate/route.ts`**

```typescript
// POST — body: GenerateRequest
// 1. Validate request with generateRequestSchema (Zod)
// 2. Get authenticated user from Supabase session
// 3. Verify document belongs to user
// 4. Build system prompt with buildSystemPrompt(jurisdiction, docType)
// 5. Format user message with formatAnswersForPrompt(answers)
// 6. Call openrouter.chat.completions.create({ model: AI_MODEL, stream: true, ... })
// 7. Stream response chunks back to client as ReadableStream
// 8. After stream ends: save fullContent to Supabase, update status → 'generated'
// 9. Return streaming Response with Content-Type: text/plain
```

Use the streaming pattern from AGENTS.md "OpenRouter API Integration".

**5.5 — Build generating page** (`app/documents/[id]/generating/page.tsx`)

Client component:
- On mount: POST to `/api/generate` with `{ documentId, docType, jurisdiction, answers }` from wizard store
- Read the streaming `ReadableStream` response with a `TextDecoder`
- Append chunks to state and display progressively
- Show animated progress indicator while streaming
- On stream complete → navigate to `/documents/[id]`
- On error → error state with "Try Again" button (re-fetch answers from Supabase, don't lose data)

**5.6 — Write prompt tests** (`tests/generate.test.ts`)

- `buildSystemPrompt('NG', 'service-agreement')` includes "Nigeria" and "NDPR"
- `buildSystemPrompt('ZA', 'privacy-policy')` includes "POPIA"
- `buildSystemPrompt('KE', 'employment-contract')` includes "Kenya"
- `formatAnswersForPrompt` correctly handles string values
- `formatAnswersForPrompt` correctly handles string array values (joins with ", ")

### Phase 5 Verification
```bash
npm run typecheck    # Zero errors
npm run test         # Prompt tests pass
npm run dev          # Full flow: wizard → generate → streamed content renders on screen
```

---

## Phase 6 — Document Viewer and PDF Export

**Goal:** Generated documents render cleanly. PDF download works with ClauseGuard branding.

### Tasks

**6.1 — Create `app/documents/[id]/page.tsx`**

Server component:
- Fetch document from Supabase (verify user owns it)
- If `status === 'draft'` → redirect to questionnaire
- Else → render `DocumentViewer`

**6.2 — Create `components/document/DocumentViewer.tsx`**

Layout: two-column (65% content / 35% sticky sidebar)

Left panel:
- Warning `Alert` (shadcn): "⚠️ AI-generated document — not legal advice. ClauseGuard is not a law firm."
- `<ReactMarkdown remarkPlugins={[remarkGfm]}>` rendering `document.content`
- Clean typography: Inter, generous line height, max readable width

Right panel (sticky):
- `JurisdictionBadge` + doc type label
- Status badge
- Created date
- "Download PDF" button (`bg-brand-blue`) → triggers export
- "Sign Document" button (`bg-brand-green`) → `/documents/[id]/sign` (disabled if already signed)
- If signed: signed date + "Download Signed PDF" link

**6.3 — Create `lib/pdf/renderer.tsx`**

ClauseGuard-branded PDF using `@react-pdf/renderer`:
- Page: A4, 60px padding, Inter (Helvetica fallback), navy text
- Header: document title, jurisdiction, doc type, generated date
- Logo area: "ClauseGuard" wordmark text (SVG logo cannot be used directly — use text branding)
- Content: Markdown converted to line-by-line text blocks
- Disclaimer box: yellow background, warning text
- Footer on every page: "ClauseGuard Africa · Page N of M"
- Signature block at end if document is signed (base64 image embedded)

**6.4 — Build `app/api/export/[id]/route.ts`**

```typescript
// GET — params: { id }
// 1. Verify user owns document
// 2. If pdf_url exists and status unchanged → redirect to Supabase signed URL
// 3. Else: renderToBuffer(LexAfricaPDF) → upload to Supabase Storage
//    Path: documents/[userId]/[documentId].pdf
// 4. Update pdf_url in Supabase
// 5. Return PDF buffer with Content-Disposition: attachment; filename="..."
```

**6.5 — Create `hooks/useDocumentExport.ts`**

```typescript
// Wraps the export API call
// Returns: { download, isLoading, error }
// download() → fetch /api/export/[id] → trigger browser file save
```

### Phase 6 Verification
```bash
npm run typecheck    # Zero errors
npm run dev          # Viewer renders content, PDF downloads with correct formatting and branding
```

---

## Phase 7 — E-Signature

**Goal:** Signature capture working. Signed PDF generated and stored.

### Tasks

**7.1 — Create `app/documents/[id]/sign/page.tsx`**

Server component:
- Fetch document (verify ownership)
- If already `signed` → redirect to `/documents/[id]` with toast "Already signed"
- If `draft` → redirect to questionnaire
- Render `SignatureCapture`

**7.2 — Create `components/document/SignatureCapture.tsx`**

```typescript
// Client component — Props: { documentId, documentTitle }
// - Document title heading
// - Instructions: "Draw your signature below"
// - SignatureCanvas: white background, 600×200px, full-width on mobile
// - "Clear" button (outline) → sigCanvas.current.clear()
// - "Confirm Signature" button (bg-brand-green) — disabled until canvas has strokes
//   → sigCanvas.current.isEmpty() check
// - On confirm: base64 = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
//   → POST to /api/sign
```

**7.3 — Build `app/api/sign/route.ts`**

```typescript
// POST — body: SignRequest
// 1. Validate with signRequestSchema
// 2. Verify user owns document
// 3. Check status !== 'signed' (cannot re-sign)
// 4. Update: signature, signed_at, status → 'signed'
// 5. Re-render PDF with signature embedded → upload to Supabase Storage (overwrite)
// 6. Update pdf_url
// 7. Return { success: true, pdfUrl }
```

**7.4 — Confirmation screen**

After successful sign POST, show:
- "Document signed ✓" heading (green)
- Signature preview (`<img>` with base64 src)
- Signed date and time
- "Download Signed PDF" button (`bg-brand-green`)
- "Back to My Documents" link

**7.5 — Write sign tests** (`tests/sign.test.ts`)

- Route rejects unauthenticated request (401)
- Route rejects already-signed documents
- Route returns 404 for documents not owned by user

### Phase 7 Verification
```bash
npm run typecheck    # Zero errors
npm run test         # Sign tests pass
npm run dev          # Full sign flow: canvas → confirm → signed PDF downloadable
```

---

## Phase 8 — Dashboard Polish and Documents API

**Goal:** Document CRUD routes complete. Dashboard fully functional with filters and error states.

### Tasks

**8.1 — Build `app/api/documents/route.ts`**

- `GET` — all user documents, ordered by `created_at` desc. Support `?status=` and `?track=` filters.
- `POST` — create draft document. Body: `{ track, docType, jurisdiction, title }`. Return created document with UUID.

**8.2 — Build `app/api/documents/[id]/route.ts`**

- `GET` — single document (ownership verified)
- `PATCH` — update answers or status (ownership verified). Used by wizard for progressive saving.
- `DELETE` — delete document (confirm dialog in UI before calling)

**8.3 — Polish dashboard**

- Filter tabs: All / Draft / Generated / Signed (brand-colored active tab)
- Track filter: All / Freelancer / Startup / Creator
- Fade-in animation on document cards (Tailwind `animate-`)
- "Delete document" action with shadcn `AlertDialog` confirmation

**8.4 — Add toast notifications throughout**

Use shadcn `useToast` for:
- Document created
- Document generated successfully
- Document signed ✓
- PDF downloaded
- Any API error (show error message from `{ error: string }` response)

**8.5 — Error boundaries**

`app/dashboard/error.tsx`, `app/documents/[id]/error.tsx`, `app/create/error.tsx` — each shows a friendly error card with "Try again" button.

**8.6 — Loading states**

`app/dashboard/loading.tsx` — 3-4 skeleton document cards (pulse animation)  
`app/documents/[id]/loading.tsx` — skeleton document viewer

### Phase 8 Verification
```bash
npm run typecheck    # Zero errors
npm run test         # All tests pass
npm run dev          # Filters work, toasts appear, loading skeletons show, errors render
```

---

## Phase 9 — End-to-End Smoke Test

**Goal:** Walk the complete user journey for all three tracks. No known bugs.

### Test Scenarios

**Scenario A — Freelancer full flow**
- [ ] Sign up with new email → lands on /dashboard
- [ ] Select Freelancer track → "Service Agreement"
- [ ] Select Nigeria jurisdiction
- [ ] Complete all questionnaire fields
- [ ] Summary step shows all answers correctly
- [ ] Click "Generate Document" — streaming starts within 3 seconds
- [ ] Document renders in viewer — formatted correctly, disclaimer shown
- [ ] Download PDF — opens correctly, ClauseGuard footer visible, disclaimer in footer
- [ ] Sign document — canvas works on desktop (mouse)
- [ ] Confirm signature — signed PDF downloadable
- [ ] Dashboard shows "Signed" badge for the document

**Scenario B — Startup full flow**
- [ ] Create "Shareholder Agreement" for Ghana
- [ ] Enter 3 shareholders: 60% + 25% + 15% (sums to 100%)
- [ ] Generate → viewer renders correctly
- [ ] Download PDF

**Scenario C — Creator full flow**
- [ ] Create "Brand Deal Contract" for Kenya
- [ ] Include TikTok + Instagram as platforms
- [ ] Set exclusivity: yes, skincare, 3 months
- [ ] Generate → FTC disclosure clause present in viewer
- [ ] Download PDF

**Scenario D — Error handling**
- [ ] Submit with required fields blank → validation error shown inline, not page redirect
- [ ] Use invalid/expired API key → error state shown, answers not lost
- [ ] Navigate directly to another user's document URL → 404 or redirect

**Scenario E — Mobile (375px viewport)**
- [ ] Repeat Scenario A on 375px viewport (Chrome DevTools device emulation)
- [ ] Signature canvas responds to touch/drag events
- [ ] PDF download works on mobile browser

### Phase 9 Verification
```bash
npm run build        # Production build succeeds
npm run typecheck    # Zero TypeScript errors
npm run test         # All tests pass
```

---

## Phase 10 — Deployment

**Goal:** ClauseGuard live on Vercel, Supabase pointing to production.

### Tasks

**10.1 — Final pre-deploy check**
```bash
npm run build && npm run typecheck && npm run test
# All three must pass before deploying
```

**10.2 — Deploy to Vercel**
```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard (Settings → Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY
NEXT_PUBLIC_APP_URL   ← set to the Vercel production URL
```

**10.3 — Supabase production config**

In Supabase dashboard → Authentication → URL Configuration:
- Site URL: your Vercel production URL
- Redirect URLs: add `https://your-app.vercel.app/auth/callback`

**10.4 — Smoke test production**

Repeat Scenario A from Phase 9 on the live Vercel URL.

**10.5 — Tag the release**
```bash
git add .
git commit -m "feat: ClauseGuard MVP v0.1.0 — all phases complete"
git tag v0.1.0
git push origin main --tags
```

---

## Phase Summary

| Phase | Name | Key Output |
|---|---|---|
| 0 | Scaffolding | Next.js app, brand colors, Inter font, OpenRouter client |
| 1 | Types & Schemas | 18 doc type schemas, Zod validators, Zustand store |
| 2 | Database & Auth | Supabase schema, RLS, login/signup |
| 3 | Layout & Nav | ClauseGuard-branded shell, dashboard, landing page |
| 4 | Wizard | Track → doc type → questionnaire with validation |
| 5 | AI Generation | OpenRouter streaming via `openai/gpt-oss-120b` |
| 6 | Document Viewer | Markdown render, branded PDF download |
| 7 | E-Signature | Canvas capture, signed PDF |
| 8 | Dashboard Polish | CRUD API, filters, toasts, error states |
| 9 | Smoke Test | All 5 scenarios pass on desktop + mobile |
| 10 | Deployment | Live on Vercel, production Supabase |
