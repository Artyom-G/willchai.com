# Content Guide

This guide makes it easy to add, revise, and retire work while preserving the
site's voice or structure. The voice principles and canonical AI writing
instruction in `BRAND-GUIDELINES.md` apply to every published draft.

## What belongs on the site

Publish work which is finished, representative, and worth someone spending
time with. The homepage, Films, and Projects remain selective. Older work can
receive a compact mention on Projects when it adds useful context. Public
detail pages are reserved for work with enough substance to support them.

Photography is the professional service. Films and Projects are separate
chooser destinations. **Sharing Stories** remains the idea connecting film,
writing, games, watchmaking, photography, and future forms. Every published
item has one canonical home when it intersects several disciplines.

## Photography service

The Photography page introduces Will directly and names the opening selection
Featured photographs for assistive tools. Publish the nine approved photographs
from the existing public Photography page as one uncategorized sequence. Keep
the presentation caption free. An animated collaboration composition appears
before the inquiry route. McMaster University holds the image led feature while
Foxwood Homes and Platinum Moon use compact supporting positions. All three
remain visible in the settled composition.

The wider portfolio appears as a caption free shuffle loaded in controlled
batches. The complete service footer follows it with contact, policy, rights,
and navigation information. A future service such as weddings or real estate
may receive its own page once the business and visitor journey support a
dedicated destination.

The general site contact invitation should feel open and collaborative (“Let’s
do something together”). Within photography, provide a specific inquiry route
with only the information required to understand the shoot and respond.

Portraits and events are the commercial focus. Use the complete page to assess
beauty, comfortable browsing, access to practical information, and ease of
contacting Will. Exact rates can follow the visual review.

The featured sequence advances through ordinary vertical scrolling. The linked
photographs open in the viewer, where Previous, Next, Add reference, and Close
remain available. The board introduces Event name and two questions about place
and date. Next advances to optional budget and notes, then to the completed
inquiry. The second advance changes Next into Open email. Copy text remains in
the completed inquiry. Back keeps all answers.
Budgets accept an amount or range in CAD, with guidance available. The supplied
amount is labelled Your budget. The departing package prop identifies a Super
Generic Package and presents $600. The budget field repeats it as the sole public
pricing reference. The prop copy contains its name and amount. Supporting copy connects
additional budget room with longer coverage and a wider final gallery. Further
details can be added in the email.

Visitors may add references from an opened featured or shuffle photograph.
Reference selections produce image links in the inquiry and remain editable
on the board. Alternative text supplies internal reference descriptions. The
selection, form answers and draft remain local to the current page.

## Updating the Photography shuffle

The folder `public/photography/shuffle/` is the source of the shuffle image list.
Add exported JPEG, PNG, WebP or AVIF photographs directly to this folder. To
retire a photograph, move its file outside the folder. Keep original media in
your usual archive. Run `npm run photos:sync` from the project folder after
changing the selection, then preview and publish the site.

The command updates `src/data/photographyShuffle.json`, reads image dimensions,
and preserves existing source information. It changes the list and leaves the
photograph files intact. `npm run photos:check` previews whether the list needs
an update, and the build performs this check automatically. Export optimized
images before adding them. Filename changes become image URL changes.

Fresh page loads choose a new random order from the complete list. The Shuffle
button chooses another order and plays the brief character sequence. Loading
more photographs continues the current order in batches of 36.

## Films and Projects

Films remain separate from Projects. Each film uses its `/films/` page as its
canonical home. Projects uses its chooser to introduce Medical Terminology
Games, Tachyboard, Searing Stories, and ConspiraSea. A creative work can carry
the Sharing Stories idea while its medium determines its public route.

The Films chooser introduces Wattleseed and Murder of Minus with their exact
titles, years, runtimes, director credits and a short premise. Each detail page
uses a synopsis followed by a personal production account grounded in the
published film page or press kit. The press kits remain original downloadable
PDFs. `src/data/film-media-sources.json` records source URLs and file hashes.

Trailer actions identify the trailer explicitly. The full films are available
through a screening inquiry. The YouTube players offer automatic English
captions, which the dialog identifies as automatic. Media loads from YouTube
after a visitor chooses Watch trailer. Direct YouTube links remain available.

## Résumé and utility content

The Résumé is a professional record with a current PDF at the top and a
scrollable HTML version below. View and download actions stay easy to find, and
both formats carry the same verified facts. Links to Films and Projects may
help a reader inspect relevant work. Their case studies remain on the canonical
Film and Project pages.

`/hey/` is a branded quick links page for QR codes and profile contexts. It
stays outside the primary navigation architecture. During the focused public
release it links to Home, Photography, LinkedIn, and email. Contact appears
within the homepage and the Photography inquiry area. Film, Project, and
Résumé routes stay outside the sitemap and crawler discovery until approved.

## Project entry checklist

Each project should include:

- Title and year
- Primary discipline and role
- One-sentence introduction
- Short description of the idea, process, or outcome
- A purposeful cover image, with defined crop and focal point
- Credits, recognition, collaborators, and external links where relevant
- A gallery, video, or supporting material only when it advances the story
- Image alt text and captions when they add context

## Writing rules

This standard applies to homepage copy, project pages, service descriptions,
captions, calls to action, metadata, and every AI-assisted draft. Site copy
should use complete sentences and cohesive, substantive paragraphs. Related
ideas belong together. Avoid staccato or listicle-style prose, sentence
fragments, repetitive openings, anaphora, stacked declarations, and an
artificial rhythm made from excessive line breaks. Do not isolate one or two
words to manufacture emphasis. Headings should organise genuinely longer
material, and lists should appear only when enumeration makes the content
clearer. Short functional labels are acceptable when they identify a place or
action rather than imitate editorial writing.

The voice should be ordinary, conversational, precise, and personal rather
than promotional or self-consciously editorial. Lead with the work and explain
it plainly; specific details, credits, and outcomes are stronger than
superlatives. Homepage copy should stay concise, while project pages may use
longer paragraphs when the context improves the reader's understanding. Avoid
repeating the same sentence structure several times in succession.

Write credits consistently as role, collaborator, organisation, and link. Do
not refer to temporary academic status in permanent homepage copy unless it
genuinely remains central to the work. Every AI-assisted draft should be
revised against this standard before it is published.

## Images and media

- Keep original files safe outside the site build; publish optimized derivatives.
- Name assets predictably: `project-slug-purpose-01.ext`.
- Use a small number of strong images rather than a large, undifferentiated
  gallery.
- Provide captions for work that benefits from provenance, location, process,
  or collaborator context.
- For film, include runtime, year, role, key credits, captions, and an external
  viewing link or a lightweight poster-led embed.

## Homepage curation

Feature work that is visually strong, current, and varied. Rotate entries only
when there is a better story to tell; the homepage does not need to change for
its own sake.

## Removal policy

Review older work individually. A useful project may remain as a compact item
on Projects, move to a stronger replacement, or leave the public site with an
appropriate redirect. Preserve accurate credit and project history wherever
the selected destination benefits from it.
