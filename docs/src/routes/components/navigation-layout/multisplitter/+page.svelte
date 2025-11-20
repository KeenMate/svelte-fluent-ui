<script lang="ts">
	import {MultiSplitter, MultiSplitterPane, QuickGrid, Stack, Grid, GridItem, Card, Button} from "svelte-fluentui"
	import type {MultiSplitterEventArgs, MultiSplitterResizeEventArgs} from "svelte-fluentui"

	let lastEvent = $state<string>("None")
	let orientation: "horizontal" | "vertical" = $state("horizontal")

	function handleCollapse(args: MultiSplitterEventArgs) {
		lastEvent = `Collapsed pane ${args.index}`
		console.log("Collapsed:", args)
	}

	function handleExpand(args: MultiSplitterEventArgs) {
		lastEvent = `Expanded pane ${args.index}`
		console.log("Expanded:", args)
	}

	function handleResize(args: MultiSplitterResizeEventArgs) {
		lastEvent = `Resized pane ${args.index} to ${Math.round(args.size)}px`
		console.log("Resized:", args)
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const multiSplitterProperties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: "horizontal", description: "Direction of the splitter"},
		{name: "barSize", type: "string", default: "6px", description: "Size of the resize bar"},
		{name: "width", type: "string", default: "undefined", description: "Width of the splitter container"},
		{name: "height", type: "string", default: "undefined", description: "Height of the splitter container"},
		{name: "onCollapse", type: "function", default: "undefined", description: "Callback when a pane is collapsed"},
		{name: "onExpand", type: "function", default: "undefined", description: "Callback when a pane is expanded"},
		{name: "onResize", type: "function", default: "undefined", description: "Callback when a pane is resized"}
	]

	const multiSplitterPaneProperties: Property[] = [
		{name: "size", type: "string", default: "undefined", description: "Initial size (width/height based on orientation)"},
		{name: "minSize", type: "string", default: "undefined", description: "Minimum size constraint"},
		{name: "maxSize", type: "string", default: "undefined", description: "Maximum size constraint"},
		{name: "resizable", type: "boolean", default: "true", description: "Whether the pane can be resized"},
		{name: "collapsible", type: "boolean", default: "false", description: "Whether the pane can be collapsed"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>MultiSplitter</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Splitter" target="_blank" rel="noopener noreferrer">FluentUI Blazor Splitter</a>
		</p>
	</Card>

	<p>
		Resizable multi-panel splitter based on FluentUI Blazor implementation. Drag the bars to resize
		panels.
	</p>

	<Card>
		<h2>Basic Horizontal Splitter</h2>
	<p>Last event: <strong>{lastEvent}</strong></p>

	<div class="splitter-container">
		<MultiSplitter
			orientation="horizontal"
			onCollapse={handleCollapse}
			onExpand={handleExpand}
			onResize={handleResize}
		>
			<MultiSplitterPane size="250px" minSize="150px" maxSize="400px" resizable collapsible>
				<Card class="pane-card-layer2">
					<h3>Left Panel</h3>
					<p>Size: 250px</p>
					<p>Min: 150px, Max: 400px</p>
					<p>Resizable & Collapsible</p>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane>
				<Card class="pane-card-layer3">
					<h3>Main Content</h3>
					<p>This panel takes up the remaining space.</p>
					<p>Not resizable</p>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane size="200px" resizable>
				<Card class="pane-card-layer2">
					<h3>Right Panel</h3>
					<p>Size: 200px</p>
					<p>Resizable but not collapsible</p>
				</Card>
			</MultiSplitterPane>
		</MultiSplitter>
	</div>
	</Card>

	<Card>
		<h2>Vertical Splitter</h2>
	<Button onClick={() => (orientation = orientation === "horizontal" ? "vertical" : "horizontal")}>
		Toggle Orientation (Current: {orientation})
	</Button>

	<div class="splitter-container-large">
		<MultiSplitter {orientation}>
			<MultiSplitterPane size="100px" minSize="60px" resizable>
				<Card class="pane-card-layer2">
					<h4>Panel 1</h4>
					<p>100px, resizable</p>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane>
				<Card class="pane-card-layer3">
					<h4>Panel 2</h4>
					<p>Flexible</p>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane size="150px" resizable collapsible>
				<Card class="pane-card-layer2">
					<h4>Panel 3</h4>
					<p>150px, resizable & collapsible</p>
				</Card>
			</MultiSplitterPane>
		</MultiSplitter>
	</div>
	</Card>

	<Card>
		<h2>Code Editor Layout Example</h2>
	<div class="splitter-container-xlarge">
		<MultiSplitter orientation="horizontal">
			<MultiSplitterPane size="250px" minSize="200px" resizable collapsible>
				<Card class="pane-card-layer2">
					<h4>File Explorer</h4>
					<ul class="file-tree">
						<li>📁 src</li>
						<li class="file-tree-indent">📄 main.ts</li>
						<li class="file-tree-indent">📄 app.svelte</li>
						<li>📁 lib</li>
						<li class="file-tree-indent">📄 index.ts</li>
					</ul>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane>
				<MultiSplitter orientation="vertical">
					<MultiSplitterPane>
						<Card class="pane-card-layer3">
							<h4>Editor</h4>
							<pre class="editor-code">
{`// Your code here
function hello() {
  console.log("Hello World!");
}`}
							</pre>
						</Card>
					</MultiSplitterPane>
					<MultiSplitterPane size="200px" minSize="100px" resizable>
						<Card class="pane-card-layer2">
							<h4>Terminal</h4>
							<p class="terminal-text">$ npm run dev</p>
							<p class="terminal-text terminal-success">
								✓ Server running...
							</p>
						</Card>
					</MultiSplitterPane>
				</MultiSplitter>
			</MultiSplitterPane>
			<MultiSplitterPane size="300px" minSize="250px" resizable collapsible>
				<Card class="pane-card-layer2">
					<h4>Properties Panel</h4>
					<p>Component properties and settings would go here.</p>
				</Card>
			</MultiSplitterPane>
		</MultiSplitter>
	</div>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>MultiSplitter Component</h2>
				<QuickGrid items={multiSplitterProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>MultiSplitterPane Component</h2>
				<QuickGrid items={multiSplitterPaneProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.splitter-container {
		height: 400px;
		border: 1px solid var(--app-border);
		margin: 1rem 0;
	}

	.splitter-container-large {
		height: 500px;
		border: 1px solid var(--app-border);
		margin: 1rem 0;
	}

	.splitter-container-xlarge {
		height: 600px;
		border: 1px solid var(--app-border);
		margin: 1rem 0;
	}

	.file-tree {
		list-style: none;
		padding-left: 0;
	}

	.file-tree-indent {
		padding-left: 1rem;
	}

	.editor-code {
		margin: 0;
	}

	.terminal-text {
		font-family: monospace;
		font-size: 0.875rem;
	}

	.terminal-success {
		color: green;
	}
</style>
