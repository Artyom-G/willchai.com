import { getBlogMediaPaths, serveBlogMedia } from "../../../../data/blogMedia";

export function getStaticPaths() {
  return getBlogMediaPaths(".png");
}

export const GET = serveBlogMedia;
