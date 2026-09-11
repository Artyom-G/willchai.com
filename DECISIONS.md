# willchai.com — Product & Technical Decisions

This is the living source of truth for the website. It records decisions that
should survive individual design conversations and implementation changes.

## North star

Create a personal website for a future physician with an unusual creative
practice: a considered, expressive place to share stories across mediums. It
must load almost instantly, remain useful for years, and be simple to update
with content or code changes made collaboratively in conversation.

## Priorities

In order:

1. **Speed.** Deliver mostly static HTML and optimized media; ship JavaScript
   only when it earns its cost.
2. **Beauty.** Let typography, whitespace, photography, and motion carry the
   design. Avoid generic template or dashboard aesthetics.
3. **Durability.** Keep content, media, and styling in ordinary files that are
   portable and easy to understand without a vendor or CMS.
4. **Editability.** Make a new project or page a small, predictable change;
   document the pattern close to the code.
5. **Accessibility and clarity.** Semantic markup, keyboard support, readable
   contrast, reduced-motion support, and a clean navigation model are baseline
   requirements.

## Audience and purpose

- **Primary audience:** people discovering Will's personal creative practice,
  potential creative collaborators, and photography clients. The site should
  establish the quality and range of the work, then make contacting or
  exploring it effortless.
- **Secondary audience:** creative peers, film audiences, professional
  opportunities, and people already familiar with Will's work.
- **Homepage job:** establish a real, personal identity within seconds; invite
  visitors into photography or shared stories; and provide a clear route to
  contact. It is not a résumé, student profile, or complete chronological
  record.
- **Voice:** assured, curious, personal, and written in cohesive conversational
  prose. Let work and images make the case; avoid inflated biography,
  marketing language, staccato slogans, and artificial editorial rhythm.

## Chosen technical direction

- **Site type:** static-first personal portfolio; no WordPress or database by
  default.
- **Framework:** Astro, using static output. Interactive islands are opt-in.
- **React:** use it only for self-contained interactions that benefit from
  state, such as the identity-portrait carousel. The rest of the site remains
  server-rendered static HTML and CSS.
- **Styling:** custom CSS, organized with design tokens and component-scoped
  styles. Do not introduce a CSS framework unless a concrete need justifies it.
- **Content:** Markdown/MDX and small typed content collections for projects,
  films, photography, writing, and watchmaking.
- **Media:** self-hosted and optimized images, using AVIF/WebP with responsive
  sizes and descriptive alt text. Video should use a specialist host only when
  necessary, loaded lazily.
- **Hosting:** Git-based static deployment (Cloudflare Pages or Vercel), with
  automatic HTTPS and preview deployments.

## Information architecture

The launch site is shallow and substantial. It contains twelve public pages.
The homepage is a curated introduction to Will and selected work. `/hey/` is a
utility destination for quick links and QR codes. Photography occupies one
long page with a caption free sequence of nine featured photographs, three client
cards, a shoot builder, a caption free shuffle, its own inquiry area, and the
complete service footer.

Films and Projects provide the two branch points. `/films/` introduces the film
practice and leads to the Wattleseed and Murder of Minus pages. `/projects/`
helps visitors choose among Medical Terminology Games, Tachyboard, Searing
Stories, and ConspiraSea. Each film and project page is the canonical home for
its work.

The résumé page presents the current PDF first, with view and download actions,
followed by an accessible HTML record carrying the same facts. Its content
stays aligned with LinkedIn. Contact lives within the homepage, Photography,
and compact endings on other pages. `/hey/` stays outside primary navigation.

Sharing Stories remains the organising idea connecting the creative practice.
Its expression lives in page copy and project context. Older work receives a
public mention when curation supports it. A small item on `/projects/` can carry
a useful older project in compact form.

The launch page map is:

1. `/`
2. `/hey/`
3. `/photography/`
4. `/films/`
5. `/films/wattleseed/`
6. `/films/murder-of-minus/`
7. `/projects/`
8. `/projects/medterms/`
9. `/projects/tachyboard/`
10. `/projects/searing-stories/`
11. `/projects/conspirasea/`
12. `/resume/`

Published resources include `/resume.pdf`, sitemap output, `robots.txt`, a
useful 404 page, and permanent redirects for meaningful legacy URLs. Future
growth may add dedicated Photography services, publicly ready films, or
substantial projects while preserving the same page logic.

Possible later routes include `/photography/weddings/`,
`/photography/real-estate/`, `/films/level-55/`, and
`/projects/[future-project]/`. Each route is created when the work and visitor
journey support a dedicated destination.
- The desktop homepage uses a persistent left identity/navigation rail beside a
  naturally scrolling right-hand sequence of project panels. The page has one
  document scroll; do not create a nested scroll area for the panels. The rail
  remains fixed in the viewport and must not acquire its own scrollbar.
- The identity rail introduces the current practice, not a time-sensitive
  student status. It becomes a compact header or menu on small screens.
- The identity portrait may cycle through a small, curated set of candid and
  formal images when activated. Its affordance must be clear, keyboard
  accessible, respectful of reduced-motion preferences, and never required for
  navigation. Use a large pixel-stepped pointer artwork as the visual cue; do
  not add an explanatory label or image counter.
- The homepage has one Films panel leading to a dedicated film index rather
  than one homepage panel for every film. Recognition and individual film
  identities can appear inside that shared panel.
- The project stream uses an Ink background so the media panels separate from
  the interface. Consistent Black gutters separate the homepage panels; the
  panels themselves have no dashed frames. This is a bounded contrast field,
  not a site-wide dark theme.
- The panel-entry interaction is rendered across the full panel rather than
  inside a moving circular lens. A dark event horizon, thin warm accretion
  trace without a circular photon ring, and radial shader distortion bend the
  panel's actual imagery while the live title and descriptive copy remain in a
  separate layer above it. A
  fine pointer sets the destination, but spring physics give the phenomenon
  visible weight. The hole is not clamped away from panel edges, and its disk
  tilts from roughly −20 to +20 degrees according to horizontal distance from
  the panel centre. “ENTER” is drawn within the same rendering in tightly
  spaced bold Unbounded and receives a coherent optical bend rather than a
  novelty text effect. While a fine pointer engages one panel, a 20% Black veil
  darkens every other project panel so attention follows the active work. On
  touch, the first tap plays a short transition at the tap position before following the
  destination. Reduced-motion and slow-update environments use the direct link.
- Remove helper copy around self-evident homepage structures. The work stream,
  portrait cycler, contact ticket, and footer do not need preambles, counters,
  instructions, or back-to-top copy merely to fill space.
- The site-wide contact invitation is broad and collaborative—“Let’s do
  something together.” Photography additionally offers a distinct
  photography-inquiries path for clients.

## Migration, discoverability, and privacy

- Inventory public WordPress URLs before launch and permanently redirect each
  meaningful URL to its closest new equivalent.
- Preserve or deliberately improve page titles, descriptions, social-preview
  images, canonical URLs, and structured data. Generate a sitemap and
  `robots.txt` with every production build.
- Start with privacy-respecting, cookieless analytics or no analytics. Do not
  add a tracking script without a specific question it will answer.
- Keep forms minimal and spam-resistant. Prefer a service that does not require
  maintaining an application backend, and document any visitor data it retains.
- Lazy-load third-party embeds and use a click-to-load state where the embed is
  not essential to the page.

## Ownership and operations

- The source repository and all published content must remain under Will's
  control. Keep original media outside the deployment asset folder and retain
  export-ready derivatives in the repository or a documented asset store.
- Document the registrar, DNS provider, deployment provider, and recovery
  steps in private project notes; never commit credentials or recovery codes.
- A clean production build and preview deployment must work from a fresh clone.
- Before publishing, check the intended route on a narrow mobile viewport and
  a desktop viewport, then test the contact path and any external links.

## Modularity rules

- A page composes reusable, deliberately small sections; sections do not know
  about the whole site.
- Keep global design choices in one token layer: colour, spacing, type scale,
  breakpoints, radii, and animation timings.
- Each content type has one schema and one repeatable page template.
- Prefer CSS and HTML first. Add JavaScript only for a discrete interaction
  such as a gallery lightbox, filter, or menu.
- Avoid dependencies that duplicate native browser features or force broad
  client-side hydration.
- Every dependency must have a clear purpose and be easy to remove.

## Proposed project shape

```text
src/
  components/       reusable visual building blocks
  layouts/          shared document and page shells
  pages/            routes and route-level composition
  content/          Markdown/MDX and collection definitions
  styles/           tokens, global foundations, utilities
public/
  images/           optimized, stable media assets
```

## Performance budget

- Static pages should render meaningful content without JavaScript.
- Keep the font payload deliberately small. Use one foundation sans and no more
  than one curated display family per view; subset and preload only the files
  used above the fold.
- Never autoplay heavyweight video on the homepage.
- Reserve image dimensions to prevent layout shift.
- Lazy-load media below the fold and defer nonessential third-party embeds.
- Check real mobile performance before publishing a visually significant page.

## Quality baseline

- Each page has a unique title, description, canonical URL, social-preview
  image, and a meaningful heading hierarchy.
- Interactive controls work with a keyboard and display a visible focus state.
- Images have useful alt text; decorative images have empty alt text; video has
  captions or an accurate transcript when dialogue or essential audio is used.
- Honour `prefers-reduced-motion`; motion should clarify hierarchy or provide
  delight, never block reading or navigation.
- Test the actual site with a modern phone-sized viewport before publishing.

## Content and editing workflow

1. Add or update content in its Markdown/MDX entry and media folder.
2. Reuse an existing template or component before making a new one.
3. When a recurring pattern emerges, promote it to a reusable component.
4. Test locally, review the deployment preview, then publish.

For conversation-driven changes, describe the outcome (for example, “add a
film project in the style of Wattleseed” or “make the photography index more
editorial”). The implementation should update the content and the smallest
relevant component or style layer, then record any lasting architectural choice
below.

Brand, content, and visual rules live in `BRAND-GUIDELINES.md`,
`CONTENT-GUIDE.md`, and `DESIGN-SYSTEM.md`. Keep this document focused on
choices that affect the site's direction, structure, or long-term maintenance.

## Decisions still to make

- Choose a deployment provider and a privacy-respecting analytics approach.
- Define the first release's photography inquiry experience: direct email only
  or email plus a hosted inquiry form.
- Decide whether the identity portrait is best as a click-to-cycle image or a
  small visible carousel control; both must work without hover.

## Decision log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-09-07 | Rebuild away from WordPress as a static-first site. | Better speed, security, longevity, and ownership. |
| 2026-09-07 | Prefer Astro and custom CSS over a fully client-rendered React site. | Keeps the default output lean while retaining modular components where useful. |
| 2026-09-07 | Use file-based Markdown/MDX content. | Content remains portable, versioned, and easy to change collaboratively. |
| 2026-09-07 | Use a persistent desktop identity rail and a single scrolling project sequence on the homepage. | Creates a stronger personal index without the usability problems of nested scrolling. |
| 2026-09-07 | Treat the homepage as a curated index, not a résumé or complete feed. | Keeps the first visit focused on the strongest work and clearest next step. |
| 2026-09-07 | Centre the identity on “a future physician with an unusual creative practice.” | It is a durable, personal distinction without reducing the site to student status. |
| 2026-09-07 | Make photography the professional service and group personal creative work under Sharing Stories. | Separates a clear client path from the broader multidisciplinary portfolio. |
| 2026-09-07 | Use React only for discrete enhancements such as cycling the identity portrait. | Retains a static-first performance model while allowing rich, modular interaction. |
| 2026-09-07 | Organise photography around Portraits, Events, and Creative. | These are clear entry points that remain expressive rather than overly commercial. |
| 2026-09-07 | Use broad collaboration contact site-wide and a dedicated photography inquiry route within photography. | Welcomes multidisciplinary work while giving prospective clients an obvious path. |
| 2026-09-07 | Initially explore a Paper identity rail beside an Ink archive, with Instrument Sans and Instrument Serif as the visual foundation. | Established an early editorial direction that was later superseded by the lighter modular system below. |
| 2026-09-07 | Compose the homepage from immersive, editorial-split, and archive-invitation panels. | Gives each project a repeatable but non-uniform home and prevents the page becoming a card grid. |
| 2026-09-07 | Pause the Paper + Ink art direction. | The visual exploration revealed that its dark, cinematic, archival tone does not match the intended graphic, modular, and experimental character. |
| 2026-09-07 | Use an always-light, orderly modular canvas with a subtle interface metaphor. | This matches the strongest qualities in Will's references: Oimachi-like boxes, product-level precision, and interaction-led personality without visual costume. |
| 2026-09-07 | Use a one-column stream of equal-height `36vh` project panels beside the fixed identity rail; never exceed 40vh. | Keeps several parts of the practice visible at once, gives the stream a steady rhythm, and avoids both full-screen portfolio slides and a dashboard composition. |
| 2026-09-07 | Use a cool grey-and-white foundation with no beige or cream. | Keeps the always-light interface crisp and lets photography and project colours provide warmth. |
| 2026-09-07 | Use a consistent non-monospace sans for the interface and one curated retro display face for identity and project titles. | Preserves clarity while giving the visual system character without resorting to nostalgic UI costume. |
| 2026-09-07 | Write in cohesive, conversational prose with complete sentences and natural paragraphs. | Keeps the voice substantive and human while avoiding staccato slogans, listicle patterns, and artificial editorial rhythm. |
| 2026-09-07 | Make `BRAND-GUIDELINES.md` the source of truth for identity, voice, and visual character. | Keeps future conversation-based edits and AI-assisted copy aligned with the same durable brand rather than scattered preferences. |
| 2026-09-07 | Initially test Funnel Sans as the foundation typeface and Gloock as the display face. | Established a concrete baseline, but the pairing was reopened after visual review rather than treated as final. |
| 2026-09-07 | Use Cloud `#EEF0F2`, White `#FFFFFF`, Ink `#111317`, and Slate `#5F6670` as the permanent neutral palette, with Brand Blue `#2D29F4` and Vermilion `#D9362B` as restrained accents. | Creates a crisp light foundation with recognisable colour and no beige, while leaving photography and project imagery visually dominant. |
| 2026-09-07 | Use an eight-pixel spacing rhythm, 16px desktop gutters, and no shadows. | Gives the modular interface a disciplined, graphic character without drifting into a soft corporate card system. |
| 2026-09-07 | Use three-pixel Vermilion dashed structural lines with rounded dash caps and 14px corners only as a selective signature. | Keeps the graphic, eccentric quality without making every panel noisy or visually irritating. |
| 2026-09-07 | Reopen the foundation and display typeface selection and compare real webfonts in a controlled browser specimen. | The Funnel Sans and Gloock pairing did not feel sufficiently aligned with Will's taste, and generated lettering would not provide an accurate comparison. |
| 2026-09-07 | Use Funnel Sans as the foundation typeface and Unbounded Regular as the display face. | Funnel Sans keeps prose and navigation lucid, while Unbounded gives the identity the retro-futurist, unconventional silhouette Will responded to. |
| 2026-09-07 | Do not add a third live-text webfont. | Funnel Sans and Unbounded provide enough range, reduce font payload, and keep project variation from weakening the overall identity. |
| 2026-09-07 | Make equal-sized homepage project panels image-led, with distinct internal art direction instead of different solid background colours. | Lets each work express its own identity while the shared exterior rhythm keeps the homepage coherent. |
| 2026-09-07 | Preserve the existing Plantagenet Cherokee logo lettering as outlined artwork rather than a served typeface. | Keeps the established logo while avoiding an unnecessary third font request and unlicensed redistribution of a proprietary font file. |
| 2026-09-07 | Maintain `system/index.html` as the living visual system and pattern library, backed by reusable tokens and written contracts. | Gives future agents and implementations one rendered reference for visual parity instead of relying on prose or memory alone. |
| 2026-09-07 | Require future agents to read the decision, brand, design, content, and system sources before changing the interface. | Makes conversation-based editing durable across tasks and reduces accidental drift or resurrection of superseded directions. |
| 2026-09-07 | Add a controlled rule-breaker layer of irregular silhouettes, coarse pixel edges, rotated notes, asymmetrical overlaps, and tactile interactions. | The orderly system needs purposeful disruption to feel like Will's personal site rather than a clinical technology brand. |
| 2026-09-07 | Preserve the perforated, pointer-responsive holographic contact ticket as a signature interaction. | It is an existing, memorable piece of willchai.com that combines utility, play, and the Brand Blue identity. |
| 2026-09-07 | Recognise `public/logo512.png` as the official compact W mark and set a 14px absolute minimum for live text, with 15px preferred for recurring interface roles. | Carries the established identity into the new system and prevents small counters or captions from becoming needlessly difficult to read. |
| 2026-09-07 | Supersede the preceding logo identification: the current live-site W is preserved at `system/assets/willchai-mark.avif`; `public/logo512.png` is legacy and must not be reused. | Visual review confirmed that the repository icon was the old logo rather than the current identity. |
| 2026-09-07 | Remove the invented blob, rough-note, and pixel-badge demonstrations from the approved system. | They reproduced a generic experimental-design vocabulary rather than feeling personal to Will. Future rule-breaking elements must grow from authentic artifacts or project material. |
| 2026-09-07 | Keep the desktop identity rail fixed and non-scrolling while the document moves through the project stream. | Preserves orientation without introducing a second scroll area or letting the personal identity disappear. |
| 2026-09-07 | Remove explanatory homepage preambles, eyebrow labels, portrait counters, ticket instructions, and the back-to-top footer link. | The interface and content should communicate through hierarchy and interaction instead of redundant labels. |
| 2026-09-07 | Use a large local pixel-cursor artwork as the portrait-change cue. | Makes the interaction obvious while adding a specific coarse-digital interruption without another text badge. |
| 2026-09-07 | Consolidate all films into one homepage panel that opens a dedicated Films page. | Keeps the homepage a curated map of practices rather than a feed of every individual work. |
| 2026-09-07 | Set the homepage project-stream field to Ink while retaining light identity and reading surfaces. | Gives media panels sharper separation without turning the whole identity into a dark theme. |
| 2026-09-07 | Replace corner action labels with a pointer-responsive gravity portal containing “ENTER”; play the portal before navigation on touch. | Creates one memorable, reusable entry behaviour instead of generic card buttons. |
| 2026-09-07 | Remove the Vermilion seam between the identity rail and project stream, omit navigation arrows, and frame each homepage project panel with dashed White. | The black field already separates the two areas; white panel frames make the media rhythm legible without extra directional symbols. |
| 2026-09-07 | Supersede the first gravity-portal rendering while retaining the entry concept. | The colourful CSS vortex looked graphic rather than realistic. The replacement should use a credible event horizon, accretion light, and gravitational distortion. |
| 2026-09-07 | Use a clean, classic pixel-arrow silhouette for the portrait cue and clip the circular portrait cleanly. | The first cursor artwork read as an irregular black shape, and the source portrait exposed black square corners. |
| 2026-09-07 | Adopt the restrained-disk black-hole study as the panel-entry target and make its orientation respond from −20° to +20° across the panel. | The near-black horizon and image distortion feel more convincing when the accretion light is subordinate; pointer-relative tilt and distorted “ENTER” type make the effect responsive without an idle animation loop. |
| 2026-09-08 | Supersede the clipped circular gravity lens with a single full-panel WebGL rendering layer behind all live panel copy. | The circular DOM treatment read as a large cursor, barely distorted the imagery, obscured text, tracked too quickly, and broke when page geometry changed during scrolling. The replacement samples the actual panel image with radial deflection, follows a spring target without edge clamping, refreshes geometry on scroll and resize, and sleeps once motion settles. |
| 2026-09-08 | Remove the black hole's circular photon ring, set “ENTER” in bold tightly spaced Unbounded, and darken non-hovered project panels by 20%. | The unoutlined horizon feels more naturally embedded in the lensing, the label now shares the site's display language, and the temporary veil gives the engaged project a clearer focal hierarchy. |
| 2026-09-08 | Approve the homepage panel and black-hole visual direction as final. | The image-led panels, weighted full-panel lensing, ringless horizon, tightly set Unbounded entry label, and hover focus hierarchy now express the intended upscale, strange, personal character. |
| 2026-09-08 | Remove dashed White frames from homepage project panels and rely on consistent Black gutters. | The repeated dashes add unnecessary visual noise now that the imagery, gutters, and hover dimming establish the panel rhythm clearly. |
| 2026-09-08 | Use Cloud for the full contact section, shorten the sidebar destination to “Contact,” enlarge the sidebar `willchai.com` name to 20px on desktop, and bring the Photography title into the shared Unbounded panel scale. | These changes direct attention toward the White contact ticket, simplify navigation, strengthen the identity lockup, and make Photography feel like part of the same collection rather than a separate hero. |
| 2026-09-08 | Deepen the contact field to `#DFE3E8`, reduce the portrait pointer artwork by 20%, and increase the Photography panel title and descriptor. | The darker contact field improves separation around the White ticket, the pointer no longer competes with the portrait, and Photography regains the intended prominence without returning to a separate visual language. |
| 2026-09-08 | Preserve the contact ticket design while making its handling more physical: clockwise hover rotation, ten-pixel lift, faster pointer tilt, cursor-tracked spectral light, and counter-moving W marks beneath the surface. | The ticket remains recognisable while its shadow, lighting, and subsurface parallax create depth instead of reading as a flat holographic print. |
| 2026-09-08 | Supersede the prototype ticket motion with the original live willchai.com implementation. | The original 0.075 easing, ±20° tilt, 1.1× hover scale, periodic jiggle, click bounce, layered blue foil, noise, and recessed W texture feel better than the redesigned hover-lift treatment. The transplant retains the prototype’s semantic button and reduced-motion support. |
| 2026-09-08 | Darken the contact field to `#CBD2DA`, remove the ticket-stage polygon clip, and split the ticket into an unclipped moving button with a clipped inner foil surface. | The contact section needs clearer separation from the 320px White identity rail, while the ticket must be free to scale and rotate without its silhouette or holographic layers being cut off. |
| 2026-09-08 | Preserve the live ticket motion while replacing its permanent visible-state animation loop with event-driven frames and a timer-driven idle jiggle. | The ticket keeps the same easing, scale, tilt, bounce, and three-second jiggle at full quality, but stops requesting frames once it settles and only reserves a compositor layer while it is moving. |
| 2026-09-08 | Restore the ticket-stage polygon while keeping the animated button and clipped foil surface separated. | The irregular stage is an intentional part of the contact composition; its generous dimensions allow the ticket to rotate without reintroducing the card-level clipping problem. |
| 2026-09-08 | Keep the formal suit portrait as the default and replace the former single alternate with three user-provided photographs from the CFMU studio, public transit, and OFFA. | The portrait control should reveal a broader, more personal set of real contexts while always returning to the established formal identity image. |
| 2026-09-08 | Keep only the default portrait circular, show the three candid alternates as square crops, and simplify the introduction to “I'm a student, a maker, and a storyteller.” | The shape change makes the formal default distinct while letting the candid images retain their photographic character; the shorter line is the approved current introduction. |
| 2026-09-08 | Add a dedicated Projects panel after Films, link it to `/projects/`, and expand the sidebar to Photography, Films, Projects, Objects & experiments, Linkedin, and Contact. | The homepage now exposes the broader project archive—including games, tools, and communities—without displacing the existing featured work. |
| 2026-09-08 | Set the contact invitation to “Let's go do something.”, remove its supporting paragraph, restore the stage as a visible lighter-grey polygon, and add a subtle hover-only ticket shadow. | The shorter invitation and visible stage improve hierarchy, while the shadow gives the ticket lift and fully disappears when the object settles back into the stage. |
| 2026-09-08 | Supersede square alternate portrait crops with each photograph's native aspect ratio while retaining the circular formal default. | The candid radio, transit, and OFFA photographs should preserve their original compositions instead of being forced into a square frame. |
| 2026-09-08 | Lighten the contact field to `#D5DBE2`, lighten the ticket stage to `#E9EDF0`, and give the stage a visibly irregular six-sided silhouette. | The two cool greys retain their hierarchy while making the contact ending feel lighter; the additional angled side prevents the stage from reading as a conventional rectangle. |
| 2026-09-08 | Make Photography 25% taller than the standard project card, double the inter-card gap, and replace its flat-feeling tint with a layered directional gradient. | Photography gains the requested hierarchy while the larger breathing room and gradient improve the rhythm and preserve image clarity behind readable copy. |
| 2026-09-08 | Remove Waterbear as a standalone homepage card and represent it as “Watchmaking” inside a triangular-grid Projects panel. | Watchmaking belongs within the broader project archive, reducing homepage duplication while making the Projects destination more representative. |
| 2026-09-08 | Standardise sidebar capitalization as Photography, Films, Projects, Objects & experiments, LinkedIn, and Contact. | Correct brand and destination casing makes the navigation feel finished and consistent. |
| 2026-09-08 | Render the Projects triangular grid as the panel's sampled image layer rather than a CSS background. | The black-hole shader can now gravitationally distort the grid with the rest of the card instead of leaving it visually detached above the effect. |
| 2026-09-08 | Launch with twelve public pages, one substantial Photography page, and all branching within Films and Projects. | The structure gives selected work enough context while keeping maintenance and primary navigation manageable. |
| 2026-09-09 | Present Photography as a long uncategorized sequence with ten to fifteen captioned featured photographs, commercial information, a caption free shuffle, and the complete footer. | The sequence gives the photographs room, keeps individual identities available in small captions, and preserves the broad visual range without asking visitors to choose a category. |
| 2026-09-09 | Prioritize a beautiful Photography page with comfortable browsing and useful paths to portrait and event inquiries. Review the complete visual proposal with provisional photographs and captions. | Success means visitors can enjoy the work, understand the service, and contact Will. Image selection, captions, organization selection, and exact rates remain open. |
| 2026-09-09 | Continue exploring the Photography composition around beauty and an inviting commercial experience. Develop a personal pixel character using four simple 32 × 32 drawings over four seconds. | Will chose an animated character as his personal presence on this page. The character arrives, prepares the camera, takes a photograph, and settles. The artwork study and its eventual placement remain available for review. |
| 2026-09-09 | Approve the six colour pixel photographer and its four second entrance. Use the character beside the Photography title. | The four 32 × 32 poses play once on entry and hold the resting pose. The approved artwork gives the page a personal detail while the broader visual composition continues through review. |

| 2026-09-09 | Develop Photography around overlapping photographs, scroll driven stacking, a reversible contact sheet, and an expanded image view. Connect the booking section through a photograph crossing its boundary and revealing the existing ticket. | Will approved this direction after discussing beauty, movement, and comfortable exploration. The four second pixel entrance remains approved. Photograph selection, captions, organization selection, and exact rates remain provisional. |

| 2026-09-09 | Adopt a short sideways featured passage, compact image spacing, direct homepage return, and brief enlarged character appearances. Give pricing an arcade inspired shoot builder revealed by Will pushing a decorative Gold tier card off a ledge. | Will requested a warmer page with the homepage pointer and irregular shapes. The $600 amount is a theatrical prop. Actual rates await pricing rules. Incoming shuffle images fill continuous columns. |

| 2026 09 09 | Refine Photography with composed desktop resting positions, a directly swipeable phone strip, and a larger character entrance beside the title. Reveal gallery images once and align organization marks by visible artwork. | The movement supports comfortable viewing and preserves the visitor's place. |
| 2026 09 09 | Make the shoot card editable through its name, category and optional CAD budget. Provide email, inquiry copy, address copy and an optional unfolding preview. Move scheduling details into the email. Keep actual pricing private and remove the numerical amount from the Gold tier prop. | The visitor can prepare a personal inquiry and use their preferred email or messaging service. |
| 2026 09 09 | Use the approved script cleanup of the generated pushing poses to produce a transparent six colour atlas. Align feet at logical y28 and contact palms at x25. | The character can brace against the card, push it to the ledge and recover after the fall. |

| 2026 09 10 | Restore the white shoot board within its irregular blue enclosure. Keep an editable title and two questions at a time, with Next advancing to optional details and the completed inquiry. Preserve the pushing poses and choreograph the pointer around a shared grip point. | Will preferred the earlier board and asked for a simple progression. The current revision is prepared for visual review. |
| 2026 09 10 | Present the featured work in three scroll chapters with consistent viewing areas and complete image proportions. Let the opening character duck behind the featured boundary. Add reference selection inside the photograph viewer for both collections. | Scrolling advances the photographs, the character has a physical connection to the page, and selected image links can accompany an inquiry. |

| 2026 09 10 | Explore the supplied Jitter motion references through a horizontal featured strip, a brief photographic composition, and bounded stretch transitions. Combine the opening identity link and simplify its booking action. Let Will recover after the shove and duck behind the blue frame. | The visitor controls browsing, images settle into complete proportions, and the character finishes within his own scene. The revision is prepared for visual review. |

| 2026 09 10 | Replace the featured strip with nine approved public portfolio photographs in an Orbit Cards sequence driven by native vertical scroll. Keep the movement on mobile and use a caption free featured presentation. | Will selected the existing public Photography page as the image source, specified nine photographs, and approved the diagonal movement from lower right to upper left. |
| 2026 09 10 | Present credibility through three client cards for McMaster University, Foxwood Homes, and Platinum Moon. Use the shared site header and remove the annotated duplicate actions, helper lines, counters, and booking shortcuts. | The page keeps its personal interactions while the featured work, client proof, and inquiry path become easier to read. |
| 2026 09 10 | Give McMaster University twice the visual area within the client proof and use the existing performance photograph as its image. Present Foxwood Homes and Platinum Moon as smaller transparent entries. Animate the composition through a staged entrance and gentle photograph drift. | McMaster carries personal importance because Will studies, works, and photographs there. The visual hierarchy reflects this relationship. |
| 2026 09 10 | Use a compact Photography header with the Will Chai identity and Contact. | The page opens directly into the photography experience while the identity link provides the homepage route. |
| 2026 09 10 | Stabilize the featured sequence during phone scrolling and place the opening character in a collection level stage following the first photograph. | Mobile browser chrome may resize during a gesture. Stable measurements preserve scroll progress, while the separate stage keeps the complete character greeting visible above incoming cards. |
| 2026 09 10 | Present McMaster University, Foxwood Homes, and Platinum Moon in one animated Will Chai collaboration composition. Keep all three visible in the settled frame and retain the larger McMaster position. | The shared composition connects credibility to the playful homepage identity and gives visitors time to read every relationship together. |
| 2026 09 10 | Use $600 as the sole public pricing anchor inside an eight second departing package scene. Keep internal pricing thresholds private and quote each assignment after reviewing its scope and submitted budget. | One public amount guides budget expectations while the builder explains the factors shaping a personal quote. |

| 2026 09 10 | Build the Films chooser and its two detail pages around original stills, overlapping poster artwork, personal production accounts and direct viewing actions. Connect the selected image to its detail page and open trailers in a dismissible player. Include the original press kits and screening contact links. | Will asked for the next page to receive a complete implementation and production readiness pass. The composition and motion are available in the private preview for his review. |
