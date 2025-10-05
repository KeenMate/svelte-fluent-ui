<script lang="ts">
	import {Listbox, Option, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string | string[]", default: "undefined", description: "Selected value(s)"},
		{name: "multi", type: "boolean", default: "false", description: "Enable multiple selection"},
		{name: "readonly", type: "boolean", default: "false", description: "Disables user changes"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the component"},
		{name: "class", type: "string", default: '""', description: "Custom classes"},
		{name: "style", type: "string", default: '""', description: "Custom inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "function", default: "undefined", description: "Fired when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Listbox option elements"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Listbox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Listbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>Callbacks</h2>
					<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Basic listbox</h3>
		<Listbox value="apple">
			<Option value="apple">Apple</Option>
			<Option value="banana">Banana</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>

		<h3>Disabled listbox</h3>
		<Listbox value="banana">
			<Option value="apple" disabled>Apple</Option>
			<Option value="banana" disabled>Banana</Option>
			<Option value="cherry" disabled>Cherry</Option>
		</Listbox>
	</Card>
</Stack>
