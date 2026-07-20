/**
 * verify-icon-modes.mjs
 *
 * End-to-end assertion that both icon delivery modes of the `svelteFluentUI`
 * Vite plugin produce the output shape they promise. There's no browser here —
 * the two modes differ entirely in the *build pipeline*, so asserting the built
 * output is what actually covers them.
 *
 * For each mode it wipes `build/`, runs `vite build` with SF_ICONS_MODE set, and
 * checks the emitted files:
 *
 *   inline → NO hashed icon `.svg` files, and an app chunk that inlines `<svg>`
 *            markup keyed by `name_size_variant` (icons ship inside the JS).
 *   asset  → hashed icon `.svg` files under _app/immutable/assets, and NO inlined
 *            icon markup in the chunks (icons ship as fetched files).
 *
 * Usage:  node scripts/verify-icon-modes.mjs   (from docs/, or `npm run verify:icons`)
 * Exit code 0 = both modes pass, 1 = any assertion failed.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(docsRoot, 'build');
const assetsDir = path.join(buildDir, '_app', 'immutable', 'assets');
const immutableDir = path.join(buildDir, '_app', 'immutable');

// A hashed icon asset looks like `add_16_regular.B1AMZjf0.svg`; a virtual-module
// map key looks like `add_16_regular`. Both hinge on the _<size>_<variant> stem.
const ICON_STEM = /_(?:16|20|24|28|32|48)_(?:regular|filled)\b/;
// An inlined icon in a JS chunk: a `name_size_variant` key mapped straight to
// `<svg` markup. Tolerant of the minifier's choices — the key may be quoted or
// bare, and the value may use single or double quotes (`add_16_regular:'<svg`).
const INLINED_ICON = /_(?:16|20|24|28|32|48)_(?:regular|filled)['"]?:\s*['"]<svg/;

/** Recursively collect files under `dir` whose name passes `predicate`. */
function collect(dir, predicate, out = []) {
	let entries;
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) collect(full, predicate, out);
		else if (predicate(entry.name)) out.push(full);
	}
	return out;
}

/** True if any `.js` file under _app/immutable inlines an icon's `<svg>` markup. */
function hasInlinedIcons() {
	const jsFiles = collect(immutableDir, (name) => name.endsWith('.js'));
	return jsFiles.some((file) => INLINED_ICON.test(fs.readFileSync(file, 'utf-8')));
}

function buildWithMode(mode) {
	fs.rmSync(buildDir, { recursive: true, force: true });
	console.log(`\n▶ building docs with SF_ICONS_MODE=${mode} …`);
	execSync('npm run build', {
		cwd: docsRoot,
		stdio: 'inherit',
		env: { ...process.env, SF_ICONS_MODE: mode }
	});
}

/** @type {{mode: string, label: string, ok: boolean, detail: string}[]} */
const results = [];
function check(mode, label, ok, detail) {
	results.push({ mode, label, ok, detail });
	console.log(`  ${ok ? '✅' : '❌'} [${mode}] ${label} — ${detail}`);
}

// ── inline ────────────────────────────────────────────────────────────────
buildWithMode('inline');
{
	const iconAssets = collect(assetsDir, (name) => name.endsWith('.svg') && ICON_STEM.test(name));
	check(
		'inline',
		'emits no hashed icon .svg files',
		iconAssets.length === 0,
		`found ${iconAssets.length} (expected 0)`
	);
	check(
		'inline',
		'inlines icon <svg> markup into a JS chunk',
		hasInlinedIcons(),
		hasInlinedIcons() ? 'inlined markup present' : 'no inlined icon markup found'
	);
}

// ── asset ─────────────────────────────────────────────────────────────────
buildWithMode('asset');
{
	const iconAssets = collect(assetsDir, (name) => name.endsWith('.svg') && ICON_STEM.test(name));
	check(
		'asset',
		'emits hashed icon .svg files',
		iconAssets.length > 0,
		`found ${iconAssets.length} (expected > 0)`
	);
	check(
		'asset',
		'does not inline icon <svg> markup',
		!hasInlinedIcons(),
		hasInlinedIcons() ? 'unexpected inlined markup found' : 'no inlined icon markup (URLs only)'
	);
}

// ── report ──────────────────────────────────────────────────────────────────
const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length === 0 ? '✅ all icon-mode checks passed' : `❌ ${failed.length} check(s) failed`}`);
process.exit(failed.length === 0 ? 0 : 1);
