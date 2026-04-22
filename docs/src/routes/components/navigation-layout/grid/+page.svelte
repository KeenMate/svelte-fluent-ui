<script lang="ts">
	import {Grid, GridItem, QuickGrid, Stack, Card, Button, Badge} from "svelte-fluentui"

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
		{name: "columns", type: "number", default: "undefined", description: "Switches Grid to CSS-grid mode with N equal-width tracks (minmax(0, 1fr)). Children fill one cell each; xs/sm/md breakpoint props are ignored."},
		{name: "gap", type: "string", default: '"1rem" (when columns set)', description: "Gap between cells in columns mode (e.g. '0.5rem', '16px'). Ignored in flex-spacing mode."},
		{name: "spacing", type: "number (1-10)", default: "3", description: "Spacing between grid items (flex-spacing mode only)"},
		{name: "justify", type: "JustifyContent", default: "flex-start", description: "Horizontal alignment of items (flex-spacing mode only)"},
		{name: "adaptiveRendering", type: "boolean", default: "false", description: "Only render items for current breakpoint (flex-spacing mode only)"},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names"},
		{name: "style", type: "string", default: '""', description: "Inline CSS styles"}
	]

	const gridCallbacks: Property[] = [
		{name: "onBreakpointEnter", type: "(size: GridItemSize) => void", default: "undefined", description: "Called when the grid container crosses a responsive breakpoint. Size is one of: xs, sm, md, lg, xl, xxl"}
	]

	const gridSlots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "GridItem components and other content to render inside the grid"}
	]

	const gridItemProperties: Property[] = [
		{name: "xs", type: "number (0-12)", default: "undefined", description: "Columns to span at xs breakpoint (< 600px). 0 means auto/grow."},
		{name: "sm", type: "number (0-12)", default: "undefined", description: "Columns to span at sm breakpoint (600px+)"},
		{name: "md", type: "number (0-12)", default: "undefined", description: "Columns to span at md breakpoint (960px+)"},
		{name: "lg", type: "number (0-12)", default: "undefined", description: "Columns to span at lg breakpoint (1280px+)"},
		{name: "xl", type: "number (0-12)", default: "undefined", description: "Columns to span at xl breakpoint (1920px+)"},
		{name: "xxl", type: "number (0-12)", default: "undefined", description: "Columns to span at xxl breakpoint (2560px+)"},
		{name: "justify", type: "JustifyContent", default: "undefined", description: "Override horizontal alignment for this item's inner content"},
		{name: "gap", type: "string", default: "undefined", description: "Gap between child elements (sets display:flex automatically)"},
		{name: "adaptiveRendering", type: "boolean", default: "undefined", description: "Override parent Grid adaptiveRendering for this item"},
		{name: "hiddenWhen", type: "GridItemHidden", default: "undefined", description: 'Hide item at a breakpoint. Supports exact (e.g. "xs"), "-up" (e.g. "md-up"), or "-down" (e.g. "lg-down") suffixes'},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names"},
		{name: "style", type: "string", default: '""', description: "Inline CSS styles"}
	]

	const gridItemCallbacks: Property[] = []

	const gridItemSlots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Content to render inside the grid item"}
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
		Grid supports two layout modes:
	</p>
	<ul>
		<li><strong>Flex-spacing mode</strong> (default): responsive 12-column system with <code>GridItem</code> breakpoint props (<code>xs</code>, <code>sm</code>, <code>md</code>…). Based on FluentUI Blazor.</li>
		<li><strong>Columns mode</strong>: pass <code>columns={'{N}'}</code> (plus optional <code>gap</code>) for a CSS-grid layout with N equal-width tracks. Simpler, and immune to content-based width stealing between cells.</li>
	</ul>

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
		<h2>Columns mode (CSS grid)</h2>
		<p>
			With <code>columns={'{N}'}</code> Grid switches to CSS grid with N equal-width tracks.
			<code>GridItem</code> children need no breakpoint props — each one becomes a cell.
			Columns stay at exactly 1/N of the container even if one cell's content is much wider
			than the others (notice the long string in the middle cell below does not steal space
			from its neighbors):
		</p>

		<Grid columns={3} gap="1rem">
			<GridItem>
				<Card class="grid-card-layer2">
					<h4>Cell 1</h4>
					<p>Short content</p>
				</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer2">
					<h4>Cell 2</h4>
					<p style="word-break: break-all;">ThisIsADeliberatelyUnbreakableStringThatWouldBlowOutAFlexColumnButMinmax0TracksShrinkBelowContent</p>
				</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer2">
					<h4>Cell 3</h4>
					<p>Short content</p>
				</Card>
			</GridItem>
		</Grid>

		<p style="margin-top: 1rem;">Two columns with a tighter gap:</p>

		<Grid columns={2} gap="0.5rem">
			<GridItem>
				<Card class="grid-card-layer3">Left</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer3">Right</Card>
			</GridItem>
		</Grid>

		<p style="margin-top: 1rem;">Four columns:</p>

		<Grid columns={4} gap="0.75rem">
			<GridItem>
				<Card class="grid-card-layer3">1</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer3">2</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer3">3</Card>
			</GridItem>
			<GridItem>
				<Card class="grid-card-layer3">4</Card>
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

	<h2>Grid API</h2>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={gridProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={gridCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={gridSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<h2>GridItem API</h2>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={gridItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={gridItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={gridItemSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.breakpoint-list {
		margin: 0.5rem 0;
	}
</style>
