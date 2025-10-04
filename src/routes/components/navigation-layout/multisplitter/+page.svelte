<script lang="ts">
	import {MultiSplitter, MultiSplitterPane, Stack, Grid, GridItem, Card, Button} from "$lib/index.js"
	import type {MultiSplitterEventArgs, MultiSplitterResizeEventArgs} from "$lib/components/layout/MultiSplitter.svelte"

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
				<table class="member-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>orientation</td>
				<td>"horizontal" | "vertical"</td>
				<td>"horizontal"</td>
				<td>Direction of the splitter</td>
			</tr>
			<tr>
				<td>barSize</td>
				<td>string</td>
				<td>"6px"</td>
				<td>Size of the resize bar</td>
			</tr>
			<tr>
				<td>width</td>
				<td>string</td>
				<td>undefined</td>
				<td>Width of the splitter container</td>
			</tr>
			<tr>
				<td>height</td>
				<td>string</td>
				<td>undefined</td>
				<td>Height of the splitter container</td>
			</tr>
			<tr>
				<td>onCollapse</td>
				<td>function</td>
				<td>undefined</td>
				<td>Callback when a pane is collapsed</td>
			</tr>
			<tr>
				<td>onExpand</td>
				<td>function</td>
				<td>undefined</td>
				<td>Callback when a pane is expanded</td>
			</tr>
			<tr>
				<td>onResize</td>
				<td>function</td>
				<td>undefined</td>
				<td>Callback when a pane is resized</td>
			</tr>
		</tbody>
	</table>
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>MultiSplitterPane Component</h2>
				<table class="member-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>size</td>
				<td>string</td>
				<td>undefined</td>
				<td>Initial size (width/height based on orientation)</td>
			</tr>
			<tr>
				<td>minSize</td>
				<td>string</td>
				<td>undefined</td>
				<td>Minimum size constraint</td>
			</tr>
			<tr>
				<td>maxSize</td>
				<td>string</td>
				<td>undefined</td>
				<td>Maximum size constraint</td>
			</tr>
			<tr>
				<td>resizable</td>
				<td>boolean</td>
				<td>true</td>
				<td>Whether the pane can be resized</td>
			</tr>
			<tr>
				<td>collapsible</td>
				<td>boolean</td>
				<td>false</td>
				<td>Whether the pane can be collapsed</td>
			</tr>
		</tbody>
	</table>
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

	.pane-card-layer2 {
		padding: 1rem;
		height: 100%;
		background: var(--app-layer-2);
	}

	.pane-card-layer3 {
		padding: 1rem;
		height: 100%;
		background: var(--app-layer-3);
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
