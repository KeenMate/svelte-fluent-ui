<script lang="ts">
	import {MultiSplitter, MultiSplitterPane, QuickGrid, Stack, Grid, GridItem, Card, Button, Icon} from "svelte-fluentui"
	import type {MultiSplitterResizeDetail, MultiSplitterToggleDetail} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let lastEvent = $state<string>("None")
	let orientation: "horizontal" | "vertical" = $state("horizontal")

	function handleCollapse(detail: MultiSplitterToggleDetail) {
		lastEvent = `Collapsed pane ${detail.index}`
	}
	function handleExpand(detail: MultiSplitterToggleDetail) {
		lastEvent = `Expanded pane ${detail.index}`
	}
	function handleResize(detail: MultiSplitterResizeDetail) {
		lastEvent = `Resized pane ${detail.index} to ${Math.round(detail.size)}px`
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const multiSplitterProperties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction. Horizontal arranges panes side-by-side with vertical gutters; vertical stacks them with horizontal gutters."},
		{name: "id", type: "string", default: "undefined", description: "Enables localStorage persistence under \"fluent-multi-splitter:<id>\". Saves sizes, last-expanded sizes, and minimized state."},
		{name: "step", type: "number", default: "10", description: "Keyboard arrow-key step in px when a gutter is focused."},
		{name: "railSize", type: "number", default: "40", description: "Width (or height in vertical mode) in px that a minimized pane collapses to."},
		{name: "minimizeThreshold", type: "number", default: "0.40", description: "Drag-to-rail snap threshold as ratio of the drag-start (or max-reached) size. Floored at railSize × 1.5."},
		{name: "width", type: "string", default: "undefined", description: "Explicit container width (e.g. '800px', '100%')."},
		{name: "height", type: "string", default: "undefined", description: "Explicit container height (e.g. '400px', '100vh')."},
		{name: "debug", type: "boolean", default: "false", description: "Logs drag and minimize transitions to console (development aid)."},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names on the root element."},
		{name: "style", type: "string", default: '""', description: "Inline styles on the root element."}
	]

	const multiSplitterCallbacks: Property[] = [
		{name: "onresize", type: "(detail: MultiSplitterResizeDetail) => void", default: "undefined", description: "Fired continuously while a pane is resized. `{ index, pane, size }`."},
		{name: "oncollapse", type: "(detail: MultiSplitterToggleDetail) => void", default: "undefined", description: "Fired when a pane minimizes to a rail. `{ index, pane }`."},
		{name: "onexpand", type: "(detail: MultiSplitterToggleDetail) => void", default: "undefined", description: "Fired when a railed pane expands back. `{ index, pane }`."}
	]

	const multiSplitterPaneProperties: Property[] = [
		{name: "size", type: "string", default: "undefined", description: "Initial size. Accepts \"200px\" or \"30%\". Unsized panes share leftover space equally; if all are sized, the last absorbs any delta."},
		{name: "min", type: "string", default: "undefined", description: "Minimum size constraint. Accepts \"150px\" or \"10%\". Default 0."},
		{name: "max", type: "string", default: "undefined", description: "Maximum size constraint. Accepts \"400px\" or \"50%\". Default unbounded."},
		{name: "minimize", type: "boolean", default: "false", description: "If true, pane can collapse to a rail. Snaps in via drag, click the rail to restore, or double-click an adjacent gutter."},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names on the pane element."},
		{name: "style", type: "string", default: '""', description: "Inline styles on the pane element."}
	]

	const dataAttributes: Property[] = [
		{name: "data-multisplitter-toggle", type: "marker", default: "—", description: "Put on any element inside a minimizable pane to act as a toggle button (e.g. a button in a card header)."},
		{name: "data-multisplitter-rail-title", type: "marker", default: "—", description: "Put on a title element inside a minimizable pane so it rotates to vertical writing when the pane is railed."}
	]

	const cssCustomProperties: Property[] = [
		{name: "--fluent-multi-splitter-gutter-size", type: "length", default: "6px", description: "Gutter thickness (width in horizontal mode, height in vertical mode)."}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<!-- All FluentUI icons at size=20 — the only size where window_console exists,
     so picking 20 ensures consistent stroke weight & viewBox across the set.
     Folder/Code/Info also offer 20, confirmed via the pure-admin-icons MCP. -->
{#snippet folderIcon()}<Icon name="folder" size={20} variant="regular" color="accent" class="card-icon" />{/snippet}
{#snippet codeIcon()}<Icon name="code" size={20} variant="regular" color="accent" class="card-icon" />{/snippet}
{#snippet consoleIcon()}<Icon name="window_console" size={20} variant="regular" color="accent" class="card-icon" />{/snippet}
{#snippet infoIcon()}<Icon name="info" size={20} variant="regular" color="accent" class="card-icon" />{/snippet}

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="MultiSplitter"
		description="Resizable N-pane splitter for Svelte with drag, snap-to-rail, keyboard navigation, accordion mode, and localStorage persistence."
		keywords="svelte, fluentui, multisplitter, splitter, resizable, panels, layout"
	/>

	<h1>MultiSplitter</h1>

	<p>
		Resizable N-pane container. Drag any gutter to resize, arrow keys nudge when focused, double-click an adjacent gutter
		(or click a railed pane) to toggle minimize. Ported from <a href="https://pureadmin.io" target="_blank" rel="noopener">pureadmin.io</a>'s
		splitter into Svelte 5.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor Splitter", href: "https://www.fluentui-blazor.net/Splitter"},
		{label: "Custom component inspired by pureadmin.io", href: "https://pureadmin.io"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Two-pane horizontal (content-driven height)</h3>
		<p>
			No fixed height — the splitter is as tall as its tallest pane's natural content. All panes stretch to match. Drag
			the gutter to see how the height responds.
		</p>
		<p>Last event: <strong>{lastEvent}</strong></p>
		<MultiSplitter
			orientation="horizontal"
			onresize={handleResize}
			oncollapse={handleCollapse}
			onexpand={handleExpand}
		>
			<MultiSplitterPane size="280px" min="200px" max="60%">
				<Card>
					<h4 class="card-heading">{@render folderIcon()} Sidebar</h4>
					<p>Size: 280px, min 200px, max 60%.</p>
					<p>Drag the gutter →</p>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane>
				<Card>
					<h4 class="card-heading">{@render codeIcon()} Main</h4>
					<p>Absorbs leftover space.</p>
				</Card>
			</MultiSplitterPane>
		</MultiSplitter>

		<h3>Three-pane with minimize-to-rail + persistence</h3>
		<p>
			First and last panes have <code>minimize</code>. Try dragging a gutter past the snap threshold, or click a rail to
			restore. <code>&lt;Card&gt;</code> auto-adapts when railed — first child becomes a rotated title, the rest hides.
			Layout persists under <code>id="demo-three"</code> in localStorage. Pane content sets the height; expand a card to
			see the whole splitter grow.
		</p>
		<MultiSplitter id="demo-three" orientation="horizontal">
			<MultiSplitterPane size="240px" min="180px" max="360px" minimize>
				<Card>
					<h4 class="card-heading">{@render folderIcon()} File tree</h4>
					<ul class="file-tree">
						<li>src</li>
						<li class="file-tree-indent">main.ts</li>
						<li class="file-tree-indent">app.svelte</li>
						<li>lib</li>
						<li class="file-tree-indent">index.ts</li>
					</ul>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane min="240px">
				<Card>
					<h4 class="card-heading">{@render codeIcon()} Editor</h4>
					<p>Always expanded — no <code>minimize</code> prop.</p>
					<pre class="editor-code">{`function hello() {
  console.log("Hello World!")
}`}</pre>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane size="280px" min="220px" max="420px" minimize>
				<Card>
					<h4 class="card-heading">{@render infoIcon()} Inspector</h4>
					<p>Minimizable right rail.</p>
				</Card>
			</MultiSplitterPane>
		</MultiSplitter>

		<h3>Vertical orientation</h3>
		<p>For vertical splitters you typically want a fixed height — otherwise each pane is content-sized and the gutter has nothing meaningful to drag.</p>
		<Button onclick={() => (orientation = orientation === "horizontal" ? "vertical" : "horizontal")}>
			Toggle orientation (current: {orientation})
		</Button>
		<div class="splitter-container">
			<MultiSplitter {orientation}>
				<MultiSplitterPane size="40%" min="20%" max="80%">
					<Card>
						<h4>Top / Left</h4>
					</Card>
				</MultiSplitterPane>
				<MultiSplitterPane>
					<Card>
						<h4>Bottom / Right</h4>
					</Card>
				</MultiSplitterPane>
			</MultiSplitter>
		</div>

		<h3>Fixed-area splitter (IDE-style)</h3>
		<p>Pass <code>height</code> to lock the splitter to a viewport area. Useful for nested splitters where the outer drives a known frame and inner splitters fill it.</p>
		<MultiSplitter orientation="horizontal" height="500px" id="ide-outer" debug>
			<MultiSplitterPane size="240px" min="180px" minimize>
				<Card>
					<h4 class="card-heading">{@render folderIcon()} Explorer</h4>
					<ul class="file-tree">
						<li>src</li>
						<li class="file-tree-indent">main.ts</li>
						<li class="file-tree-indent">app.svelte</li>
					</ul>
				</Card>
			</MultiSplitterPane>
			<MultiSplitterPane>
				<MultiSplitter orientation="vertical" height="100%" id="ide-inner" debug>
					<MultiSplitterPane min="100px" minimize>
						<Card>
							<h4 class="card-heading">{@render codeIcon()} Editor</h4>
							<pre class="editor-code">{`function hello() {
  console.log("Hello World!")
}`}</pre>
						</Card>
					</MultiSplitterPane>
					<MultiSplitterPane size="160px" min="80px" minimize>
						<Card>
							<h4 class="card-heading">{@render consoleIcon()} Console</h4>
							<p class="terminal-text">$ npm run dev</p>
							<p class="terminal-text terminal-success">✓ Server running...</p>
						</Card>
					</MultiSplitterPane>
				</MultiSplitter>
			</MultiSplitterPane>
		</MultiSplitter>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>MultiSplitter properties</h2>
				<QuickGrid items={multiSplitterProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>MultiSplitter callbacks</h2>
				<QuickGrid items={multiSplitterCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>MultiSplitterPane properties</h2>
				<QuickGrid items={multiSplitterPaneProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Data attributes</h2>
				<QuickGrid items={dataAttributes} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>CSS custom properties</h2>
				<QuickGrid items={cssCustomProperties} columns={propertyColumns} sortable filterable striped />
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

	.card-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.5rem 0;
	}
	.card-heading :global(.card-icon) {
		flex-shrink: 0;
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
		font-family: monospace;
		font-size: 0.875rem;
	}
	.terminal-text {
		font-family: monospace;
		font-size: 0.875rem;
	}
	.terminal-success {
		color: green;
	}
</style>
