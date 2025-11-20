<script lang="ts">
	import { NumberField, Stack, Grid, GridItem, Card, QuickGrid } from "svelte-fluentui"

	let testValue="10";

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string", default: "undefined", description: "Value of the input"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "appearance", type: "string", default: "undefined", description: "Visual style"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable input"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only input"},
		{name: "required", type: "boolean", default: "undefined", description: "Marks the field as required"},
		{name: "name", type: "string", default: "undefined", description: "Name attribute"},
		{name: "label", type: "string", default: "undefined", description: "Label or slot content"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Autofocus on mount"},
		{name: "step", type: "number", default: "undefined", description: "Increment/decrement step"},
		{name: "min", type: "number|string", default: "undefined", description: "Minimum value"},
		{name: "max", type: "number|string", default: "undefined", description: "Maximum value"},
		{name: "hideStep", type: "boolean", default: "undefined", description: "Hides the stepper buttons"}
	]

	const callbacks: Property[] = [
		{name: "onInput", type: "(ev: InputEvent) => void", default: "undefined", description: "Fires as value is typed"},
		{name: "onChange", type: "(ev: Event) => void", default: "undefined", description: "Fires when value changes on blur"}
	]

	const actions: Property[] = [
		{name: "select", type: "() => void", default: "-", description: "Selects input contents"},
		{name: "checkValidity", type: "() => boolean", default: "-", description: "Returns whether input is valid"},
		{name: "reportValidity", type: "() => boolean", default: "-", description: "Triggers validation UI"},
		{name: "setCustomValidity", type: "(message: string) => void", default: "-", description: "Sets custom validity message"},
		{name: "setSelectionRange", type: "(start: number, end: number, direction?: string) => void", default: "-", description: "Programmatically set selection"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Label or slotted content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>NumberField</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/NumberField" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
					<h2>Actions</h2>
					<QuickGrid items={actions} columns={propertyColumns} sortable filterable striped />
				</Card>
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

		<h3>Age number field</h3>
		<NumberField label="Age" placeholder="Enter age" />

		<h3>With min=1, max=20, and step=5</h3>
		<NumberField label="Step 5" min={1} max={20} step={5} value={testValue} />

		<h3>Read-only and disabled</h3>
		<NumberField label="Read-only" value={"10"} readonly />
		<NumberField label="Disabled" value={"11"} disabled />
	</Card>
</Stack>
