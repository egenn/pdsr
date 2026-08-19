# justfile
# ::rtemis::
# 2026- EDG rtemis.org
#
# PDSR is a Quarto book: sources live in `src/`, the rendered site is written to
# `docs/`, which GitHub Pages serves at https://pdsr.rtemis.org (docs/CNAME).
#
# Every recipe runs Quarto from inside `src/`, so any file you pass is relative
# to `src/` (e.g. `just render-file DataTypes.qmd`). Recipes taking `*flags`
# forward them verbatim to the underlying `quarto` command.
#
# Run `just` to list recipes.

src := "src"
out := "docs"
quarto := env("QUARTO", "quarto")

# Preview server: `PORT=5555 just preview`, `HOST=0.0.0.0 just preview`.
port := env("PORT", "4200")
host := env("HOST", "127.0.0.1")

# Quarto's frozen execution results and its internal caches. Both are
# gitignored and safe to delete: they only cost a re-render.
freeze := src / "_freeze"
internal := src / ".quarto"

# List available recipes
default:
    @just --list

_msg msg:
    @printf '\033[38;2;108;163;160m[%s] %s\033[0m\n' "$(date '+%Y-%m-%d %H:%M:%S')" "{{ msg }}"

# ── Render ───────────────────────────────────────────────────────────────────

# Render the whole book into `docs/`.
#
# `src/_quarto.yml` sets `execute: freeze: auto`, so only chapters whose source
# changed since the last render are re-executed; the rest are restored from
# `src/_freeze/`. This is the everyday build.
#
#     just render                 # all formats declared in _quarto.yml
#     just render --to html       # one format
#     just render --no-clean      # keep files Quarto would prune from docs/
[doc("Render the whole book into docs/ (freeze: auto — only changed chapters execute).")]
render *flags:
    @just _msg "─── Quarto: rendering PDSR... ───"
    cd {{ src }} && {{ quarto }} render {{ flags }}
    @just _msg "Done"

# Render one chapter, e.g. `just render-file DataTypes.qmd`.
#
# A single-file render inside a project is incremental: the rest of `docs/` is
# left untouched, so this is the fast path while writing one chapter.
[doc("Render a single chapter, e.g. `just render-file DataTypes.qmd`.")]
render-file file *flags:
    @just _msg "─── Quarto: rendering {{ file }}... ───"
    cd {{ src }} && {{ quarto }} render {{ file }} {{ flags }}
    @just _msg "Done"

# Render with `--cache-refresh`: chunks marked `cache: true` are re-executed
# instead of read back from `src/<Chapter>_cache/`.
#
# Freeze still decides *which* chapters run at all, so this only refreshes the
# caches of chapters that were going to execute anyway. To force the entire
# book to re-execute, use `just render-fresh`.
[doc("Render, forcing knitr's chunk caches to refresh (--cache-refresh).")]
render-refresh:
    @just _msg "─── Quarto: rendering PDSR (cache refresh)... ───"
    cd {{ src }} && {{ quarto }} render --cache-refresh
    @just _msg "Done"

# Re-execute and render the entire book from scratch: drops every frozen result
# first, then renders with the chunk caches refreshed.
#
# Slow — every chapter runs. Reach for it after an R or package upgrade, when
# results can change without any `.qmd` changing.
[doc("Re-execute and render the whole book from scratch (drops freeze, refreshes caches).")]
render-fresh: unfreeze
    @just _msg "─── Quarto: rendering PDSR from scratch... ───"
    cd {{ src }} && {{ quarto }} render --cache-refresh
    @just _msg "Done"

# Re-execute one chapter that Quarto thinks is current, e.g. `just refresh
# Colors.qmd`: drops that chapter's frozen results, then renders it with its
# chunk cache refreshed.
[doc("Force-re-execute one chapter, e.g. `just refresh Colors.qmd`.")]
refresh file *flags:
    @just _msg "─── Quarto: refreshing {{ file }}... ───"
    rm -rf "{{ freeze / file_stem(file) }}" "{{ internal / '_freeze' / file_stem(file) }}"
    cd {{ src }} && {{ quarto }} render {{ file }} --cache-refresh {{ flags }}
    @just _msg "Done"

# ── Preview ──────────────────────────────────────────────────────────────────

# Live-reload preview at http://127.0.0.1:4200. Ctrl-C to stop.
#
# Preview starts from the most recent execution results so it comes up fast,
# then re-renders a chapter when you save it. Useful flags:
#
#     just preview --no-browser        # don't open a browser
#     just preview --no-watch-inputs   # serve only, don't re-render on save
[doc("Live-reload preview of the book (fast start: reuses last execution results).")]
preview *flags:
    @just _msg "─── Quarto: previewing PDSR on {{ host }}:{{ port }}... ───"
    cd {{ src }} && {{ quarto }} preview --port {{ port }} --host {{ host }} {{ flags }}

# Preview a single chapter, e.g. `just preview-file dtBasics.qmd`. Re-renders
# that file on save; other chapters are not served.
[doc("Live-reload preview of a single chapter, e.g. `just preview-file dtBasics.qmd`.")]
preview-file file *flags:
    @just _msg "─── Quarto: previewing {{ file }} on {{ host }}:{{ port }}... ───"
    cd {{ src }} && {{ quarto }} preview {{ file }} --port {{ port }} --host {{ host }} {{ flags }}

# Fully render the book (`--render all`) before serving it, instead of reusing
# the last execution results. Slower to start; use when the preview is showing
# stale output.
[doc("Render all formats first, then preview (quarto preview --render all).")]
preview-render *flags:
    @just _msg "─── Quarto: rendering, then previewing PDSR... ───"
    cd {{ src }} && {{ quarto }} preview --render all --port {{ port }} --host {{ host }} {{ flags }}

# ── Freeze & caches ──────────────────────────────────────────────────────────

# Delete `src/_freeze/`, Quarto's store of frozen execution results. Nothing is
# lost but time: the next `just render` re-executes every chapter.
[doc("Delete src/_freeze/ so the next render re-executes every chapter.")]
unfreeze:
    @just _msg "─── Dropping frozen results... ───"
    rm -rf "{{ freeze }}" "{{ internal / '_freeze' }}"
    @just _msg "Done"

# Delete `src/.quarto/`, Quarto's internal project state (search index, xrefs,
# citation and project caches). Regenerated on the next render.
[doc("Delete src/.quarto/ (Quarto's internal index, xref and project caches).")]
clean-quarto:
    @just _msg "─── Removing Quarto internal caches... ───"
    rm -rf "{{ internal }}"
    @just _msg "Done"

# Delete knitr's per-chapter chunk caches, `src/*_cache/`.
#
# Unlike `_freeze` and `.quarto`, these directories are tracked in git — this
# shows up as a large deletion in `git status`. Undo with `git restore src`.
# Prefer `just render-refresh` / `just render-fresh`, which refresh the caches
# in place. Not part of `just clean` for this reason.
[doc("Delete knitr's src/*_cache/ dirs (WARNING: these are tracked in git).")]
clean-cache:
    @just _msg "─── Removing knitr chunk caches (tracked in git)... ───"
    rm -rf {{ src }}/*_cache
    @just _msg "Done"

# Remove Quarto's freeze and internal caches. Leaves the rendered site in
# `docs/` and the tracked `src/*_cache/` dirs alone — see `clean-cache`.
[doc("Remove Quarto's freeze and internal caches (leaves docs/ and *_cache/ alone).")]
clean: unfreeze clean-quarto

# ── Publish ──────────────────────────────────────────────────────────────────

# Render, then commit `src/` and `docs/` and push to `master` — GitHub Pages
# serves `docs/` from that branch, so pushing is the deploy.
#
#     just publish                      # message: "Update PDSR"
#     just publish "add polars joins"
[doc("Render, then commit src/ and docs/ and push to master (deploys the site).")]
publish message="Update PDSR": render
    @just _msg "─── Publishing PDSR... ───"
    git add {{ src }} {{ out }}
    @if git diff --cached --quiet; then \
        echo "   Nothing to publish — no changes staged."; \
    else \
        git commit -m "{{ message }}" && git push; \
    fi
    @just _msg "Done"

# ── Quarto toolchain ─────────────────────────────────────────────────────────

# Verify the local Quarto installation and its engines (knitr/R, Jupyter).
check:
    {{ quarto }} check

# Print the Quarto version this project renders with.
version:
    @{{ quarto }} --version

# List the Quarto extensions installed under `src/_extensions/`.
extensions:
    cd {{ src }} && {{ quarto }} list extensions

# Update the webR extension. `src/_quarto.yml` attaches its filter to every
# page, so a stale copy affects the whole book.
[doc("Update the webR extension (egenn/quarto-webr) in src/_extensions/.")]
update-webr:
    @just _msg "─── Updating quarto-webr extension... ───"
    cd {{ src }} && {{ quarto }} update egenn/quarto-webr
    @just _msg "Done"
