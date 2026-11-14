export const config = {
  path: ["/api/events", "/api/rsvp"],
  rateLimit: {
    action: "rate_limit",
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};

const noStore = { "Cache-Control": "no-store" };
const uuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const emailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(status, error, headers = {}) {
  return Response.json({ error }, { status, headers: { ...noStore, ...headers } });
}

async function supabase(path, keyName, options = {}) {
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get(keyName);
  if (!url || !key) {
    console.error("Set SUPABASE_URL and " + keyName + " in Netlify.");
    throw new Error("Missing Supabase configuration");
  }

  return fetch(new URL("/rest/v1/" + path, url), {
    ...options,
    headers: { apikey: key, ...options.headers },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
}

async function publishedEvents(eventId) {
  const query = new URLSearchParams({
    select: eventId ? "id" : "id,title,description,starts_at,ends_at,image_url,attendee_count,location",
    starts_at: "gt." + new Date().toISOString(),
    order: "starts_at.asc,id.asc",
  });
  if (eventId) {
    query.set("id", "eq." + eventId);
    query.set("is_published", "eq.true");
  }

  const resource = eventId ? "events" : "published_events_with_attendee_counts";
  const keyName = eventId ? "SUPABASE_PUBLISHABLE_KEY" : "SUPABASE_SECRET_KEY";
  const response = await supabase(resource + "?" + query, keyName);
  if (!response.ok) throw new Error("Supabase event read failed");
  return response.json();
}

async function submitRsvp(request) {
  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return fail(415, "Send JSON.");

  const body = await request.json().catch(() => null);
  const eventId = body?.event_id;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = body?.phone_number ?? "";
  if (
    typeof eventId !== "string" || !uuid.test(eventId) ||
    !name || name.length > 120 ||
    email.length > 254 || !emailAddress.test(email) ||
    typeof phone !== "string" || phone.trim().length > 40
  ) {
    return fail(400, "Enter a valid event, name, email, and optional phone number.");
  }

  if (!(await publishedEvents(eventId)).length) {
    return fail(404, "This meetup is unavailable for RSVPs.");
  }

  const response = await supabase("event_rsvps", "SUPABASE_SECRET_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ event_id: eventId, name, email, phone_number: phone.trim() || null }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    if (result?.code === "23503") return fail(404, "This meetup is unavailable for RSVPs.");
    if (result?.code !== "23505") throw new Error("Supabase RSVP insert failed");
  }
  return new Response(null, { status: 204, headers: noStore });
}

export default async function handler(request) {
  const isEventList = new URL(request.url).pathname.replace(/\/$/, "") === "/api/events";
  const method = isEventList ? "GET" : "POST";
  if (request.method !== method) return fail(405, "Method not allowed.", { Allow: method });

  try {
    if (isEventList) return Response.json({ events: await publishedEvents() }, { headers: noStore });
    return await submitRsvp(request);
  } catch {
    console.error("Meetup API request failed (" + method + ").");
    return fail(503, "Meetup service is temporarily unavailable.");
  }
}
