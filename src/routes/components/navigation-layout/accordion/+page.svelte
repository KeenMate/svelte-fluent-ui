<script lang="ts">
	import {Accordion, AccordionItem, Stack, Grid, GridItem, Card} from "$lib/index.js"
	let accordionValue: string | string[] | null = null
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
				<h2>Members</h2>

				<table class="member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr
						><td></td><td>value</td><td>string | string[]</td><td>null</td><td
							>Expanded item ID(s)</td
						></tr
					>
					<tr
						><td></td><td>multi</td><td>boolean</td><td>undefined</td><td
							>Allow multiple items open</td
						></tr
					>
					<tr
						><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Accordion items</td
						></tr
					>
				</tbody>
			</table>
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Actions</h2>

				<table class="member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr
						><td></td><td>onChange</td><td>function</td><td>Fires when expanded items change</td
						></tr
					>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Slots</h2>

		<table class="member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr
				><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
					>AccordionItem components</td
				></tr
			>
			<tr
				><td></td><td>heading</td><td>SlotType</td><td>undefined</td><td>Custom heading content</td
				></tr
			>
			<tr
				><td></td><td>icon</td><td>SlotType</td><td>undefined</td><td
					>Custom expand/collapse icon</td
				></tr
			>
		</tbody>
	</table>

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
