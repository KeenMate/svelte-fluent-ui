<script lang="ts">
	import {BodyContent, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = []

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Body content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Body content</h1>

	<p>
		The main content region inside a <code>Layout</code>, sitting between the header/navigation and
		the footer. Inspired by the FluentUI Blazor BodyContent component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">BodyContent (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/BodyContent" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<BodyContent>
			This is some content displayed in a FluentBodyContent component
		</BodyContent>
	</Card>
</Stack>
