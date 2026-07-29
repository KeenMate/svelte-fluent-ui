<script lang="ts">
	import {Tab, Tabs, QuickGrid, Stack, Grid, GridItem, Card, Icon, Badge, Slider, TextField} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let verticalStripWidth = $state(200)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const tabsProperties: Property[] = [
		{name: "id", type: "string", default: "undefined", description: "Unique ID on the tabs container"},
		{name: "class", type: "string", default: '""', description: "Custom class"},
		{name: "style", type: "string", default: '""', description: "Inline CSS"},
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Tab bar orientation"},
		{name: "activeId", type: "string (bindable)", default: "undefined", description: "ID of the currently active tab. If unset on mount, defaults to the first visible tab's id"},
		{name: "showActiveIndicator", type: "boolean", default: "true", description: "Show the animated full-width active indicator under (horizontal) / beside (vertical) the selected tab"},
		{name: "responsive", type: '"scroll" | "wrap" | "menu"', default: '"scroll"', description: "Overflow behaviour when the tab list is wider than the container. scroll = horizontal scroll with auto-appearing ‹ › arrow buttons. wrap = tabs flow onto multiple rows. menu = overflowing tabs collapse into a ⋯ button at the end; selecting a hidden tab swaps it into the strip in place of the last-visible tab (ellipsis truncation on borderline tabs)"},
		{name: "justify", type: "boolean", default: "false", description: "When true, the tab list stretches to fill the container and tabs divide the row equally. Default keeps the compact start-aligned layout"},
		{name: "stripWidth", type: "string (CSS length)", default: "undefined", description: "Fixed width for the tab strip. Most useful in orientation='vertical' — caps the sidebar width and auto-ellipsises long labels"},
		{name: "stripHeight", type: "string (CSS length)", default: "undefined", description: "Fixed height for the tab strip (symmetric counterpart to stripWidth). Rarely needed"},
		{name: "swipe", type: "boolean", default: "true", description: "Enable swipe-left/right (or swipe-up/down in vertical orientation) on the tabpanels to navigate prev/next tab. Touches starting on interactive elements (input, button, slider, contenteditable) are ignored so form controls keep their gestures"}
	]

	const tabsCallbacks: Property[] = [
		{name: "ontabchange", type: "(detail: { tabId: string; data?: Record<string, unknown> }) => void", default: "undefined", description: "Fired when the active tab changes. `data` is whatever the tab registered via its `data` prop"}
	]

	const tabsSlots: Property[] = [
		{name: "childContent", type: "SlotType", default: "undefined", description: "Slot containing the child <Tab> elements"}
	]

	const tabProperties: Property[] = [
		{name: "id", type: "string", default: "undefined", description: "Unique ID"},
		{name: "label", type: "string", default: "undefined", description: "Tab label text"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the tab"},
		{name: "labelEditable", type: "boolean", default: "false", description: "Allows inline editing of the tab label"},
		{name: "showClose", type: "boolean", default: "false", description: "Shows a close (×) button on the tab"},
		{name: "visible", type: "boolean", default: "true", description: "Controls whether the tab is rendered"},
		{name: "data", type: "Record<string, unknown>", default: "undefined", description: "Arbitrary context data surfaced to ontabchange when this tab is selected"},
		{name: "class", type: "string", default: '""', description: "Custom class"},
		{name: "style", type: "string", default: '""', description: "Inline CSS"}
	]

	const tabCallbacks: Property[] = [
		{name: "canLeave", type: "() => boolean | Promise<boolean>", default: "undefined", description: "Guard called on the active tab before Tabs switches to another tab. Return false (or resolve to false) to veto the switch — e.g. when the tab has unsaved changes. May be async to await a confirm dialog. Covers click, keyboard, swipe and overflow-menu navigation (not external activeId assignment)"},
		{name: "canClose", type: "() => boolean | Promise<boolean>", default: "undefined", description: "Guard called before the tab's close (×) button fires oncloseclick. Return false (or resolve to false) to veto the close — e.g. to confirm discarding unsaved data. Independent of canLeave (leaving keeps the tab, closing destroys it). May be async"},
		{name: "oncloseclick", type: "() => void", default: "undefined", description: "Fired when the tab's close (×) button is clicked (after canClose passes, if set)"}
	]

	const tabSlots: Property[] = [
		{name: "icon", type: "SlotType", default: "undefined", description: "Optional icon slot rendered before the label"},
		{name: "header", type: "SlotType", default: "undefined", description: "Fully custom header content (replaces the icon + label default)"},
		{name: "content", type: "SlotType", default: "undefined", description: "Tab panel content"},
		{name: "childContent", type: "SlotType", default: "undefined", description: "Alternative content slot, rendered after `content`"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Tracks active tab for the ontabchange demo
	let activeId = $state("overview")
	let lastSelected = $state<{tabId: string; data?: Record<string, unknown>} | undefined>(undefined)

	function handleTabChange(detail: {tabId: string; data?: Record<string, unknown>}) {
		lastSelected = detail
		activeId = detail.tabId
	}

	// Closable tabs demo
	let closableTabs = $state([
		{id: "doc1", label: "Invoice-2026-04.pdf", icon: "document"},
		{id: "doc2", label: "Contract.docx", icon: "document"},
		{id: "doc3", label: "Budget-Q2.xlsx", icon: "document"},
		{id: "doc4", label: "Notes.txt", icon: "document"}
	])
	function closeTab(id: string) {
		closableTabs = closableTabs.filter(t => t.id !== id)
	}

	// Guarded switch (dirty data) demo — the active tab vetoes leaving while
	// its field is non-empty. `canLeave` may be async; here we use a sync confirm.
	let guardActiveId = $state("edit")
	let draft = $state("")
	function confirmLeaveIfDirty() {
		if (!draft) return true
		return confirm("You have unsaved changes. Discard them and switch tabs?")
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Tabs"
		description="Custom Svelte tabbed interface with horizontal/vertical orientations, overflow handling, closable/editable tabs, and swipe navigation."
		keywords="svelte, fluentui, tabs, tab, panel, navigation, web components"
	/>

	<h1>Tabs</h1>

	<p>
		A custom tabbed interface rendering native <code>&lt;button role="tab"&gt;</code> elements, with
		horizontal/vertical orientations, overflow handling (scroll, wrap, or ellipsis menu), closable
		and editable tabs, and optional swipe navigation between panels.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-tablist--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Tabs"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic tab layout</h3>
		<p>Minimal tabs — labels only.</p>
		<Tabs>
			{#snippet childContent()}
				<Tab id="tab1" label="First tab">
					{#snippet content()}
						<p>Example text for tab 1</p>
					{/snippet}
				</Tab>
				<Tab id="tab2" label="Second tab">
					{#snippet content()}
						<p>Example text for tab 2</p>
					{/snippet}
				</Tab>
				<Tab id="tab3" label="Third tab">
					{#snippet content()}
						<p>Example text for tab 3</p>
					{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Tabs with icons</h3>
		<p>Pass an <code>icon</code> snippet to each <code>&lt;Tab&gt;</code>.</p>
		<Tabs activeId="home-tab">
			{#snippet childContent()}
				<Tab id="home-tab" label="Home">
					{#snippet icon()}
						<Icon name="home" size={16} />
					{/snippet}
					{#snippet content()}
						<p>Landing page content.</p>
					{/snippet}
				</Tab>
				<Tab id="profile-tab" label="Profile">
					{#snippet icon()}
						<Icon name="person" size={16} />
					{/snippet}
					{#snippet content()}
						<p>Profile details and avatar.</p>
					{/snippet}
				</Tab>
				<Tab id="inbox-tab" label="Inbox">
					{#snippet icon()}
						<Icon name="mail" size={16} />
					{/snippet}
					{#snippet content()}
						<p>Unread messages and notifications.</p>
					{/snippet}
				</Tab>
				<Tab id="calendar-tab" label="Calendar">
					{#snippet icon()}
						<Icon name="calendar" size={16} />
					{/snippet}
					{#snippet content()}
						<p>Upcoming events and reminders.</p>
					{/snippet}
				</Tab>
				<Tab id="settings-tab" label="Settings">
					{#snippet icon()}
						<Icon name="settings" size={16} />
					{/snippet}
					{#snippet content()}
						<p>Preferences and integrations.</p>
					{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Custom header with badge</h3>
		<p>
			Use the <code>header</code> snippet for arbitrary header content — here
			we put an icon, a label, and a status badge together on the "Inbox" tab.
		</p>
		<Tabs activeId="overview2">
			{#snippet childContent()}
				<Tab id="overview2" label="Overview">
					{#snippet icon()}<Icon name="home" size={16} />{/snippet}
					{#snippet content()}<p>Overview page</p>{/snippet}
				</Tab>
				<Tab id="inbox2">
					{#snippet header()}
						<Icon name="mail" size={16} />
						<span>Inbox</span>
						<Badge appearance="accent">3</Badge>
					{/snippet}
					{#snippet content()}<p>You have 3 unread messages.</p>{/snippet}
				</Tab>
				<Tab id="archive2" label="Archive">
					{#snippet icon()}<Icon name="folder" size={16} />{/snippet}
					{#snippet content()}<p>Archived items.</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Justified tabs</h3>
		<p>
			<code>justify</code> stretches the tab list to fill the container and
			each tab takes an equal share of the row. Useful for fixed, top-level
			section navigation.
		</p>
		<Tabs justify activeId="summary">
			{#snippet childContent()}
				<Tab id="summary" label="Summary">
					{#snippet icon()}<Icon name="document" size={16} />{/snippet}
					{#snippet content()}<p>High-level summary</p>{/snippet}
				</Tab>
				<Tab id="details" label="Details">
					{#snippet icon()}<Icon name="info" size={16} />{/snippet}
					{#snippet content()}<p>Detailed breakdown</p>{/snippet}
				</Tab>
				<Tab id="history" label="History">
					{#snippet icon()}<Icon name="history" size={16} />{/snippet}
					{#snippet content()}<p>Activity log</p>{/snippet}
				</Tab>
				<Tab id="sharing" label="Sharing">
					{#snippet icon()}<Icon name="share" size={16} />{/snippet}
					{#snippet content()}<p>Share and permissions</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Responsive modes</h3>
		<p>
			Many tabs + narrow container. Resize the browser (or the preview
			containers below) to see how each mode handles overflow.
		</p>

		<Stack orientation="vertical" gap="1rem">
			<div>
				<p><strong><code>responsive="scroll"</code> (default)</strong> — horizontal scrollbar appears when tabs don't fit.</p>
				<div style="max-width: 420px; border: 1px dashed var(--neutral-stroke-rest); padding: 0.5rem;">
					<Tabs responsive="scroll" activeId="s1">
						{#snippet childContent()}
							<Tab id="s1" label="Basic info" />
							<Tab id="s2" label="Languages" />
							<Tab id="s3" label="Additional attributes" />
							<Tab id="s4" label="Values" />
							<Tab id="s5" label="Maintenance" />
							<Tab id="s6" label="Audit trail" />
							<Tab id="s7" label="Integrations" />
						{/snippet}
					</Tabs>
				</div>
			</div>

			<div>
				<p><strong><code>responsive="wrap"</code></strong> — tabs flow onto multiple rows.</p>
				<div style="max-width: 420px; border: 1px dashed var(--neutral-stroke-rest); padding: 0.5rem;">
					<Tabs responsive="wrap" activeId="w1">
						{#snippet childContent()}
							<Tab id="w1" label="Basic info" />
							<Tab id="w2" label="Languages" />
							<Tab id="w3" label="Additional attributes" />
							<Tab id="w4" label="Values" />
							<Tab id="w5" label="Maintenance" />
							<Tab id="w6" label="Audit trail" />
							<Tab id="w7" label="Integrations" />
						{/snippet}
					</Tabs>
				</div>
			</div>

			<div>
				<p><strong><code>responsive="menu"</code></strong> — tabs that don't fit collapse into a <code>⋯</code> button at the end. Clicking it opens a menu of hidden tabs; selecting one swaps it into the strip in place of the last visible tab.</p>
				<div style="max-width: 420px; border: 1px dashed var(--neutral-stroke-rest); padding: 0.5rem;">
					<Tabs responsive="menu" activeId="m1">
						{#snippet childContent()}
							<Tab id="m1" label="Basic info" />
							<Tab id="m2" label="Language & Countries" />
							<Tab id="m3" label="Additional attributes" />
							<Tab id="m4" label="Values" />
							<Tab id="m5" label="Maintenance" />
							<Tab id="m6" label="Audit trail" />
							<Tab id="m7" label="Integrations" />
						{/snippet}
					</Tabs>
				</div>
			</div>
		</Stack>

		<h3>Vertical orientation</h3>
		<p>
			Set <code>orientation="vertical"</code> for stacked tabs (side navigation style).
			Use the slider below to change <code>stripWidth</code> and watch the labels
			ellipsis when the strip gets too narrow for the full text.
		</p>

		<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
			<label for="v-strip-slider" style="min-width: 10rem;">
				stripWidth: <strong>{verticalStripWidth}px</strong>
			</label>
			<Slider
				id="v-strip-slider"
				min={80}
				max={360}
				step={10}
				bind:value={verticalStripWidth}
				style="flex: 1; max-width: 360px;"
			/>
		</div>

		<div style="display: flex; min-height: 180px;">
			<Tabs orientation="vertical" activeId="v1" stripWidth={`${verticalStripWidth}px`}>
				{#snippet childContent()}
					<Tab id="v1" label="General">
						{#snippet icon()}<Icon name="settings" size={16} />{/snippet}
						{#snippet content()}<p>General settings</p>{/snippet}
					</Tab>
					<Tab id="v2" label="Appearance & Theme Customization">
						{#snippet icon()}<Icon name="color" size={16} />{/snippet}
						{#snippet content()}<p>Theme, accent color, density</p>{/snippet}
					</Tab>
					<Tab id="v3" label="Notifications">
						{#snippet icon()}<Icon name="alert" size={16} />{/snippet}
						{#snippet content()}<p>Notification preferences</p>{/snippet}
					</Tab>
					<Tab id="v4" label="Security, Privacy & Data Sharing">
						{#snippet icon()}<Icon name="shield" size={16} />{/snippet}
						{#snippet content()}<p>Password, 2FA, sessions</p>{/snippet}
					</Tab>
				{/snippet}
			</Tabs>
		</div>

		<h3>Closable tabs</h3>
		<p>
			Set <code>showClose</code> on a tab and listen to <code>oncloseclick</code>
			to get the "browser-style" closable tab UX. Add a <code>canClose</code> guard
			to confirm before destroying a tab (independent of <code>canLeave</code>). Closing
			a tab below asks you to confirm — except <code>Notes.txt</code>, which has no guard
			and closes immediately.
		</p>
		{#if closableTabs.length > 0}
			<Tabs activeId={closableTabs[0].id}>
				{#snippet childContent()}
					{#each closableTabs as t (t.id)}
						<Tab
							id={t.id}
							label={t.label}
							showClose
							canClose={t.label === "Notes.txt" ? undefined : () => confirm(`Close ${t.label}?`)}
							oncloseclick={() => closeTab(t.id)}
						>
							{#snippet icon()}<Icon name={t.icon} size={16} />{/snippet}
							{#snippet content()}<p>Content of {t.label}</p>{/snippet}
						</Tab>
					{/each}
				{/snippet}
			</Tabs>
		{:else}
			<p><em>No tabs left. Refresh the page to reset.</em></p>
		{/if}

		<h3>Disabled tab</h3>
		<p>Disabled tabs are greyed out and cannot be activated.</p>
		<Tabs activeId="d1">
			{#snippet childContent()}
				<Tab id="d1" label="Active">
					{#snippet icon()}<Icon name="checkmark" size={16} />{/snippet}
					{#snippet content()}<p>This tab is enabled.</p>{/snippet}
				</Tab>
				<Tab id="d2" label="Disabled" disabled>
					{#snippet icon()}<Icon name="lock" size={16} />{/snippet}
					{#snippet content()}<p>This tab is disabled.</p>{/snippet}
				</Tab>
				<Tab id="d3" label="Also active">
					{#snippet icon()}<Icon name="star" size={16} />{/snippet}
					{#snippet content()}<p>This tab is enabled.</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Editable labels</h3>
		<p>
			Set <code>labelEditable</code> to let users rename a tab inline. Click
			the label to edit, press <kbd>Enter</kbd> or click away to commit.
		</p>
		<Tabs activeId="e1">
			{#snippet childContent()}
				<Tab id="e1" label="Untitled 1" labelEditable>
					{#snippet icon()}<Icon name="edit" size={16} />{/snippet}
					{#snippet content()}<p>Editable tab</p>{/snippet}
				</Tab>
				<Tab id="e2" label="Untitled 2" labelEditable>
					{#snippet icon()}<Icon name="edit" size={16} />{/snippet}
					{#snippet content()}<p>Another editable tab</p>{/snippet}
				</Tab>
				<Tab id="e3" label="Fixed name">
					{#snippet icon()}<Icon name="lock" size={16} />{/snippet}
					{#snippet content()}<p>Not editable.</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>

		<h3>Controlled activeId with <code>ontabchange</code> + tab data</h3>
		<p>
			Each tab passes a <code>data</code> object that's surfaced to
			<code>ontabchange</code>. Current active: <strong>{activeId}</strong>.
		</p>
		<Tabs {activeId} ontabchange={handleTabChange}>
			{#snippet childContent()}
				<Tab id="overview" label="Overview" data={{section: "overview", index: 0}}>
					{#snippet icon()}<Icon name="home" size={16} />{/snippet}
					{#snippet content()}<p>Overview panel.</p>{/snippet}
				</Tab>
				<Tab id="members" label="Members" data={{section: "members", index: 1}}>
					{#snippet icon()}<Icon name="people" size={16} />{/snippet}
					{#snippet content()}<p>Members panel.</p>{/snippet}
				</Tab>
				<Tab id="activity" label="Activity" data={{section: "activity", index: 2}}>
					{#snippet icon()}<Icon name="history" size={16} />{/snippet}
					{#snippet content()}<p>Activity panel.</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>
		{#if lastSelected}
			<p style="margin-top: 1rem;">
				<strong>Last event:</strong>
				<code>{JSON.stringify(lastSelected)}</code>
			</p>
		{/if}

		<h3>Blocking a switch (unsaved changes)</h3>
		<p>
			Give the active <code>&lt;Tab&gt;</code> a <code>canLeave</code> guard. Tabs calls it
			before navigating away and cancels the switch if it returns <code>false</code> (it may
			also be async and await a confirm dialog). Type into the field below, then try clicking
			another tab — you'll be asked to confirm.
		</p>
		<Tabs bind:activeId={guardActiveId}>
			{#snippet childContent()}
				<Tab id="edit" label="Edit" canLeave={confirmLeaveIfDirty}>
					{#snippet content()}
						<Stack orientation="vertical" gap="0.5rem">
							<p>This tab blocks leaving while the field below is non-empty.</p>
							<TextField bind:value={draft} placeholder="Type something…" />
						</Stack>
					{/snippet}
				</Tab>
				<Tab id="preview" label="Preview">
					{#snippet content()}<p>Preview panel — free to switch to once the field is empty (or you confirm).</p>{/snippet}
				</Tab>
				<Tab id="settings" label="Settings">
					{#snippet content()}<p>Settings panel</p>{/snippet}
				</Tab>
			{/snippet}
		</Tabs>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tabs Properties</h2>
				<QuickGrid items={tabsProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tabs Callbacks</h2>
				<QuickGrid items={tabsCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tabs Slots</h2>
				<QuickGrid items={tabsSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tab Properties</h2>
				<QuickGrid items={tabProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tab Callbacks</h2>
				<QuickGrid items={tabCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Tab Slots</h2>
				<QuickGrid items={tabSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>
