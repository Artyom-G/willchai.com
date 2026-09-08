const paths = [
  "/",
  "/hey/",
  "/photography/",
  "/films/",
  "/films/wattleseed/",
  "/films/murder-of-minus/",
  "/projects/",
  "/projects/medterms/",
  "/projects/tachyboard/",
  "/projects/searing-stories/",
  "/projects/conspirasea/",
  "/resume/",
];

export function GET({ site }: { site: URL }) {
  const urls = paths
    .map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`)
    .join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
