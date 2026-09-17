import { getBlogPosts } from "../data/blog";

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export function GET({ site }: { site: URL }) {
  const posts = getBlogPosts().sort((a, b) =>
    b.entry.frontmatter.date.localeCompare(a.entry.frontmatter.date),
  );
  const feedUrl = new URL("/rss.xml", site).href;
  const items = posts.map(({ slug, entry }) => {
    const url = new URL(`/blog/${slug}/`, site).href;
    const { title, description, date } = entry.frontmatter;
    return `<item><title>${escapeXml(title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(description)}</description><pubDate>${new Date(`${date}T12:00:00Z`).toUTCString()}</pubDate></item>`;
  }).join("");
  const lastBuildDate = posts[0]
    ? `<lastBuildDate>${new Date(`${posts[0].entry.frontmatter.modified ?? posts[0].entry.frontmatter.date}T12:00:00Z`).toUTCString()}</lastBuildDate>`
    : "";
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Will Chai Blog</title><link>${new URL("/blog/", site).href}</link><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/><description>Articles by Will Chai about creative work, research, and student life.</description><language>en-ca</language>${lastBuildDate}${items}</channel></rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
