<script lang="ts">
	import {
		Badge,
		Button,
		Dialog,
		Divider,
		Menu,
		ProgressBar, TextField,
		Tooltip,
	} from "$lib/index.js"
	import {ButtonAppearance} from "$lib/fluent-ui/constants/button.js"

	let dialogElement: any = $state()
	let counter: number = $state(0)
	let expandedAccordionItem: string | null = $state(null)
</script>

<div>
	<h1>Fluent UI Svelte – Full Component Demo</h1>

	<!-- Example Section -->
	<div class="components">
		<div class="component-section">
			<div class="component-title">
				<a href="/components/forms">Forms</a>
			</div>
			<div class="grid">
				<TextField placeholder="Enter text" />
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">
				<a href="/components/button">
					Buttons
				</a>
			</div>
			<div class="grid">
				<Button
					appearance={ButtonAppearance.accent}
					onClick={() => counter++}
				>
					Button ({counter})
				</Button>
				<Button
					appearance={ButtonAppearance.stealth}
					onClick={() => counter = 0}
				>
					Reset
				</Button>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">
				<a href="/components/navigation-layout">
					Navigation / Layout
				</a>
			</div>

			<p>
				Accordion, Stack, Page&nbsp;layout and the rest&mldr;
			</p>
			<!-- note: takes too much space for just a simple tile navigation item -->
			<!--<div>-->
			<!--	<span>Selected: {expandedAccordionItem}</span> <br>-->

			<!--	<Button onClick={() => expandedAccordionItem = null}>-->
			<!--		Reset-->
			<!--	</Button>-->
			<!--</div>-->

			<!--<div>-->
			<!--	<Accordion bind:value={expandedAccordionItem}>-->
			<!--		<AccordionItem id="my-accordion-1" header="Item 1">Content 1</AccordionItem>-->
			<!--		<AccordionItem id="my-accordion-2" header="Item 2">Content 2</AccordionItem>-->
			<!--		<AccordionItem id="my-accordion-3" header="Item 3">Content 3</AccordionItem>-->
			<!--	</Accordion>-->
			<!--</div>-->
		</div>

		<div class="component-section">
			<div class="component-title">Menus & Dialogs</div>
			<div class="grid">
				<Menu>
					<!-- <MenuButton>Open Menu</MenuButton> -->
					<!-- <MenuList slot="menu">
						<MenuItem>Item A</MenuItem>
						<MenuItem>Item B</MenuItem>
					</MenuList> -->
				</Menu>
				<Button appearance={ButtonAppearance.lightweight} onClick={dialogElement?.show}>
					Show dialog
				</Button>
				<Dialog
					bind:this={dialogElement}
					modal
					trapFocus
				>
					This is a dialog
				</Dialog>
				<!-- <Drawer>
					<DrawerBody>This is a drawer</DrawerBody>
				</Drawer> -->
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Text, Media, Misc</div>
			<div class="grid">
				<Badge appearance="filled" color="danger">Badge 2</Badge>
				<Badge appearance="accent">New</Badge>
				<!-- <CounterBadge count="5" /> -->
				<ProgressBar value="75" />
				<!-- <Spinner /> -->
				<Button id="hover-button">Hover me</Button>
				<Tooltip anchor="hover-button">
					Helpful info
				</Tooltip>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Decorative & Structural</div>
			<div class="grid">
				<Divider />
				<!-- <ToggleButton>Toggle Me</ToggleButton> -->
			</div>
		</div>
	</div>
</div>
