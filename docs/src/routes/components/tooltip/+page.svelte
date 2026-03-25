<script lang="ts">
	import {Tooltip, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "anchor", type: "string", default: "undefined", description: "HTML ID of the element the tooltip is positioned relative to"},
		{name: "class", type: "string", default: '""', description: "CSS classes"},
		{name: "delay", type: "number", default: "250", description: "Delay in milliseconds before showing tooltip after hover"},
		{name: "maxWidth", type: "string", default: "undefined", description: "Maximum width for wrapping long content"},
		{name: "position", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Position relative to anchor element"},
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "visible", type: "boolean", default: "undefined", description: "Forces tooltip to be visible (default: shows on hover)"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Tooltip content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Tooltip</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-tooltip--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Tooltip" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Tooltip on hover</h3>
		<Stack orientation="horizontal" gap="2rem" style="flex-wrap: wrap; margin-bottom: 1rem;">
			<span id="hover-target" style="cursor: pointer; text-decoration: underline;">Hover me (top)</span>
			<Tooltip anchor="hover-target">
				{#snippet children()}
					Tooltip on top (default)
				{/snippet}
			</Tooltip>

			<span id="hover-target2" style="cursor: pointer; text-decoration: underline;">Hover me (right)</span>
			<Tooltip anchor="hover-target2" position="right">
				{#snippet children()}
					Tooltip on the right
				{/snippet}
			</Tooltip>

			<span id="hover-target3" style="cursor: pointer; text-decoration: underline;">Hover me (bottom)</span>
			<Tooltip anchor="hover-target3" position="bottom">
				{#snippet children()}
					Tooltip on the bottom
				{/snippet}
			</Tooltip>

			<span id="hover-target4" style="cursor: pointer; text-decoration: underline;">Hover me (left)</span>
			<Tooltip anchor="hover-target4" position="left">
				{#snippet children()}
					Tooltip on the left
				{/snippet}
			</Tooltip>
		</Stack>

		<h3>Always visible tooltip</h3>
		<p>
			<span id="always-visible">Always visible</span>
			<Tooltip anchor="always-visible" position="right" visible={true}>
				{#snippet children()}
					This tooltip is always shown
				{/snippet}
			</Tooltip>
		</p>

		<h3>With delay</h3>
		<p>
			<span id="delayed" style="cursor: pointer; text-decoration: underline;">Hover me (500ms delay)</span>
			<Tooltip anchor="delayed" delay={500}>
				{#snippet children()}
					This tooltip has a 500ms delay
				{/snippet}
			</Tooltip>
		</p>
	</Card>
</Stack>
