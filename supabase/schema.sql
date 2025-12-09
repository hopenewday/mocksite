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

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  role text check (role in ('super_admin','junior_admin','user')) not null default 'user',
  name text,
  created_at timestamp with time zone default now()
);

create table if not exists public.rankings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  score int not null default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  meta jsonb,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.rankings enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Select own profile" on public.profiles for select using (auth.uid() = id);
create policy "Upsert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Select own ranking" on public.rankings for select using (auth.uid() = user_id);
create policy "Upsert own ranking" on public.rankings for insert with check (auth.uid() = user_id);
create policy "Update own ranking" on public.rankings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Write logs admins" on public.admin_audit_logs for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','junior_admin')));

create or replace function public.update_ranking()
returns trigger as $$
begin
  insert into public.rankings(user_id, score, updated_at)
  values (new.user_id, new.score, now())
  on conflict (user_id) do update set score = excluded.score, updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_ranking on public.user_attempts;
create trigger trg_update_ranking
after insert on public.user_attempts
for each row execute function public.update_ranking();
create table if not exists public.configs (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

create table if not exists public.configs_history (
  key text not null,
  version int not null,
  value jsonb not null,
  updated_at timestamp with time zone default now(),
  primary key (key, version)
);

alter table public.configs enable row level security;
alter table public.configs_history enable row level security;

create policy "Read configs" on public.configs for select using (true);
create policy "Admin write configs" on public.configs for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','junior_admin')));
create policy "Admin update configs" on public.configs for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','junior_admin'))) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','junior_admin')));

create policy "Read configs history" on public.configs_history for select using (true);
create policy "Admin write configs history" on public.configs_history for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','junior_admin')));

create or replace function public.upsert_config(p_key text, p_value jsonb)
returns void as $$
declare v_version int;
begin
  insert into public.configs(key, value, updated_at) values (p_key, p_value, now())
  on conflict (key) do update set value = excluded.value, updated_at = now();
  select coalesce(max(version), 0) + 1 into v_version from public.configs_history where key = p_key;
  insert into public.configs_history(key, version, value, updated_at) values (p_key, v_version, p_value, now());
end;
$$ language plpgsql security definer;
