import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://willchai.com",
  output: "static",
  vite: { cacheDir: ".astro/vite" },
  devToolbar: { enabled: false },
  redirects: {
    "/projects/medterms/": {
      destination: "https://medterms.willchai.com/",
      status: 301,
    },
    "/projects/tachyboard/": {
      destination: "https://tachyboard.willchai.com/",
      status: 301,
    },
  },
  trailingSlash: "always",
});
