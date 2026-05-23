<script lang="ts">
	import {Breadcrumb, BreadcrumbItem, ChevronDoubleRight, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let count = $state(0)

	function onBreadcrumbClicked(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target)
		count += 1
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance"}
	]

	const callbacks: Property[] = [
		{name: "onClick", type: "(ev: MouseEvent) => void", default: "undefined", description: "Click event handler"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Default slot content"}
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
		title="Breadcrumb"
		description="A Svelte wrapper for FluentUI's breadcrumb web components — a navigation trail showing the user's location within a hierarchy with configurable separators."
		keywords="svelte, fluentui, breadcrumb, breadcrumbs, navigation, hierarchy, web components"
	/>

	<h1>Breadcrumb</h1>

	<p>
		A navigation trail that shows the user's location within a hierarchy. Wraps the
		<code>&lt;fluent-breadcrumb&gt;</code> and <code>&lt;fluent-breadcrumb-item&gt;</code> elements with
		configurable separators between items.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Breadcrumb"}
	]} />

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<div class="examples-container">
		<div class="example-item">
			<Breadcrumb>
				<BreadcrumbItem>
					Item 1
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 2
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 3
				</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="example-item">
			<Breadcrumb>
				<BreadcrumbItem>
					{#snippet separator()}
						<ChevronDoubleRight />
					{/snippet}
					Item 1
				</BreadcrumbItem>
				<BreadcrumbItem>
					{#snippet separator()}
						<ChevronDoubleRight />
					{/snippet}
					Item 2
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 3
				</BreadcrumbItem>
			</Breadcrumb>
		</div>
		</div>
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
</Stack>

<style>
	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.example-item {
		flex: 1;
	}
</style>
