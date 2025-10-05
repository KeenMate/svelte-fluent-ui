<script lang="ts">
	import {AppBar, AppBarItem, ResourcesIcon, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"
	import {AppBarOrientation} from "$lib/fluent-ui/constants/app-bar.js"

	function onAppBarItemClicked(ev: Event) {
		console.log("Nav appbar item clicked", ev)
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "AppBar orientation"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "AppBarItem components"}
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

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">AppBar (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/AppBar" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<p>
		For components: <br>
		<span class="component-name">AppBar</span>,
		<span class="component-name">AppBarItem</span>
	</p>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<p>(of AppBar)</p>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<p>(of AppBar)</p>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<div class="examples-container">
		<div class="example-item">
			<h5>Regular AppBar</h5>

			<Stack varticalAlign="start" horizontalAlign="start" vertical>
				<AppBar>
					<AppBarItem href="https://microsoft.com" rel="noreferer noorigin" target="_blank" icon={commonItemIcon}>
						Microsoft
					</AppBarItem>

					<AppBarItem href="/" icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Home
					</AppBarItem>
					<AppBarItem onClick={onAppBarItemClicked} icon={commonItemIcon}>
						Item 2
					</AppBarItem>
					<AppBarItem href="https://microsoft.com" icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 4
					</AppBarItem>
					<AppBarItem icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 5
					</AppBarItem>
				</AppBar>
			</Stack>
		</div>
		<div class="example-item">
			<h5>Horizontal AppBar menu</h5>

			<Stack varticalAlign="start" horizontalAlign="start" vertical>
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
