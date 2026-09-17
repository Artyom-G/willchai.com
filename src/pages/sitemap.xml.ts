import { getBlogPosts } from "../data/blog";

const basePaths = [
  "/",
  "/hey/",
  "/photography/",
  "/films/",
  "/films/wattleseed/",
  "/films/murder-of-minus/",
  "/projects/",
  "/resume/",
  "/waterbear/",
  "/msu/",
  "/sesr/",
  "/inqling-a-collaborative-card-game-in-education/",
  "/transit-a-cars-endurance-training-tool/",
  "/lockedin-gpt-powered-linkedin-profile-optimizer/",

];

export function GET({ site }: { site: URL }) {
  const posts = getBlogPosts();
  const paths = [
    ...basePaths,
    ...(posts.length > 0 ? ["/blog/"] : []),
    ...posts.map(({ slug }) => `/blog/${slug}/`),
  ];
  const latestPostDate = posts
    .map(({ entry }) => entry.frontmatter.modified ?? entry.frontmatter.date)
    .sort()
    .at(-1);
  const dates = new Map<string, string>([
    ...(latestPostDate ? [["/blog/", latestPostDate] as const] : []),
    ...posts.map(({ slug, entry }) => [
      `/blog/${slug}/`,
      entry.frontmatter.modified ?? entry.frontmatter.date,
    ] as const),
  ]);
  const urls = paths
    .map((path) => {
      const lastModified = dates.get(path);
      return `<url><loc>${new URL(path, site).href}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ""}</url>`;
    })
    .join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
