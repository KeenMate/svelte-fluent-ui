<script lang="ts">
	import {Tooltip, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "anchor", type: "string", default: "undefined", description: "ID of anchor element"},
		{name: "autoUpdateMode", type: "string", default: "undefined", description: "Auto update mode"},
		{name: "class", type: "string", default: '""', description: "CSS classes"},
		{name: "delay", type: "number", default: "undefined", description: "Show delay"},
		{name: "horizontalViewportLock", type: "boolean", default: "undefined", description: "Lock to horizontal viewport"},
		{name: "maxWidth", type: "string", default: "undefined", description: "Maximum width"},
		{name: "position", type: "string", default: "undefined", description: "Tooltip position"},
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "verticalViewportLock", type: "boolean", default: "undefined", description: "Lock to vertical viewport"},
		{name: "visible", type: "boolean", default: "undefined", description: "Force visibility"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Tooltip content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Tooltip</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-tooltip--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Tooltip" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Tooltip on hover</h3>
		<p>
		<span
			id="hover-target">
			Top tooltip
		</span>

		<Tooltip anchor="hover-target" autoUpdateMode="auto"
			>Test text</Tooltip
		>
	</p>
	<p>
		<span
			id="hover-target2">
			Right tooltip
		</span>

		<Tooltip anchor="hover-target2" autoUpdateMode="auto" position="end"
			>Test text</Tooltip
		>
	</p>
	<p>
		<span
			id="hover-target3">
			Always active
		</span>

		<Tooltip anchor="hover-target3" autoUpdateMode="anchor" position="end" visible={true}
			><bold> This text is different and bold doesn't work</bold></Tooltip
		>
</p>
	</Card>
</Stack>
