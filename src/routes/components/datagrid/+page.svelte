<script lang="ts">
	import {DataGrid, DataGridRow, DataGridCell, Stack, Grid, GridItem, Card} from "$lib/index.js"

	const sampleData = [
		{name: "Adam", age: 1},
		{name: "Bob", age: 2},
		{name: "Cecilie", age: 30000}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>DataGrid</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/DataGrid" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr
						><td></td><td>ariaRowCount</td><td>number</td><td>undefined</td><td
							>Total number of rows (for accessibility)</td
						></tr
					>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom CSS classes</td></tr>
					<tr
						><td></td><td>generateHeader</td><td>string</td><td>undefined</td><td
							>Header option: "none", "default", "sticky"</td
						></tr
					>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Element ID</td></tr>
					<tr><td></td><td>role</td><td>string</td><td>"grid"</td><td>ARIA role</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
				</tbody>
			</table>
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2 class="content-subhead">Actions</h2>

				<table class="member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td></td>
						<td>onCloseColumnOptions</td>
						<td>function</td>
						<td>Fires when column options close</td>
					</tr>
					<tr>
						<td></td>
						<td>onCloseColumnResize</td>
						<td>function</td>
						<td>Fires when column resize ends</td>
					</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Slots</h2>

		<table class="member-table">
			<tbody>
				<tr class="slot"><td colspan="5">Slots</td></tr>
				<tr
					><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
						>DataGridRow / DataGridCell structure</td
					></tr
				>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2 class="content-subhead">Examples</h2>

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
</Stack>
