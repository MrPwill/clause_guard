# ClauseGuard Africa

Protect your work. Get paid.

## Overview

ClauseGuard Africa is a specialized legal document generation platform designed to provide accessible, jurisdiction-aware legal protection for freelancers, startups, SMEs, and content creators across Africa. By leveraging artificial intelligence and localized legal knowledge, ClauseGuard enables users to generate professional, e-signable documents in minutes, bypassing the high costs and complexity often associated with legal services.

## Problem Statement

Legal protection in many African markets is often inaccessible due to high legal fees or reliance on Western templates that do not comply with local laws. This leaves professionals vulnerable to contract disputes, non-payment, and intellectual property theft. ClauseGuard addresses this by providing a platform that understands the regulatory environments of Nigeria, Kenya, Ghana, and South Africa.

## Key Features

### 1. Jurisdiction-Aware Generation
Every document is tailored to the specific laws of the selected country:
- Nigeria: References CAMA 2020 and NDPR 2019.
- Kenya: References Companies Act 2015 and DPA 2019.
- Ghana: References Companies Act 2019 and DPA 2012.
- South Africa: References Companies Act 2008 and POPIA 2013.

### 2. Specialized Tracks
Users select a track to access relevant document types:
- Freelancer: Service agreements, NDAs, demand letters, IP ownership.
- Startup/SME: Shareholder agreements, vesting schedules, employment contracts, privacy policies.
- Creator/Influencer: Brand deal contracts, licensing agreements, collaboration agreements.

### 3. AI-Powered Questionnaire
A guided, plain-language wizard collects necessary information through an intuitive interface, ensuring that complex legal requirements are simplified for the user.

### 4. Streaming Document Generation
Documents are generated in real-time using high-performance AI models via OpenRouter, allowing users to see their contracts being drafted instantly.

### 5. E-Signatures and PDF Export
Users can digitally sign documents directly within the platform. Signed and unsigned versions are exportable as professional PDFs with custom branding.

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Backend/Database: Supabase (Auth, PostgreSQL, Storage, RLS)
- AI Integration: OpenRouter (OpenAI SDK)
- PDF Generation: @react-pdf/renderer
- E-Signature: react-signature-canvas
- State Management: Zustand
- Validation: Zod
- Testing: Vitest

## Architecture

### AI Integration
The platform uses the OpenRouter API to access advanced language models. System prompts are dynamically constructed based on the document type and jurisdiction, ensuring the output is legally relevant and formatted correctly in Markdown.

### Database Schema
ClauseGuard uses Supabase with Row Level Security (RLS) to ensure data privacy. The primary `documents` table stores:
- User association
- Track and document type
- Jurisdiction metadata
- User-provided answers (JSONB)
- Generated content (Markdown)
- Signature data and status

### PDF Export Workflow
Documents are rendered from Markdown to professional PDF layouts server-side. Branding, jurisdiction badges, and signature blocks are injected during the rendering process.

## Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Supabase account and CLI
- OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MrPwill/clause-guard.git
   cd clause_guard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENROUTER_API_KEY=your_openrouter_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Initialize the database:
   ```bash
   npx supabase init
   npx supabase link --project-ref your_project_ref
   npx supabase db push
   ```

### Running the App

- Development mode: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm run test`
- Type check: `npm run typecheck`

## Project Structure

- `app/`: Next.js application routes and API endpoints.
- `components/`: React components, including track-specific logic and UI primitives.
- `lib/`: Core logic including AI clients, jurisdiction schemas, and Supabase helpers.
- `stores/`: Client-side state management for the questionnaire wizard.
- `supabase/`: Database migrations and configuration.
- `types/`: Shared TypeScript definitions.
- `tests/`: Unit and integration tests.

## Security

- Row Level Security (RLS) ensures users can only access their own documents.
- Sensitive API keys are managed server-side.
- Signed Storage URLs are used for secure PDF access.

## License

This project is licensed under the MIT License.
