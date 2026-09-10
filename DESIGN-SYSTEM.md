# willchai.com — Visual Direction

This is the current visual source of truth. It describes the system closely
enough to prototype while leaving project imagery and final typography room to
be art-directed in context. It implements the visual character established in
`BRAND-GUIDELINES.md`; lasting changes to the identity should be reconciled in
both documents.

## Direction

**A playful personal instrument.** The site should feel like a beautifully
designed workspace for one person's interests and work: orderly, light,
modular, intelligent, and subtly unusual. Its structure can be calm without
making the personality corporate.

The interface is not a literal operating system, laboratory, magazine, or
archive. It borrows the clarity and confidence of good software without using
a costume or nostalgic UI metaphor.

## Locked decisions

- The default and only colour mode is light.
- The homepage uses orderly boxes on a disciplined grid.
- The right side is a vertical stream of self-contained panels, not a dashboard
  grid and not a hero-led landing page.
- Standard desktop project panels share a `36vh` height and are never taller
  than `40vh`. Photography is the deliberate hierarchy exception at 25%
  taller (`45vh`, capped at `30rem`). Inter-card gaps are twice the base gutter.
- Homepage project panels are image-led rather than differentiated by solid
  colour fills. Their exterior geometry stays consistent while their internal
  art direction reflects the work.
- The homepage project panels and black-hole entry treatment are approved as
  the final visual direction. Refine content within this grammar rather than
  reopening the interaction as a new visual concept.
- Interface references are subtle: tabs, status marks, counters, and controls
  should feel native to the site rather than imitating an existing product.
- Photography and project imagery supply most of the colour and visual
  richness.
- Retro character comes from typography, proportion, flat colour, and small
  interactions—not from beige, faux ageing, or imitation computer chrome.
- Personality comes from interaction, composition, copy, Will's images, and an
  authentic exception layer whose visual vocabulary remains to be developed,
  rather than from a uniform decorative skin.
- The layout remains a normal, accessible document scroll.

## Canvas and colour

- Use a cool, very light grey canvas with crisp white modules. Beige, cream,
  parchment, and other warm paper neutrals are not part of the foundation.
- Identity and text modules may be white; homepage project panels are
  image-filled.
- Core interface colours are near-black text, soft-grey structure, and white.
- Each project may nominate one accent colour derived from its imagery. Do not
  create a permanent rainbow of section colours.
- Avoid dark-mode expanses, warm paper effects, general grain overlays,
  gradients, glassmorphism, and faux-print distress. The holographic contact
  ticket is the documented exception. A realistic gravitational-lensing effect
  is the approved second bounded exception; neither treatment becomes a
  static background language.

Core colour tokens:

| Token | Value | Use |
| --- | --- | --- |
| Cloud | `#EEF0F2` | Page background and gutters |
| Contact Field | `#D5DBE2` | Homepage contact-section field |
| Ticket Stage | `#E9EDF0` | Irregular six-sided field behind the contact ticket |
| Panel | `#FFFFFF` | Text and identity modules |
| Ink | `#111317` | Primary text and controls |
| Slate | `#5F6670` | Secondary information |
| Brand Blue | `#2D29F4` | Links, focus, and primary brand accent |
| Vermilion | `#D9362B` | Structural lines and editorial accent |

Use white text on Brand Blue and Vermilion. Ink is the default traditional
highlight and emphasis colour; there is no additional playful highlight hue.
Project-derived colours may appear in small details when their text pairing has
been checked for contrast, but homepage panel backgrounds remain image-led.

## Homepage composition

Desktop uses a stable identity rail at left and a wider scrolling panel stream
at right. The rail occupies roughly 28–34% of the viewport. The stream is one
column by default, with a narrow consistent gutter between panels. The rail is
fixed to the viewport, never scrolls independently, and never displays a
scrollbar; the document itself remains the sole scroll container.

The opening viewport should contain:

1. **Identity module:** changeable portrait, name, one-line premise, and a
   small invitation to reveal another side.
2. **Navigation module:** Photography, Films, Projects, Résumé, and Contact.
3. **Project stream:** two or three short panels visible at once, establishing
   immediately that the page is meant to be browsed rather than presenting one
   dominant hero.

Each panel owns one destination or idea. Desktop project panels use the same
`36vh` exterior height and aligned gutters. Variety happens inside the panel
through image choice, crop, sequencing, embedded project artwork, type
placement, and interaction—not through different solid fills, arbitrary sizes,
a corporate card grid, or masonry. On mobile, project panels share a `4 / 3`
aspect ratio rather than a viewport-relative height.

Films share one homepage panel and lead to a dedicated Films index. On mobile,
the identity rail becomes a compact opening/header and the same panels continue
as one vertical sequence.

The public structure contains one Photography page, one Films chooser with two
film pages, one Projects chooser with four project pages, and one Résumé page
with PDF and HTML formats. The homepage carries the main contact invitation.
Photography carries its own inquiry area, while other pages may close with a
compact contact invitation. `/hey/` remains a branded utility page outside the
primary navigation.

## Module grammar

Use a small repeatable family:

- **Project media module:** edge-to-edge photo, film still, project artwork,
  interface capture, object detail, or silent loop with minimal overlay.
- **Text module:** one idea, generous padding, no long homepage paragraphs.
- **Index module:** compact list of projects or categories with a clear active
  state.
- **Utility module:** contact, current status, counter, or small control.
- **Identity module:** portrait cycler and introduction.

Homepage project panels are unframed and separated by consistent Black gutters
against the Ink work-stream field. Light reading modules outside the stream may still use the Cloud canvas.
Vermilion dashed structure remains available elsewhere as a selective accent,
but it does not divide the homepage rail from the work stream. Avoid inset
cards, containers inside containers, icon-led navigation, oversized pills,
shadows, and floating card stacks.

Every homepage project panel begins with real project media. Its treatment may
be a quiet full-bleed photograph, an assertive crop, a contact-sheet sequence,
a film frame, a close object study, or artwork already belonging to the
project. Titles may shift position and scale within the shared geometry. Do not
apply one global colour grade, invented texture, or uniform overlay to make
unrelated projects look the same. Place text in an area with natural contrast;
when the image cannot support it, use a compact opaque White or Ink label rather
than covering the whole panel.

## Avoiding the corporate feel

- Do not give every panel the same internal template.
- Do not use dashboard iconography, KPI-like labels, availability badges, or
  polished stock-product copy.
- Navigation is plain text with expressive states, not a stack of app buttons.
- Allow bolder crops, surprising alignment, dry or playful microcopy, and
  project-specific type scale within the stable outer panel geometry.
- Prefer direct photography and project imagery to white cards, solid-colour
  panels, or repeated borders.
- The sidebar should feel authored and personal rather than like an account or
  profile menu.

## Typography

Typography carries much of the retro character without turning the site into a
period piece. **Funnel Sans** is the foundation face for body copy, navigation,
captions, counters, controls, and small headings. Use weight 400 for reading,
500 for recurring interface elements, and 600 only for firmer hierarchy.

**Unbounded Regular** is the display face for major page titles, selected
project titles, and occasional short lines. Its width is part of its character,
so do not use it for paragraphs, metadata, controls, or long positioning copy.
Project pages use the same two-family live-text system rather than adding their
own typefaces. Monospaced type is not used for recurring roles.

Self-host Latin-subsetted WOFF2 files and preload only the Funnel Sans file
needed for initial reading content. Unbounded should load without blocking
meaningful text and use a broad sans-serif fallback. Use sentence case by
default; all caps are limited to very short functional markers.

Working type roles:

| Role | Typeface | Size and line height | Notes |
| --- | --- | --- | --- |
| Display | Unbounded 400 | `clamp(2.4rem, 5.5vw, 6.5rem)` / `0.95` | Major page or short project title only |
| Heading | Foundation 500 | `clamp(1.75rem, 3vw, 3rem)` / `1.05` | Section and panel heading |
| Lead | Foundation 400 | `clamp(1.2rem, 1.8vw, 1.6rem)` / `1.35` | Short introduction |
| Body | Foundation 400 | `1.0625rem` / `1.5` | Default prose, about 17px |
| Interface | Foundation 500 | `0.9375rem` / `1.2` | Navigation, counters, and controls |
| Identity name | Foundation 600 | `1.25rem` desktop, `1.125rem` narrow / `1.2` | `willchai.com` beside the compact W mark |
| Caption | Foundation 400 | `0.875rem` / `1.4` | Minimum size; credits and image context |

Keep prose measures between 48 and 68 characters. Unbounded may use tracking
between `-0.02em` and `-0.04em` at large sizes, but it must never be compressed
or artificially condensed to fit. Paragraph spacing remains natural and
readable.

No live text is smaller than `0.875rem` at the default browser scale. Use
`0.9375rem` for section numbers, navigation, and recurring interface metadata
whenever space permits rather than shrinking text to solve a layout problem.

The current blue W in `system/assets/willchai-mark.avif` is the official compact mark and may
be used for site identity, icons, and the contact ticket texture. The logo also
retains its existing Plantagenet Cherokee lettering as outlined SVG artwork.
Do not declare Plantagenet in CSS, ship the font file, or depend on it being
installed on the visitor's device. The SVG should contain paths rather than
editable font text, include an accessible “Will Chai” name, and preserve a
separate editable master outside the public asset folder.

## Spacing, shape, and focus

Use the spacing scale `4, 8, 12, 16, 24, 32, 48, 64, 96`. Desktop canvas
gutters are 16px and narrow-screen gutters are 12px. Default panel padding is
24px on narrow screens and 32px on desktop, with 48px or 64px reserved for
deliberately sparse compositions.

Modules have no structural shadow. Homepage project panels are unframed against their Ink
field and rely on the shared gutter for separation. Elsewhere, reserve the 14px, three-pixel Vermilion dashed
boundary for a current selection or occasional featured frame. The portrait may
use a larger rounded-rectangle or oval crop. The homepage portrait set is a
specific exception: only its formal default is circular, while the three candid
alternate photographs preserve their native aspect ratios with square corners.

Keyboard focus uses a two-pixel Brand Blue outline with a three-pixel offset. Draw
simple arrows, rules, counters, and geometric marks with CSS or small SVGs; do
not add a general icon library for these details.

## Signature interactions

The wow factor comes from a few quiet behaviours:

- **Portrait cycler:** clicking, tapping, or pressing the portrait crossfades
  to another authentic image. A pixel-stepped pointer artwork, reduced to 80%
  of the original study, makes the affordance clear without competing with the
  face or requiring an instruction label or count. The homepage sequence begins
  with the formal suit portrait, then cycles through the CFMU studio, transit,
  and OFFA photographs before returning to the default. Keep only the formal
  default circular; the three alternates use square corners and their native
  aspect ratios.
- **Black-hole entry:** hovering or focusing a project panel activates one
  full-panel rendering layer beneath its live copy. A near-black event horizon
  without a circular photon ring, a thin warm accretion trace, and radial sampling of the panel's own media
  produce the lensing; do not simulate it with a clipped circular magnifier.
  “ENTER” belongs inside the same rendering in bold, tightly spaced Unbounded
  and receives a coherent optical curve rather than noisy per-letter
  displacement. While one panel is hovered with a fine pointer, place a 20%
  Black veil over every other project panel. Horizontal pointer position
  maps the disk's orientation from roughly −20 to +20 degrees, while a damped
  spring makes position changes feel heavy. Touch activation plays a short
  version at the tap position before navigation, while reduced-motion leaves
  the semantic link direct.
- **In-place expansion:** opening a panel may smoothly transition into the
  project view while preserving a clear back path.
- **Responsive composition:** modules reorganize deliberately at breakpoints;
  they do not simply shrink.
- **Holographic contact ticket:** a native button with perforated edges tilts
  up to ±20 degrees towards a fine pointer and scales to 1.1× on hover using
  the live site's original 0.075 easing. It gives a short horizontal jiggle
  every three seconds while visible and idle. Activation reveals the original
  layered blue foil and noise, bounces the ticket, copies the email address,
  and confirms the action in its subtitle. Touch and keyboard activation
  receive the same confirmation without requiring pointer tilt. A subtle
  drop shadow appears only while the ticket is hovered or keyboard-focused and
  vanishes as the ticket returns to its lighter-grey polygon stage.

Motion uses 160ms for interface responses and 360ms for image transitions.
Movement is normally limited to opacity, crop, colour, or a translation no
larger than eight pixels. The ticket's bounded three-dimensional tilt and click
bounce and the black hole's short optical distortion are explicit exceptions.
The renderer is instantiated lazily, reuses one WebGL canvas, updates only
shader uniforms during motion, and stops requesting frames once its spring has
settled. It remeasures the engaged panel after scroll and resize rather than
retaining stale viewport coordinates. Slow-update displays, unavailable WebGL,
and reduced-motion mode omit the rendering layer. No continuous floating,
parallax, scroll-jacking, custom cursor replacement, or decorative loading
sequence. The pixel pointer beside the portrait is an illustrated affordance,
not a replacement for the system cursor.

The ticket uses the same event-driven principle: request animation frames only
while tilt, scale, jiggle, or bounce is converging, then stop completely. Its
three-second idle jiggle is timer-driven, and compositor promotion is applied
only during movement. The moving button remains unclipped; a nested surface
owns the perforated clip and holographic layers so rotation and scale cannot be
cropped by the card. The surrounding stage retains its large irregular polygon
mask as part of the contact composition, with enough internal space for the
full ticket rotation.

## Authentic exceptions

The modular grid is the baseline, not the entire personality. Each major view
may eventually contain one dominant exception that behaves like a found object
or an authored interruption. The exact visual grammar is not yet approved.
New exceptions should be derived from Will's real objects, images, artwork,
handwriting, or project processes rather than generic experimental decoration.

Do not turn the exception layer into a library of decorative stickers, blobs,
or pixel badges. The ticket perforation is confirmed for contact; other
irregular shapes, coarse digital treatments, and overlapping elements remain
exploratory until reviewed with authentic source material. Calm modules should
surround approved exceptions so they remain surprising.

The holographic treatment is reserved for the contact ticket. Its colour stays
within Brand Blue, deep blue, White, and Ink rather than becoming a generic
rainbow foil. The repeated texture uses the official W mark and counter-moves
under the face through three-dimensional rotation and a −120px Z translation.
Pointer position controls tilt and the spectral light source, while click,
tap, or keyboard activation reveals
the foil briefly and confirms that `me@willchai.com` was copied. Reduced-motion
mode removes tilt and bounce but preserves the colour change and confirmation.

### Photography character

Photography opens with a linked Will Chai name, the Photography title, a short
portrait and event description, and a single booking link. Featured photographs
form a native horizontal strip with close spacing and complete image proportions.
The next photograph remains partly visible. Previous and Next move the strip,
while View together exposes the full collection. Keyboard arrows, Home and End
operate the focused strip. Vertical document scrolling remains native.

Will supplied Jitter references for Orbit: Social Media Showreel, Share Your Work,
and Image Stretch Transition. The current study gathers the visible photographs
into a brief overlapping arrangement, then opens them into the strip. Horizontal
movement produces a bounded elastic response. Opening and changing a photograph
uses a directional image stretch and masked reveal. Each image returns to its
native proportions at rest. Movement ends when browsing settles, and direct
interaction can finish the introductory composition immediately.

The opening character emerges from the lower edge of the first photograph after
the collection settles, takes a photograph, and ducks behind the edge. The four
second greeting uses the approved four poses and integer enlargement. The later
appearance retains the approved pushing poses. A blue rim joins the enclosure
sides beneath the Gold tier prop. Will pushes the panel past the edge, recovers
his stance, pauses, and ducks vertically behind the rim. The scene stays opaque
until his exit is complete, then reveals the board. The prop reads Standard
event package. Direct inquiry links and form interaction reveal the usable board
immediately. Replay remains available.

The white shoot board retains its irregular blue enclosure. An editable shoot
name stays above two questions about place and date. Next reveals an optional
CAD budget and additional notes, then the completed inquiry with Open email and
Copy text. Back preserves every answer. The rough pointer accompanies Next and
responds briefly to a press. A directional mask exchanges the question pair while
the title and photographic preview stay anchored. Supplied amounts are labelled
Your budget, and visitors may request guidance. Actual fees are quoted personally.

An opened photograph offers Add reference across the featured work and shuffle.
Selections appear on the shoot board and remain removable. Their image links
appear in the same generated message used by email and copying. Collection
headers provide a return to the shoot when references are selected. Clipboard
failure selects the message for manual copying. Inquiry contents stay in the
current page.

Organization marks retain their measured artwork sizing. The shuffle reserves
image dimensions and fills continuous columns while preserving earlier positions.
The footer retains the original contact ticket, policy, rights and homepage return.
Reduced motion presents the contact sheet, direct image changes and usable builder.
The composition is prepared for visual review. Photograph selection, captions,
organizations and actual pricing remain provisional.

The production reference is `system/photography-stack.html`. The Gold tier
prop uses the bounded `--wc-pricing-prop-gold` token. Its four second sequence
uses `--wc-duration-scene`. The enclosure derives from the homepage portrait
and ticket geometry, while controls retain Funnel Sans and selected headings
use Unbounded. Gold is specific to the departing prop.

JavaScript readers convert duration tokens from seconds or milliseconds into
milliseconds before starting an animation. The production stylesheet may
express 4000ms as 4s. Verify the greeting and field transition against the
production build when changing their timing.

## Current Photography composition

The current Photography composition uses the shared site header, a vertical
featured sequence, and a compact direct inquiry. Featured photographs retain
their source order and complete proportions, while captions use Funnel Sans.
Selected organization marks appear together as visual proof. The inquiry
collects Event name, Where?, and When? before starting an email draft. The
pixel photographer remains an available future direction while the primary page
composition settles through review.

## Films and Projects

Films and Projects are the two chooser destinations. Their individual work
pages share the interface system while allowing crop, media sequence, title
placement, and internal composition to respond to each work. Shared
navigation, typography, and contact endings keep the pages related.

The Films chooser pairs two substantial stills with the original poster artwork
overlapping a lower corner. The second entry begins slightly lower on desktop;
phone layouts read in one column. Titles and director credits sit beneath each
image. A shared image transition connects a selected entry to its film page.
The poster settles on hover or keyboard focus. Trailers open in a white dialog
through a brief masked expansion. These movements follow visitor actions.
Reduced motion presents each destination directly. All dimensions, typography,
colour and timing derive from the shared token system.

Film detail pages retain the leading image, synopsis, production account,
original poster, two supporting stills, principal credits and festival record.
Press kits and screening inquiries appear alongside viewing actions. A compact
link to the other film follows the record. The shared ending uses the existing
contact invitation and email address.

The Résumé uses the same reading system with restrained formatting suited to a
professional record. The PDF appears first through view and download actions,
and the HTML version follows with matching facts. The `/hey/` utility page may
compress the brand into a small link collection while preserving type, colour,
focus, and spacing rules.

## Explicitly avoid

- Dark cinematic archive styling
- Vintage paperwork, specimen labels, or clinical imagery
- High-fashion collage for its own sake
- Faux operating-system windows or literal desktop chrome
- Giant typography covering the work
- Uniform template cards
- Heavy WebGL or animation used only as spectacle
- Making every element eccentric; the unusual parts need calm surroundings

## Reference lessons

- **Oimachi:** orderly boxes, mixed content density, stable interface with
  changing media, and calm navigation.
- **Illoca:** restraint and subtle system cues.
- **Dia:** polished human imagery inside approachable software chrome.
- **Legwork:** media can carry the personality while controls stay plain.
- **Cosmos:** lightness, whitespace, and product-level precision.
- **dAppBoi and Defrag98:** one committed idea is more memorable than many
  decorative effects; borrow the conviction, not the literal style.
- **Maria Vasilyeva:** interaction can reveal a body of work as a system; keep
  our geometry orderly rather than spatial and freeform.
