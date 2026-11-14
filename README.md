# crackheads.ai

Netlify publishes the static landing page from `public/` and deploys the meetup API from `netlify/functions/meetups.mjs`. The page is prebuilt and can be deployed directly.

## Local development

Run `python3 -m http.server --directory public` from the repository root to preview the landing page. With the Netlify CLI installed, run `netlify dev` to test the `/api/events` and `/api/rsvp` routes. The function uses `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. Set them in the local `.env` and in the Netlify project environment for deployed functions.

## Project notes

- [Edit and regenerate the landing page](docs/landing-page.md)
- [Ideas](docs/IDEAS.md)
- [Planned work](TODO/README.md)
- [Completed work](docs/DONE.md)
- [Website mockup](docs/website-mockup/index.html)
