import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const page = await fs.readFile(path.join(root, "src/pages/photography/index.astro"), "utf8");
const sources = [...new Set([...page.matchAll(/src: "(\/photography\/[^" ]+)"/g)].map(match => match[1]))];
const output = path.join(root, "public/photography/featured");
await fs.mkdir(output, { recursive: true });
for (const source of sources) {
  const input = path.join(root, "public", source);
  const { name, ext } = path.parse(source);
  const original = await sharp(input).metadata();
  for (const width of [640, 1280]) {
    if (original.width < width) throw new Error(`${source} is too small for its ${width}w candidate`);
    let image = sharp(input).resize({ width, withoutEnlargement: true });
    image = ext === ".avif" ? image.avif({ quality: 65 }) : image.webp({ quality: 85 });
    await image.toFile(path.join(output, `${name}-${width}${ext}`));
  }
}
console.log(`Prepared ${sources.length * 2} featured image candidates.`);
