-- 0003_rls.sql
-- Row Level Security — this is the app's authorization story.
-- Cases and verdicts are readable by everyone (including guests); only authenticated
-- users can insert cases and votes; users can update/delete only their own cases;
-- one vote per user per verdict is enforced by the composite PK (0001).

alter table public.profiles enable row level security;
alter table public.cases    enable row level security;
alter table public.verdicts enable row level security;
alter table public.votes    enable row level security;

-- ---------- profiles ----------
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- cases ----------
create policy "Cases are viewable by everyone"
  on public.cases for select
  using (true);

create policy "Authenticated users can file their own cases"
  on public.cases for insert
  to authenticated
  with check (plaintiff_id = auth.uid());

-- Plaintiff can edit/delete their own case. Defendant (Sharing) can edit to submit a defense.
create policy "Plaintiff can update their own case"
  on public.cases for update
  using (plaintiff_id = auth.uid())
  with check (plaintiff_id = auth.uid());

create policy "Defendant can update their case"
  on public.cases for update
  using (defendant_id = auth.uid())
  with check (defendant_id = auth.uid());

create policy "Plaintiff can delete their own case"
  on public.cases for delete
  using (plaintiff_id = auth.uid());

-- ---------- verdicts ----------
-- Readable by all; NO client insert/update policy — only the generate-verdict edge
-- function writes here, using the service-role key which bypasses RLS.
create policy "Verdicts are viewable by everyone"
  on public.verdicts for select
  using (true);

-- ---------- votes ----------
create policy "Votes are viewable by everyone"
  on public.votes for select
  using (true);

create policy "Users can cast their own vote"
  on public.votes for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can change their own vote"
  on public.votes for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can retract their own vote"
  on public.votes for delete
  using (user_id = auth.uid());

-- ---------- aggregated vote tallies (public, no per-voter exposure) ----------
-- security_invoker so the view respects the querying user's RLS on votes (select = all).
create or replace view public.verdict_vote_counts
  with (security_invoker = true)
as
  select
    verdict_id,
    count(*) filter (where vote = 'justice')  as justice_count,
    count(*) filter (where vote = 'mistrial') as mistrial_count
  from public.votes
  group by verdict_id;
