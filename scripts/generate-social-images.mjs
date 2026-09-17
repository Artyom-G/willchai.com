import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = path.join(root, "public/assets/social");
const sources = {
  home: "public/assets/will-portrait.avif",
  hey: "public/assets/will-portrait.avif",
  photography: "public/assets/photography-banner.avif",
  projects: "public/assets/projects-triangle-grid.svg",
  resume: "public/assets/resume-preview.webp",
};

await fs.mkdir(outputDir, { recursive: true });
for (const [name, source] of Object.entries(sources)) {
  if (name === "home" || name === "hey") {
    const portrait = await sharp(path.join(root, source)).resize(500, 500).composite([{
      input: Buffer.from('<svg width="500" height="500"><circle cx="250" cy="250" r="250" fill="white"/></svg>'),
      blend: "dest-in",
    }]).png().toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#eef0f2" } })
      .composite([{ input: portrait, left: 350, top: 65 }])
      .jpeg({ quality: 88, progressive: true }).toFile(path.join(outputDir, `${name}.jpg`));
    continue;
  }
  await sharp(path.join(root, source))
    .resize(1200, 630, { fit: "contain", background: "#eef0f2" })
    .flatten({ background: "#eef0f2" })
    .jpeg({ quality: 88, progressive: true })
    .toFile(path.join(outputDir, `${name}.jpg`));
}
