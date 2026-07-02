<script lang="ts">
	import {Badge, Label, CompositeBadge, BadgeGroup, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "color", type: "string", default: "undefined", description: "Badge color"},
		{name: "appearance", type: "string", default: '"lightweight"', description: "Visual appearance"},
		{name: "size", type: '"xs" | "sm" | "medium" | "lg" | "xl"', default: '"medium"', description: "Size scale."},
		{name: "circular", type: "boolean", default: "false", description: "Circular count-style shape (adds min-width)."},
		{name: "pill", type: "boolean", default: "false", description: "Fully-rounded pill corners (no min-width)."},
		{name: "icon", type: "Snippet", default: "undefined", description: "Icon slot rendered before the label."},
		{name: "truncate", type: "boolean", default: "false", description: "Ellipsis-truncate overflowing text. Needs maxWidth to take effect."},
		{name: "ellipsisStart", type: "boolean", default: "false", description: "Truncate from the START (keeps the tail visible) — for paths/breadcrumbs. Implies truncate."},
		{name: "maxWidth", type: "string", default: "undefined", description: "Max width (any CSS length) that drives truncation."},
		{name: "title", type: "string", default: "undefined", description: "Native tooltip; surface the full text here when truncating."},
		{name: "radius", type: "string", default: "undefined", description: "Custom border-radius (any CSS length). Wins over default and circular radii via inline-style specificity."}
	]

	const labelProps: Property[] = [
		{name: "color", type: '"primary" | "secondary" | "success" | "warning" | "danger" | "info"', default: '"primary"', description: "Semantic color."},
		{name: "size", type: '"xs" | "sm" | "medium" | "lg" | "xl"', default: '"medium"', description: "Size scale (matches Badge)."},
		{name: "outline", type: "boolean", default: "false", description: "Transparent background; fills with the tint on hover."},
		{name: "icon", type: "Snippet", default: "undefined", description: "Icon slot before the label text."}
	]

	const compositeProps: Property[] = [
		{name: "color", type: '"primary" | … | "dark"', default: '"primary"', description: "Base color applied to all three sections."},
		{name: "labelColor", type: "string", default: "undefined", description: "Override only the label (middle) section color."},
		{name: "buttonColor", type: "string", default: "undefined", description: "Override only the button (right) section color."},
		{name: "icon", type: "Snippet", default: "undefined", description: "Left icon section (omitted when not set)."},
		{name: "label", type: "Snippet", default: "undefined", description: "Middle label section content."},
		{name: "button", type: "Snippet", default: "× glyph", description: "Right button section content."},
		{name: "showButton", type: "boolean", default: "true", description: "Render the button section."},
		{name: "onlabelclick", type: "(ev) => void", default: "undefined", description: "Label click handler (adds pointer/hover)."},
		{name: "onbuttonclick", type: "(ev) => void", default: "undefined", description: "Button click handler."}
	]

	const groupProps: Property[] = [
		{name: "limit", type: "number", default: "5", description: "Max badges shown before overflow is hidden."},
		{name: "showAll", type: "boolean", default: "false", description: "Reveal all children, ignoring limit (hard override)."},
		{name: "expandable", type: "boolean", default: "false", description: "Render a built-in clickable +N more / Show less toggle (don't supply a manual tail)."},
		{name: "moreLabel", type: "(hiddenCount: number) => string", default: "n => `+${n} more`", description: "Label for the collapsed toggle."},
		{name: "lessLabel", type: "string", default: '"Show less"', description: "Label for the expanded toggle."},
		{name: "gap", type: "string", default: '"0.5rem"', description: "Gap between badges (any CSS length)."}
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

		<h3>Sizes</h3>
		<p>Five sizes from <code>xs</code> to <code>xl</code> (default <code>medium</code>):</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Badge color="brand" appearance="accent" size="xs">xs</Badge>
			<Badge color="brand" appearance="accent" size="sm">sm</Badge>
			<Badge color="brand" appearance="accent">medium</Badge>
			<Badge color="brand" appearance="accent" size="lg">lg</Badge>
			<Badge color="brand" appearance="accent" size="xl">xl</Badge>
		</Stack>

		<h3>Pill</h3>
		<p>Fully-rounded corners without the count-badge <code>min-width</code>:</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Badge pill color="success" appearance="accent">Active</Badge>
			<Badge pill color="danger" appearance="accent">Blocked</Badge>
			<Badge pill appearance="outline">Draft</Badge>
		</Stack>

		<h3>With Icon</h3>
		<p>The <code>icon</code> snippet renders before the label:</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Badge color="success" appearance="accent">
				{#snippet icon()}✓{/snippet}
				Verified
			</Badge>
			<Badge color="warning" appearance="accent" size="sm">
				{#snippet icon()}⚠{/snippet}
				Alert
			</Badge>
		</Stack>

		<h3>Truncation &amp; Start-Side Ellipsis</h3>
		<p>
			Constrain width with <code>maxWidth</code> and turn on <code>truncate</code> to get an end
			ellipsis, or <code>ellipsisStart</code> to truncate from the <strong>start</strong> — keeping the
			visible tail, which is what matters for file paths, breadcrumbs and hierarchies. Set
			<code>title</code> so the full text shows on hover.
		</p>
		<p style="margin-bottom: 0.25rem;"><strong>End ellipsis</strong> (<code>truncate</code>):</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Badge color="brand" appearance="accent" truncate maxWidth="10rem" title="This is a longer badge that will be truncated">
				This is a longer badge that will be truncated
			</Badge>
			<Badge color="informative" truncate maxWidth="8rem" title="PostgreSQL Database">PostgreSQL Database</Badge>
		</Stack>
		<p style="margin: 0.75rem 0 0.25rem;"><strong>Start ellipsis</strong> (<code>ellipsisStart</code>) — path/hierarchy display:</p>
		<Stack orientation="vertical" gap="0.5rem" style="align-items: flex-start;">
			<Badge color="informative" ellipsisStart maxWidth="14rem" title="Settings > User Preferences > Notifications > Email">
				Settings &gt; User Preferences &gt; Notifications &gt; Email
			</Badge>
			<Badge color="informative" ellipsisStart maxWidth="14rem" title="/var/www/html/application/config/database.php">
				/var/www/html/application/config/database.php
			</Badge>
			<Badge color="brand" appearance="accent" ellipsisStart maxWidth="14rem" title="Components > Forms > Inputs > TextArea.svelte">
				Components &gt; Forms &gt; Inputs &gt; TextArea.svelte
			</Badge>
		</Stack>
	</Card>

	<Card>
		<h2>Label</h2>
		<p>
			A lighter, tag-style indicator — tinted background + coloured border, medium weight. Good for
			inline content tags and category chips. Same size scale as Badge.
		</p>

		<h3>Colors</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Label color="primary">React</Label>
			<Label color="secondary">TypeScript</Label>
			<Label color="success">Bug Fix</Label>
			<Label color="warning">Enhancement</Label>
			<Label color="danger">Breaking Change</Label>
			<Label color="info">Documentation</Label>
		</Stack>

		<h3>Outline</h3>
		<p>Transparent background; fills with the tint on hover.</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Label color="primary" outline>React</Label>
			<Label color="success" outline>Bug Fix</Label>
			<Label color="danger" outline>Breaking Change</Label>
		</Stack>

		<h3>Sizes</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Label color="primary" size="xs">xs</Label>
			<Label color="primary" size="sm">sm</Label>
			<Label color="primary">medium</Label>
			<Label color="primary" size="lg">lg</Label>
			<Label color="primary" size="xl">xl</Label>
		</Stack>
	</Card>

	<Card>
		<h2>CompositeBadge</h2>
		<p>
			A three-section <code>[icon][label][button]</code> chip for notification pills, status + count,
			or dismissible chips. Each section takes the base <code>color</code>, or override the label and
			button sections independently.
		</p>

		<h3>Standard Colors</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<CompositeBadge color="primary">
				{#snippet icon()}🔔{/snippet}
				{#snippet label()}Notifications{/snippet}
				{#snippet button()}5{/snippet}
			</CompositeBadge>
			<CompositeBadge color="success">
				{#snippet icon()}✓{/snippet}
				{#snippet label()}Completed{/snippet}
				{#snippet button()}12{/snippet}
			</CompositeBadge>
			<CompositeBadge color="danger">
				{#snippet icon()}⚠{/snippet}
				{#snippet label()}Errors{/snippet}
				{#snippet button()}3{/snippet}
			</CompositeBadge>
			<CompositeBadge color="info">
				{#snippet icon()}ℹ{/snippet}
				{#snippet label()}Updates{/snippet}
				{#snippet button()}2{/snippet}
			</CompositeBadge>
		</Stack>

		<h3>Dismissible &amp; Mixed Sections</h3>
		<p>Default button is a <code>×</code>. Override just the button with <code>buttonColor="danger"</code> for a red dismiss.</p>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<CompositeBadge color="primary" labelColor="info" buttonColor="danger" onbuttonclick={() => alert("dismiss")}>
				{#snippet icon()}📧{/snippet}
				{#snippet label()}New messages{/snippet}
			</CompositeBadge>
			<CompositeBadge color="success" labelColor="secondary" onlabelclick={() => alert("open")} onbuttonclick={() => alert("dismiss")}>
				{#snippet icon()}✓{/snippet}
				{#snippet label()}CI passed{/snippet}
			</CompositeBadge>
		</Stack>
	</Card>

	<Card>
		<h2>BadgeGroup</h2>
		<p>
			Flex-wraps child badges and hides any past <code>limit</code>. In <strong>expandable</strong> mode the
			group renders its own clickable <code>+N more</code> / <code>Show less</code> toggle; in the default
			static mode it keeps the <strong>last</strong> child visible so you can supply your own "+N more" tail.
			Hidden badges stay in the DOM. Set <code>showAll</code> to reveal everything.
		</p>

		<h3>Expandable (click to reveal)</h3>
		<p>With <code>expandable</code>, the group owns the toggle — click <code>+N more</code> to show the rest, <code>Show less</code> to collapse.</p>
		<BadgeGroup limit={5} expandable>
			<Badge color="brand" appearance="accent">React</Badge>
			<Badge color="informative">TypeScript</Badge>
			<Badge color="success">Node.js</Badge>
			<Badge color="warning">Express</Badge>
			<Badge color="danger">PostgreSQL</Badge>
			<Badge>Redux</Badge>
			<Badge>Sass</Badge>
			<Badge>Docker</Badge>
			<Badge>Jest</Badge>
			<Badge>Webpack</Badge>
		</BadgeGroup>

		<h3>Static tail (you supply "+N more")</h3>
		<p>Default mode: overflow is hidden but the last child stays visible as a non-interactive tail.</p>
		<BadgeGroup limit={5}>
			<Badge color="brand" appearance="accent">React</Badge>
			<Badge color="informative">TypeScript</Badge>
			<Badge color="success">Node.js</Badge>
			<Badge color="warning">Express</Badge>
			<Badge color="danger">PostgreSQL</Badge>
			<Badge>Redux</Badge>
			<Badge>Sass</Badge>
			<Badge>Docker</Badge>
			<Badge appearance="neutral">+3 more</Badge>
		</BadgeGroup>

		<h3>Show All</h3>
		<BadgeGroup showAll>
			<Badge pill color="brand" appearance="accent">JavaScript</Badge>
			<Badge pill color="informative">Python</Badge>
			<Badge pill color="success">Java</Badge>
			<Badge pill color="warning">C++</Badge>
			<Badge pill appearance="neutral">Ruby</Badge>
			<Badge pill appearance="neutral">Go</Badge>
			<Badge pill appearance="neutral">Rust</Badge>
		</BadgeGroup>
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

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Label Properties</h2>
				<QuickGrid items={labelProps} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>CompositeBadge Properties</h2>
				<QuickGrid items={compositeProps} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>BadgeGroup Properties</h2>
				<QuickGrid items={groupProps} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>
