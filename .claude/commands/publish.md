---
description: Prepare svelte-fluentui for npm publish — bump version, finalize CHANGELOG/README, build, commit
argument-hint: rc|release|patch|minor|major
---

# /publish — prepare an npm release of svelte-fluentui

You are preparing the `packages/svelte-fluentui` package for `npm publish`. **Do not run `npm publish`** — the user logs in and publishes manually.

## Argument

The release type: **$ARGUMENTS**

Must be one of:

- `rc` — ship the WIP rc as-is. The next-version heading at the top of the CHANGELOG (e.g. `## [1.0.0-rc17] - 2026-05-05`) becomes `[PUBLISHED]`. Most common operation in this repo today.
- `release` — promote the WIP rc to a final release. `1.0.0-rcN` → `1.0.0`. CHANGELOG heading is renamed to match the new version.
- `patch` — SemVer patch bump. Drops any `-rc` suffix. `1.0.1-rcN` → `1.0.1`, `1.0.0` → `1.0.1`.
- `minor` — SemVer minor bump. Drops `-rc`. Resets patch.
- `major` — SemVer major bump. Drops `-rc`. Resets minor and patch.

If missing or invalid, stop and ask the user which one to use (don't guess).

## Repo layout (this is a monorepo)

- **PKG_DIR**: `packages/svelte-fluentui` — the only non-private package, the publish target.
- **CHANGELOG.md**: lives at the **workspace root**, not in PKG_DIR. Single shared changelog.
- **README.md**: lives at the **workspace root** and is the source of truth. The package's own `README.md` is auto-synced from it by `scripts/post-package.js` during `npm run package`. **Edit only the root one** — running the build picks up the copy.
- **`packages/svelte-fluentui/src/lib/version.ts`**: auto-bumped from `package.json` by `scripts/pre-package.js` during `npm run package`. Don't edit directly.

## CHANGELOG convention in this repo

There is **no `## [Unreleased]` section**. The WIP section is the topmost `## [X.Y.Z-rcN] - YYYY-MM-DD` heading **without** the `[PUBLISHED]` tag. Already-released sections carry `[PUBLISHED]` at the end of their heading. Example:

```
## [1.0.0-rc17] - 2026-05-05            ← WIP, the one you're shipping
### Added
- ...

## [1.0.0-rc16] - 2026-05-04 [PUBLISHED]
### Added
- ...
```

Publishing the WIP section means appending ` [PUBLISHED]` to its heading. The next development cycle creates a fresh `## [next-version] - date` heading on the next CHANGELOG edit.

## Resolve versions

Read `packages/svelte-fluentui/package.json` `version` as `CURRENT_VERSION`.
Read the topmost `## [X.Y.Z...]` heading from `./CHANGELOG.md` as `WIP_VERSION` (the version the latest WIP section is tagged for).

Compute `NEW_VERSION`:

| Argument | Logic |
|---|---|
| `rc` | If `CURRENT_VERSION` matches `X.Y.Z-rcN`, `NEW_VERSION = CURRENT_VERSION` (no bump — we're shipping what's already in package.json). If `CURRENT_VERSION` is not an rc, stop and ask the user (they probably wanted `release`/`patch`/etc.). |
| `release` | If `CURRENT_VERSION` matches `X.Y.Z-rcN`, `NEW_VERSION = X.Y.Z`. Otherwise stop. |
| `patch` | Strip any `-rcN`, then bump patch. |
| `minor` | Strip any `-rcN`, then bump minor, reset patch. |
| `major` | Strip any `-rcN`, then bump major, reset minor and patch. |

If `WIP_VERSION` ≠ `NEW_VERSION` (e.g. the WIP is `1.0.0-rc17` but the user asked for `release`), the CHANGELOG heading rename in step 3 also re-tags the section to `NEW_VERSION` — call this out in the report so the user notices.

## Steps (in order)

### 1. Sanity checks

- Run `git status`. The repo intentionally keeps `.claude/`, `ALERT_SESSION_NOTES.md`, and `docs/.claude/` untracked — those are fine. If there are **other** uncommitted changes that aren't `CHANGELOG.md`, root `README.md`, or `packages/svelte-fluentui/package.json`, warn the user and ask before continuing.
- Confirm the WIP CHANGELOG section has at least one bullet of substantive content under `### Added`, `### Changed`, `### Removed`, or `### Fixed`. If empty, stop — there's nothing meaningful to release.
- Confirm `./README.md` has a `## What's New in vWIP_VERSION` section. If it's missing, draft one from the CHANGELOG and present it to the user for approval before continuing:
  - Read the WIP CHANGELOG section, distill it to 5–7 scannable bullets covering the Added/Changed themes (paraphrase, don't copy CHANGELOG bullets verbatim — those are exhaustive; What's New is the highlight reel). Follow the formatting of the existing `## What's New in vX.Y.Z` sections in the README (bold lead phrase + em-dash + 1–3 sentence explanation).
  - Show the user the proposed draft as plain markdown in your reply. Ask whether to (a) insert as-is, (b) edit, or (c) abort so they can write it themselves.
  - Only proceed past step 1 once the user approves the draft (or supplies their own). On approval, insert the section directly above the current top `## What's New in vX.Y.Z` heading in `README.md`, then continue.
  - Do not silently insert the draft without confirmation — release highlights are a writing call and the user owns the voice.

### 2. Bump version (if needed)

If `NEW_VERSION` ≠ `CURRENT_VERSION`, edit `packages/svelte-fluentui/package.json` and change `"version": "CURRENT_VERSION"` to `"version": "NEW_VERSION"`.

For `rc` arg this is normally a no-op — version was bumped earlier in the development cycle.

### 3. Finalize CHANGELOG

In `./CHANGELOG.md` (workspace root):

- If `WIP_VERSION` ≠ `NEW_VERSION` (e.g. promoting `1.0.0-rc17` → `1.0.0`), rename the WIP heading from `## [WIP_VERSION] - <date>` to `## [NEW_VERSION] - <today>` (today's date from system context).
- If `WIP_VERSION` == `NEW_VERSION`, leave the heading text alone.
- In either case, **append ` [PUBLISHED]`** to the heading so it ends with the tag.
- Leave all bullet content untouched.
- **Do not** create an empty new WIP section — the next development cycle's first CHANGELOG edit will create one.

### 4. Update README "What's New" — only if version changed

In `./README.md` (workspace root):

- If the existing `## What's New in vWIP_VERSION` section's version differs from `NEW_VERSION`, rename its heading to `## What's New in vNEW_VERSION`. (No content rewrites — the text was already curated for this release.)
- Then count the `## What's New in vX.Y.Z` headings. If there are more than **two**, delete the oldest ones so only the **two most recent** remain (the just-finalized one plus the one before it).

For `rc` arg this is normally a no-op on the heading itself — only trims if someone left an extra-old section behind.

### 5. Validate README reflects the release

Read both the finalized CHANGELOG section and the matching `What's New in vNEW_VERSION` section. Every **Added** or **Changed** bullet in the CHANGELOG that represents a user-facing feature or behavior change should have a corresponding hit in the What's New section (paraphrased, not verbatim). Pure internal refactors and Fixed-only entries don't need coverage.

If you find a significant CHANGELOG entry that isn't reflected in What's New, add a bullet for it. If the section ends up with more than ~7 bullets after this pass, condense — What's New should be scannable, not exhaustive.

### 6. Validate CHANGELOG entries match recent work

Find the previous `[PUBLISHED]` tag in CHANGELOG (the version just before NEW_VERSION) and run `git log --oneline <previous-published-commit>..HEAD` to list commits since. Also check `git diff` for any uncommitted work outside the files you're editing.

For every substantive commit or uncommitted change, verify the WIP CHANGELOG section mentions it. If something significant is missing, **stop and ask the user** before finalizing — don't invent entries on their behalf.

### 7. Build the package

Run `cd packages/svelte-fluentui && npm run package`. This:
- Bumps `src/lib/version.ts` to match `package.json` (pre-build).
- Runs `svelte-package` to regenerate `dist/`.
- Copies the workspace-root `README.md` into the package's own `README.md` (post-build).
- Compiles SCSS to CSS in dist.
- Runs `publint` and `npm pack`.

If publint complains, stop and report — don't proceed to commit until the package validates clean. Sass `@import` deprecation warnings are pre-existing and OK to ignore.

### 8. Commit

Stage:
- `./CHANGELOG.md`
- `./README.md`
- `packages/svelte-fluentui/package.json`
- `packages/svelte-fluentui/README.md` (the synced copy from step 7)
- `packages/svelte-fluentui/src/lib/version.ts` (auto-bumped in step 7)

Do **not** stage `dist/` — it's gitignored.

Commit message format:

```
vNEW_VERSION — <one-line summary of the headline change>

<2–4 line description of what this version delivers, drawn from the What's New highlights>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

The Co-Authored-By line matches the convention used in recent commits on this repo.

### 9. Report

Report back with:

- The new version number
- The commit SHA
- The exact command to publish: `cd packages/svelte-fluentui && npm publish`
- A reminder that the CHANGELOG `[PUBLISHED]` tag is now in place — if `npm publish` fails, the user should revert both the tag (CHANGELOG line) and the version bump (package.json) before retrying, since CI/registry will see the same version twice otherwise.

## Things not to do

- **Do not run `npm publish`.** The user publishes manually after `npm login`.
- **Do not push to git remote.** The commit stays local until the user pushes.
- **Do not create an empty `[Unreleased]` or new WIP heading** in CHANGELOG after finalizing — the next dev cycle's first edit creates the next heading.
- **Do not edit `packages/svelte-fluentui/README.md` directly** — it's auto-generated. Edit the workspace-root `README.md` and let `npm run package` sync it.
- **Do not edit `packages/svelte-fluentui/src/lib/version.ts` directly** — auto-generated.
- **Do not invent CHANGELOG entries** to cover commits you find; ask the user if something's missing.
- **Do not skip `npm run package`** — without it, `dist/` is stale, `version.ts` is stale, the package's `README.md` is stale, and publint hasn't validated. Publishing in that state ships broken artifacts.
- **Do not bump if there's nothing meaningful in the WIP section** — stop and explain.
