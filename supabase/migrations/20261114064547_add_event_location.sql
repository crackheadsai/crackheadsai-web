alter table public.events add column location text;

create or replace view public.published_events_with_attendee_counts
with (security_invoker = true)
as
select
  events.id,
  events.title,
  events.description,
  events.starts_at,
  events.ends_at,
  events.image_url,
  (
    select count(*)
    from public.event_rsvps as rsvps
    where rsvps.event_id = events.id
  ) as attendee_count,
  events.location
from public.events as events
where events.is_published;

notify pgrst, 'reload schema';
