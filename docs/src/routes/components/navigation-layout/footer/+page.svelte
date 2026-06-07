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
		{name: "class", type: "string", default: '""', description: "Additional CSS class names appended after the built-in fluent-footer class"},
		{name: "style", type: "string", default: '""', description: "Inline style string"}
	]

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Footer content"}
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
				<h3>With multiple sections</h3>
				<p class="example-description">
					Footer is a flex row by default; lay out columns / spacer / actions however your design needs.
				</p>
				<div class="footer-frame">
					<Footer style="height: 60px; justify-content: space-between;">
						<span>© 2026 Acme Inc.</span>
						<span>v1.3.0</span>
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
</style>
