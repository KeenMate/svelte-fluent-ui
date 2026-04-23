<script lang="ts">
	import {Listbox, Option, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	let selectedValue: string = "banana";

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string", default: "required", description: "Option value"},
		{name: "label", type: "string", default: "undefined", description: "Optional display label"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the option"},
		{name: "selected", type: "boolean", default: "undefined", description: "Force selection"},
		{name: "style", type: "string", default: '""', description: "Custom inline styles"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onClick", type: "(event: MouseEvent) => void", default: "undefined", description: "Optional click handler"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Option label content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Option</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dropdown-option--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Option" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<h2 class="content-subhead">Examples</h2>

		<h3>Basic option in listbox</h3>
		<Listbox bind:value={selectedValue}>
			<Option value="apple">Apple</Option>
			<Option value="banana">Banana</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>
		<p>Selected: {selectedValue}</p>

		<h3>Disabled option</h3>
		<Listbox value="banana">
			<Option value="apple">Apple</Option>
			<Option value="banana" disabled={true}>Banana (disabled)</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>
	</Card>
</Stack>
