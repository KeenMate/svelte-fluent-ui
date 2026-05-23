<script lang="ts">
	import {MenuButton, Stack, Card, Grid, GridItem, QuickGrid, Icon} from "svelte-fluentui"
	import type {MenuButtonItem} from "svelte-fluentui"
	import {References} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "items", type: "MenuButtonItem[]", default: "[]", description: "Menu entries rendered as a dropdown when the button is clicked."},
		{name: "appearance", type: "string", default: "undefined", description: "Passed through to <fluent-button>. Options: 'accent', 'lightweight', 'outline', 'stealth', 'neutral'."},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables both the trigger button and opening the menu."},
		{name: "class", type: "string", default: '""', description: "Extra class on the button element."},
		{name: "style", type: "string", default: '""', description: "Inline style on the button element."},
		{name: "position", type: '"bottom" | "top"', default: '"bottom"', description: "Preferred side to open the menu on. Auto-flips to the other side if there's no room."},
		{name: "open", type: "boolean (bindable)", default: "false", description: "Controls the menu's open state. Bind it if you want to open/close from outside."}
	]

	const itemProps: Property[] = [
		{name: "label", type: "string", default: "—", description: "Displayed text of the menu item."},
		{name: "icon", type: "string", default: "undefined", description: "Fluent icon name (regular variant) rendered before the label."},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the item — the click is ignored and the item is rendered dimmed."},
		{name: "visible", type: "boolean", default: "true", description: "When false, the item is skipped entirely (not rendered)."},
		{name: "danger", type: "boolean", default: "false", description: "Paints the item in the destructive/error color. Useful for delete/remove actions."},
		{name: "dividerBefore", type: "boolean", default: "false", description: "Renders a <fluent-divider> above this item. Ignored on the first item."},
		{name: "onclick", type: "() => void | Promise<void>", default: "undefined", description: "Called when the item is clicked. The menu auto-closes after this resolves."}
	]

	const callbacks: Property[] = [
		{name: "onopen", type: "() => void", default: "undefined", description: "Fired when the menu opens."},
		{name: "onclose", type: "() => void", default: "undefined", description: "Fired when the menu closes (from click-outside, Escape, or an item click)."}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Default slot — the button's label / content."},
		{name: "start", type: "Snippet", default: "undefined", description: "Rendered in the button's `start` slot (icon before label)."},
		{name: "end", type: "Snippet", default: "undefined", description: "Rendered in the button's `end` slot (icon after label, e.g. a chevron)."}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// --- Demo state ---
	let lastAction = $state("—")
	let controlledOpen = $state(false)

	function setAction(name: string) {
		lastAction = name
	}

	const basicItems: MenuButtonItem[] = [
		{label: "Edit", icon: "edit", onclick: () => setAction("Edit")},
		{label: "Duplicate", icon: "copy", onclick: () => setAction("Duplicate")},
		{label: "Share", icon: "share", onclick: () => setAction("Share")},
		{label: "Delete", icon: "delete", danger: true, dividerBefore: true, onclick: () => setAction("Delete")}
	]

	const withDisabledItems: MenuButtonItem[] = [
		{label: "Save", icon: "save", onclick: () => setAction("Save")},
		{label: "Save As…", icon: "save_copy", disabled: true},
		{label: "Export", icon: "arrow_download", onclick: () => setAction("Export")},
		{label: "Archive (coming soon)", icon: "archive", disabled: true, dividerBefore: true}
	]

	let allowDelete = $state(false)
	const conditionalItems = $derived<MenuButtonItem[]>([
		{label: "View", icon: "eye", onclick: () => setAction("View")},
		{label: "Download", icon: "arrow_download", onclick: () => setAction("Download")},
		{label: "Delete", icon: "delete", danger: true, dividerBefore: true, visible: allowDelete, onclick: () => setAction("Delete")}
	])

	async function asyncAction() {
		lastAction = "Running…"
		await new Promise(resolve => setTimeout(resolve, 1500))
		lastAction = "Finished async action"
	}

	const asyncItems: MenuButtonItem[] = [
		{label: "Sync now", icon: "arrow_sync", onclick: asyncAction},
		{label: "Publish", icon: "rocket", onclick: asyncAction}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>MenuButton</h1>

	<p>
		A button that opens a dropdown context menu on click instead of firing a
		single <code>onclick</code>. Uses the same visual language as the QuickGrid
		context menu and the <code>Tabs</code> <code>responsive="menu"</code> overflow
		dropdown so menus look consistent across the library.
	</p>

	<p>
		The menu is portalled to <code>&lt;body&gt;</code> via
		<code>PositioningRegion</code> so it escapes ancestor stacking contexts. It
		opens below the button by default and auto-flips to above when there isn't
		enough room below.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", na: "Not available in FluentUI Blazor"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic usage</h3>
		<p>
			Pass an array of <code>items</code>. Click the button to open, click an
			item to run its <code>onclick</code>; the menu auto-closes afterwards.
			Use <code>danger</code> for destructive actions and <code>dividerBefore</code>
			to group them.
		</p>
		<div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
			<MenuButton appearance="accent" items={basicItems}>
				Actions
			</MenuButton>

			<MenuButton appearance="outline" items={basicItems}>
				Outline
			</MenuButton>

			<MenuButton appearance="stealth" items={basicItems}>
				{#snippet start()}<Icon name="more_horizontal" size={16} />{/snippet}
				More
			</MenuButton>

			<span style="margin-left: auto; color: var(--neutral-foreground-hint);">
				Last action: <strong>{lastAction}</strong>
			</span>
		</div>

		<h3>Disabled items</h3>
		<p>
			Individual items can be disabled — they render dimmed and their
			<code>onclick</code> is ignored.
		</p>
		<MenuButton items={withDisabledItems}>File</MenuButton>

		<h3>Conditional visibility</h3>
		<p>
			Set <code>visible: false</code> on an item to omit it entirely — useful for
			permission-based menus. Toggle the checkbox below and reopen the menu to
			see the Delete item appear.
		</p>
		<div style="display: flex; align-items: center; gap: 1rem;">
			<label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
				<input type="checkbox" bind:checked={allowDelete} />
				Allow delete
			</label>
			<MenuButton appearance="neutral" items={conditionalItems}>
				Document
			</MenuButton>
		</div>

		<h3>Async item handler</h3>
		<p>
			<code>onclick</code> can return a promise. The menu closes immediately
			but you can safely perform async work after.
		</p>
		<MenuButton items={asyncItems}>Run</MenuButton>

		<h3>Controlled open state</h3>
		<p>
			Use <code>bind:open</code> to control the menu from outside — useful for
			closing it in response to some external event, or for imperatively opening
			it (e.g. from a keyboard shortcut).
		</p>
		<div style="display: flex; gap: 1rem; align-items: center;">
			<MenuButton bind:open={controlledOpen} items={basicItems} appearance="accent">
				Controlled
			</MenuButton>
			<button onclick={() => controlledOpen = !controlledOpen}>
				Toggle from outside (currently {controlledOpen ? "open" : "closed"})
			</button>
		</div>

		<h3>Open upward</h3>
		<p>
			Set <code>position="top"</code> to prefer opening above the button. The
			menu still auto-flips to below if there's no room above.
		</p>
		<div style="padding-top: 10rem;">
			<MenuButton position="top" items={basicItems} appearance="accent">
				Opens upward
			</MenuButton>
		</div>
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
		<h2>MenuButtonItem</h2>
		<p>Shape of each entry in the <code>items</code> array.</p>
		<QuickGrid items={itemProps} columns={propertyColumns} />
	</Card>
</Stack>
