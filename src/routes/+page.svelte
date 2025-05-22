<script lang="ts">
	import "$lib/fluent-ui/setup.js"

	import {
		Accordion,
		AccordionItem,
		Badge,
		Button,
		Dialog,
		Divider,
		Menu,
		ProgressBar,
		Tooltip,
		Tree,
		TreeItem,
		TextField
	} from "$lib/index.js"
	import {ButtonAppearance} from "$lib/fluent-ui/constants/button.js"

	let dialogElement: any
</script>


<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h1>List of components and their state</h1>

<table class="pure-table pure-table-striped">
	<thead>
		<tr>
			<th>State</th>
			<th>Name</th>
			<th>Comment</th>
		</tr>
	</thead>
	<tbody>
		<tr>
	<td></td>
	<td>accordion</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>anchor</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>anchored-region</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>badge</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>breadcrumb</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>breadcrumb-item</td>
	<td></td>
	</tr>
<tr>
	<td>Initial tests</td>
	<td>button</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>calendar</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>card</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>checkbox</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>color</td>
	<td></td>
	</tr>
<tr>
	<td>Initial tests</td>
	<td>combobox</td>
	<td>Disable option is displayed as disabled, but can still be selected</td>
	</tr>
<tr>
	<td></td>
	<td>data-grid</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>design-system-provider</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>dialog</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>divider</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>flipper</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>horizontal-scroll</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>listbox</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>listbox-option</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>menu</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>menu-item</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>number-field</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>progress</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>radio</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>radio-group</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>search</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>select</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>skeleton</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>slider</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>slider-label</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>styles</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>switch</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>tabs</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>text-area</td>
	<td></td>
	</tr>
<tr>
	<td>Initial tests</td>
	<td>text-field</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>toolbar</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>tooltip</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>tree-item</td>
	<td></td>
	</tr>
<tr>
	<td></td>
	<td>tree-view</td>
	<td></td>
	</tr>
	</tbody>
</table>
		</div>
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h1>Fluent UI Svelte – Full Component Demo</h1>

<!-- Example Section -->
<div class="components">
	<div class="component-section">
		<div class="component-title">
			<a href="/forms">Forms</a>
		</div>
		<div class="grid">
			<TextField placeholder="Enter text" />
		</div>
	</div>

	<div class="component-section">
		<div class="component-title">
			<a href="/buttons">
				Buttons
			</a>
		</div>
		<div class="grid">
			<Button appearance={ButtonAppearance.accent}>Button</Button>
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
</div>


<!--<style lang="scss">-->
<!--	@import ;-->
<!--</style>-->






