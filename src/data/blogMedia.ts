import type { APIRoute } from "astro";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { getBlogPosts } from "./blog";

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export function getBlogMediaPaths(extension: string) {
  return getBlogPosts().flatMap(({ slug, entry }) => {
    const assetDirectory = join(dirname(entry.file), "../blog-media", slug);
    if (!existsSync(assetDirectory)) return [];
    return readdirSync(assetDirectory)
      .filter((file) => extname(file) === extension)
      .map((file) => ({
        params: { slug, file: file.slice(0, -extension.length) },
        props: { assetPath: join(assetDirectory, file), draft: entry.frontmatter.draft },
      }));
  });
}

export const serveBlogMedia: APIRoute = ({ props }) => {
  const { assetPath, draft } = props;
  return new Response(new Uint8Array(readFileSync(assetPath)), {
    headers: {
      "Content-Type": contentTypes[extname(assetPath)],
      "X-Content-Type-Options": "nosniff",
      ...(draft ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    },
  });
};
