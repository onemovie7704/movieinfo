create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);

create table if not exists public.watch_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id text not null,
  progress_seconds double precision not null default 0 check (progress_seconds >= 0),
  duration_seconds double precision not null default 0 check (duration_seconds >= 0),
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);

create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (char_length(event_type) between 2 and 50),
  movie_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.movie_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  status text not null default 'pending' check (status in ('pending', 'approved', 'added', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_notifications boolean not null default true,
  new_release_notifications boolean not null default true,
  request_status_notifications boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists watch_history_user_date_idx
  on public.watch_history (user_id, last_watched_at desc);
create index if not exists user_activity_user_date_idx
  on public.user_activity (user_id, created_at desc);
create index if not exists movie_requests_user_date_idx
  on public.movie_requests (user_id, created_at desc);
create index if not exists notifications_user_date_idx
  on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.wishlists enable row level security;
alter table public.watch_history enable row level security;
alter table public.user_activity enable row level security;
alter table public.movie_requests enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;

revoke all on public.profiles, public.wishlists, public.watch_history,
  public.user_activity, public.movie_requests, public.notification_preferences,
  public.notifications from anon;
grant select, insert, update, delete on public.profiles, public.wishlists,
  public.watch_history, public.user_activity, public.movie_requests,
  public.notification_preferences, public.notifications to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.enforce_movie_request_limit()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (
    select count(*) >= 3
    from public.movie_requests
    where user_id = new.user_id
      and created_at > now() - interval '24 hours'
  ) then
    raise exception 'request_limit_reached';
  end if;
  return new;
end;
$$;

drop trigger if exists movie_request_rate_limit on public.movie_requests;
create trigger movie_request_rate_limit
  before insert on public.movie_requests
  for each row execute procedure public.enforce_movie_request_limit();

create or replace function public.notify_movie_request_status()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.status is distinct from old.status
    and coalesce(
      (select request_status_notifications
       from public.notification_preferences
       where user_id = new.user_id),
      true
    )
  then
    insert into public.notifications (user_id, title, message, link)
    values (
      new.user_id,
      'Movie request updated',
      'Your request for "' || new.title || '" is now ' || replace(new.status, '_', ' ') || '.',
      '/account'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists movie_request_status_notification on public.movie_requests;
create trigger movie_request_status_notification
  after update of status on public.movie_requests
  for each row execute procedure public.notify_movie_request_status();

create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
create policy "Users manage own wishlist" on public.wishlists
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users manage own watch history" on public.watch_history
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users read own activity" on public.user_activity
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own activity" on public.user_activity
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users read own requests" on public.movie_requests
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own requests" on public.movie_requests
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users manage own preferences" on public.notification_preferences
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users read own notifications" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users update own notifications" on public.notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
