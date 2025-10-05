<script lang="ts">
	import Checkbox from "$lib/components/Checkbox.svelte";
	import {QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js";

	let value:boolean = $state();
	let checkboxField: HTMLElement;

	function onClicked(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked);
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "checked", type: "boolean | null", default: "bindable", description: "Checked state (bindable)"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Readonly state"},
		{name: "required", type: "boolean", default: "undefined", description: "Required field"},
		{name: "withIntermediate", type: "boolean", default: "undefined", description: "Support intermediate state"}
	]

	const callbacks: Property[] = [
		{name: "checkValidity", type: "() => boolean", default: "undefined", description: "Check form validity"},
		{name: "onClick", type: "(ev: PointerEvent, previousValue: boolean | null) => void", default: "undefined", description: "Click event handler"},
		{name: "reportValidity", type: "() => boolean", default: "undefined", description: "Report form validity"},
		{name: "setCustomValidity", type: "(message: string) => any", default: "undefined", description: "Set custom validity message"},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void", default: "undefined", description: "Set validity state"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Default slot content"}
	]

	const actions: Property[] = [
		{name: "select", type: "() => void", default: "-", description: "Select the checkbox"},
		{name: "checkValidity", type: "() => boolean", default: "-", description: "Check form validity"},
		{name: "reportValidity", type: "() => boolean", default: "-", description: "Report form validity"},
		{name: "setCustomValidity", type: "(message: string) => any", default: "-", description: "Set custom validity message"},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void", default: "-", description: "Set validity state"},
		{name: "setSelectionRange", type: '(start: number, end: number, direction?: "forward" | "backward" | "none") => void', default: "-", description: "Set text selection range"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Checkbox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-checkbox--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Checkbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<Checkbox
			bind:this={checkboxField}
			bind:checked = {value}
			onClick={onClicked}
		>Are you going to Mars?</Checkbox>
		Value: {value}
	</Card>
</Stack>
