<script lang="ts">
	import {Accordion, AccordionItem, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	let accordionValue: string | string[] | null = null

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const accordionProperties: Property[] = [
		{name: "value", type: "string | string[]", default: "null", description: "Expanded item ID(s)"},
		{name: "multi", type: "boolean", default: "undefined", description: "Allow multiple items open"}
	]

	const accordionCallbacks: Property[] = [
		{name: "onChange", type: "(value: string | string[]) => void", default: "undefined", description: "Fires when expanded items change"}
	]

	const accordionSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "AccordionItem components"}
	]

	const accordionItemProperties: Property[] = [
		{name: "id", type: "string", default: "Required", description: "Unique item identifier"},
		{name: "header", type: "string", default: "undefined", description: "Header text (plain string)"},
		{name: "headingLevel", type: "string | number", default: "undefined", description: "Heading level for accessibility"},
		{name: "expanded", type: "boolean", default: "undefined", description: "Controls expanded state (falls back to parent Accordion's value)"}
	]

	const accordionItemCallbacks: Property[] = [
		{name: "onchange", type: "(ev: Event, isExpanded: boolean) => void", default: "undefined", description: "Fires when this item expands or collapses"}
	]

	const accordionItemSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Body content rendered when the item is expanded"},
		{name: "heading", type: "SlotType", default: "undefined", description: "Custom heading content (overrides the `header` string prop)"},
		{name: "start", type: "SlotType", default: "undefined", description: "Content rendered at the start of the header"},
		{name: "end", type: "SlotType", default: "undefined", description: "Content rendered at the end of the header"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Custom expand/collapse icon. Receives isExpanded boolean"}
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
				<h2>Accordion Properties</h2>
				<QuickGrid items={accordionProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Accordion Callbacks</h2>
				<QuickGrid items={accordionCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Accordion Slots</h2>
				<QuickGrid items={accordionSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Properties</h2>
				<QuickGrid items={accordionItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Callbacks</h2>
				<QuickGrid items={accordionItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Slots</h2>
				<QuickGrid items={accordionItemSlots} columns={propertyColumns} sortable filterable striped />
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
