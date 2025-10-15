<script lang="ts">
	import {Spacer, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "width", type: "string | number", default: "undefined", description: "Fixed width in pixels or auto-expand"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Spacer</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">Spacer (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/Spacer" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<h5>
			Auto width:
		</h5>
		<div class="example example-row">
		<div class="element-block">1</div>
		<Spacer />
		<div class="element-block">2</div>
		<Spacer />
		<div class="element-block">3</div>
		<Spacer />
		<div class="element-block">4</div>
	</div>
	<h5>
		Specific width:
	</h5>
	<div class="example example-row-start">
		<div class="element-block">
			<span>100px after</span>
		</div>
		<Spacer width="100" />
		<div class="element-block">
			<span>200px after</span>
		</div>
		<Spacer width="200" />
		<div class="element-block">
			<span>300px after</span>
		</div>
		<Spacer width="300" />
		<div class="element-block">4</div>
	</div>
	</Card>
</Stack>

<style lang="scss">
	.example {
		:global {
			.element-block {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 5rem;
				height: 5rem;
				background-color: var(--neutral-layer-2, #f5f5f5);
				color: var(--neutral-foreground-rest, #242424);
				border-radius: .15em;
				line-height: 1;
				font-family: monospace;
			}
		}
	}

	.example-row {
		display: flex;
		gap: 0.25rem;
	}

	.example-row-start {
		display: flex;
		justify-items: start;
		gap: 0.25rem;
	}
</style>
