<script lang="ts">
	import {Badge, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "color", type: "string", default: "undefined", description: "Badge color"},
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance"},
		{name: "circular", type: "boolean", default: "undefined", description: "Circular shape"},
		{name: "radius", type: "string", default: "undefined", description: "Custom border-radius (any CSS length). Wins over default and circular radii via inline-style specificity."}
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
	<Meta
		title="Badge"
		description="A Svelte wrapper for FluentUI's badge web component — a small visual indicator highlighting status, counts, or labels next to other content."
		keywords="svelte, fluentui, badge, status, count, label, web components"
	/>

	<h1>Badge</h1>

	<p>
		A small visual indicator that wraps the <code>&lt;fluent-badge&gt;</code> element, used to highlight
		status, counts, or labels next to other content.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-badge-badge--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Badge"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Built-in Colors</h3>
		<p>Pre-defined colors: brand, danger, important, informative, severe, subtle, success, warning</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Badge color="brand">brand</Badge>
			<Badge color="danger">danger</Badge>
			<Badge color="important">important</Badge>
			<Badge color="informative">informative</Badge>
			<Badge color="severe">severe</Badge>
			<Badge color="subtle">subtle</Badge>
			<Badge color="success">success</Badge>
			<Badge color="warning">warning</Badge>
		</Stack>

		<h3>Appearance</h3>
		<p>Different appearance styles:</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Badge appearance="accent">Accent</Badge>
			<Badge appearance="lightweight">Lightweight</Badge>
			<Badge appearance="neutral">Neutral</Badge>
			<Badge appearance="outline">Outline</Badge>
			<Badge appearance="tint">Tint</Badge>
		</Stack>

		<h3>Color + Appearance Combinations</h3>
		<p>Combining color with different appearances:</p>
		<Grid columns={4} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>danger</strong>
					<Badge color="danger" appearance="accent">accent</Badge>
					<Badge color="danger" appearance="lightweight">lightweight</Badge>
					<Badge color="danger" appearance="neutral">neutral</Badge>
					<Badge color="danger" appearance="outline">outline</Badge>
					<Badge color="danger" appearance="tint">tint</Badge>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>success</strong>
					<Badge color="success" appearance="accent">accent</Badge>
					<Badge color="success" appearance="lightweight">lightweight</Badge>
					<Badge color="success" appearance="neutral">neutral</Badge>
					<Badge color="success" appearance="outline">outline</Badge>
					<Badge color="success" appearance="tint">tint</Badge>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>warning</strong>
					<Badge color="warning" appearance="accent">accent</Badge>
					<Badge color="warning" appearance="lightweight">lightweight</Badge>
					<Badge color="warning" appearance="neutral">neutral</Badge>
					<Badge color="warning" appearance="outline">outline</Badge>
					<Badge color="warning" appearance="tint">tint</Badge>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>informative</strong>
					<Badge color="informative" appearance="accent">accent</Badge>
					<Badge color="informative" appearance="lightweight">lightweight</Badge>
					<Badge color="informative" appearance="neutral">neutral</Badge>
					<Badge color="informative" appearance="outline">outline</Badge>
					<Badge color="informative" appearance="tint">tint</Badge>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Custom Colors</h3>
		<p>Custom colors using CSS variables <code>--badge-fill-[name]</code> and <code>--badge-color-[name]</code>:</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Badge
				style="--badge-fill-custom1: red; --badge-color-custom1: white;"
				fill="custom1"
				color="custom1"
			>
				Red/White
			</Badge>
			<Badge
				style="--badge-fill-custom2: #ffd800; --badge-color-custom2: #000;"
				fill="custom2"
				color="custom2"
			>
				Highlight
			</Badge>
			<Badge
				style="--badge-fill-custom3: #000; --badge-color-custom3: #fff;"
				fill="custom3"
				color="custom3"
			>
				Lowlight
			</Badge>
			<Badge
				style="--badge-fill-custom4: linear-gradient(90deg, #ff0000, #0000ff); --badge-color-custom4: white;"
				fill="custom4"
				color="custom4"
			>
				Gradient
			</Badge>
		</Stack>

		<h3>Circular</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Badge circular>1</Badge>
			<Badge circular color="danger">5</Badge>
			<Badge circular color="success">99+</Badge>
		</Stack>

		<h3>Custom Radius</h3>
		<p>
			The <code>radius</code> prop accepts any CSS length and overrides both the default rounded-rect
			(<code>4px</code>) and <code>circular</code> pill shapes via inline-style specificity. Useful when you
			want a softer corner, match a nearby Card radius, or get pill-mode sizing with a non-pill radius.
		</p>
		<Stack orientation="horizontal" gap="0.75rem" style="flex-wrap: wrap; align-items: center;">
			<Badge color="brand" appearance="accent" radius="0">Squared</Badge>
			<Badge color="brand" appearance="accent" radius="2px">2px</Badge>
			<Badge color="brand" appearance="accent" radius="8px">8px</Badge>
			<Badge color="brand" appearance="accent" radius="12px">12px</Badge>
			<Badge color="success" appearance="accent" radius="0.5rem">0.5rem</Badge>
			<Badge color="warning" appearance="accent" radius="var(--fluent-border-radius-pill)">Token</Badge>
		</Stack>
		<p style="margin-top: 0.75rem;">
			Combine with <code>circular</code> to keep the pill <strong>sizing</strong> (<code>min-width: 20px</code>, padded)
			but with a non-pill corner:
		</p>
		<Stack orientation="horizontal" gap="0.75rem" style="flex-wrap: wrap; align-items: center;">
			<Badge circular color="danger">5</Badge>
			<Badge circular color="danger" radius="6px">5</Badge>
			<Badge circular color="success" radius="4px">99+</Badge>
			<Badge circular color="informative" radius="0">12</Badge>
		</Stack>
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
</Stack>
