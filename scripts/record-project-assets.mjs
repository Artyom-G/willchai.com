import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";

const sha = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");
const prepared = JSON.parse(
  await fs.readFile("artifacts/projects-review/scene-exports.json", "utf8"),
);
const assets = [];
async function record(file, source, treatment, details = {}) {
  const buffer = await fs.readFile(file);
  if (!buffer.length) throw new Error(`Empty asset: ${file}`);
  const image = /\.(webp|png|svg|avif)$/.test(file)
    ? await sharp(buffer).metadata()
    : {};
  assets.push({
    file,
    source,
    treatment,
    bytes: buffer.length,
    sha256: sha(buffer),
    width: image.width,
    height: image.height,
    alpha: image.hasAlpha,
    ...details,
  });
}
for (const item of prepared.records) {
  await record(item.output, item.source, item.treatment, {
    sourceSha256: item.sourceSha256,
  });
}
const directory = "public/assets/projects-v3";
for (const name of ["eb-garamond", "patrick-hand"]) {
  const family = name === "eb-garamond" ? "ebgaramond" : "patrickhand";
  const url =
    name === "eb-garamond"
      ? "https://fonts.gstatic.com/s/ebgaramond/v33/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUAw.ttf"
      : "https://fonts.gstatic.com/s/patrickhand/v25/LDI1apSQOAYtSuYWp8ZhfYeMWQ.ttf";
  await record(
    `${directory}/${name}.woff2`,
    url,
    "Latin WOFF2 export scoped to Cipher.",
    {
      licence: `${directory}/${name}-OFL.txt`,
      weight: name === "eb-garamond" ? 700 : 400,
    },
  );
  await record(
    `${directory}/${name}-OFL.txt`,
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
    "SIL Open Font License retained.",
  );
}
await record(
  `${directory}/searing-masthead.svg`,
  "https://searingstories.com/fonts/Trattatello.woff2",
  "Original Searing Stories masthead converted to outlined artwork. The font is omitted from the site.",
);
await record(
  "public/photography/pixel-photographer.png",
  "Approved Photography atlas",
  "Canonical face, hair and palette.",
);
await record(
  `${directory}/will-host.png`,
  "scripts/build-projects-sprite.mjs",
  "Eighteen native RGBA frames.",
  { frameWidth: 32, frameHeight: 32, frames: 18 },
);
await record(
  `${directory}/will-frames.json`,
  "scripts/build-projects-sprite.mjs",
  "Foot, hand and prop attachment coordinates.",
);
for (const name of (await fs.readdir(`${directory}/poses`)).filter((name) =>
  name.endsWith(".png"),
)) {
  await record(
    `${directory}/poses/${name}`,
    "scripts/build-projects-sprite.mjs",
    "Native pose with canonical palette and binary alpha.",
  );
}
await record(
  `${directory}/hands-poster.webp`,
  "src/scripts/project-hands/scene.ts",
  "Transparent still rendered using the current corrected rig.",
  { rigRevision: "4513723" },
);
await record(
  `${directory}/hands-poster.json`,
  "src/scripts/project-hands/scene.ts",
  "Projected keyboard support for the static poster.",
);
for (const name of [
  "left.glb",
  "right.glb",
  "LICENSE.txt",
  "PROVENANCE.md",
  "THREE-LICENSE.txt",
]) {
  await record(
    `public/assets/projects-showtell/hands/${name}`,
    `/Users/Shared/tachyboard/public/models/finger-guide/${name}`,
    "Existing hand model and provenance retained.",
  );
}
await record(
  "src/scripts/project-hands/fingerGuideRig.ts",
  "/Users/Shared/tachyboard/lib/fingerGuideRig.ts",
  "Current corrected rig copied verbatim.",
  { revision: "4513723" },
);
await record(
  "src/scripts/project-hands/fingerGuide.ts",
  "/Users/Shared/tachyboard/lib/fingerGuide.ts",
  "Keyboard geometry and finger target mapping.",
);
for (const name of ["box-study.png", "crew-study.png"]) {
  await record(
    `artifacts/projects-review/studies/${name}`,
    "Built in image generation tool, September 14, 2026",
    "Extraction study used during preparation. Final derivatives preserve original pixels.",
  );
}
const result = {
  version: 3,
  date: "2026-09-14",
  status: "Local implementation for review",
  preview: "http://127.0.0.1:4349/projects/",
  referencePreview: "http://127.0.0.1:4348/projects/",
  assets,
  spriteProcess: "src/data/projects-showtell-sprite.md",
  verification: "artifacts/projects-review/VERIFICATION.md",
};
await fs.writeFile(
  "src/data/projects-showtell-sources.json",
  JSON.stringify(result, null, 2) + "\n",
);
await fs.writeFile(
  "artifacts/projects-review/asset-record.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(`${assets.length} assets recorded.`);
