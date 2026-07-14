// Runtime support for GridItem container-query sizing.
//
// Two hard CSS limitations shape this file:
//   1. A `@container <name> (…)` rule needs the name as a static identifier, so
//      named containers (`containerId`) can't be expressed in scoped CSS.
//   2. `@container (min-width: …)` thresholds cannot read `var()`, so
//      CSS-variable / per-app breakpoint config can't live in static CSS either.
//
// Both are solved by generating the rules at runtime into a **constructed
// stylesheet** (adoptedStyleSheets), which — unlike an injected <style> — is NOT
// governed by the CSP `style-src` directive. Works under strict
// `style-src 'self'` with no nonce and no 'unsafe-inline'.
//
// Breakpoint resolution (per Grid): perGrid override → global config → built-in.
// The built-in default self-container ("") ships as static scoped CSS in
// GridItem.svelte (SSR-clean, zero JS). Any deviation is generated here.

export type GridBreakpoints = {
	sm: number
	md: number
	lg: number
	xl: number
	xxl: number
}

// Keep in sync with the static `@container` stops in GridItem.svelte.
export const DEFAULT_GRID_BREAKPOINTS: GridBreakpoints = {
	sm: 480,
	md: 640,
	lg: 900,
	xl: 1200,
	xxl: 1600
}

// `:root` custom properties read by configureGridBreakpoints(). Matches the
// project's `--fluent-*` theming convention.
const CSS_VARS: Record<keyof GridBreakpoints, string> = {
	sm: "--fluent-grid-breakpoint-sm",
	md: "--fluent-grid-breakpoint-md",
	lg: "--fluent-grid-breakpoint-lg",
	xl: "--fluent-grid-breakpoint-xl",
	xxl: "--fluent-grid-breakpoint-xxl"
}

// Added to <html> once a global override is active, disabling the static
// default `@container` rules (which are gated by :not(.this-class)) so the
// generated ones take over cleanly instead of overlapping.
const CUSTOM_BP_CLASS = "fluent-grid-custom-bp"

const STOPS: ReadonlyArray<keyof GridBreakpoints> = ["sm", "md", "lg", "xl", "xxl"]

const supportsConstructed =
	typeof document !== "undefined" &&
	typeof CSSStyleSheet !== "undefined" &&
	"adoptedStyleSheets" in Document.prototype

let globalOverride: Partial<GridBreakpoints> = {}
let configured = false
let autoChecked = false

/** perGrid → global → built-in default. */
export function getEffectiveBreakpoints(perGrid?: Partial<GridBreakpoints>): GridBreakpoints {
	return {...DEFAULT_GRID_BREAKPOINTS, ...globalOverride, ...(perGrid ?? {})}
}

function readCssVarBreakpoints(): Partial<GridBreakpoints> {
	if (typeof getComputedStyle === "undefined" || typeof document === "undefined") return {}
	const cs = getComputedStyle(document.documentElement)
	const out: Partial<GridBreakpoints> = {}
	for (const key of STOPS) {
		const raw = cs.getPropertyValue(CSS_VARS[key]).trim()
		if (!raw) continue
		const px = parseFloat(raw)
		if (!Number.isNaN(px)) out[key] = px
	}
	return out
}

// name "" → default anonymous container; otherwise a named container query.
// `--col` is set `!important`: GridItem's base rule is scoped by Svelte, so it
// compiles to `div.s-HASH[data-cq][data-xs]` (specificity 0-3-1) which a plain
// selector here can't out-rank. These rules only assign an internal layout var,
// so `!important` is safe and keeps them independent of the build-time hash.
// (The static default rules in GridItem.svelte carry the same scope class, so
// they don't need it.)
function buildRules(name: string, bp: GridBreakpoints): string {
	const q = name === "" ? "" : `${name} `
	const sel = `div[data-cq="${name}"][data-xs]`
	return STOPS.map(
		(key) => `@container ${q}(min-width: ${bp[key]}px){${sel}{--col:var(--${key},var(--col)) !important}}`
	).join("")
}

// ── Named-container registry (refcounted, one sheet per name) ────────────────

type Entry = {count: number; sheet: CSSStyleSheet; explicit: boolean}

const registry = new Map<string, Entry>()
let defaultSheet: CSSStyleSheet | null = null

/**
 * Configure breakpoints for the whole app. With no argument it reads the
 * `--fluent-grid-breakpoint-*` CSS variables from `:root`; an explicit object
 * wins over those. Regenerates the default container and every active named
 * container that didn't opt out with a per-Grid override. Call once at startup,
 * or again after a theme switch. Returns the resolved breakpoints.
 */
export function configureGridBreakpoints(overrides?: Partial<GridBreakpoints>): GridBreakpoints {
	configured = true
	globalOverride = {...readCssVarBreakpoints(), ...(overrides ?? {})}
	const eff = getEffectiveBreakpoints()

	if (supportsConstructed && Object.keys(globalOverride).length > 0) {
		if (!defaultSheet) {
			defaultSheet = new CSSStyleSheet()
			document.adoptedStyleSheets = [...document.adoptedStyleSheets, defaultSheet]
		}
		defaultSheet.replaceSync(buildRules("", eff))
		document.documentElement.classList.add(CUSTOM_BP_CLASS)

		for (const [name, entry] of registry) {
			if (entry.explicit) continue
			entry.sheet.replaceSync(buildRules(name, eff))
		}
	}
	return eff
}

/**
 * One-time auto-config: if the app set `--fluent-grid-breakpoint-*` vars but
 * never called configureGridBreakpoints(), pick them up on the first container
 * Grid mount so CSS-variable config "just works". No-op if already configured
 * or no vars are present.
 */
export function ensureAutoConfigured(): void {
	if (configured || autoChecked || !supportsConstructed) return
	autoChecked = true
	if (Object.keys(readCssVarBreakpoints()).length > 0) configureGridBreakpoints()
}

/**
 * Register interest in a named container (user `containerId` or a Grid-generated
 * self-container name). Injects its `@container` rules once, shared across
 * callers. `explicit` marks a per-Grid breakpoint override so a later global
 * config won't rewrite it. Returns a release function for unmount.
 */
export function acquireContainer(name: string, bp: GridBreakpoints, explicit: boolean): () => void {
	if (!name || !supportsConstructed) return () => {}

	let entry = registry.get(name)
	if (!entry) {
		const sheet = new CSSStyleSheet()
		sheet.replaceSync(buildRules(name, bp))
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
		entry = {count: 0, sheet, explicit}
		registry.set(name, entry)
	} else if (explicit && !entry.explicit) {
		// First per-Grid override for this name refreshes its thresholds.
		entry.explicit = true
		entry.sheet.replaceSync(buildRules(name, bp))
	}
	entry.count++

	return () => {
		const e = registry.get(name)
		if (!e) return
		e.count--
		if (e.count <= 0) {
			document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== e.sheet)
			registry.delete(name)
		}
	}
}

/**
 * Best-effort dev warning: a named (external) container only works if some
 * ancestor actually declares `container-name: <name>` with a container-type.
 * Otherwise the browser silently falls back to the viewport.
 */
export function warnIfContainerMissing(el: Element | undefined, name: string | undefined): void {
	if (!el || !name || typeof getComputedStyle === "undefined") return

	let node: Element | null = el.parentElement
	while (node) {
		const names = getComputedStyle(node).containerName
		if (names && names.split(/\s+/).includes(name)) return
		node = node.parentElement
	}

	console.warn(
		`[svelte-fluentui] <Grid containerId="${name}">: no ancestor declares ` +
			`\`container-name: ${name}\` (with a container-type). Container queries ` +
			`will fall back to the viewport.`
	)
}
