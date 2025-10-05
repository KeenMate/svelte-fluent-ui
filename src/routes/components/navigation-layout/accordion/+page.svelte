<script lang="ts">
	import {Accordion, AccordionItem, QuickGrid, Stack, Grid, GridItem, Card} from "$lib/index.js"
	let accordionValue: string | string[] | null = null

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string | string[]", default: "null", description: "Expanded item ID(s)"},
		{name: "multi", type: "boolean", default: "undefined", description: "Allow multiple items open"},
		{name: "children", type: "SlotType", default: "undefined", description: "Accordion items"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(value: string | string[]) => void", default: "undefined", description: "Fires when expanded items change"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "AccordionItem components"},
		{name: "heading", type: "SlotType", default: "undefined", description: "Custom heading content"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Custom expand/collapse icon"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Accordion</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-accordion-accordion--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Accordion" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

	<Card>
		<h2>Examples</h2>

		<Grid spacing={3}>
			<GridItem xs={12} xl={6} xxl={4}>
			<h3>Basic accordion</h3>
			<Accordion>
				{#snippet children()}
					<AccordionItem id="item-1" header="Section 1">
						<p>This is the content of section 1.</p>
					</AccordionItem>
					<AccordionItem id="item-2" header="Section 2">
						<p>This is the content of section 2.</p>
					</AccordionItem>
				{/snippet}
			</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Accordion with multiple expand allowed</h3>
			<Accordion multi={true}>
				{#snippet children()}
					<AccordionItem id="multi-1" header="First">
						<p>Multi mode - first item content.</p>
					</AccordionItem>
					<AccordionItem id="multi-2" header="Second">
						<p>Multi mode - second item content.</p>
					</AccordionItem>
				{/snippet}
			</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Controlled accordion</h3>
			<Accordion bind:value={accordionValue}>
				{#snippet children()}
					<AccordionItem id="controlled-1" header="Controlled One">
						<p>First controlled content.</p>
					</AccordionItem>
					<AccordionItem id="controlled-2" header="Controlled Two">
						<p>Second controlled content.</p>
					</AccordionItem>
				{/snippet}
			</Accordion>
			<p>Current value: {JSON.stringify(accordionValue)}</p>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Accordion with custom heading</h3>
			<Accordion>
				{#snippet children()}
					<AccordionItem id="custom-head">
						{#snippet heading()}
							<strong class="warning-heading">⚠ Important Section</strong>
						{/snippet}
						<p>Custom heading content goes here.</p>
					</AccordionItem>
				{/snippet}
			</Accordion>
			</GridItem>
		</Grid>
	</Card>
</Stack>

<style>
	.warning-heading {
		color: red;
	}
</style>
