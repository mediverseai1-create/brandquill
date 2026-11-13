-- BrandQuill schema. Run in Supabase SQL editor (or as a migration).
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  primary key (workspace_id, user_id)
);

-- One row per workspace. Written ONLY by the verified payment webhook (service role).
create table public.subscriptions (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('trial','pro','business')),
  status text not null default 'trialing' check (status in ('trialing','active','past_due','canceled','expired')),
  billing_interval text check (billing_interval in ('month','year')),
  customer_ref text,
  subscription_ref text,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.brand_voices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text not null default '',
  tone_traits text[] not null default '{}',
  do_rules text not null default '',
  avoid_words text[] not null default '{}',
  sample_text text not null default '',
  created_at timestamptz not null default now()
);

create table public.audiences (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text not null default '',
  pain_points text not null default '',
  created_at timestamptz not null default now()
);

create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  template text not null,
  title text not null,
  inputs jsonb not null default '{}',
  content text not null,
  brand_check jsonb,
  voice_id uuid references public.brand_voices(id) on delete set null,
  audience_id uuid references public.audiences(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'generation',
  created_at timestamptz not null default now()
);
create index on public.usage_events (workspace_id, created_at);
create index on public.generations (workspace_id, created_at desc);

-- Membership helper (security definer avoids recursive RLS on workspace_members).
create or replace function public.is_member(ws uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workspace_members where workspace_id = ws and user_id = auth.uid());
$$;

-- Signup trigger: profile + workspace + owner membership + 7-day trial.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare ws uuid;
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  insert into public.workspaces (name, owner_id)
  values (coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'My') || '''s workspace', new.id)
  returning id into ws;
  insert into public.workspace_members (workspace_id, user_id, role) values (ws, new.id, 'owner');
  insert into public.subscriptions (workspace_id, plan, status, trial_ends_at)
  values (ws, 'trial', 'trialing', now() + interval '7 days');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.brand_voices enable row level security;
alter table public.audiences enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.generations enable row level security;
alter table public.usage_events enable row level security;

create policy "own profile read" on public.profiles for select using (id = auth.uid());
create policy "own profile update" on public.profiles for update using (id = auth.uid());

create policy "members read workspace" on public.workspaces for select using (public.is_member(id));
create policy "owner update workspace" on public.workspaces for update using (owner_id = auth.uid());

create policy "members read memberships" on public.workspace_members for select using (user_id = auth.uid() or public.is_member(workspace_id));

-- Subscriptions: members may read; no insert/update/delete policies (service role only).
create policy "members read subscription" on public.subscriptions for select using (public.is_member(workspace_id));

create policy "voices all" on public.brand_voices for all using (public.is_member(workspace_id)) with check (public.is_member(workspace_id));
create policy "audiences all" on public.audiences for all using (public.is_member(workspace_id)) with check (public.is_member(workspace_id));
create policy "knowledge all" on public.knowledge_items for all using (public.is_member(workspace_id)) with check (public.is_member(workspace_id));

create policy "generations read" on public.generations for select using (public.is_member(workspace_id));
create policy "generations insert" on public.generations for insert with check (public.is_member(workspace_id) and user_id = auth.uid());
create policy "generations delete" on public.generations for delete using (public.is_member(workspace_id));
create policy "generations update" on public.generations for update using (public.is_member(workspace_id));

create policy "usage read" on public.usage_events for select using (public.is_member(workspace_id));
create policy "usage insert" on public.usage_events for insert with check (public.is_member(workspace_id) and user_id = auth.uid());
