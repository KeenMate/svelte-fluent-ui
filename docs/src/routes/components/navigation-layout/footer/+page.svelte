<script lang="ts">
	import {Footer, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "stack", type: "boolean", default: "true", description: "Stack to a single column below 600px container width. Only applies in 3-part mode (when start/center/end are provided)."},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names appended after the built-in fluent-footer class"},
		{name: "style", type: "string", default: '""', description: "Inline style string"}
	]

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "start", type: "Snippet", default: "undefined", description: "Inline-start (left in LTR / right in RTL) section. Providing any of start/center/end switches to a 3-part CSS Grid layout (1fr | auto | 1fr)."},
		{name: "center", type: "Snippet", default: "undefined", description: "Truly centered section — sits at the footer midpoint regardless of start/end widths."},
		{name: "end", type: "Snippet", default: "undefined", description: "Inline-end (right in LTR / left in RTL) section."},
		{name: "children", type: "SlotType", default: "undefined", description: "Default slot — used when none of start/center/end are provided. Backward-compatible fallback for the single-children case."}
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
		title="Footer"
		description="A bottom-of-page section that renders as a semantic <footer> element with the Svelte FluentUI theme tokens for background, text, and border."
		keywords="svelte, fluentui, footer, layout, page footer"
	/>

	<h1>Footer</h1>

	<p>
		A semantic <span class="component-name">&lt;footer&gt;</span> wrapper that picks up the library's
		footer theme tokens (<span class="component-name">--fluent-footer-bg</span>,
		<span class="component-name">--fluent-footer-text</span>,
		<span class="component-name">--fluent-footer-border</span>) so a consistent footer renders inside
		any <span class="component-name">Layout</span>. Inspired by FluentUI Blazor's FluentFooter.
	</p>

	<References links={[
		{label: "Footer", custom: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Footer"}
	]} />

	<Card>
		<h2>Examples</h2>

		<Stack orientation="vertical" gap="1.5rem">
			<div class="example-item">
				<h3>Default</h3>
				<p class="example-description">A plain copyright line.</p>
				<div class="footer-frame">
					<Footer>
						© 2026 Acme Inc.
					</Footer>
				</div>
			</div>

			<div class="example-item">
				<h3>With custom height</h3>
				<p class="example-description">
					Footer has no intrinsic height; set one via <span class="component-name">style</span> when you
					want it taller than its content.
				</p>
				<div class="footer-frame">
					<Footer style="height: 60px;">
						© 2026 Acme Inc. — All rights reserved.
					</Footer>
				</div>
			</div>

			<div class="example-item">
				<h3>Three-part layout (start / center / end)</h3>
				<p class="example-description">
					Providing any of <span class="component-name">start</span>, <span class="component-name">center</span>,
					<span class="component-name">end</span> snippets switches to a CSS Grid layout with
					<span class="component-name">grid-template-columns: 1fr auto 1fr</span> — the center column is
					<em>truly</em> centered regardless of how wide the side sections are. RTL flips
					<span class="component-name">start</span> ↔ <span class="component-name">end</span> automatically
					via logical positioning.
				</p>
				<div class="footer-frame">
					<Footer>
						{#snippet start()}
							© 2026 Acme Inc.
						{/snippet}
						{#snippet center()}
							Built with Svelte FluentUI
						{/snippet}
						{#snippet end()}
							v1.3.0
						{/snippet}
					</Footer>
				</div>
			</div>

			<div class="example-item">
				<h3>Stacks on narrow widths (default)</h3>
				<p class="example-description">
					<span class="component-name">stack</span> defaults to <span class="component-name">true</span> — below
					600px container width the three sections collapse to a single column, all aligned to the inline-start
					edge. The footer becomes its own container (via <span class="component-name">container-type: inline-size</span>),
					so behavior is intrinsic to the bar's own width, not the viewport. Drag the demo frame narrower to
					see it kick in.
				</p>
				<div class="footer-frame footer-frame--resizable">
					<Footer>
						{#snippet start()}
							© 2026 Acme Inc.
						{/snippet}
						{#snippet center()}
							Built with Svelte FluentUI
						{/snippet}
						{#snippet end()}
							<a href="/legal/privacy">Privacy</a>
						{/snippet}
					</Footer>
				</div>
			</div>

			<div class="example-item">
				<h3>Stack opt-out (<span class="component-name">stack={'{false}'}</span>)</h3>
				<p class="example-description">
					Pass <span class="component-name">stack={'{false}'}</span> if you specifically want the three-section
					row preserved at every width (e.g. when the content is short enough to always fit).
				</p>
				<div class="footer-frame footer-frame--resizable">
					<Footer stack={false}>
						{#snippet start()}
							©
						{/snippet}
						{#snippet center()}
							Acme
						{/snippet}
						{#snippet end()}
							v1
						{/snippet}
					</Footer>
				</div>
			</div>
		</Stack>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Footer Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Footer Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Footer Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.component-name {
		font-family: monospace;
	}

	.example-item {
		width: 100%;
	}

	.example-description {
		margin: 0 0 0.75rem 0;
		color: var(--neutral-foreground-hint-rest, #616161);
		font-size: 0.9rem;
	}

	.footer-frame {
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: var(--fluent-border-radius-md, 4px);
		overflow: hidden;
	}

	.footer-frame--resizable {
		resize: horizontal;
		min-width: 240px;
		max-width: 100%;
	}
</style>
