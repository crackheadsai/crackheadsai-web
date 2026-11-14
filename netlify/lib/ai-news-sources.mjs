// Where the "Latest in AI" section gets its news. Each needs a public RSS or Atom feed.
// To add one: give it a short display name and its feed URL. `match` (optional)
// keeps only posts whose title or summary matches, for feeds that cover more than AI.
// Anthropic, Mistral and xAI publish no RSS feed, so they aren't here yet.
// Leave Meta out on purpose (Michael, 2026-11-14).
export const SOURCES = [
  { name: "OpenAI", feed: "https://openai.com/news/rss.xml" },
  { name: "Google", feed: "https://blog.google/technology/ai/rss/" },
  { name: "Google DeepMind", feed: "https://deepmind.google/blog/rss.xml" },
  { name: "Hugging Face", feed: "https://huggingface.co/blog/feed.xml" },
  { name: "GitHub Copilot", feed: "https://github.blog/changelog/label/copilot/feed/" },
  { name: "Microsoft", feed: "https://blogs.microsoft.com/ai/feed/" },
  { name: "AWS", feed: "https://aws.amazon.com/blogs/machine-learning/feed/" },
];
