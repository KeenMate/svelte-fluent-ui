<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Badge,
		Button,
		Dialog,
		Divider,
		Menu,
		ProgressBar, TextField,
		Tooltip,
		Tree,
		TreeItem
	} from "$lib/index.js"
	import {ButtonAppearance} from "$lib/fluent-ui/constants/button.js"

	let dialogElement: any = $state()
	let counter: number = $state(0)
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
				<a href="/components/buttons">
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
			<div class="component-title">Navigation / Layout</div>
			<div class="grid">
				<!-- <TabList>
					<TabPanel>Tab 1 content</TabPanel>
					<TabPanel>Tab 2 content</TabPanel>
				</TabList> -->
				<Accordion>
					<AccordionItem header="Item 1">Content 1</AccordionItem>
					<AccordionItem header="Item 2">Content 2</AccordionItem>
				</Accordion>
				<Tree>
					<TreeItem>
						Root
						<TreeItem>Child</TreeItem>
					</TreeItem>
				</Tree>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Miscellaneous</div>
			<div class="grid">
				<Badge appearance="accent">New</Badge>
				<!-- <CounterBadge count="5" /> -->
				<ProgressBar value="75" />
				<!-- <Spinner /> -->
				<Tooltip content="Helpful info">
					<Button>Hover me</Button>
				</Tooltip>
				<!-- <MessageBar>Important message here</MessageBar> -->
			</div>
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
				<!-- <Text>Sample text</Text>
				<Label for="input">Label</Label>
				<Image src="https://via.placeholder.com/100" alt="Placeholder" />
				<Link href="https://example.com">Example Link</Link>
				<Field label="Name">
					<TextInput id="name" />
				</Field> -->
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
