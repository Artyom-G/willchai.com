import { getBlogMediaPaths, serveBlogMedia } from "../../../../data/blogMedia";

export function getStaticPaths() {
  return getBlogMediaPaths(".pdf");
}

export const GET = serveBlogMedia;
