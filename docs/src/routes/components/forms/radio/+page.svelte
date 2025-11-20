<script lang="ts">
	import {Radio, RadioGroup, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"

	let radioValue: string | null = $state("option_1")

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const radioGroupProperties: Property[] = [
		{name: "value", type: "string", default: "undefined", description: "Selected radio value (bindable)"},
		{name: "name", type: "string", default: "undefined", description: "Form name for the radio group"},
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only state"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state for entire group"}
	]

	const radioProperties: Property[] = [
		{name: "value", type: "string", default: "undefined", description: "Value for this radio button"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only state"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(value: string) => void", default: "undefined", description: "Fires when selected value changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Radio button options"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Radio</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-radio--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Radio" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>RadioGroup Properties</h2>
					<QuickGrid items={radioGroupProperties} columns={propertyColumns} sortable filterable striped />
				</Card>
				<Card>
					<h2>Radio Properties</h2>
					<QuickGrid items={radioProperties} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
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
		<div class="example-group">
		<div>
			<RadioGroup
				bind:value={radioValue}
				name="second-radio"
				orientation="vertical"
				class="radio-group-wrapper"
			>
				<Radio value="option_1">Option 1</Radio>
				<Radio value="option_2">Option 2</Radio>
				<Radio value="option_3">Option 3</Radio>
				<Radio value="option_4">Option 4</Radio>
			</RadioGroup>
		</div>
		Value is: {radioValue}
	</div>
	<div class="example-group">
		<div>
			<RadioGroup
				bind:value={radioValue}
				name="second-radio"
				class="radio-group-wrapper"
				disabled
			>
				<Radio value="option_1">Option 1</Radio>
				<Radio value="option_2">Option 2</Radio>
				<Radio value="option_3">Option 3</Radio>
				<Radio value="option_4">Option 4</Radio>
			</RadioGroup>
		</div>
	</div>
	</Card>
</Stack>

<style>
	.example-group {
		margin-bottom: 0.5rem;
	}
</style>
