<script lang="ts">
	import {DataGrid, DataGridRow, DataGridCell, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References} from "$lib/components"

	const sampleData = [
		{name: "Adam", age: 1},
		{name: "Bob", age: 2},
		{name: "Cecilie", age: 30000}
	]

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "ariaRowCount", type: "number", default: "undefined", description: "Total number of rows (for accessibility)"},
		{name: "class", type: "string", default: '""', description: "Custom CSS classes"},
		{name: "generateHeader", type: "string", default: "undefined", description: 'Header option: "none", "default", "sticky"'},
		{name: "id", type: "string", default: "undefined", description: "Element ID"},
		{name: "role", type: "string", default: '"grid"', description: "ARIA role"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onCloseColumnOptions", type: "function", default: "undefined", description: "Fires when column options close"},
		{name: "onCloseColumnResize", type: "function", default: "undefined", description: "Fires when column resize ends"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "DataGridRow / DataGridCell structure"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>DataGrid</h1>

	<p>
		A low-level grid layout that wraps the <code>&lt;fluent-data-grid&gt;</code>,
		<code>&lt;fluent-data-grid-row&gt;</code>, and <code>&lt;fluent-data-grid-cell&gt;</code> elements.
		For a higher-level component with sorting, filtering, and pagination use <code>QuickGrid</code> instead.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/DataGrid"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic DataGrid</h3>
		<DataGrid ariaRowCount={sampleData.length + 1} generateHeader="sticky">
			<DataGridRow rowType="header">
				<DataGridCell cellType="columnheader" gridColumn={1}>Name</DataGridCell>
				<DataGridCell cellType="columnheader" gridColumn={2}>Age</DataGridCell>
			</DataGridRow>

			{#each sampleData as row}
				<DataGridRow>
					<DataGridCell gridColumn={1}>{row.name}</DataGridCell>
					<DataGridCell gridColumn={2}>{row.age}</DataGridCell>
				</DataGridRow>
			{/each}
		</DataGrid>

		<h3>Empty DataGrid</h3>
		<DataGrid ariaRowCount={2} generateHeader="sticky">
			<DataGridRow rowType="header">
				<DataGridCell cellType="columnheader" gridColumn={1}>Column 1</DataGridCell>
				<DataGridCell cellType="columnheader" gridColumn={2}>Column 2</DataGridCell>
			</DataGridRow>
			<DataGridRow>
				<DataGridCell gridColumn="1 / span 2">No data available</DataGridCell>
			</DataGridRow>
		</DataGrid>
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
</Stack>
