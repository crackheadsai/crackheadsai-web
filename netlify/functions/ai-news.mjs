// Serves the "Latest in AI" section's data at /feed.json, read from Supabase.
export const config = {
  path: "/feed.json",
  rateLimit: { action: "rate_limit", windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

const LIMIT = 60;

async function read(path) {
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get("SUPABASE_SECRET_KEY");
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in Netlify.");
  const response = await fetch(new URL("/rest/v1/" + path, url), {
    headers: { apikey: key },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Supabase read failed: " + response.status);
  return response.json();
}

export default async function handler(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "GET" } });
  }
  try {
    const [items, runs] = await Promise.all([
      read("ai_news_items?select=source,title,blurb,url,image_url,published_at&order=published_at.desc,id.desc&limit=" + LIMIT),
      read("ai_news_runs?select=ran_at&order=ran_at.desc&limit=1"),
    ]);
    return Response.json(
      {
        generated: runs[0]?.ran_at ?? null,
        items: items.map((it) => ({ source: it.source, date: it.published_at, title: it.title, blurb: it.blurb, url: it.url, image: it.image_url })),
      },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error) {
    console.error("AI news feed failed:", error.message);
    return Response.json({ error: "AI news is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
