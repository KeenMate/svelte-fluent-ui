/**
 * A single entry in the command palette. Entries are either *navigation*
 * (carry an `href`) or *actions* (carry an `onSelect`). Navigation entries
 * render as real `<a>` elements so SvelteKit (or any router that intercepts
 * anchor clicks) handles client-side navigation with no framework import.
 */
export type CommandPaletteItem = {
	/** Stable identity for keyed rendering. Falls back to `title` when omitted. */
	id?: string
	/** Primary line. */
	title: string
	/** Secondary muted line (e.g. "SKU: MBP-16-001 • $2,499.00"). */
	meta?: string
	/** FluentUI icon name passed to `<Icon name>`. For arbitrary content, use the `item` snippet on `<CommandPalette>`. */
	icon?: string
	/** Trailing badge text (e.g. "In Stock"). */
	badge?: string
	/** Trailing keycap hint, space-separated (e.g. "Ctrl ,"). Display only. */
	shortcut?: string
	/** Section heading on the idle/home screen; rendered as a trailing chip in search results. */
	group?: string
	/** Extra search terms / aliases that match but aren't shown. */
	keywords?: string[]
	/** Navigation target. Rendered as an `<a>` so the host router handles the click. */
	href?: string
	/** Anchor target (e.g. "_blank"). Only meaningful with `href`. */
	target?: string
	/** Anchor rel. Only meaningful with `href`. */
	rel?: string
	/** Action callback. Takes precedence over `href` when both are present. */
	onSelect?: () => void
	/** Render the row but make it non-interactive. */
	disabled?: boolean
}

/**
 * Custom filter/rank hook. Receives the full item list and the trimmed query,
 * returns the items to show in result order. Overrides the built-in fuzzy
 * scorer entirely — the escape hatch for app-specific search (server-side,
 * scopes, weighting, etc.).
 */
export type CommandPaletteFilter = (items: CommandPaletteItem[], query: string) => CommandPaletteItem[]
