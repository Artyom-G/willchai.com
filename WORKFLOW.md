# Fast repository workflow

The repository contains the active rebuild alongside the legacy React site, generated output, installed dependencies, and original media. Keep routine work narrowly scoped so those older files do not slow down inspection or publishing.

## Active surfaces

- `prototype/` is the dependency-free homepage prototype.
- `hey/` is the dependency-free quick-links page at `/hey/`.
- `system/` and the root design documents define the durable visual and content rules.
- `src/`, `public/`, and `build/` belong to the legacy application unless a task explicitly targets it.
- `Portfolio Downsampled Photos/` and `WillChai.com Claude Code/` are reference material, not default implementation surfaces.

## Quick GitHub update

1. Read `AGENTS.md` and the design sources it names before interface work.
2. Inspect only the requested active path, using path-scoped status and search commands instead of scanning the entire repository.
3. Serve the repository root and verify the exact route being changed.
4. Stage only the relevant active path and any documentation changed with it.
5. Commit on the current branch and push that branch to `origin`.

The saved `origin` uses HTTPS, while this machine's GitHub CLI token may be
expired. If an HTTPS push asks for credentials, push the same branch through
`git@github.com:Artyom-G/willchai.com.git` instead; the configured SSH key is
the working non-interactive path. Do not spend time retrying the expired token.

Do not scaffold a temporary framework or install another dependency tree in the repository root for a static page. Use an isolated temporary directory for experiments, then port the finished HTML, CSS, and optimized assets into the appropriate active path.
