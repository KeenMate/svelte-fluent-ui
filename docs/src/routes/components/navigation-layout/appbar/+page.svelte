<script lang="ts">
	import {AppBar, AppBarItem, ResourcesIcon, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {AppBarOrientation} from "svelte-fluentui/constants"

	function onAppBarItemClicked(ev: Event) {
		console.log("Nav appbar item clicked", ev)
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const appBarProperties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "AppBar orientation"}
	]

	const appBarCallbacks: Property[] = []

	const appBarSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "AppBarItem components"}
	]

	const appBarItemProperties: Property[] = [
		{name: "href", type: "string", default: "undefined", description: "URL — renders the item as a link"},
		{name: "rel", type: "string", default: "undefined", description: "Link rel attribute"},
		{name: "count", type: "number", default: "undefined", description: "Optional counter badge"},
		{name: "active", type: "boolean", default: "undefined", description: "Marks the item as active (bindable)"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class"}
	]

	const appBarItemCallbacks: Property[] = [
		{name: "onClick", type: "(ev: MouseEvent) => void", default: "undefined", description: "Fires when the item is clicked"}
	]

	const appBarItemSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Item label content"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Icon rendered above the label"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

{#snippet commonItemIcon()}
	<ResourcesIcon aria-hidden="true" part="icon-rest" />
	<ResourcesIcon aria-hidden="true" part="icon-active" active />
{/snippet}

<Stack orientation="vertical" gap="1rem">
	<h1>AppBar</h1>

	<p>
		A persistent application bar of icon-and-label items rendered vertically or horizontally, typically
		used for top-level navigation. Inspired by the FluentUI Blazor AppBar component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">AppBar (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/AppBar" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBar Properties</h2>
				<QuickGrid items={appBarProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBar Callbacks</h2>
				<QuickGrid items={appBarCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBar Slots</h2>
				<QuickGrid items={appBarSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBarItem Properties</h2>
				<QuickGrid items={appBarItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBarItem Callbacks</h2>
				<QuickGrid items={appBarItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AppBarItem Slots</h2>
				<QuickGrid items={appBarItemSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<div class="examples-container">
			<div class="example-item">
				<h3>Regular AppBar</h3>

				<Stack verticalAlign="start" horizontalAlign="start" vertical>
					<AppBar>
						<AppBarItem href="https://microsoft.com" rel="noreferer noorigin" target="_blank" icon={commonItemIcon}>
							Microsoft
						</AppBarItem>

						<AppBarItem href="/" icon={commonItemIcon}>
							Home
						</AppBarItem>
						<AppBarItem onClick={onAppBarItemClicked} icon={commonItemIcon}>
							Item 2
						</AppBarItem>
						<AppBarItem href="https://microsoft.com" icon={commonItemIcon}>
							Item 4
						</AppBarItem>
						<AppBarItem icon={commonItemIcon}>
							Item 5
						</AppBarItem>
					</AppBar>
				</Stack>
			</div>
			<div class="example-item">
				<h3>Horizontal AppBar menu</h3>

				<Stack verticalAlign="start" horizontalAlign="start" vertical>
					<AppBar orientation={AppBarOrientation.Horizontal}>
						<AppBarItem title="Item 1 tooltip" icon={commonItemIcon}>
							Item 1
						</AppBarItem>
						<AppBarItem title="Item 2 tooltip" icon={commonItemIcon}>
							Item 2
						</AppBarItem>
						<AppBarItem title="Item 4 tooltip" icon={commonItemIcon}>
							Item 4
						</AppBarItem>
					</AppBar>
				</Stack>
			</div>
		</div>
	</Card>
</Stack>

<style>
	.component-name {
		font-family: monospace;
	}

	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.example-item {
		flex: 1;
	}
</style>
