-- Joint Command & War College Tracker
-- User-owned application data with Row Level Security.

create table if not exists public.week_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_id text not null check (week_id ~ '^week-([1-9]|[1-8][0-9]|9[0-6])$'),
  status text not null default 'not-started'
    check (status in ('not-started', 'in-progress', 'needs-review', 'completed')),
  reading_completion jsonb not null default '{}'::jsonb,
  exercise_completion jsonb not null default '{}'::jsonb,
  prompt_responses jsonb not null default '{}'::jsonb,
  private_notes text not null default '',
  decision_journal text not null default '',
  lessons_learned text not null default '',
  remaining_questions text not null default '',
  hours_spent numeric(7,2) not null default 0 check (hours_spent >= 0 and hours_spent <= 10000),
  confidence_rating smallint not null default 0 check (confidence_rating between 0 and 5),
  rubric_scores jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_id)
);

create table if not exists public.command_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id text not null check (char_length(document_id) between 1 and 200),
  document_type text not null check (document_type in (
    'doctrine-ledger', 'historical-decision', 'campaign-estimate',
    'commanders-intent', 'decision-journal', 'after-action-review',
    'personal-doctrine', 'other'
  )),
  title text not null default '' check (char_length(title) <= 300),
  related_week_id text check (related_week_id is null or related_week_id ~ '^week-([1-9]|[1-8][0-9]|9[0-6])$'),
  content text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, document_id)
);

create index if not exists week_progress_user_updated_idx on public.week_progress (user_id, updated_at desc);
create index if not exists week_progress_user_status_idx on public.week_progress (user_id, status);
create index if not exists command_documents_user_updated_idx on public.command_documents (user_id, updated_at desc);
create index if not exists command_documents_user_type_idx on public.command_documents (user_id, document_type);
create index if not exists command_documents_related_week_idx on public.command_documents (user_id, related_week_id) where related_week_id is not null;

alter table public.week_progress enable row level security;
alter table public.command_documents enable row level security;

drop policy if exists "Users select own week progress" on public.week_progress;
create policy "Users select own week progress" on public.week_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users insert own week progress" on public.week_progress;
create policy "Users insert own week progress" on public.week_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own week progress" on public.week_progress;
create policy "Users update own week progress" on public.week_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete own week progress" on public.week_progress;
create policy "Users delete own week progress" on public.week_progress for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users select own command documents" on public.command_documents;
create policy "Users select own command documents" on public.command_documents for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users insert own command documents" on public.command_documents;
create policy "Users insert own command documents" on public.command_documents for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own command documents" on public.command_documents;
create policy "Users update own command documents" on public.command_documents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete own command documents" on public.command_documents;
create policy "Users delete own command documents" on public.command_documents for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.week_progress from anon;
revoke all on public.command_documents from anon;
grant select, insert, update, delete on public.week_progress to authenticated;
grant select, insert, update, delete on public.command_documents to authenticated;
