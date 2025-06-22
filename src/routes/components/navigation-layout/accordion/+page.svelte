<script lang="ts">
	import {Accordion, AccordionItem} from "$lib/index.js"
	let accordionValue: string | string[] | null = null
</script>

<div class="header">
	<h1>Accordion</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
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
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr
						><td></td><td>onChange</td><td>function</td><td>Fires when expanded items change</td
						></tr
					>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
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

	<h2 class="content-subhead">Examples</h2>

	<div class="pure-g">
		<div class="pure-u-1 pure-u-m-1 pure-u-l-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
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
		</div>
	</div>

	<div class="pure-g">
		<div class="pure-u-1 pure-u-m-1 pure-u-l-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
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
		</div>
	</div>

	<div class="pure-g">
		<div class="pure-u-1 pure-u-m-1 pure-u-l-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
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
		</div>
	</div>

	<div class="pure-g">
		<div class="pure-u-1 pure-u-m-1 pure-u-l-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h3>Accordion with custom heading</h3>
			<Accordion>
				{#snippet children()}
					<AccordionItem id="custom-head">
						{#snippet heading()}
							<strong style="color: red;">⚠ Important Section</strong>
						{/snippet}
						<p>Custom heading content goes here.</p>
					</AccordionItem>
				{/snippet}
			</Accordion>
		</div>
	</div>
</div>
