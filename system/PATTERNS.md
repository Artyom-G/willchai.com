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
site's personal voice. The page requires ten to fifteen featured photographs,
small identifying captions, pricing, selected professional relationships, and
a photography specific inquiry action. Availability, location, and delivery
information appears when it is current and useful.

The featured order and photographs may change. Editorial transitions keep the
uncategorized sequence continuous. A caption free shuffle follows the
commercial information and loads in controlled batches before the complete
service footer. Photographs remain the primary visual material, the inquiry
action stays outside any lightbox, and client privacy or publication
permission must be confirmed before use.

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
