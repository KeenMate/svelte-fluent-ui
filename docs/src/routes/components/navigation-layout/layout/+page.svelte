<script lang="ts">
	import {Layout, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Layout orientation"},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names"},
		{name: "style", type: "string", default: '""', description: "Inline style string"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Layout content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Layout"
		description="A page-level flex container that arranges Header, AppBar, BodyContent, and Footer along a horizontal or vertical axis. Inspired by FluentUI Blazor."
		keywords="svelte, fluentui, layout, page, header, footer, application shell"
	/>

	<h1>Layout</h1>

	<p>
		A page-level flex container that arranges <code>Header</code>, <code>AppBar</code>,
		<code>BodyContent</code>, and <code>Footer</code> along a horizontal or vertical axis. Inspired by
		the FluentUI Blazor Layout component.
	</p>

	<References links={[
		{label: "Layout", custom: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Layout"}
	]} />

	<Card>
		<h2>Examples</h2>
		<p>
			<Layout>
				<p>
					Inner content of layout
				</p>
			</Layout>
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
</Stack>
