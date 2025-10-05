<script lang="ts">
	import {Button, Dialog, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	let dialog: Dialog

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "modal", type: "boolean", default: "undefined", description: "Modal behavior"},
		{name: "visible", type: "boolean", default: "undefined", description: "Visibility state"},
		{name: "preventClose", type: "boolean", default: "undefined", description: "Prevent closing"},
		{name: "dismissable", type: "boolean", default: "undefined", description: "Can be dismissed"},
		{name: "trapFocus", type: "boolean", default: "undefined", description: "Trap focus"},
		{name: "ariaDescribedby", type: "string", default: "undefined", description: "Accessibility: described by"},
		{name: "ariaLabelledby", type: "string", default: "undefined", description: "Accessibility: labelled by"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"}
	]

	const actions: Property[] = [
		{name: "show", type: "() => void", default: "-", description: "Show the dialog"},
		{name: "hide", type: "() => void", default: "-", description: "Hide the dialog"}
	]

	const callbacks: Property[] = [
		{name: "onDismiss", type: "(ev: Event) => void", default: "undefined", description: "Fires when dialog is dismissed"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Dialog content"},
		{name: "actions", type: "any", default: "undefined", description: "Action buttons"},
		{name: "dismissButtonText", type: "any", default: "undefined", description: "Dismiss button text"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Dialog</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dialog-dialog--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Dialog" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<Button onClick={() => dialog.show()}>
			Open dialog
		</Button>

		<Dialog bind:this={dialog}>
			<p>
				Some dialog content
			</p>
		</Dialog>
	</Card>
</Stack>
