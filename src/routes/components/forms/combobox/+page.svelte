<script lang="ts">
	import { Combobox, Option, Stack, Grid, GridItem, Card, QuickGrid } from "$lib/index.js";

	const stOptions = [
		{ value: "ds9", label: "Deep Space 9" },
		{ value: "voy", label: "Voyager" },
		{ value: "ent", label: "Enterprise" },
		{ value: "tng", label: "The Next generation" },
		{ value: "tos", label: "The Original series", disabled: true }
	];

	let combobox1: HTMLElement

	let value = $state("");
	let value1: string | null = $state(null);
	let gpuSelectedValue: string | null = $state(null)
	let comboboxSelectedValue: string | null = $state(null)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: '"outline" | "filled"', default: "undefined", description: "Visual style"},
		{name: "autocomplete", type: '"inline" | "list" | "both" | "none"', default: "undefined", description: "Autocomplete behavior"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "currentValue", type: "string", default: "undefined", description: "Current input text"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable the combobox"},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "open", type: "boolean", default: "undefined", description: "Dropdown open state"},
		{name: "options", type: "OptionItem[]", default: "undefined", description: "Array of option items"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "position", type: '"above" | "below"', default: "undefined", description: "Dropdown position"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "undefined", description: "Required field"},
		{name: "value", type: "string | null", default: "undefined", description: "Selected value (bindable)"}
	]

	const callbacks: Property[] = [
		{name: "onChange", type: "(value: string | null) => void", default: "undefined", description: "Fires when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: ""}
	]

	const actions: Property[] = [
		{name: "select", type: "() => void;", default: "-", description: ""},
		{name: "checkValidity", type: "() => boolean;", default: "-", description: ""},
		{name: "reportValidity", type: "() => boolean;", default: "-", description: ""},
		{name: "setCustomValidity", type: "(message: string) => any;", default: "-", description: ""},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void;", default: "-", description: ""},
		{name: "setSelectionRange", type: "(start: number, end: number, direction?: \"forward\" | \"backward\" | \"none\") => void;", default: "-", description: ""}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Combobox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-combobox--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Combobox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<h2 class="content-subhead">Examples</h2>

		<h3>Plain combobox with static options</h3>
		<Combobox
			bind:this={combobox1}
			bind:value
			placeholder="Do you feel lucky, punk?"
		>
			<Option value="yes">YES!</Option>
			<Option value="no">no..</Option>
			<Option value="what?">What?</Option>
		</Combobox>
		Selected value: {value}

		<h3>Plain combobox with array options</h3>
		<Combobox
			bind:value={value1}
			placeholder="Best StarTrek series?"
			options={stOptions}
		></Combobox>
		Selected value: {value1}

		<h3>With autocomplete</h3>
		<Combobox id="combo-2" bind:value={gpuSelectedValue} autocomplete="both" placeholder="Select a graphics card">
			<Option value="1">GTX 1060</Option>
			<Option value="2">GTX 1070</Option>
			<Option value="3">GTX 1080</Option>
			<Option value="4">GTX 1090</Option>
		</Combobox>
		Selected value: {gpuSelectedValue}

		<h3>Disabled</h3>
		<Combobox id="combo-disabled" bind:value={comboboxSelectedValue} disabled placeholder="Select an option">
			<Option value="1">Option 1</Option>
			<Option value="2">Option 2</Option>
			<Option value="3">Option 3</Option>
		</Combobox>
		Selected value: {comboboxSelectedValue}
	</Card>
</Stack>
