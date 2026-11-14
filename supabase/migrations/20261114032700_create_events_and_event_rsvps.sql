create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at > starts_at)
);

create index events_published_starts_at_idx
  on public.events (starts_at)
  where is_published;

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete restrict,
  name text not null,
  email text not null,
  phone_number text,
  created_at timestamptz not null default now()
);

create unique index event_rsvps_event_id_email_unique_idx
  on public.event_rsvps (event_id, lower(btrim(email)));

alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;

revoke all privileges on table public.events, public.event_rsvps
  from public, anon, authenticated, service_role;

grant select on table public.events to anon, authenticated, service_role;
grant insert on table public.event_rsvps to service_role;

create policy "Read published events"
  on public.events
  for select
  to anon, authenticated
  using (is_published);
