-- AI news for the "Latest in AI" section. The scheduled Netlify function fills it;
-- the /feed.json function reads it. Only the server (service_role) touches these tables.
create table public.ai_news_items (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  source text not null,
  title text not null,
  blurb text,
  image_url text,
  published_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint ai_news_items_https_url check (url like 'https://%'),
  constraint ai_news_items_https_image check (image_url is null or image_url like 'https://%')
);

create index ai_news_items_published_at_idx
  on public.ai_news_items (published_at desc);

-- One row per run, so the site can say when the feed was last checked
-- and failed sources are easy to spot.
create table public.ai_news_runs (
  id bigint generated always as identity primary key,
  ran_at timestamptz not null default now(),
  items_found integer not null,
  failed_sources text[] not null default '{}'
);

alter table public.ai_news_items enable row level security;
alter table public.ai_news_runs enable row level security;

revoke all privileges on table public.ai_news_items, public.ai_news_runs
  from public, anon, authenticated, service_role;

grant select, insert on table public.ai_news_items to service_role;
grant select, insert on table public.ai_news_runs to service_role;
