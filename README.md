# willchai.com

The source repository for Will Chai's personal website. The current rebuild is
in its foundational prototype stage: the homepage's visual language,
interaction model, navigation, portrait system, project-card rhythm, and
contact ticket are established, while deeper project and archive pages remain
to be built.

## Current prototype

Serve the repository root with any static file server, then open
`/prototype/`. The established local preview URL is:

`http://127.0.0.1:4173/prototype/`

The prototype is dependency-free and lives in `prototype/` with its optimized
assets. Its `README.md` and `MATERIALS.md` explain the implementation and media
sources.

## Quick-links page

The lightweight link page lives in `hey/` and is available at `/hey/`. It is
dependency-free, contains no JavaScript, and reuses the prototype's optimized
identity assets rather than duplicating them.

For efficient agent work and GitHub updates in this mixed legacy/rebuild
repository, follow `WORKFLOW.md`.

## Before continuing the rebuild

Agents and contributors should begin with `AGENTS.md`, then read:

- `DECISIONS.md`
- `BRAND-GUIDELINES.md`
- `DESIGN-SYSTEM.md`
- `CONTENT-GUIDE.md`
- `system/README.md`
- `system/PATTERNS.md`

The rendered reference library is available at `/system/`. Keep these sources
synchronized when a durable design, content, or interaction decision changes.

## Archived legacy application

The former Create React App implementation was removed from the active branch
after the rebuild prototypes were established. Its final state remains
available in Git history under the `legacy-react-final-2026-09-08` tag.
