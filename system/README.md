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
- `photography-stack.html` demonstrates the current featured passage, contact sheet and personal shoot card using the production CSS and interaction script.
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
Photography opening and returns for the pricing scene. The four frame artwork and entrance can be replayed in
`photographer-pixel.html`.
Each drawing is 32 × 32 pixels and each appearance lasts four seconds. The
broader visual language continues to develop from Will's real source material.
The implementation was adapted from the live WordPress ticket's perforated
path, pointer-driven perspective, Brand Blue interference layer, repeated W
texture, and click-to-copy response rather than recreated from appearance
alone.

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

Photography opens with a direct homepage link, the Photography title, and an
explicitly named featured selection. Three short chapters present four
photographs each. Desktop chapters hold two photographs together; phones hold
one. Each photograph occupies the same viewing area and retains its complete
composition. Scrolling brings the following photographs upward into place,
with a pause at each resting position. Document scrolling stays native and
reverses the sequence. View together exposes the full collection immediately.
The current composition remains available for Will's visual review.

Will rises above the Featured photographs boundary, takes a photograph, then
ducks behind the edge. The four second greeting plays once per session using
the approved four poses. Integer enlargement gives the drawn body a height of
176 pixels on desktop and 132 pixels on phones. His later appearance retains
the dedicated pushing poses. The Gold tier prop reads Standard event package.
It pauses at its ledge, tips away and reveals the builder. Direct inquiry links
and form interaction expose the usable board immediately. Replay is available.

The builder restores the white interior within the irregular blue enclosure.
Its heading and homepage pointer sit inside the board. An editable shoot name
stays above two questions about place and date. Next exchanges these questions
for an optional CAD budget and additional notes. A second Next reveals the
completed inquiry with Open email and Copy text. Back preserves every answer.
The pointer meets the field panel at a defined grip point, travels with it,
then returns to its resting position. The shoot name and photographic preview
remain in place while the fields change. A supplied budget is labelled Your
budget, and visitors may request guidance. Actual fees are quoted personally.

An opened photograph offers Add reference across both featured work and the
shuffle. Selected references appear on the shoot board and may be removed
there. Their image links appear in the generated email and copied text.
Collection headers provide a return to the shoot when references are selected.
The same draft powers both contact choices. Clipboard failure selects the
message for manual copying. Inquiry contents stay in the current page.

Organization marks retain their measured artwork sizing. The shuffle places
incoming photographs into the shortest continuous column, reserves intrinsic
image dimensions and preserves earlier positions. The footer retains the
original contact ticket, policy, rights and homepage return. Reduced motion
presents the contact sheet and usable builder immediately. Photograph
selection, captions and organizations remain provisional.
