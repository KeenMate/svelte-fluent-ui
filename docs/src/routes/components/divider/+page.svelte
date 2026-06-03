<script lang="ts">
	import {Divider, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of the divider line"},
		{name: "role", type: '"separator" | "presentation"', default: '"separator"', description: "ARIA role — `presentation` removes the divider from the accessibility tree when it's purely decorative"},
		{name: "class", type: "string", default: '""', description: "Extra class names forwarded to the host"},
		{name: "style", type: "string", default: '""', description: "Inline style appended after the wrapper's own color override. Use to repoint `--neutral-stroke-divider-rest` for a custom color, or set `height` for vertical dividers"}
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
		title="Divider"
		description="A Svelte wrapper for FluentUI's divider web component — a thin line that separates content horizontally or vertically."
		keywords="svelte, fluentui, divider, separator, web components"
	/>

	<h1>Divider</h1>

	<p>
		A thin line that separates content. Wraps the <code>&lt;fluent-divider&gt;</code> element. The wrapper re-points
		<code>--neutral-stroke-divider-rest</code> to <code>--neutral-stroke-rest</code> so the line is actually visible
		against the page background — <code>fluent-divider</code>'s default token is one shade away from
		<code>--fluent-bg-page</code> and renders as effectively invisible.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-divider--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Divider"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Horizontal (default)</h3>
		<p>The most common case — a horizontal line between blocks of content.</p>
		<div class="divider-stack">
			<p>Section 1 — some content above the divider.</p>
			<Divider />
			<p>Section 2 — content below.</p>
			<Divider />
			<p>Section 3 — and one more.</p>
		</div>

		<h3>Vertical</h3>
		<p>
			Set <code>orientation="vertical"</code> for an inline divider between siblings. Vertical dividers don't have an
			intrinsic height — give the divider an explicit <code>height</code> via inline style (this matches the FluentUI
			Blazor pattern). The parent layout doesn't need any special configuration.
		</p>
		<Stack orientation="horizontal" gap="0.625rem" verticalAlign="center">
			<span>Home</span>
			<Divider orientation="vertical" style="height: 1.5rem;" />
			<span>Products</span>
			<Divider orientation="vertical" style="height: 1.5rem;" />
			<span>About</span>
			<Divider orientation="vertical" style="height: 1.5rem;" />
			<span>Contact</span>
		</Stack>

		<h3>Decorative (role="presentation")</h3>
		<p>
			Use <code>role="presentation"</code> when the divider is purely visual and shouldn't be announced by screen readers
			(e.g. inside a layout where the structural separation is already obvious from surrounding semantics).
		</p>
		<div class="divider-stack">
			<p>The divider below is decorative — screen readers will skip it.</p>
			<Divider role="presentation" />
			<p>This is the content after it.</p>
		</div>

		<h3>Custom color</h3>
		<p>
			Override <code>--neutral-stroke-divider-rest</code> inline (or in a parent stylesheet) to change the divider's color
			without forking the component.
		</p>
		<div class="divider-stack">
			<p>Default color (subtle neutral stroke).</p>
			<Divider />
			<p>Accent-tinted divider.</p>
			<Divider style="--neutral-stroke-divider-rest: var(--accent-fill-rest);" />
			<p>Danger-tinted divider.</p>
			<Divider style="--neutral-stroke-divider-rest: var(--error-foreground-rest, #c50f1f);" />
		</div>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	/* Reset reboot.scss's `p { margin-bottom: 1rem }` inside our horizontal-divider
	   demos so dividers sit visually centred between paragraphs instead of glued
	   to the bottom of the previous one. */
	.divider-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.divider-stack > p {
		margin: 0;
	}
</style>
