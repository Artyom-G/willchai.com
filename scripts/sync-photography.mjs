import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const supported = /\.(avif|webp|jpe?g|png)$/i;

export async function syncPhotography(root = projectRoot, { check = false, allowEmpty = false } = {}) {
  const folder = path.join(root, 'public/photography/shuffle');
  const manifestPath = path.join(root, 'src/data/photographyShuffle.json');
  const original = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(original);
  const entries = await readdir(folder, { withFileTypes: true });
  const unsupported = entries.filter(entry => !entry.name.startsWith('.') && entry.isFile() && !supported.test(entry.name));
  if (unsupported.length) throw new Error(`Move these files outside the shuffle folder or export them as JPEG, PNG, WebP or AVIF: ${unsupported.map(entry => entry.name).join(', ')}`);
  const files = entries.filter(entry => entry.isFile() && supported.test(entry.name)).map(entry => entry.name).sort((a,b)=>a.localeCompare(b, 'en', {numeric:true}));
  if (!files.length && !allowEmpty) throw new Error('The shuffle folder is empty. Add photographs, or use --allow-empty to publish an empty list.');
  const previous = new Map(manifest.images.map(image => [image.src, image]));
  const existingOrder = new Map(manifest.images.map((image,index)=>[image.src,index]));
  const images = [];
  // A small batch limits open files while checking the complete collection.
  for (let index = 0; index < files.length; index += 8) {
    images.push(...await Promise.all(files.slice(index,index+8).map(async filename => {
      const src = '/photography/shuffle/' + encodeURIComponent(filename);
      const metadata = await sharp(path.join(folder,filename)).metadata();
      const dimensions = metadata.autoOrient || metadata;
      if (!dimensions.width || !dimensions.height) throw new Error(`Image dimensions could not be read: ${filename}`);
      return {...previous.get(src), src, width:dimensions.width, height:dimensions.height};
    })));
  }
  images.sort((a,b)=>(existingOrder.get(a.src) ?? Infinity)-(existingOrder.get(b.src) ?? Infinity));
  const next = JSON.stringify({...manifest,images},null,2)+'\n';
  const added = images.filter(image => !previous.has(image.src)).length;
  const current = new Set(images.map(image=>image.src));
  const removed = manifest.images.filter(image=>!current.has(image.src)).length;
  const changed = next !== original;
  if (changed && !check) {
    const temporary = manifestPath + `.sync-${process.pid}`;
    await writeFile(temporary,next);
    await rename(temporary,manifestPath);
  }
  return {count:images.length,added,removed,changed,check};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const unknown = args.filter(arg=>!['--check','--allow-empty'].includes(arg));
  if (unknown.length) throw new Error(`Unknown option: ${unknown.join(', ')}`);
  try {
    const result = await syncPhotography(projectRoot,{check:args.includes('--check'),allowEmpty:args.includes('--allow-empty')});
    console.log(`${result.count} photographs. ${result.added} added. ${result.removed} removed. ${result.check ? 'Check completed.' : 'Image list synchronized.'}`);
    if (result.check && result.changed) { console.error('Run npm run photos:sync to update the image list.'); process.exitCode=1; }
  } catch (error) {
    console.error(error.message);
    process.exitCode=1;
  }
}
