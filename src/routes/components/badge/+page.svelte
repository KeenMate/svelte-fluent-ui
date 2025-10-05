<script lang="ts">
	import {Badge, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "color", type: "string", default: "undefined", description: "Badge color"},
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance"},
		{name: "circular", type: "boolean", default: "undefined", description: "Circular shape"}
	]

	const callbacks: Property[] = [
		{name: "onClick", type: "(ev: PointerEvent) => void", default: "undefined", description: "Click event handler"}
	]

	const actions: Property[] = []

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
	<h1>Badge</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-badge-badge--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Badge" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<Badge class="lightweight clickable-badge" appearance="lightweight">
			<span class="badge-content"><!--!-->
				Lightweight
			</span>
		</Badge>

		<Badge
			appearance="accent" class="accent"
		>
			<span class="badge-content">
				<!--!-->
				Accent
			</span>
		</Badge>

		<Badge
			appearance="neutral" class="neutral"
		>
			<span class="badge-content">
				<!--!-->
				Neutral
			</span>
		</Badge>

		<Badge
			style="--badge-fill-somevalue: red; --badge-color-somevalue: white;"
			appearance="neutral"
			fill="somevalue"
			color="somevalue"
			class="neutral"
		>
			<span class="badge-content">
				Red
				and White
			</span>
		</Badge>
		<Badge
			style="--badge-fill-highlight: #ffd800; --badge-color-highlight: #000;"
			appearance="neutral"
			fill="highlight"
			color="highlight"
			class="neutral"
		>
			<span class="badge-content">
				Highlight
			</span>
		</Badge>
		<Badge
			style="--badge-fill-lowlight: #000; --badge-color-lowlight: #fff;"
			appearance="neutral"
			fill="lowlight"
			color="lowlight"
			class="neutral"
		>
			<span class="badge-content">
				Lowlight
			</span>
		</Badge>
		<Badge style="width: 250px;" appearance="neutral" class="neutral">
			<span class="badge-content large-badge-content">
				Bigger
				<!--!-->
			</span>

		</Badge>
	</Card>
</Stack>

<style>
	.badge-content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.large-badge-content {
		height: 250px;
	}
</style>
