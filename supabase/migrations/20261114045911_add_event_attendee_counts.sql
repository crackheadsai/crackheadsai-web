-- The server can count RSVPs by event without reading attendee contact details.
grant select (event_id) on table public.event_rsvps to service_role;

create view public.published_events_with_attendee_counts
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
  ) as attendee_count
from public.events as events
where events.is_published;

revoke all on table public.published_events_with_attendee_counts
  from public, anon, authenticated, service_role;

grant select on table public.published_events_with_attendee_counts
  to service_role;
