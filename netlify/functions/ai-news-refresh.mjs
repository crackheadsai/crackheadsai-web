// Pulls the newest posts from AI company RSS/Atom feeds into Supabase.
// Runs 6 times on weekdays: 7, 9 and 11 AM, and 1, 3 and 5 PM Central.
// Netlify cron is UTC and Central shifts with daylight saving, so the job wakes
// at the top of every hour in that UTC window and only works at those local hours.
import { SOURCES } from "../lib/ai-news-sources.mjs";
import { parseFeed } from "../lib/ai-news-parse.mjs";

export const config = { schedule: "0 12-23 * * 1-5" };

const TIME_ZONE = "America/Chicago";
const RUN_HOURS = [7, 9, 11, 13, 15, 17];
const PER_SOURCE = 10;
const MAX_AGE_DAYS = 30;

function localHour(date) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(date));
}

async function supabase(path, options = {}) {
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get("SUPABASE_SECRET_KEY");
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in Netlify.");
  const response = await fetch(new URL("/rest/v1/" + path, url), {
    ...options,
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal", ...options.headers },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Supabase " + path.split("?")[0] + " write failed: " + response.status);
}

async function readSource(source) {
  const response = await fetch(source.feed, {
    headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml", "User-Agent": "crackheads.ai news reader" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(source.name + " returned " + response.status);
  const oldest = Date.now() - MAX_AGE_DAYS * 864e5;
  return parseFeed(await response.text())
    .filter((item) => (!source.match || source.match.test(item.title + " " + item.blurb)) && Date.parse(item.published_at) >= oldest)
    .slice(0, PER_SOURCE)
    .map((item) => ({ ...item, source: source.name }));
}

export async function refresh() {
  const results = await Promise.allSettled(SOURCES.map(readSource));
  const items = [], failed = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") items.push(...result.value);
    else { failed.push(SOURCES[i].name); console.error("AI news source failed:", SOURCES[i].name, result.reason?.message); }
  });

  // One row per article URL: anything already saved is left as it was.
  const unique = [...new Map(items.map((item) => [item.url, item])).values()];
  if (unique.length) {
    await supabase("ai_news_items?on_conflict=url", {
      method: "POST",
      headers: { Prefer: "return=minimal,resolution=ignore-duplicates" },
      body: JSON.stringify(unique),
    });
  }
  await supabase("ai_news_runs", { method: "POST", body: JSON.stringify({ items_found: unique.length, failed_sources: failed }) });
  console.log("AI news refresh: " + unique.length + " items, " + failed.length + " failed sources");
  return { items: unique.length, failed };
}

async function hasRunBefore() {
  const response = await fetch(new URL("/rest/v1/ai_news_runs?select=id&limit=1", Netlify.env.get("SUPABASE_URL")), {
    headers: { apikey: Netlify.env.get("SUPABASE_SECRET_KEY") },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Supabase ai_news_runs read failed: " + response.status);
  return (await response.json()).length > 0;
}

export default async function handler() {
  // Off-hours wakes do nothing, except the very first run, so pressing
  // "Run now" in Netlify right after launch fills the feed straight away.
  if (!RUN_HOURS.includes(localHour(new Date())) && (await hasRunBefore())) return;
  await refresh();
}
