<script lang="ts">
	import {
		Accordion, AccordionItem, Button,
	} from "svelte-fluentui"
	import {Meta} from "$lib/components"

	let expandedAccordionItem: string | null        = $state("my-accordion-3")
	let expandedAccordionItemMulti: string[] | null = $state([
		"my-multi-accordion-1",
		"my-multi-accordion-2"
	])
</script>

<div class="navigation-layout">
	<Meta
		title="Navigation & Layout"
		description="Svelte FluentUI navigation and layout components — Accordion, AppBar, Grid, Layout, Stack, MultiSplitter, Spacer, and NavMenu primitives."
		keywords="svelte, fluentui, navigation, layout, accordion, appbar, grid, stack"
	/>

	<h1>Navigation & Layout</h1>

	<div class="components">
		<div class="accordions component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/accordion">
					Accordion
				</a>
			</div>
			<div class="accordion-examples">
				<div class="mb-2 accordion-column">
					<div>
						<span>Selected: {expandedAccordionItem}</span> <br>

						<Button onclick={() => expandedAccordionItem = null}>
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

				<div class="mb-2 accordion-column">
					<div>
						<span>Multi selected:</span>
						<br>
						<div>{@html expandedAccordionItemMulti?.join("<br>")}</div>

						<Button onclick={() => expandedAccordionItemMulti = null}>
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
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/layout">
					Layout
				</a>
			</div>
		</div>
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/stack">
					Stack
				</a>
			</div>
		</div>
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/spacer">
					Spacer
				</a>
			</div>
		</div>
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/body-content">
					BodyContent
				</a>
			</div>
		</div>
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/grid">
					Grid
				</a>
			</div>
			<p>Responsive 12-column grid system</p>
		</div>
		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout/multisplitter">
					MultiSplitter
				</a>
			</div>
			<p>Resizable multi-panel splitter</p>
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

	.accordion-examples {
		display: flex;
		gap: 0.5rem;
	}

	.accordion-column {
		flex: 1;
	}
</style>
