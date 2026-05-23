<script lang="ts">
	import {BodyContent, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = []

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Body content"}
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
		title="Body content"
		description="The main content region inside a Svelte FluentUI Layout, sitting between header/navigation and footer. Inspired by FluentUI Blazor BodyContent."
		keywords="svelte, fluentui, body content, bodycontent, layout, page, content"
	/>

	<h1>Body content</h1>

	<p>
		The main content region inside a <code>Layout</code>, sitting between the header/navigation and
		the footer. Inspired by the FluentUI Blazor BodyContent component.
	</p>

	<References links={[
		{label: "BodyContent", custom: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/BodyContent"}
	]} />

	<Card>
		<h2>Examples</h2>
		<BodyContent>
			This is some content displayed in a FluentBodyContent component
		</BodyContent>
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
