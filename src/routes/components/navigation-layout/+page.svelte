<script lang="ts">
	import {
		Accordion, AccordionItem, Button,
		Checkbox,
		Option, Radio, RadioGroup,
		TextField,
	} from "$lib/index.js"
	import Combobox from "$lib/components/Combobox.svelte"

	let expandedAccordionItem: string | null = $state("my-accordion-3")
	let expandedAccordionItemMulti: string[] | null = $state([
		"my-multi-accordion-1",
		"my-multi-accordion-2"
	])
</script>

<div class="navigation-layout">
	<h1>Navigation & Layout</h1>

	<div class="components">
		<div class="accordions component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/accordion">
					Accordion
				</a>
			</div>
			<div class="tw:flex tw:gap-2">
				<div class="tw:flex-1 mb-2">
					<div>
						<span>Selected: {expandedAccordionItem}</span> <br>

						<Button onClick={() => expandedAccordionItem = null}>
							Reset
						</Button>
					</div>

					<div>
						<Accordion bind:value={expandedAccordionItem}>
							<AccordionItem id="my-accordion-1" header="Item 1">Content 1</AccordionItem>
							<AccordionItem id="my-accordion-2" header="Item 2">Content 2</AccordionItem>
							<AccordionItem id="my-accordion-3" header="Item 3">Content 3</AccordionItem>
						</Accordion>
					</div>
				</div>

				<div class="tw:flex-1 mb-2">
					<div>
						<span>Multi selected:</span>
						<br>
						<div>{@html expandedAccordionItemMulti?.join("<br>")}</div>

						<Button onClick={() => expandedAccordionItemMulti = null}>
							Reset
						</Button>
					</div>

					<div>
						<Accordion bind:value={expandedAccordionItemMulti} multi>
							<AccordionItem id="my-multi-accordion-1" header="Item 1">Content 1</AccordionItem>
							<AccordionItem id="my-multi-accordion-2" header="Item 2">Content 2</AccordionItem>
							<AccordionItem id="my-multi-accordion-3" header="Item 3">Content 3</AccordionItem>
						</Accordion>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.navigation-layout {
		.components {
			.accordions.component-section {
				min-width: 30rem;
				max-width: 50vw;
			}
		}
	}
</style>
