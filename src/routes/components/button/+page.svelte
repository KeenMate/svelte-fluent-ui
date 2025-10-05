<script lang="ts">
	import {Button, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	let count = $state(0)

	function onButtonClick(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked)
		count += 1
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state"},
		{name: "form", type: "string", default: "undefined", description: "Associated form ID"},
		{name: "formaction", type: "string", default: "undefined", description: "Form action URL"},
		{name: "formenctype", type: "string", default: "undefined", description: "Form encoding type"},
		{name: "formmethod", type: "string", default: "undefined", description: "Form HTTP method"},
		{name: "formnovalidate", type: "boolean", default: "undefined", description: "Skip form validation"},
		{name: "formtarget", type: "string", default: "undefined", description: "Form target window"},
		{name: "name", type: "string", default: "undefined", description: "Button name"},
		{name: "type", type: "string", default: "undefined", description: "Button type"},
		{name: "value", type: "string", default: "undefined", description: "Button value"},
		{name: "start", type: "SlotType", default: "undefined", description: "Start slot content"},
		{name: "end", type: "SlotType", default: "undefined", description: "End slot content"}
	]

	const callbacks: Property[] = [
		{name: "checkValidity", type: "() => boolean", default: "undefined", description: "Check form validity"},
		{name: "onClick", type: "(ev: PointerEvent) => void", default: "undefined", description: "Click event handler"},
		{name: "reportValidity", type: "() => boolean", default: "undefined", description: "Report form validity"},
		{name: "setCustomValidity", type: "(message: string) => any", default: "undefined", description: "Set custom validity message"},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void", default: "undefined", description: "Set validity state"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Default slot content"},
		{name: "start", type: "any", default: "undefined", description: "Start icon or content"},
		{name: "end", type: "any", default: "undefined", description: "End icon or content"}
	]

	const actions: Property[] = [
		{name: "select", type: "() => void", default: "-", description: "Select the button"},
		{name: "checkValidity", type: "() => boolean", default: "-", description: "Check form validity"},
		{name: "reportValidity", type: "() => boolean", default: "-", description: "Report form validity"},
		{name: "setCustomValidity", type: "(message: string) => any", default: "-", description: "Set custom validity message"},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void", default: "-", description: "Set validity state"},
		{name: "setSelectionRange", type: "(start: number, end: number, direction?: 'forward' | 'backward' | 'none') => void", default: "-", description: "Set text selection range"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Button</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-button-button--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Button" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<Button onClick={onButtonClick}>
			Click me ({count})
		</Button>
		<Button appearance="custom" onClick={() => count = 0}>
			Reset
		</Button>
	</Card>
</Stack>
