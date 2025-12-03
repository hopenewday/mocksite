create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  exam text not null,
  difficulty text check (difficulty in ('easy','medium','hard')) not null,
  duration_minutes int not null default 30,
  language text check (language in ('en','hi')) not null default 'en',
  created_at timestamp with time zone default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references public.tests(id) on delete cascade,
  type text check (type in ('mcq','tf','fib','match')) not null default 'mcq',
  content_en jsonb not null,
  content_hi jsonb,
  options jsonb not null,
  correct_answer int not null,
  topic text,
  section text,
  explanation_en text,
  explanation_hi text,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  test_id uuid references public.tests(id) on delete cascade,
  answers jsonb not null,
  score int not null,
  completed_at timestamp with time zone
);

alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.user_attempts enable row level security;

create policy "Allow read tests" on public.tests for select using (true);
create policy "Allow read questions" on public.questions for select using (true);
create policy "Insert attempts for authenticated" on public.user_attempts for insert with check (auth.uid() = user_id);
create policy "Select own attempts" on public.user_attempts for select using (auth.uid() = user_id);
