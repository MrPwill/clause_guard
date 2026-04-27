create extension if not exists "uuid-ossp" schema pg_extensions;

create table public.documents (
  id           uuid primary key default gen_random_uuid(),
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