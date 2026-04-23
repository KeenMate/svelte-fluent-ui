<script lang="ts">
	import {ContextMenu, Stack, Card, Grid, GridItem, QuickGrid, Slider} from "svelte-fluentui"
	import type {MenuButtonItem} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "items", type: "MenuButtonItem[]", default: "[]", description: "Menu entries rendered when the child area is right-clicked. Shares the same item shape as <MenuButton>"},
		{name: "disabled", type: "boolean", default: "false", description: "When true, right-clicks fall through to the browser's native context menu as usual"},
		{name: "offsetMenuX", type: "number", default: "8", description: "Horizontal offset (pixels) pushing the menu further right of the cursor. Default 8px keeps the cursor off the first menu item after right-click"},
		{name: "offsetMenuY", type: "number", default: "0", description: "Vertical offset (pixels) pushing the menu further below the cursor. Stacks on top of a small baseline gap"}
	]

	const callbacks: Property[] = [
		{name: "onopen", type: "(detail: { x: number; y: number }) => void", default: "undefined", description: "Fired when the menu opens. `x`/`y` are the viewport-relative cursor coordinates"},
		{name: "onclose", type: "() => void", default: "undefined", description: "Fired when the menu closes (click-outside, Escape, right-click elsewhere, or an item click)"}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Children rendered inside the right-click trigger zone. The wrapper uses `display: contents` so it doesn't affect layout"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// --- Demo state ---
	let lastAction = $state("—")
	let lastCursor = $state<{x: number; y: number} | null>(null)
	let blockDelete = $state(false)
	let offsetX = $state(8)
	let offsetY = $state(0)

	function setAction(name: string) {
		lastAction = name
	}

	const fileItems: MenuButtonItem[] = [
		{label: "Open", icon: "open", onclick: () => setAction("Open")},
		{label: "Rename", icon: "rename", onclick: () => setAction("Rename")},
		{label: "Duplicate", icon: "copy", onclick: () => setAction("Duplicate")},
		{label: "Download", icon: "arrow_download", dividerBefore: true, onclick: () => setAction("Download")},
		{label: "Share", icon: "share", onclick: () => setAction("Share")},
		{label: "Delete", icon: "delete", danger: true, dividerBefore: true, onclick: () => setAction("Delete")}
	]

	const conditionalItems = $derived<MenuButtonItem[]>([
		{label: "Open", icon: "open", onclick: () => setAction("Open")},
		{label: "Rename", icon: "rename", onclick: () => setAction("Rename")},
		{label: "Delete", icon: "delete", danger: true, dividerBefore: true, disabled: blockDelete, onclick: () => setAction("Delete")}
	])

	// Side-opening submenus — items with `children` (and no `expandable` flag)
	// render as submenu triggers that open a floating popover to the right.
	const submenuItems: MenuButtonItem[] = [
		{label: "New", icon: "add", children: [
			{label: "Document", icon: "document", onclick: () => setAction("New / Document")},
			{label: "Folder", icon: "folder", onclick: () => setAction("New / Folder")},
			{label: "From template", icon: "document_copy", children: [
				{label: "Meeting notes", onclick: () => setAction("New / Template / Meeting notes")},
				{label: "Weekly report", onclick: () => setAction("New / Template / Weekly report")},
				{label: "Empty", onclick: () => setAction("New / Template / Empty")}
			]}
		]},
		{label: "Open", icon: "open", onclick: () => setAction("Open")},
		{label: "Share", icon: "share", children: [
			{label: "Copy link", icon: "link", onclick: () => setAction("Share / Copy link")},
			{label: "Email", icon: "mail", onclick: () => setAction("Share / Email")},
			{label: "Export", icon: "arrow_download", onclick: () => setAction("Share / Export")}
		]},
		{label: "Delete", icon: "delete", danger: true, dividerBefore: true, onclick: () => setAction("Delete")}
	]

	// Sidebar-style nested menu — two expandable sections ("Form & Inputs",
	// "List") followed by ungrouped items with dividers.
	const navItems: MenuButtonItem[] = [
		{
			id: "forms",
			label: "Form & Inputs",
			icon: "form",
			expandable: true,
			children: [
				{label: "Overview", icon: "form", onclick: () => setAction("Forms / Overview")},
				{label: "Checkbox", icon: "checkbox_checked", onclick: () => setAction("Forms / Checkbox")},
				{label: "Date & Time", icon: "calendar_ltr", onclick: () => setAction("Forms / Date & Time")},
				{label: "InputFile", icon: "arrow_upload", onclick: () => setAction("Forms / InputFile")}
			]
		},
		{
			id: "list",
			label: "List",
			icon: "list",
			expandable: true,
			children: [
				{label: "Autocomplete", icon: "edit", onclick: () => setAction("List / Autocomplete")},
				{label: "Combobox", onclick: () => setAction("List / Combobox")},
				{label: "Listbox", icon: "list", onclick: () => setAction("List / Listbox")},
				{label: "Select", icon: "list", onclick: () => setAction("List / Select")},
				{label: "Option", icon: "options", onclick: () => setAction("List / Option")}
			]
		},
		{label: "Number Field", icon: "number_symbol", dividerBefore: true, onclick: () => setAction("Number Field")},
		{label: "Radio", icon: "radio_button", onclick: () => setAction("Radio")},
		{label: "Radio Group", icon: "radio_button", onclick: () => setAction("Radio Group")},
		{label: "Slider", icon: "options", dividerBefore: true, onclick: () => setAction("Slider")},
		{label: "Switch", icon: "toggle_left", onclick: () => setAction("Switch")},
		{label: "Text Area", icon: "document", onclick: () => setAction("Text Area")},
		{label: "Text Field", icon: "text_t", onclick: () => setAction("Text Field")}
	]

	type ImageItem = {id: number; title: string; color: string}
	let images: ImageItem[] = $state([
		{id: 1, title: "Sunrise", color: "#fda4af"},
		{id: 2, title: "Forest", color: "#86efac"},
		{id: 3, title: "Ocean", color: "#7dd3fc"},
		{id: 4, title: "Desert", color: "#fdba74"}
	])

	function makeImageItems(img: ImageItem): MenuButtonItem[] {
		return [
			{label: `Preview "${img.title}"`, icon: "eye", onclick: () => setAction(`Preview ${img.title}`)},
			{label: "Favorite", icon: "heart", onclick: () => setAction(`Favorite ${img.title}`)},
			{label: "Share", icon: "share", onclick: () => setAction(`Share ${img.title}`)},
			{label: "Delete", icon: "delete", danger: true, dividerBefore: true, onclick: () => {
				images = images.filter(i => i.id !== img.id)
				setAction(`Deleted ${img.title}`)
			}}
		]
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>ContextMenu</h1>

	<p>
		Right-click anywhere inside the wrapped children to open a floating menu at the
		cursor. Shares the same <code>MenuButtonItem</code> shape as <code>&lt;MenuButton&gt;</code>
		— icon, label, disabled, visible, danger, dividerBefore, onclick — and the same
		visual language as QuickGrid's built-in context menu.
	</p>

	<p>
		Positioning is handled by <a href="https://floating-ui.com/" target="_blank" rel="noopener">Floating UI</a>
		so the menu automatically flips away from the viewport edge (right-click near the
		bottom of the screen and it opens upward), shifts horizontally to stay visible,
		and caps its own height when space is tight so it becomes scrollable instead of
		being cut off.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Blazor">FluentUI Blazor (N/A)</span>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>

		<h3>Basic usage</h3>
		<p>
			Right-click inside the box below. The browser's native context menu is
			suppressed for this area and ours opens at the cursor.
		</p>
		<ContextMenu items={fileItems} onopen={({x, y}) => lastCursor = {x, y}}>
			<div class="demo-box">
				<strong>Right-click me</strong>
				<div class="demo-hint">
					The menu opens wherever the cursor is — try the top-left, bottom-right,
					or near the edges of the viewport to see the flip/shift behaviour.
				</div>
			</div>
		</ContextMenu>

		<div class="demo-status">
			Last action: <strong>{lastAction}</strong>
			{#if lastCursor}
				&middot; opened at <code>({lastCursor.x}, {lastCursor.y})</code>
			{/if}
		</div>

		<h3>Side-opening submenus</h3>
		<p>
			Pass <code>children</code> without <code>expandable</code> to render an
			item as a submenu trigger — hover (or focus) opens a floating submenu
			to the right. The submenu auto-flips to the left when there's no room on
			the right and can be nested arbitrarily (the <em>New / From template</em>
			item below opens a third level). Hover intent delays (150ms open / 250ms
			close) prevent flicker and let you diagonally swoop from trigger to submenu.
		</p>
		<ContextMenu items={submenuItems}>
			<div class="demo-box">
				<strong>Right-click me</strong>
				<div class="demo-hint">
					Hover <em>New</em> or <em>Share</em> to open submenus; hover
					<em>From template</em> inside New to nest further.
				</div>
			</div>
		</ContextMenu>

		<h3>Expandable sections</h3>
		<p>
			Pass <code>children</code> plus <code>expandable: true</code> on a menu item
			to render it as an inline section header. Clicking the chevron expands or
			collapses the nested items in place — ideal for sidebar-style component
			pickers or grouped action lists. Mix expandable sections with regular items
			and dividers freely.
		</p>
		<ContextMenu items={navItems}>
			<div class="demo-box">
				<strong>Right-click me</strong>
				<div class="demo-hint">
					Right-click to open a menu with expandable <em>Form &amp; Inputs</em> and
					<em>List</em> sections at the top, followed by ungrouped items
					separated by dividers. Click a section's chevron to collapse it.
				</div>
			</div>
		</ContextMenu>

		<h3>Offset from cursor</h3>
		<p>
			By default the menu opens right at the click position, which means the
			cursor is sitting on the first menu item. Use
			<code>offsetMenuX</code> and <code>offsetMenuY</code> to push the menu
			away from the cursor so the user doesn't have to move the mouse back to
			click an item.
		</p>

		<div class="offset-controls">
			<label class="offset-field">
				<span>offsetMenuX: <strong>{offsetX}px</strong></span>
				<Slider min={0} max={40} step={1} bind:value={offsetX} style="flex: 1; max-width: 240px;" />
			</label>
			<label class="offset-field">
				<span>offsetMenuY: <strong>{offsetY}px</strong></span>
				<Slider min={0} max={40} step={1} bind:value={offsetY} style="flex: 1; max-width: 240px;" />
			</label>
		</div>

		<ContextMenu items={fileItems} offsetMenuX={offsetX} offsetMenuY={offsetY}>
			<div class="demo-box">
				<strong>Right-click me</strong>
				<div class="demo-hint">
					Adjust the sliders and right-click — the menu will open further away
					from the cursor.
				</div>
			</div>
		</ContextMenu>

		<h3>Conditional items</h3>
		<p>
			Toggle the checkbox below, then right-click the box — the Delete item
			becomes disabled when the lock is on.
		</p>
		<label class="demo-toggle">
			<input type="checkbox" bind:checked={blockDelete} />
			Lock destructive actions (Delete will be disabled)
		</label>

		<ContextMenu items={conditionalItems}>
			<div class="demo-box">
				<strong>Right-click for conditional menu</strong>
			</div>
		</ContextMenu>

		<h3>Per-item menus in a list</h3>
		<p>
			Each item has its own <code>&lt;ContextMenu&gt;</code> with actions tailored to
			the item. Right-click any card to see its own menu; pick Delete to remove it.
		</p>
		<div class="demo-grid">
			{#each images as img (img.id)}
				<ContextMenu items={makeImageItems(img)}>
					<div class="demo-card" style="background: {img.color};">
						<div class="demo-card-title">{img.title}</div>
						<div class="demo-card-hint">right-click</div>
					</div>
				</ContextMenu>
			{/each}
		</div>
		{#if images.length === 0}
			<p>
				<em>All items deleted.</em>
				<button type="button" onclick={() => images = [
					{id: 1, title: "Sunrise", color: "#fda4af"},
					{id: 2, title: "Forest", color: "#86efac"},
					{id: 3, title: "Ocean", color: "#7dd3fc"},
					{id: 4, title: "Desert", color: "#fdba74"}
				]}>Reset</button>
			</p>
		{/if}

		<h3>Disabled trigger</h3>
		<p>
			Set <code>disabled</code> to fall back to the browser's native right-click menu —
			useful when an element should opt out of the custom menu (e.g. an editable
			textarea where users still need Paste/Undo).
		</p>
		<ContextMenu items={fileItems} disabled>
			<div class="demo-box demo-box-disabled">
				<strong>Right-click falls through to the browser menu</strong>
			</div>
		</ContextMenu>
	</Card>
</Stack>

<style>
	.demo-box {
		padding: 2rem;
		border: 2px dashed var(--neutral-stroke-rest, #d1d1d1);
		border-radius: 6px;
		text-align: center;
		background: var(--neutral-layer-2);
		min-height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		user-select: none;
	}

	.demo-hint {
		font-size: 0.85rem;
		color: var(--neutral-foreground-hint);
		max-width: 40em;
		margin: 0 auto;
	}

	.demo-status {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: var(--neutral-foreground-hint);
	}

	.demo-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		margin-bottom: 0.75rem;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.demo-card {
		padding: 1.25rem 1rem;
		border-radius: 6px;
		min-height: 90px;
		color: #1f2937;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		cursor: context-menu;
		user-select: none;
	}

	.demo-card-title {
		font-weight: 600;
	}

	.demo-card-hint {
		font-size: 0.75rem;
		opacity: 0.6;
	}

	.demo-box-disabled {
		border-color: var(--neutral-stroke-hint, #b0b0b0);
		background: transparent;
	}

	.offset-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.offset-field {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 18rem;
	}

	.offset-field span {
		min-width: 9rem;
	}
</style>
