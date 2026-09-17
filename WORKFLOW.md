# Fast repository workflow

The repository contains only the active rebuild and its design sources. Keep routine work narrowly scoped so original media and experiments do not drift back into the active tree.

## Active surfaces

The Astro application at the repository root is the active launch
implementation. `src/pages/` owns the twelve public pages, `src/components/`
owns shared page structures, and `public/` contains published resources such
as the résumé PDF, media, redirects, `robots.txt`, and sitemap output.

`prototype/` and `hey/` remain implementation references while their routes
move into Astro. `system/` and the root design documents define the durable
visual and content rules. The former React application remains available
through tagged history. Original media and retired scratch work remain outside
the active tree.

## Quick GitHub update

1. Read `AGENTS.md` and the design sources it names before interface work.
2. Inspect only the requested active path, using path-scoped status and search commands instead of scanning the entire repository.
3. Run the Astro site and verify every route affected by the change.
4. Stage only the relevant active path and any documentation changed with it.
5. Commit on the current branch and push that branch to `origin`.

The saved `origin` uses HTTPS, while this machine's GitHub CLI token may be
expired. If an HTTPS push asks for credentials, push the same branch through
`git@github.com:Artyom-G/willchai.com.git` instead; the configured SSH key is
the working non-interactive path. Do not spend time retrying the expired token.

The root Astro dependency tree belongs to the active implementation. Use an
isolated temporary directory for experiments with unrelated tools, then bring
finished HTML, CSS, and optimized assets into the appropriate active path.
