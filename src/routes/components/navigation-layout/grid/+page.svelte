<script lang="ts">
	import {Grid, GridItem, QuickGrid, Stack, Card, Button, Badge} from "$lib/index.js"

	let currentBreakpoint = $state<string>("unknown")

	function handleBreakpointChange(size: string) {
		currentBreakpoint = size
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const gridProperties: Property[] = [
		{name: "spacing", type: "number (1-10)", default: "3", description: "Spacing between grid items"},
		{name: "justify", type: "JustifyContent", default: "flex-start", description: "Horizontal alignment of items"},
		{name: "adaptiveRendering", type: "boolean", default: "false", description: "Only render items for current breakpoint"},
		{name: "onBreakpointEnter", type: "function", default: "undefined", description: "Callback when breakpoint changes"}
	]

	const gridItemProperties: Property[] = [
		{name: "xs, sm, md, lg, xl, xxl", type: "number (0-12)", default: "undefined", description: "Number of columns to span at each breakpoint"},
		{name: "justify", type: "JustifyContent", default: "undefined", description: "Override grid justify for this item"},
		{name: "gap", type: "string", default: "undefined", description: "Gap between child elements"},
		{name: "hiddenWhen", type: "GridItemHidden", default: "undefined", description: "Hide item at specific breakpoints"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Grid</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">Grid (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/Grid" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<p>
		Responsive 12-column grid system with breakpoints based on FluentUI Blazor implementation.
	</p>

	<Card>
		<h2>Basic Grid</h2>
	<p>Grid with default spacing (3):</p>

	<Grid spacing={3}>
		<GridItem xs={12} md={6} lg={4}>
			<Card class="grid-card-layer2">
				<h3>Column 1</h3>
				<p>xs=12, md=6, lg=4</p>
			</Card>
		</GridItem>
		<GridItem xs={12} md={6} lg={4}>
			<Card class="grid-card-layer2">
				<h3>Column 2</h3>
				<p>xs=12, md=6, lg=4</p>
			</Card>
		</GridItem>
		<GridItem xs={12} md={12} lg={4}>
			<Card class="grid-card-layer2">
				<h3>Column 3</h3>
				<p>xs=12, md=12, lg=4</p>
			</Card>
		</GridItem>
	</Grid>
	</Card>

	<Card>
		<h2>Different Spacing</h2>
	<p>Grid with spacing={6}:</p>

	<Grid spacing={6}>
		<GridItem xs={12} sm={6} md={4}>
			<Card class="grid-card-layer3">
				<h4>Card 1</h4>
				<p>Larger spacing between items</p>
			</Card>
		</GridItem>
		<GridItem xs={12} sm={6} md={4}>
			<Card class="grid-card-layer3">
				<h4>Card 2</h4>
				<p>Larger spacing between items</p>
			</Card>
		</GridItem>
		<GridItem xs={12} sm={12} md={4}>
			<Card class="grid-card-layer3">
				<h4>Card 3</h4>
				<p>Larger spacing between items</p>
			</Card>
		</GridItem>
	</Grid>
	</Card>

	<Card>
		<h2>Justify Content</h2>
	<p>Grid with justify="center":</p>

	<Grid spacing={3} justify="center">
		<GridItem xs={6} md={3}>
			<Card class="grid-card-centered">
				<Badge appearance="accent">Centered 1</Badge>
			</Card>
		</GridItem>
		<GridItem xs={6} md={3}>
			<Card class="grid-card-centered">
				<Badge appearance="accent">Centered 2</Badge>
			</Card>
		</GridItem>
	</Grid>
	</Card>

	<Card>
		<h2>Breakpoint Detection</h2>
	<p>Current breakpoint: <strong>{currentBreakpoint}</strong></p>

	<Grid spacing={3} onBreakpointEnter={handleBreakpointChange}>
		<GridItem xs={12}>
			<Card class="grid-card-layer3">
				<h4>Responsive Info</h4>
				<ul class="breakpoint-list">
					<li><strong>xs</strong>: &lt; 600px</li>
					<li><strong>sm</strong>: 600px - 959px</li>
					<li><strong>md</strong>: 960px - 1279px</li>
					<li><strong>lg</strong>: 1280px - 1919px</li>
					<li><strong>xl</strong>: 1920px - 2559px</li>
					<li><strong>xxl</strong>: ≥ 2560px</li>
				</ul>
			</Card>
		</GridItem>
	</Grid>
	</Card>

	<Card>
		<h2>Hidden When Breakpoints</h2>
	<p>Items can be hidden at specific breakpoints:</p>

	<Grid spacing={3}>
		<GridItem xs={12} md={6} hiddenWhen="xs">
			<Card class="grid-card-layer2">
				<h4>Hidden on XS</h4>
				<p>This card is hidden on extra small screens</p>
			</Card>
		</GridItem>
		<GridItem xs={12} md={6} hiddenWhen="md-up">
			<Card class="grid-card-layer2">
				<h4>Hidden MD and up</h4>
				<p>This card is hidden on medium screens and larger</p>
			</Card>
		</GridItem>
	</Grid>
	</Card>

	<Card>
		<h2>Complex Layout</h2>
	<Grid spacing={4}>
		<GridItem xs={12}>
			<Card class="grid-header-card">
				<h3>Full Width Header</h3>
			</Card>
		</GridItem>
		<GridItem xs={12} md={8}>
			<Card class="grid-card-layer2 grid-card-min-height">
				<h4>Main Content Area</h4>
				<p>This takes up 2/3 of the width on medium screens and up.</p>
			</Card>
		</GridItem>
		<GridItem xs={12} md={4}>
			<Card class="grid-card-layer2 grid-card-min-height">
				<h4>Sidebar</h4>
				<p>This takes up 1/3 of the width on medium screens and up.</p>
			</Card>
		</GridItem>
		<GridItem xs={12} sm={6} md={3}>
			<Card class="grid-card-layer3">Footer 1</Card>
		</GridItem>
		<GridItem xs={12} sm={6} md={3}>
			<Card class="grid-card-layer3">Footer 2</Card>
		</GridItem>
		<GridItem xs={12} sm={6} md={3}>
			<Card class="grid-card-layer3">Footer 3</Card>
		</GridItem>
		<GridItem xs={12} sm={6} md={3}>
			<Card class="grid-card-layer3">Footer 4</Card>
		</GridItem>
	</Grid>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Grid Component</h2>
				<QuickGrid items={gridProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>GridItem Component</h2>
				<QuickGrid items={gridItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.breakpoint-list {
		margin: 0.5rem 0;
	}
</style>
