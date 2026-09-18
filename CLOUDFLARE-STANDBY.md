# Cloudflare standby

Cloudflare hosts a dormant public copy at `https://standby.willchai.com`.
Search engines receive `X-Robots-Tag: noindex, nofollow, noarchive` on this hostname.

The first verified deployment uses Sites version 39 from commit
`74ac0f16aa7be9953bbc42392ecebf69d5685598`.
Its Cloudflare Worker version is
`dabff54c-e35b-4d29-a0aa-578eca7f3d87`.

Build and deployment:

```sh
npm ci
npm run check
npm run build
npx wrangler deploy
```

The Worker serves only `standby.willchai.com`. The primary domain stays on its
current host until a recovery change is requested. A recovery change should
begin with route, redirect, email DNS, desktop, and phone checks.
