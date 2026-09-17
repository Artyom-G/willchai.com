import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkStaticOutput } from "./check-site-integrity.mjs";

test("reports missing anchors, CSS assets, srcset assets, and directory routes", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "willchai-integrity-"));
  await fs.mkdir(path.join(root, "about"));
  await fs.mkdir(path.join(root, "styles"));
  await fs.writeFile(path.join(root, "index.html"), '<a href="#missing">Missing anchor</a><a href="/about/#also-missing">Cross page</a><img srcset="/missing.webp 1x, /also-missing.webp 2x"><a href="/about/">About</a>');
  await fs.writeFile(path.join(root, "about", "index.html"), "<p id=\"present\">About</p>");
  await fs.writeFile(path.join(root, "styles", "site.css"), 'body { background: url("/missing.css"); }');
  const result = await checkStaticOutput(root);
  assert.deepEqual(result.errors, ["index.html -> #missing", "index.html -> /about/#also-missing", "index.html -> /missing.webp", "index.html -> /also-missing.webp", "styles/site.css -> /missing.css"]);
  await fs.rm(root, { recursive: true, force: true });
});
