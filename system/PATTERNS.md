# Pattern contracts

These contracts define the reusable structures demonstrated in
`system/index.html`. They describe behaviour and content rather than a specific
framework API. When the Astro rebuild begins, production components should
implement these contracts and retain stable, descriptive names.

## Identity rail

The identity rail establishes Will as the person connecting the work. It
contains a portrait or portrait control, the name, the durable positioning
line, primary navigation, and the general collaboration route. On desktop it
remains visible beside the project stream; on mobile it becomes the compact
opening section and does not remain fixed.

The portrait crop and supporting line may change, but the rail must never
become a résumé, account menu, or collection of status badges. Its navigation
uses semantic links, retains a visible focus state, and remains fully usable
without portrait interaction or JavaScript.

## Portrait control

The portrait control reveals a small, curated sequence of authentic portraits.
Its first image must establish identity without interaction. A visible cue and
position count communicate that it can be activated. Clicking, tapping, or
pressing the control advances one image and updates its accessible name or
status.

Every portrait needs accurate alternative text. The control must use a native
button, preserve keyboard focus, and honour reduced-motion preferences. Images
are pre-sized to prevent layout shift; only the first is loaded eagerly.

## Project media panel

The project media panel is the homepage's primary route into one selected body
of work. Desktop instances share a height of `36vh` and never exceed `40vh`;
mobile instances share a `4 / 3` aspect ratio. Every instance begins with real
project media and has one destination, title, primary form, and optional short
context line.

Image choice, crop, media sequence, embedded original artwork, title placement,
and preview behaviour may vary. Exterior dimensions, gutters, focus treatment,
type families, and navigation behaviour remain fixed. Do not create identity
with a solid category fill, a global colour grade, a new font, or an unrelated
decorative texture. Text should occupy naturally quiet image space or a compact
opaque White or Ink label.

The entire panel may be one semantic link when it has one destination. Hover is
optional enhancement; the title and destination remain clear on touch and
keyboard input. Reserve media dimensions, serve responsive formats, and avoid
autoplaying heavyweight video.

## Black-hole project entry

The black-hole entry is the shared enhancement for homepage project panels. One
full-panel WebGL canvas sits above project imagery and below every live title or
description. It samples the engaged panel's own media to create radial optical
deflection around a near-black event horizon, adds only a thin warm accretion
trace, and draws bold, tightly spaced Unbounded “ENTER” inside the same
rendering. There is no circular photon ring, separate round lens element, or
chromatic fringe. A damped spring follows a fine pointer
without clamping the centre away from the panel edges. Horizontal distance from
the panel centre maps the disk orientation from approximately −20 to +20
degrees; vertical movement positions the effect without adding a second tilt
axis.

While a fine pointer hovers one panel, every other project panel receives a 20%
Black overlay. Apply the veil to the complete non-active panel so its image and
copy recede together; never dim the active panel or make this a persistent
category state. Touch layouts omit the hover hierarchy.

The link remains semantic and complete without the effect. Create the renderer
only after a panel is first engaged, reuse its one canvas between panels,
schedule updates at most once per animation frame, and stop rendering when the
spring settles. Refresh panel geometry during scroll and resize. On touch, play
a short version at the tap location and then follow the destination. Keyboard
focus uses a centred, level version. Reduced-motion preferences, slow-update
displays, and missing WebGL leave navigation direct and omit the enhancement.
The restrained light trace must not grow into a colourful portal, galaxy,
general-purpose glow, or bright uniform outline.

## Project chooser row

A project chooser row gives a useful older work a compact place on `/projects/`.
It requires a title, year or durable time label, primary form, and suitable
destination. A role, collaborator, small preview, or external site marker may
be added when it provides useful context.

The row remains one semantic link with a visible focus state. Its title and
essential context are present without hover. Narrow layouts may hide secondary
metadata but not the project title or destination.

## Project detail opener

The project detail opener establishes what the work is before beginning its
story. It requires a project title, primary form, durable date, leading media,
and a concise description. Will's actual role and important collaborators must
appear near the beginning rather than being buried in end credits.

The relative placement of title, media, and metadata may respond to the work.
The opener must not introduce a new sitewide typeface, duplicate the homepage
panel, or turn project context into an unexplained pile of labels. Leading
media has explicit dimensions, accurate alternative text, and a deliberate
mobile crop.

## Media and caption

Media and captions carry the evidence of a project. A media item requires an
appropriate source, explicit dimensions, meaningful alternative text or an
empty alternative when decorative, and a caption when the relationship to the
story is not self-evident. Captions explain what matters about the image rather
than merely restating what is visible.

Still images use responsive sources and load lazily below the opening view.
Video requires a poster image and controls, and must not autoplay with sound.
Dialogue or essential audio requires captions or a transcript. Third-party
players are deferred until requested when their initial cost would burden the
page.

## Role and credits

Role and credits distinguish authorship from participation. The pattern names
Will's specific contribution, collaborators, client or commissioner when
relevant, and any durable production facts needed to understand the work. It
must never imply sole authorship of collaborative work.

Short credits may sit near the project opener. Longer credits belong in a
structured section later on the page. Names and roles remain readable text,
not text baked into an image, and external collaborator links are visibly
identified without interrupting the project narrative.

## Photography service information

Photography service information belongs within one long page retaining the
site's personal voice. The page uses a caption free sequence of nine approved
featured photographs, three selected client cards, a shoot builder, and a photography
specific inquiry action. Availability, location, and delivery information
appears when it is current and useful.

The featured order and photographs may change. Editorial transitions keep the
uncategorized sequence continuous. A caption free shuffle follows the
commercial information and loads in controlled batches before the complete
service footer. Photographs remain the primary visual material, the inquiry
action stays outside any lightbox, and client privacy or publication
permission must be confirmed before use.

Photography uses a compact site header with the shared identity mark and Contact,
the Photography title, and a short
portrait and event description. Nine featured photographs move through a sticky
viewport while ordinary vertical scrolling advances the sequence. Cards enter
from the lower right, reach the centre at full scale, then leave through the
upper left. The complete image proportions remain visible on desktop and mobile.

The movement draws from Will's Orbit Cards reference. A small arc, rotation, and
scale shift give nearby cards depth. Each card remains a keyboard reachable link
in source order, and focus centres the selected card. Reduced motion presents a
static responsive grid. Opening a photograph preserves the established viewer,
directional image changes, and reference selection.

The opening character rises through the upper edge of the first photograph after
the collection settles and stands on its top boundary. A separate stage follows
the first card above the incoming stack. Phone viewport height changes preserve
the current geometry during active scrolling. The four second greeting uses the
clean arrive, ready, and rest poses from the approved atlas at integer
enlargement. The later
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

Open `photography-stack.html` for the production interaction study.

Photography uses a shared responsive gutter across the page. The gallery fits
within the opening viewport and reserves room above the first photograph for
Will. Client spacing keeps the settled group together. The white shoot board
and its blue outline share the irregular silhouette. Each form step uses its
visible content height, with a measured transition between questions. The
primary action follows the fields and becomes Open email on the final step.
The departing package uncovers the board during the shove. The scene height
settles into the board height as the movement ends. Empty summary details stay hidden
until the visitor supplies them. The policy and replay controls share a row,
and the shuffle ends with a centred Load more photographs action.

Each fresh Photography page load plays the opening greeting and randomizes the
shuffle. The explicit Shuffle action gathers four photographs into two piles,
weaves them into one deck, and deals the new selection into the gallery over
1100ms. The character uses the clean photographer atlas while the pricing scene
retains the pushing atlas. The gallery settles immediately for reduced motion or an interrupted
sequence. Additional batches preserve the chosen order. Featured image offsets
respond to the dimensions of adjacent photographs.

## External project handoff

An external handoff is used when a project has a substantial independent site,
application, publication, or repository. It explains what the destination is
and visibly indicates that the visitor will leave willchai.com. The surrounding
project context remains available on this site so the external link is not a
substitute for an accessible description.

Open external destinations in the current tab by default. Do not depend on a
live external embed for core understanding, and periodically verify that
outgoing links still resolve.

## General contact invitation

The general invitation uses “Let's go do something.” and welcomes
multidisciplinary collaboration. On the homepage it pairs the heading directly
with one specific contact action; no supporting paragraph is required.
Other pages may use a compact version as their ending. Contact stays within
existing page contexts.

## Photography inquiry

The photography inquiry appears within the Photography page and gives
prospective clients a direct route for Portraits, Events, or Creative work. It
asks only for the details required to understand and respond to a shoot. If a
form is introduced, every field must earn its place, expose a real label,
describe errors clearly, and document how submitted information is retained.

## Holographic contact ticket

The contact ticket preserves one of the most distinctive interactions from the
existing willchai.com. It presents `me@willchai.com` and “don’t be a stranger”
inside a perforated ticket shape. A fine pointer tilts the object towards the
visitor by as much as ±20 degrees while the card eases to 1.1× scale. When
visible and idle, it gives a brief horizontal jiggle every three seconds. The
spectral highlight follows the pointer, and the repeated official W marks sit
on a rotated layer translated −120px behind the face. Clicking, tapping, or
pressing it reveals the layered blue foil and noise, bounces the ticket, copies
the email address, and replaces the subtitle with a clear confirmation.

The ticket must be a native button or an equivalently semantic control with a
useful accessible name. Clipboard failure must not hide the email address.
Touch and keyboard users receive the same confirmation without needing hover,
and reduced-motion mode removes three-dimensional tilt and bounce while
retaining the colour response. Keep the holographic gradients and repeated W
texture specific to this component rather than turning them into a universal
surface treatment.

Keep the animated button and clipped ticket face as separate layers. The outer
button must allow visible overflow so the 1.1× scale and ±20-degree tilt are not
cropped; only the inner face clips the foil to the perforated silhouette. The
larger stage may retain its irregular polygon mask when it leaves ample motion
clearance around the ticket. Run
animation frames only while values are changing, schedule the idle jiggle with
a timer, and release compositor promotion after the ticket settles. Give the
stage a visibly lighter grey than the surrounding contact field. A subtle
drop shadow may appear while hovered or keyboard-focused, but it must disappear
completely when the ticket returns to the stage.

## Authentic exception

The Photography character is Will's personal illustration. Its logical frame
size is 32 × 32 and integer enlargement preserves square pixels. The opening
appearance lasts four seconds and leaves the page. The pricing appearance
pushes a large $600 package card across the page, then exits. The friendly
shoot builder is revealed underneath. Reduced motion presents its final
usable state immediately. The image viewer preserves focus and scrolling
position, and all contact choices retain ordinary keyboard operation.

An authentic exception gives a major composition one purposeful interruption
to the standard grid. It must begin with a real source from Will's objects,
artwork, images, handwriting, or project process rather than an invented
decorative shape. It must contain useful content, establish a clear
relationship to its surroundings, and remain stable on narrow screens.

The wider organic and rough-edged vocabulary is not yet approved. A proposed
exception does not introduce a new live-text family or make navigation harder
to find. Surround it with calm modules, usually limit the view to one dominant
interruption, and do not turn the system into a sticker collection.

## Signature boundary

The three-pixel Vermilion dashed boundary with rounded caps and 14px corners is
a cross-pattern accent rather than a standalone component. Use it for the
portrait control, a current selection, or an occasional featured frame. The
opening viewport normally contains no more than one dashed region, and ordinary
project panels do not receive the treatment by default.

## Medium-specific rules

### Films programme and player

The Films opening combines the original Murder of Minus portrait, linked title
lettering and compact year, runtime, director and Trailer content. Wattleseed
follows with the library frame. The shared header retains Contact. Each synopsis
stands alone beside a selected original still. New colour portraits and the
auditorium extend Murder of Minus. Apparatus controls and library scenes extend
Wattleseed. A small overlap links two adjacent stills. The original framing is
available through an image viewer. Every index still appears once.

In wide viewports from 44rem wide and 38rem high, each chapter occupies one and a half viewport
heights when its text fits. Native vertical scrolling expands a central image
mask. The same image element enters ordinary flow on compact viewports and with
reduced motion. Supporting photographs remain fixed under the pointer and
arrive through ordinary scrolling. Image controls use a zoom cursor and visible
keyboard focus. The viewer presents the full image with a Close button.

Festival spreads place featured original artwork in a compact three column tier
and supporting artwork in a smaller four column tier. Transparent margins stay
complete. Pending artwork uses a text composition. Lift Off cities share one
compact group beneath the artwork tiers. On phones, artwork sits beside the record.
Portrait tablets use two columns to keep the festival spread compact.
Festival titles and sourced result categories have persistent underlines.
Related categories share an outcome and year label. All confirmed records stay
in ordinary page flow. A bordered Press kit control closes each index spread.
The detail pages expand the production material through the film reading sequence below.

Trailers open in an Ink native dialog. The iframe loads after activation.
Closing, Escape and the backdrop stop playback and restore focus and scrolling.
A direct YouTube link and caption information accompany the player. The image
viewer follows the same dismissal and focus behavior.

Responsive AVIF stills reserve their dimensions. Press kits load on request.
The source manifest records original media and title extraction. Film colors
and motion timings come from `tokens.css`. The system example uses the original
Murder of Minus lettering, portrait, additional colour stills and compact
festival artwork. It demonstrates linked titles, underlined results and the
bordered Press kit action.

The system stays consistent across forms, but the evidence each form needs is
different. Photography leads with image sequences and honest captions; it
avoids automatic slideshows and unnecessary compression artefacts. Film leads
with a poster or considered still and records year, runtime, role, essential
credits, and caption or transcript availability. Writing leads with its title,
form, concise premise, and a comfortable reading surface rather than an image
of text.

Games and software identify platform, status, Will's contribution, and a clear
way to experience the work; screenshots or recordings must not imply features
that do not exist. Objects and watchmaking record material, scale, process, and
provenance where relevant. Research or academic work may appear when it helps
explain the practice, but it belongs in project context or the archive rather
than turning the identity rail into a student profile.

## Blog article

A blog article requires a category, title, author, publication date, overview, body and draft status. Reuse the shared site header and footer. The visible opening carries the category, title, publication date and overview. A contents navigation links to its second level headings. On desktop, a left contents column and a matching right column keep the prose centred in the viewport. The current section link uses Ink and a heavier weight while a reader scrolls. The contents become an ordinary section above the prose on phones. Keep native document scrolling, visible keyboard focus and a reading measure up to 64ch. Evidence images retain their complete proportions and descriptive captions linking to the source. Supporting PDFs use first page preview cards with direct document links. Full size image links and PDF downloads work without JavaScript. Draft articles and associated media endpoints appear in development only. The reference example lives in `index.html#blog-reading`.

## Projects show and tell

Each scene supplies its own composition, primary destination, support points and entrance sequence. Medical Terminology Games, Tachyboard, Searing Stories and ConspiraSea appear in this order. Shared navigation, spacing and document scrolling connect the scenes. The contact ending reuses the homepage ticket.

Medical Terminology Games presents all six games using the catalogue’s original SVG illustrations and colours. Each card has a premise, player count and direct rules link. The collection title, credit and primary action remain outside the grid. Its paper and ink tokens belong to this scene. EB Garamond and Patrick Hand load from local licensed files. Phones use two catalogue columns. Shared text uses Funnel Sans and selected display roles use Unbounded. Tachyboard’s bounded Instrument Serif family supplies its title, session details and controls. Its practice passage uses the product’s system monospace stack. ConspiraSea uses licensed Pirata One and Montserrat Alternates within its scene.

The guide uses eighteen native 32 by 32 frames at integer display sizes of 192, 160 and 128 pixels. Every resting frame meets a support on a visible object. The title letter, first catalogue card edge, projected keyboard casing, hosts portrait frame, crew card edges and ticket stage supply those supports. Frame metadata records feet, hands and prop grip points. Held illustrations follow the current grip. Released illustrations move into the foreground arrangement.

A single controller owns active scene selection, 780 millisecond travel, gestures, idle scheduling and cancellation. Entrances run once per page visit. Returning to a scene restores the completed arrangement. Resize, text zoom, section links and browser history recompute positions. Reduced motion uses completed scenes and immediate state changes. Will responds to hover, focus and direct selection in every scene. A direct guide jump waits for an active entrance, resolves the current viewport scene before travel, and returns to its visible support. The guide can be hidden while demonstration playback, inspection, character return and destinations remain usable.

Tachyboard uses the corrected source rig including the thumb axes from revision 4513723 and the resting position and single thumb Space press from revision dea2e9e. It retains the original licensed GLB models. The right thumb presses Space while the palms preserve their current position. Platform labels follow the keyboard source. The scene introduces adaptive Endless practice, Coach, timed sessions and custom drills before the active typing view with an Endless session header, slim progress line, system monospace passage, persistent Finger guide indicator, keyboard and hands. A 95 WPM automatic passage demonstrates letters, punctuation, capitals, numbers, spaces, a correction with Delete and Enter. Each scheduled keystroke drives the hands and key highlights. The caret follows the product cursor rules. Its position and line flow use critically damped springs, horizontal travel stretches the 3 pixel caret, and a 530 millisecond pause begins the idle blink. Selecting the keyboard focuses a text field. Visitor keystrokes update the field and drive the same hands and key states. The external destination remains the sole visible control. The renderer loads near visibility, receives the latest target and stops between movements, outside the viewport and on hidden tabs. The static poster comes from the same rig. The poster, camera and support edge share the 600 pixel viewport breakpoint. Camera resize completion triggers a guide position update. At smaller sizes, live key labels retain a 14 pixel minimum. The demonstration runs only while visible. Reduced motion presents a static passage and resting hands.

Searing Stories uses the actual landing photograph beneath the published Trattatello title face. The title retains the source’s large two line composition, with the font loading as the scene approaches. A deep rust lower area places the hosts portrait beside its introduction and white destination control. Will rests on the visible portrait frame. ConspiraSea uses its original painted underwater background, white logo, physical base game and Hadal expansion package artwork, and three original role cards. Its description introduces secret roles, partial information and group voting before the destination. Who can you trust? remains central to its crew interaction. The initial deal begins with empty cards as Will carries each illustration into place. The role deck deals three roles from the complete available set before repeating a role. After placing the final card, Will remains on its visible upper edge. Hovering, focusing or selecting a card schedules its presentation after an active entrance or hop completes. Will remains on the chosen card edge until a later selection. The native button supports pointer, Enter and Space. Reduced motion uses a stationary gesture. Project titles and primary descriptive text link directly to the corresponding main destination. The destination reads Play ConspiraSea Online. The contact ticket uses a stationary stage support, its existing four second foil interval, click to copy and a separate native email link.

The scene contents and ticket surface grow with enlarged text. Scene titles and catalogue descriptions wrap within their available width. Supports follow the resulting object geometry.

The canonical asset record is `src/data/projects-showtell-sources.json`. It records sources, derivatives, dimensions, hashes, licences and native sprite metadata. The rendered reference is `index.html#projects-sequence`. The current review evidence and performance measurements accompany the local implementation in `artifacts/projects-revision-2/`. Earlier review records remain in their original artifact directories.

## Shared footer

The shared footer displays the rights line. The separate utility page remains
available for profile links and QR codes. Page specific contact invitations
and Photography’s service information retain their own roles.

## Film detail reading sequence

Each index chapter ends with its film title and a prominent filled control labelled
“Read more about the film”. The boundary separates consecutive films and provides
a visible destination after the festival composition.

Detail pages use an independent opening with original title artwork, a selected
production image, a premise and Trailer. The reading sequence includes the story,
cast, director perspectives, production history, material and technical process,
specifications, full credits, festivals and original press kit. Murder of Minus
uses the monochrome chip portrait and original production photographs. Wattleseed
uses apparatus and researcher frames reserved for this route. Every image opens
in the native viewer. Supporting images remain stationary under the pointer.

`src/data/film-essays.ts` records the expanded copy with source PDF page references.
`src/data/film-detail-images.json` records the selected images. The media manifest
preserves original URLs, hashes and derivative dimensions. Personal statements
are editorial paraphrases of the published accounts. All content follows normal
vertical flow, with a single column on phones and shared type and spacing tokens.


Festival artwork uses the original graphic for its recorded edition and outcome.
Full leaf boundaries remain visible within the image frame. Featured and supporting
tiers use tight internal spacing without shared row height gaps. Each artwork source
and pending retrieval belongs in the festival record or artwork audit.


## Résumé record

The opening places the name, résumé title, professional introduction and contact links beside a compact PDF preview with view and download actions. A desktop section index remains in view while the record scrolls. Its active link follows the reading position. Phones use ordinary wrapping section links above the record. Education and research precede experience, projects, awards, credentials and volunteering. Consecutive positions at one organization share a heading, with every role and date visible. Section headings use Funnel Sans. Both editions read from the same content record. The rendered reference lives in `index.html#resume-record`.
