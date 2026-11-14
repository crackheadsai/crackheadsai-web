# crackheads.ai landing page

`public/index.html` is the whole site: a plain, hand-written static page. Edit it directly.

Sections, top to bottom: nav, hero, "What we build with" logo strip, Next meetup (RSVP), Latest in AI, footer.

- **Next meetup** reads `GET /api/events` and posts RSVPs to `POST /api/rsvp` (`netlify/functions/meetups.mjs`).
  Set the venue in `events.location` in Supabase. The page displays event times in Central Time and shows “To be announced” when the venue is blank.
- **Latest in AI** reads `/feed.json`, served by `netlify/functions/ai-news.mjs` from Supabase and filled by the scheduled `ai-news-refresh.mjs`.
- Off the live hosts (crackheads.ai, *.netlify.app, localhost) both sections show clearly labeled sample content, so the page can be previewed anywhere.

The earlier gallery-poster version is still generated from `src/template.html` with `python3 src/gen.py src/template.html <output>`. It is no longer what `public/index.html` serves.
