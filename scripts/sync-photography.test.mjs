import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, unlink, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { syncPhotography } from './sync-photography.mjs';

test('sync adds, measures, preserves metadata and removes missing entries', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(),'willchai-photo-test-'));
  const folder = path.join(root,'public/photography/shuffle');
  const manifest = path.join(root,'src/data/photographyShuffle.json');
  try {
    await mkdir(folder,{recursive:true});
    await mkdir(path.dirname(manifest),{recursive:true});
    await sharp({create:{width:40,height:60,channels:3,background:'white'}}).webp().toFile(path.join(folder,'first.webp'));
    await writeFile(manifest,JSON.stringify({images:[{src:'/photography/shuffle/first.webp',width:1,height:1,sourceUrl:'https://example.com/original'}]}));
    const before = await readFile(manifest,'utf8');
    assert.equal((await syncPhotography(root,{check:true})).changed,true);
    assert.equal(await readFile(manifest,'utf8'),before);
    await syncPhotography(root);
    const saved = JSON.parse(await readFile(manifest,'utf8'));
    assert.deepEqual(saved.images[0],{src:'/photography/shuffle/first.webp',width:40,height:60,sourceUrl:'https://example.com/original'});
    assert.equal((await syncPhotography(root,{check:true})).changed,false);
    await sharp({create:{width:30,height:20,channels:3,background:'white'}}).png().toFile(path.join(folder,'new photo.png'));
    assert.equal((await syncPhotography(root)).added,1);
    assert.equal(JSON.parse(await readFile(manifest,'utf8')).images[1].src,'/photography/shuffle/new%20photo.png');
    await unlink(path.join(folder,'first.webp'));
    assert.equal((await syncPhotography(root)).removed,1);
    await writeFile(path.join(folder,'unsupported.heic'),'fixture');
    await assert.rejects(syncPhotography(root),/export them/);
    await unlink(path.join(folder,'unsupported.heic'));
    await unlink(path.join(folder,'new photo.png'));
    await assert.rejects(syncPhotography(root),/empty/);
    assert.equal((await syncPhotography(root,{allowEmpty:true})).count,0);
  } finally {
    await rm(root,{recursive:true,force:true});
  }
});
