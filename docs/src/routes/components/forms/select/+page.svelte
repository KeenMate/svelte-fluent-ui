<script lang="ts">
	import {Select, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui";

	let selectedFruit = "apple";

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "id", type: "string", default: "undefined", description: ""},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "value", type: "string", default: "undefined", description: "Selected value"},
		{name: "required", type: "boolean", default: "undefined", description: "Form required"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the control"},
		{name: "appearance", type: "string", default: "\"outline\"", description: "Visual style"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(value: string) => void", default: "undefined", description: "Triggered when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Selectable options"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Select</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dropdown--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Select" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h2>Examples</h2>

		<h3>Basic Select</h3>
		<p>
			<Select label="Fruits" name="fruit">
				{#snippet children()}
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
					<option value="cherry">Cherry</option>
				{/snippet}
			</Select>
		</p>

		<h3>Disabled Select</h3>
		<p>
			<Select label="Disabled" disabled={true}>
				{#snippet children()}
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
				{/snippet}
			</Select>
		</p>

		<h3>Controlled Select</h3>
		<p>
			<Select label="Controlled" bind:value={selectedFruit} name="fruit">
				{#snippet children()}
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
					<option value="cherry">Cherry</option>
				{/snippet}
			</Select>
			Selected: {selectedFruit}
		</p>
	</Card>
</Stack>
