<script lang="ts">
	import {Toolbar, Button, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "id", type: "string", default: "undefined", description: "Unique identifier"},
		{name: "class", type: "string", default: '""', description: "CSS class for styling"},
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Toolbar layout direction"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Elements to include in the toolbar (e.g., buttons, icons)"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Toolbar</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Toolbar" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h3>Basic toolbar</h3>
		<Toolbar>
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>

		<h3>Vertical toolbar</h3>
		<Toolbar orientation="vertical">
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>
	</Card>
</Stack>
