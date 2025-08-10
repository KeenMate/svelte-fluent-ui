<script lang="ts">
	import { DataGrid, DataGridRow, DataGridCell } from "$lib/index.js";

	const sampleData = [
		{ name: "Adam", age: 1 },
		{ name: "Bob", age: 2 },
		{ name: "Cecilie", age: 30000 }
	];
</script>

<div class="header">
	<h1>DataGrid</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>ariaRowCount</td><td>number</td><td>undefined</td><td>Total number of rows (for accessibility)</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom CSS classes</td></tr>
					<tr><td></td><td>generateHeader</td><td>string</td><td>undefined</td><td>Header option: "none", "default", "sticky"</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Element ID</td></tr>
					<tr><td></td><td>role</td><td>string</td><td>"grid"</td><td>ARIA role</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
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
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>DataGridRow / DataGridCell structure</td></tr>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic DataGrid</h3>
	<p>
		<DataGrid ariaRowCount={sampleData.length + 1} generateHeader="sticky">
			<DataGridRow rowType="header">
				<DataGridCell cellType="columnheader">Name</DataGridCell>
				<DataGridCell cellType="columnheader">Age</DataGridCell>
			</DataGridRow>

			{#each sampleData as row}
				<DataGridRow>
					<DataGridCell>{row.name}</DataGridCell>
					<DataGridCell>{row.age}</DataGridCell>
				</DataGridRow>
			{/each}
		</DataGrid>
	</p>

	<h3>Empty DataGrid</h3>
	<p>
		<DataGrid ariaRowCount={1} generateHeader="sticky">
			<DataGridRow rowType="header">
				<DataGridCell cellType="columnheader">Column 1</DataGridCell>
				<DataGridCell cellType="columnheader">Column 2</DataGridCell>
			</DataGridRow>
			<DataGridRow>
				<DataGridCell colspan="2">No data available</DataGridCell>
			</DataGridRow>
		</DataGrid>
	</p>
</div>
