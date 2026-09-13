# Will Chai System

This directory contains the rendered brand and pattern library for
willchai.com. It exists so design decisions can be reviewed in one place and so
future implementation work reuses the same tokens, patterns, assets, and
constraints instead of recreating the visual language page by page.

## Authority

`DECISIONS.md` records dated product and architecture decisions.
`BRAND-GUIDELINES.md` governs identity and voice. `DESIGN-SYSTEM.md` governs
visual implementation, and `CONTENT-GUIDE.md` governs publishing. This system
page demonstrates those documents with real CSS and representative content.
When the page and documents disagree, the latest dated entry in `DECISIONS.md`
governs until both are reconciled.

## Files

- `index.html` is the visual reference and pattern inventory.
- `tokens.css` contains portable brand tokens intended to survive the Astro
  rebuild.
- `system.css` styles the reference page and contains the first executable
  versions of the patterns.
- `system.js` demonstrates the portrait-control and holographic-ticket
  behaviours without introducing a framework dependency.
- `photography-stack.html` demonstrates the current featured passage, client cards, and photograph viewer using the production CSS and interaction scripts.
- `PATTERNS.md` records the content, behaviour, variation, accessibility, and
  performance contracts that future components must preserve.

## Pattern contract

Every reusable pattern must document its purpose, required content, permitted
variation, responsive behaviour, accessibility expectations, and performance
constraints. A pattern is not complete merely because it looks finished. It
must work with representative content, at a narrow viewport, with keyboard
input, and with reduced motion.

The current patterns are the identity rail, portrait control, project media
panel, black-hole project entry, project detail opener, media and caption, role and credits, photography
service information, project chooser row, external handoff, general contact invitation,
photography inquiry, and the holographic contact ticket. Homepage project
panels share one exterior size while
their internal art direction comes from authentic project media, crop,
sequencing, title placement, and interaction. The Vermilion dashed boundary is
a selective signature, not the default border around every module.

The launch architecture contains twelve pages. Photography remains one
substantial page. Films and Projects are the two chooser destinations with
individual work pages. The Résumé pairs PDF and HTML formats, `/hey/` serves
quick link contexts, and contact invitations live within relevant pages.

The system also records the need for an authentic exception layer so the final
site does not inherit the corporate evenness of a conventional component
library. The contact ticket is an approved example. Will also approved the
personal pixel photographer on 9 September 2026. It appears briefly in the
Photography opening and returns for the pricing scene. The source atlas and entrance can be replayed in
`photographer-pixel.html`.
Each drawing is 32 × 32 pixels and each appearance lasts four seconds. The
broader visual language continues to develop from Will's real source material.
The implementation was adapted from the live WordPress ticket's perforated
path, pointer-driven perspective, Brand Blue interference layer, repeated W
texture, and click-to-copy response rather than recreated from appearance
alone.

The opening greeting now plays once on every Photography page load. Each load
also chooses a random shuffle order. Pressing Shuffle gives Will a brief
gathering and dealing action using the same pixel artwork. The image folder and
`npm run photos:sync` workflow are documented in `CONTENT-GUIDE.md`.

## Reference models

This is a compact personal system rather than an enterprise component library,
but several official systems establish useful standards. GitHub Primer keeps
design primitives close to production code. IBM Carbon documents usage, style,
code, accessibility, and design resources as part of a component's definition
of done. GOV.UK distinguishes foundations, components, and patterns and records
the evidence behind them. Shopify Polaris connects foundations, content,
design assets, tokens, and implementation, while Mailchimp demonstrates the
value of concise public rules for brand assets and voice. Atlassian is a useful
model for recording central design decisions, and the U.S. Web Design System
sets a strong accessibility and token baseline for public-facing interfaces.

- GitHub Primer: https://primer.style/
- IBM Carbon: https://carbondesignsystem.com/
- GOV.UK Design System: https://design-system.service.gov.uk/
- Shopify Polaris: https://polaris.shopify.com/
- Mailchimp Brand Assets: https://mailchimp.com/about/brand-assets/
- Mailchimp Voice and Tone: https://styleguide.mailchimp.com/voice-and-tone/
- Atlassian Design System: https://atlassian.design/get-started/about-atlassian-design-system
- U.S. Web Design System: https://designsystem.digital.gov/

## Asset status

The current photographs and project images are representative content already
present in the repository. They demonstrate the pattern system but do not
constitute final launch curation. The current W from the live site is preserved
in `system/assets/willchai-mark.avif` as the official compact mark;
`public/logo512.png` is legacy. The existing Plantagenet Cherokee wordmark still
needs to be supplied as outlined vector artwork. Funnel Sans and
Unbounded are shown through hosted preview files here; production must keep
licensed, subsetted WOFF2 files locally.

## Maintenance

When a reusable visual rule changes, update the decision log, the relevant
guideline, `tokens.css` when applicable, and the affected example on the system
page in the same change. When a production component becomes more accurate
than its demonstration here, bring the system page forward rather than leaving
two competing versions.

## Photography motion and pricing

Photography uses a compact site header with the shared identity and Contact,
the Photography title, and a short
portrait and event description. Nine approved photographs move through a sticky
viewport while ordinary vertical scrolling advances the sequence. Cards enter
from the lower right, reach the centre at full scale, then leave through the upper
left. Complete image proportions remain visible on desktop and mobile.

The sequence draws from Will's Orbit Cards reference. A small arc, rotation, and
scale shift give nearby cards depth. Every photograph remains a keyboard reachable
link and opens in the established viewer. Reduced motion presents a static grid.

The opening character rises through the upper edge of the first photograph after
the collection settles and stands on its top boundary. A separate stage follows
the first card above the incoming stack, and phone measurements wait for active
scrolling to settle. The four second greeting uses the clean arrive, ready, and
rest poses from the approved atlas at integer enlargement. The later
appearance retains the approved pushing poses. The large $600 package prop sits
directly on the white page surface. Will enters beside its lower edge, braces,
and pushes it beyond the right side of the page. The shoot board appears beneath
the departing scene. The prop copy reads Super Generic Package and $600. Direct
inquiry links and form interaction reveal the usable board immediately. Replay
remains available.

The white shoot board retains its irregular blue enclosure. An editable shoot
name stays above two questions about place and date. Next reveals an optional
CAD budget and additional notes, then the completed inquiry with Open email and
Copy text. Back preserves every answer. The rough pointer approaches the primary
button in a stepped loop and presses it. The second advance changes the same
button into Open email. A directional mask exchanges the question pair while
the title and photographic preview stay anchored. Supplied amounts are labelled
Your budget, and visitors may request guidance. The budget field keeps $600 as
the sole public pricing reference. Supporting copy describes the quote factors
and connects additional budget room with longer coverage and a wider final gallery.

An opened photograph offers Add reference across the featured work and shuffle.
Selections appear on the shoot board and remain removable. Their image links
appear in the same generated message used by email and copying. Collection
headers provide a return to the shoot when references are selected. Clipboard
failure selects the message for manual copying. Inquiry contents stay in the
current page.

The client proof gives McMaster University an image led feature occupying two
thirds of the desktop composition. Foxwood Homes and Platinum Moon appear as
smaller transparent entries in the remaining column. A staged Will Chai
collaboration scene settles all three organizations into one visible group.
Gentle photograph drift animates the group. The shuffle reserves image
dimensions and fills continuous columns while preserving earlier positions. The
footer retains the original contact ticket, policy, rights and homepage return.
Reduced motion presents the static featured grid, direct image changes and usable
builder. Final quotes remain personal to each assignment.
