import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const match = process.argv[index].match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}
const directory = args.get("output") || "public/assets/projects-v3";
const sea = args.get("sea-root") || "/Users/wchai/Documents/Vault/WillChai Company/ConspiraSea";
const publication = args.get("searing-root") || "/Users/wchai/Documents/Vault/WillChai Company/Searing Stories/site/public/images/hoffa";
const artifact = args.get("artifact") || "artifacts/projects-review/scene-exports.json";

async function requireFile(file, label) {
  try {
    await fs.access(file);
  } catch {
    throw new Error(`Missing ${label}: ${file}. Supply the source root with --${label === "ConspiraSea source" ? "sea-root" : "searing-root"}=...`);
  }
}

for (const [file, label] of [
  [`${sea}/ConspiraSea box and expansion pack.png`, "ConspiraSea source"],
  [`${sea}/conspirasea-deploy/public/headshots/Captain.PNG`, "ConspiraSea headshots"],
  [`${sea}/conspirasea-deploy/public/headshots/Jester.PNG`, "ConspiraSea headshots"],
  [`${sea}/conspirasea-deploy/public/headshots/Scylla.PNG`, "ConspiraSea headshots"],
  [`${publication}/main-course-table-1600.webp`, "Searing Stories source"],
  [`${publication}/portrait-window-1600.webp`, "Searing Stories source"],
]) await requireFile(file, label);

await fs.mkdir(directory, { recursive: true });
const records = [];
async function record(source, output, treatment) {
  const buffer = await fs.readFile(output),
    original = await fs.readFile(source);
  const meta = await sharp(buffer).metadata();
  records.push({
    source,
    sourceSha256: crypto.createHash("sha256").update(original).digest("hex"),
    output,
    width: meta.width,
    height: meta.height,
    alpha: meta.hasAlpha,
    bytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
    treatment,
  });
}
const box = `${sea}/ConspiraSea box and expansion pack.png`;
// Production masks retain the original package pixels and printed lettering.
for (const [name, points, crop] of [
  [
    "box",
    "35,149 43,145 704,132 754,138 755,143 754,641 752,644 64,699 59,697 35,674",
    { left: 33, top: 130, width: 724, height: 572 },
  ],
  [
    "hadal",
    "792,258 798,253 1032,260 1041,265 1042,333 1044,338 1040,675 1029,690 772,668 774,337 790,325",
    { left: 772, top: 251, width: 276, height: 443 },
  ],
]) {
  const outline = "M" + points.replaceAll(" ", " L") + "Z";
  const hole =
    name === "hadal"
      ? "M879 290 Q875 294 879 300 L944 304 Q952 304 952 297 Q952 291 945 290 L925 289 Q922 279 913 279 Q903 278 900 287 L884 287Z"
      : "";
  const mask = Buffer.from(
    `<svg width="1080" height="810"><path fill="white" fill-rule="evenodd" d="${outline} ${hole}"/></svg>`,
  );
  const output = `${directory}/${name}.webp`;
  const masked = await sharp(box)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp(masked)
    .extract(crop)
    .webp({ quality: 94, alphaQuality: 100 })
    .toFile(output);
  await record(box, output, "Original pixels with a package silhouette mask.");
}
for (const name of ["Captain", "Jester", "Scylla"]) {
  const source = `${sea}/conspirasea-deploy/public/headshots/${name}.PNG`;
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Remove the border connected white canvas while retaining enclosed white paint.
  const seen = new Uint8Array(info.width * info.height),
    queue = new Int32Array(seen.length);
  let head = 0,
    tail = 0;
  const add = (p) => {
    if (p < 0 || p >= seen.length || seen[p]) return;
    seen[p] = 1;
    const i = p * 4;
    if (Math.min(data[i], data[i + 1], data[i + 2]) < 242) return;
    queue[tail++] = p;
  };
  for (let x = 0; x < info.width; x++) {
    add(x);
    add((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y++) {
    add(y * info.width);
    add(y * info.width + info.width - 1);
  }
  while (head < tail) {
    const p = queue[head++];
    data[p * 4 + 3] = 0;
    if (p % info.width) add(p - 1);
    if (p % info.width < info.width - 1) add(p + 1);
    add(p - info.width);
    add(p + info.width);
  }
  const output = `${directory}/${name.toLowerCase()}.webp`;
  await sharp(data, { raw: info })
    .trim({ background: "#00000000", threshold: 1 })
    .resize({ width: 420, height: 420, fit: "inside" })
    .webp({ quality: 94, alphaQuality: 100 })
    .toFile(output);
  await record(
    source,
    output,
    "Border connected canvas removal; coloured brush outlines and enclosed paint retained.",
  );
}
for (const [sourceName, name, width, quality] of [
  ["main-course-table-1600.webp", "dinner", 1440, 78],
  ["portrait-window-1600.webp", "felipe", 650, 85],
]) {
  const source = path.join(publication, sourceName),
    output = `${directory}/${name}.webp`;
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(output);
  await record(source, output, "Resized from published issue photography.");
}
const svg = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg>',
);
await sharp(svg).webp({ quality: 55 }).toFile(`${directory}/ticket-noise.webp`);
records.push({
  output: `${directory}/ticket-noise.webp`,
  source: "Homepage ticket inline SVG feTurbulence",
  width: 300,
  height: 300,
  treatment: "Rasterized once with the original procedural parameters.",
  sha256: crypto
    .createHash("sha256")
    .update(await fs.readFile(`${directory}/ticket-noise.webp`))
    .digest("hex"),
});
await fs.mkdir(path.dirname(artifact), { recursive: true });
await fs.writeFile(
  artifact,
  JSON.stringify({ version: 3, records }, null, 2) + "\n",
);
console.log(
  records.map((r) => `${r.output}: ${r.width} × ${r.height}`).join("\n"),
);
