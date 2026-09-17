import { getBlogMediaPaths, serveBlogMedia } from "../../../../data/blogMedia";

export function getStaticPaths() {
  return getBlogMediaPaths(".webp");
}

export const GET = serveBlogMedia;
