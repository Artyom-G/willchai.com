import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://willchai.com",
  output: "static",
  vite: { cacheDir: ".astro/vite" },
  devToolbar: { enabled: false },
  redirects: {
    "/sesr-emulating-reasoning-with-system-instructions/": "/sesr/",
    "/projects/conspirasea/": "/projects/#conspirasea",
    "/projects/searing-stories/": "/projects/#searing",
    "/conspirasea/": "/projects/#conspirasea",
    "/searing-stories/": "/projects/#searing",

    "/prototype/": "/",
    "/wattleseed/": "/films/wattleseed/",
    "/murder-of-minus-a-sci-fi-thriller/": "/films/murder-of-minus/",
    "/contact/": "/#contact",
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
