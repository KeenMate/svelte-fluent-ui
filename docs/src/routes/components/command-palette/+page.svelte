<script lang="ts">
	import {CommandPalette, CommandPaletteTrigger, Button, Stack, Card, Grid, GridItem, QuickGrid} from "svelte-fluentui"
	import type {CommandPaletteItem} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "items", type: "CommandPaletteItem[]", default: "[]", description: "Searchable entries. Each is either navigation (href) or an action (onSelect)"},
		{name: "open", type: "boolean", default: "false", description: "Controlled, bindable open state. Drive it from your own trigger with bind:open"},
		{name: "placeholder", type: "string", default: '"Search…"', description: "Input placeholder text"},
		{name: "homeItems", type: "CommandPaletteItem[]", default: "items", description: "Items shown on the idle screen (before typing), grouped by `group`. Defaults to the first maxResults of items"},
		{name: "maxResults", type: "number", default: "50", description: "Maximum number of results rendered for a query"},
		{name: "shortcut", type: "string", default: '"mod+k"', description: "Global shortcut that toggles the palette. mod = ⌘ on Mac, Ctrl elsewhere"},
		{name: "enableShortcut", type: "boolean", default: "true", description: "Register the built-in global shortcut listener. Disable to drive open yourself"},
		{name: "closeOnSelect", type: "boolean", default: "true", description: "Close the palette after an item is selected"},
		{name: "filter", type: "CommandPaletteFilter", default: "undefined", description: "Override the built-in fuzzy scorer with app-specific search (server-side, scopes, weighting)"}
	]

	const itemShape: Property[] = [
		{name: "title", type: "string", default: "—", description: "Primary line (required)"},
		{name: "meta", type: "string", default: "undefined", description: "Secondary muted line, e.g. a SKU or path"},
		{name: "icon", type: "string", default: "undefined", description: "FluentUI icon name passed to <Icon>"},
		{name: "badge", type: "string", default: "undefined", description: "Trailing badge text"},
		{name: "shortcut", type: "string", default: "undefined", description: 'Trailing keycap hint, space-separated, e.g. "Ctrl ,"'},
		{name: "group", type: "string", default: "undefined", description: "Section heading on the idle screen; trailing chip in search results"},
		{name: "keywords", type: "string[]", default: "undefined", description: "Extra search terms / aliases that match but aren't shown"},
		{name: "href", type: "string", default: "undefined", description: "Navigation target. Rendered as an <a> so the host router handles the click"},
		{name: "target / rel", type: "string", default: "undefined", description: "Anchor target/rel, only meaningful with href"},
		{name: "onSelect", type: "() => void", default: "undefined", description: "Action callback. Takes precedence over href"},
		{name: "disabled", type: "boolean", default: "false", description: "Render the row but make it non-interactive"}
	]

	const callbacks: Property[] = [
		{name: "onselect", type: "(item: CommandPaletteItem) => void", default: "undefined", description: "Fired with the selected item before its navigation/action runs"},
		{name: "onopen", type: "() => void", default: "undefined", description: "Fired when the palette opens"},
		{name: "onclose", type: "() => void", default: "undefined", description: "Fired when the palette closes"}
	]

	const slots: Property[] = [
		{name: "item", type: "Snippet<[item, active]>", default: "undefined", description: "Replace a result row's rendering. Receives the item and whether it's the active row"},
		{name: "empty", type: "Snippet<[query]>", default: "undefined", description: "Replace the empty-state body. Receives the current query"},
		{name: "footer", type: "Snippet", default: "undefined", description: "Replace the footer keyboard hints"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// --- Demo state ---
	let lastAction = $state("—")
	function setAction(name: string) {
		lastAction = name
	}

	// Basic action palette — driven by its own trigger / button (built-in
	// shortcut disabled so it doesn't fight the docs' own Ctrl+K palette).
	let basicOpen = $state(false)
	const commands: CommandPaletteItem[] = [
		{title: "New document", icon: "document_add", shortcut: "Ctrl N", group: "Create", onSelect: () => setAction("New document")},
		{title: "New folder", icon: "folder_add", group: "Create", onSelect: () => setAction("New folder")},
		{title: "Upload files", icon: "arrow_upload", group: "Create", onSelect: () => setAction("Upload files")},
		{title: "Toggle theme", icon: "weather_moon", shortcut: "Ctrl T", group: "View", onSelect: () => setAction("Toggle theme")},
		{title: "Open settings", icon: "settings", shortcut: "Ctrl ,", group: "View", onSelect: () => setAction("Open settings")},
		{title: "Sign out", icon: "sign_out", group: "Account", onSelect: () => setAction("Sign out")}
	]

	// Rich items — icon + meta + badge, navigation entries.
	let richOpen = $state(false)
	const records: CommandPaletteItem[] = [
		{title: 'MacBook Pro 16"', meta: "SKU: MBP-16-001 • $2,499.00", icon: "laptop", badge: "In Stock", group: "Products", keywords: ["apple", "laptop"], href: "#macbook"},
		{title: "iPhone 15 Pro", meta: "SKU: IP15P-256 • $999.00", icon: "phone", badge: "New", group: "Products", keywords: ["apple", "mobile"], href: "#iphone"},
		{title: "AirPods Pro", meta: "SKU: APP-GEN2 • $249.00", icon: "headphones", badge: "Popular", group: "Products", href: "#airpods"},
		{title: "Order #1001", meta: "John Doe • $1,234.56 • 2 items", icon: "box", badge: "Shipped", group: "Orders", href: "#o1001"},
		{title: "Order #1002", meta: "Jane Smith • $567.89 • 1 item", icon: "box", badge: "Processing", group: "Orders", href: "#o1002"},
		{title: "Invoice #INV-501", meta: "Order #1001 • Due in 5 days", icon: "receipt", badge: "Unpaid", group: "Invoices", href: "#inv501"}
	]

	// Custom filter escape hatch — exact prefix match only, case-insensitive.
	let filterOpen = $state(false)
	function prefixFilter(items: CommandPaletteItem[], query: string): CommandPaletteItem[] {
		const q = query.toLowerCase()
		return items.filter((it) => it.title.toLowerCase().startsWith(q))
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="CommandPalette"
		description="A Spotlight-style command palette: fuzzy search over navigation and actions, keyboard-driven, grouped, with icons, meta lines, badges and shortcut hints."
		keywords="svelte, fluentui, command palette, spotlight, cmdk, ctrl k, quick switcher, search"
	/>

	<h1>CommandPalette</h1>

	<p>
		A macOS Spotlight–style overlay that fuzzy-searches a flat list of
		<code>CommandPaletteItem</code>s and runs the chosen one. Each item is either
		<strong>navigation</strong> (carries an <code>href</code> — rendered as a real
		<code>&lt;a&gt;</code> so your router handles the click, no framework import) or an
		<strong>action</strong> (carries an <code>onSelect</code> callback). The same palette
		that powers this site's <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> search.
	</p>

	<p>
		Open it with the bindable <code>open</code> prop (from your own button or search
		pill), or let the built-in global <code>shortcut</code> toggle it. Layered fuzzy
		scoring ranks exact &gt; prefix &gt; substring &gt; subsequence matches across the
		title, meta, group and keywords, with match highlighting. Arrow keys navigate,
		<kbd>Enter</kbd> selects, <kbd>Esc</kbd> closes.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", na: "Not available in FluentUI Blazor"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Actions with a trigger pill</h3>
		<p>
			Drive the palette from <code>&lt;CommandPaletteTrigger&gt;</code> (a search pill
			that mirrors the navbar trigger) or any button via <code>bind:open</code>. Items
			here run <code>onSelect</code> actions and show icons, grouped sections on the
			idle screen, and keycap shortcut hints.
		</p>
		<Stack orientation="horizontal" gap="0.75rem" verticalAlign="center">
			<CommandPaletteTrigger placeholder="Run a command…" shortcut={null} onclick={() => (basicOpen = true)} />
			<Button appearance="accent" onclick={() => (basicOpen = true)}>Open palette</Button>
		</Stack>
		<div class="demo-status">Last action: <strong>{lastAction}</strong></div>
		<CommandPalette bind:open={basicOpen} items={commands} enableShortcut={false} placeholder="Run a command…" onselect={(it) => setAction(it.title)} />

		<h3>Rich items: icon, meta, badge</h3>
		<p>
			Items can carry a secondary <code>meta</code> line, a trailing <code>badge</code>,
			and <code>keywords</code> (extra search terms that match but aren't shown — try
			searching <em>apple</em>). These are navigation items, so selecting one follows its
			<code>href</code>.
		</p>
		<CommandPaletteTrigger placeholder="Search products, orders, invoices…" shortcut={null} onclick={() => (richOpen = true)} />
		<CommandPalette bind:open={richOpen} items={records} enableShortcut={false} placeholder="Search products, orders, invoices…" />

		<h3>Custom filter (escape hatch)</h3>
		<p>
			Pass a <code>filter</code> to replace the built-in scorer entirely — for
			server-side search, scopes, or custom weighting. This one matches only by
			case-insensitive title prefix.
		</p>
		<CommandPaletteTrigger placeholder="Prefix search…" shortcut={null} onclick={() => (filterOpen = true)} />
		<CommandPalette bind:open={filterOpen} items={records} filter={prefixFilter} enableShortcut={false} placeholder="Type a title prefix…" />

		<h3>Global shortcut</h3>
		<p>
			With <code>enableShortcut</code> (default) the palette registers a document-level
			listener for <code>shortcut</code> — <code>"mod+k"</code> toggles it from anywhere
			(⌘K on Mac, Ctrl K elsewhere). This site mounts exactly one such palette in its
			layout; the demos above set <code>enableShortcut=&#123;false&#125;</code> so they don't
			fight it. Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> now to open the real one.
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6}>
			<Card>
				<h2>CommandPaletteItem</h2>
				<QuickGrid items={itemShape} columns={propertyColumns} />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Snippets</h2>
				<QuickGrid items={slots} columns={propertyColumns} />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.demo-status {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		background: var(--neutral-layer-2);
		font-size: 0.9rem;
	}
</style>
