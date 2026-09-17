import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isExternal = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
function splitReference(value) {
  const hash = value.indexOf("#"), query = value.indexOf("?");
  const end = [hash, query].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? value.length;
  try { return { pathPart: decodeURIComponent(value.slice(0, end)), fragment: hash >= 0 ? value.slice(hash + 1).split("?", 1)[0] : "" }; }
  catch { return { invalid: true, pathPart: value, fragment: "" }; }
}
async function regularFile(file) { try { return (await fs.stat(file)).isFile(); } catch { return false; } }
async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}
const idsForHtml = (source) => new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
function htmlReferences(source) {
  const references = [];
  for (const match of source.matchAll(/\b(?:href|src|poster|action)\s*=\s*["']([^"']+)["']/gi)) references.push(match[1].trim());
  for (const match of source.matchAll(/\b(?:srcset|imagesrcset)\s*=\s*["']([^"']+)["']/gi)) for (const candidate of match[1].split(",")) references.push(candidate.trim().split(/\s+/)[0]);
  for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1].trim());
  return references;
}
async function checkReference(reference, sourceFile, distRoot, pageIds, errors) {
  if (!reference || isExternal(reference) || /^(?:javascript|mailto|tel):/i.test(reference)) return;
  const parsed = splitReference(reference);
  if (parsed.invalid) { errors.push(`${path.relative(distRoot, sourceFile)} -> ${reference}`); return; }
  if (!parsed.pathPart && parsed.fragment) {
    if (!pageIds.get(sourceFile)?.has(parsed.fragment)) errors.push(`${path.relative(distRoot, sourceFile)} -> ${reference}`);
    return;
  }
  const target = parsed.pathPart.startsWith("/") ? path.join(distRoot, parsed.pathPart.slice(1)) : path.resolve(path.dirname(sourceFile), parsed.pathPart);
  let targetFile = target;
  if (!path.extname(targetFile) && await regularFile(path.join(targetFile, "index.html"))) targetFile = path.join(targetFile, "index.html");
  if (!(await regularFile(targetFile))) { errors.push(`${path.relative(distRoot, sourceFile)} -> ${reference}`); return; }
  if (parsed.fragment && targetFile.endsWith(".html") && !pageIds.get(targetFile)?.has(parsed.fragment)) errors.push(`${path.relative(distRoot, sourceFile)} -> ${reference}`);
}
export async function checkStaticOutput(distRoot) {
  const errors = [];
  if (!(await regularFile(path.join(distRoot, "index.html")))) throw new Error(`Static output directory does not contain index.html: ${distRoot}`);
  const files = await walk(distRoot), htmlFiles = files.filter((file) => file.endsWith(".html")), pageIds = new Map();
  for (const file of htmlFiles) pageIds.set(file, idsForHtml(await fs.readFile(file, "utf8")));
  for (const file of htmlFiles) for (const reference of htmlReferences(await fs.readFile(file, "utf8"))) await checkReference(reference, file, distRoot, pageIds, errors);
  for (const file of files.filter((entry) => entry.endsWith(".css"))) {
    const source = await fs.readFile(file, "utf8");
    for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      const reference = match[1].trim();
      if (!reference.startsWith("#")) await checkReference(reference, file, distRoot, pageIds, errors);
    }
    for (const match of source.matchAll(/@import\s+["']([^"']+)["']/gi)) await checkReference(match[1].trim(), file, distRoot, pageIds, errors);
  }
  return { files: files.length, pages: htmlFiles.length, errors };
}
export async function checkLiveRedirects(urls) {
  const errors = [];
  for (const url of urls) try { const response = await fetch(url, { redirect: "manual" }); if (response.status < 300 || response.status >= 400) errors.push(`${url} -> HTTP ${response.status}`); } catch (error) { errors.push(`${url} -> ${error instanceof Error ? error.message : String(error)}`); }
  return errors;
}
async function main() {
  const args = process.argv.slice(2), distIndex = args.indexOf("--dist"), distRoot = path.resolve(projectRoot, distIndex >= 0 ? args[distIndex + 1] : "dist"), result = await checkStaticOutput(distRoot);
  let errors = result.errors;
  if (args.includes("--live")) errors = [...errors, ...(await checkLiveRedirects(args.filter((value) => /^https?:\/\//i.test(value))))];
  console.log(`Checked ${result.pages} HTML pages and ${result.files} output files.`);
  if (errors.length) { console.error(errors.map((error) => `Broken reference: ${error}`).join("\n")); process.exitCode = 1; } else console.log("Site integrity passed.");
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
