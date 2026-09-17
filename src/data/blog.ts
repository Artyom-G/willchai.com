import type { MarkdownInstance } from "astro";

export interface BlogFrontmatter {
  title: string;
  seoTitle?: string;
  description: string;
  overview: string;
  author: string;
  category: string;
  date: string;
  modified?: string;
  socialImage?: string;
  socialImageAlt?: string;
  keywords?: string[];
  draft: boolean;
}

const entries = import.meta.glob<MarkdownInstance<BlogFrontmatter>>(
  "../content/blog/*.md",
  { eager: true },
);

export function getBlogPosts() {
  return Object.entries(entries)
    .map(([file, entry]) => ({
      slug: file.split("/").pop()!.replace(/\.md$/, ""),
      entry,
    }))
    .filter(({ entry }) => import.meta.env.DEV || !entry.frontmatter.draft);
}
