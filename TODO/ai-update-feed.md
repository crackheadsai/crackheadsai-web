# Research + build: automatic AI update feed

**Status:** Not started
**Who:** Research (fill in your name)
**Deadline:** _none yet_

## What
Collect the release notes and update posts from the big AI companies and tools, then post them to our website automatically.
Visitors come back because the page shows what's newest in AI, and they find the crew while they're there.

## Research first
- Make a list of sources: each AI company's changelog, release notes, blog, and status page (OpenAI, Anthropic, Google, Meta, Mistral, xAI, and tools like Cursor, GitHub Copilot, Midjourney...).
- For each source, check how we can read it:
  - RSS/Atom feed (easiest and most reliable)
  - Public API or GitHub releases
  - Only a web page (needs scraping, which breaks more often; check each site's terms first)
- Check whether we're allowed to repost. Safest is to post our own short summary with a link to the original, not copy their full text.

## X / Twitter posts as a source
Goal: when an AI company or team member posts news on X, our site shows a short blurb and a link to the post (or to the company's own page about it).

Things to research:
- **X's official API costs money** for reading posts, and the price and limits change often. Check the current tiers on X's developer site and whether a cheap tier covers following ~20–50 accounts.
- **Scraping X breaks its terms** and gets blocked often, so don't plan on it. Avoid third-party "X to RSS" bridges for the same reason.
- **Embeds are allowed.** X lets any site embed a public post, so on our real site a blurb can sit next to the embedded post.
- **Most big announcements also land somewhere free.** Companies usually post the same news on their blog, changelog, or RSS feed, so we can catch it there and link both the X post and the official page.
- **Bluesky and Mastodon have free, open APIs**, so it's easy to pull from accounts that post there too.

Possible setups, cheapest first:
1. Pull from free sources (RSS, blogs, GitHub, Bluesky). For X, a crew member pastes in the link to a big post and the AI writes the blurb automatically.
2. Same as 1, plus the paid X API to pull posts from a list of accounts automatically.

Each feed item: source name, 1–2 sentence blurb in our own words, link to the original post, link to the official page if there is one, date.

## Rough build idea (once research is done)
1. A scheduled job (e.g. GitHub Actions, a few times a day) reads every source.
2. It keeps only items it hasn't seen before.
3. Optional: an AI model writes a 1–2 sentence plain-English summary of each one.
4. It saves them as data the website reads, and the site shows a "Latest in AI" feed.
5. Optional later: also post new items to our Discord automatically.

## Depends on
- `make-git.md` (the job needs a repo to run from)
- `build-website.md` (somewhere to show the feed)

## Notes
- 
