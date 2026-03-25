<script lang="ts">
	import {Card, QuickGrid, Stack, Grid, GridItem} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "width", type: "string | number", default: "undefined", description: "Card width"},
		{name: "height", type: "string | number", default: "undefined", description: "Card height"},
		{name: "areaRestricted", type: "boolean", default: "undefined", description: "Restrict area"},
		{name: "class", type: "string", default: "undefined", description: "Custom CSS classes"},
		{name: "style", type: "string", default: "undefined", description: "Inline styles"},
		{name: "minimalStyle", type: "boolean", default: "undefined", description: "Use minimal styling"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Default slot content"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Card</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">Card (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/Card" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<div class="examples-container">
		<Card class="flex-card">
			<p>
				Some card content
			</p>
		</Card>
		<Card width="200px" height="200px">
			<p>200x200 content</p>
		</Card>
		<Card class="flex-card">
			<p>
				Some card content
			</p>
		</Card>
		</div>
	</Card>
</Stack>

<style>
	.examples-container {
		display: flex;
		gap: 1rem;
	}
</style>
