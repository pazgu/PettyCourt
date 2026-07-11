-- 0001_init_schema.sql
-- Core schema for Objection! (PettyCourt).
-- Run this first in the Supabase SQL editor, then 0002, then 0003.
--
-- Note: columns for the "User Sharing" extension (defendant_id, defendant_email,
-- invite_token, nullable defense, and the 'awaiting_defense' status) are provisioned
-- now so that extension is additive-only and needs no destructive migration later.

-- profiles: one row per auth user, created automatically by the 0002 trigger.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text not null unique,
  created_at timestamptz not null default now()
);

-- cases: a filed dispute.
create table if not exists public.cases (
  id              uuid primary key default gen_random_uuid(),
  plaintiff_id    uuid not null references public.profiles (id) on delete cascade,
  defendant_id    uuid references public.profiles (id) on delete set null,   -- Sharing: the tagged friend once they claim the case
  defendant_email text,                                                      -- Sharing: who the plaintiff invited
  invite_token    uuid default gen_random_uuid(),                            -- Sharing: shareable claim token
  title           text not null,
  category        text not null,
  complaint       text not null,
  defense         text,                                                      -- null while 'awaiting_defense' (Sharing); filled for core cases
  status          text not null default 'awaiting_verdict'
                    check (status in ('awaiting_defense', 'awaiting_verdict', 'ruled')),
  created_at      timestamptz not null default now()
);

-- verdicts: the AI Judge's ruling. One per case (enforced by unique case_id).
create table if not exists public.verdicts (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid not null unique references public.cases (id) on delete cascade,
  verdict_text text not null,
  winner       text not null check (winner in ('plaintiff', 'defendant', 'split')),
  created_at   timestamptz not null default now()
);

-- votes: community reaction to a verdict. One per user per verdict (composite PK).
create table if not exists public.votes (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  verdict_id uuid not null references public.verdicts (id) on delete cascade,
  vote       text not null check (vote in ('justice', 'mistrial')),
  created_at timestamptz not null default now(),
  primary key (user_id, verdict_id)
);

-- Indexes for the archive filters and docket lookups.
create index if not exists cases_category_idx   on public.cases (category);
create index if not exists cases_status_idx     on public.cases (status);
create index if not exists cases_plaintiff_idx  on public.cases (plaintiff_id);
create index if not exists cases_created_at_idx on public.cases (created_at desc);
create index if not exists votes_verdict_idx    on public.votes (verdict_id);
