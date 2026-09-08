# Prototype materials

All visual material in this prototype is either already in the repository or copied from the current public willchai.com so the page does not depend on WordPress at runtime.

| Local file | Source | Prototype use | Status |
| --- | --- | --- | --- |
| `assets/willchai-mark.avif` | Current willchai.com favicon asset | Header identity, browser icon, contact ticket texture | Official, but only 150 × 150; original vector or high-resolution transparent source is still preferred |
| `assets/will-portrait.avif` | Current willchai.com profile image | First identity portrait | Current public asset |
| `assets/will-portrait-alt.jpg` | `src/assets/profile.jpg` | Second identity portrait | Existing repository asset |
| `assets/photography-banner.avif` | Current willchai.com photography banner | Photography panel | Current public asset |
| `assets/wattleseed-poster.avif` | Current willchai.com Wattleseed poster | Combined Films panel | Current public asset; a larger original should replace this WordPress thumbnail before launch |
| `assets/murder-of-minus-poster.avif` | Current willchai.com Murder of Minus poster | Combined Films panel | Current public asset; a larger original should replace this WordPress thumbnail before launch |
| `assets/searing-stories.avif` | Current willchai.com Searing Stories landing image | Searing Stories panel | Current public asset |
| `assets/waterbear-watch.avif` | Current willchai.com Waterbear hero | Watchmaking panel | Current public asset |
| `assets/funnel-sans-latin.woff2` | Official Google Fonts-hosted Funnel Sans file | Body and interface typography | Self-hosted in prototype |
| `assets/unbounded-latin.woff2` | Official Google Fonts-hosted Unbounded file | Select display typography | Self-hosted in prototype |
| `assets/pixel-cursor.svg` | Purpose-built prototype artwork | Large click cue beside the changing portrait | Local vector with intentionally pixel-stepped geometry |

The Plantagenet Cherokee wordmark is not recreated as live text. The original outlined wordmark artwork remains a required production asset.

The current prototype sends the combined Films panel to the existing Projects page until the new dedicated Films route is built. Searing Stories points directly to `searingstories.com`.

## Interaction mockups

`mockups/realistic-black-hole-hover-v1.png` is the first approved-for-discussion visual target for the project-entry effect. It demonstrates a black event horizon, white-hot accretion disk, and visible gravitational lensing of the Photography panel underneath. It is a rendered design study, not a production website asset.

`mockups/realistic-black-hole-hover-v2.png` established the restrained-disk direction, but it is no longer a literal implementation target. The working prototype now renders the panel itself through a full-panel shader, keeps live copy above the effect, removes chromatic fringing, and gives the pointer response damped spring weight. Both still images remain useful historical comparisons rather than production assets.
