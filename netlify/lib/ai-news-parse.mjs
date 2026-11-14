// A small RSS 2.0 / Atom reader with no dependencies. It keeps only what the site
// shows: title, https link, date, a short plain-text blurb and an optional https image.
const BLURB_MAX = 280;

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", mdash: "—", ndash: "–" };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    }
    return NAMED[code.toLowerCase()] ?? whole;
  });
}

function unwrap(text) {
  const cdata = text.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return cdata ? cdata[1] : decode(text);
}

function plain(html) {
  return decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function tag(block, names) {
  for (const name of names) {
    const m = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
    if (m && m[1].trim()) return unwrap(m[1]);
  }
  return "";
}

function attr(block, element, attribute, where) {
  const re = new RegExp("<" + element + "\\b[^>]*>", "gi");
  for (const el of block.match(re) || []) {
    if (where && !where.test(el)) continue;
    const m = el.match(new RegExp("\\s" + attribute + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
    if (m) return decode(m[2]);
  }
  return "";
}

function https(url) {
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

function shorten(text) {
  if (text.length <= BLURB_MAX) return text;
  const cut = text.slice(0, BLURB_MAX);
  return cut.slice(0, cut.lastIndexOf(" ") > 200 ? cut.lastIndexOf(" ") : BLURB_MAX).replace(/[\s,;:.-]+$/, "") + "…";
}

export function parseFeed(xml) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  const items = [];
  for (const block of blocks) {
    const title = plain(tag(block, ["title"]));
    const url = https(tag(block, ["link"]) || attr(block, "link", "href", /rel=["']alternate["']/i) || attr(block, "link", "href", /^(?![\s\S]*rel=)/) || tag(block, ["guid"]));
    const date = new Date(tag(block, ["pubDate", "published", "updated", "dc:date"]));
    if (!title || !url || isNaN(date)) continue;
    const body = tag(block, ["description", "summary", "content:encoded", "content"]);
    const image = https(
      attr(block, "media:content", "url", /medium=["']image["']|type=["']image\//i) ||
      attr(block, "media:thumbnail", "url") ||
      attr(block, "enclosure", "url", /type=["']image\//i) ||
      attr(body, "img", "src") || ""
    );
    items.push({ title, url, published_at: date.toISOString(), blurb: shorten(plain(body)) || null, image_url: image });
  }
  return items;
}
