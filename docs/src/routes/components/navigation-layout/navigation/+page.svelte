<script lang="ts">
	import {NavMenu, NavGroup, NavLinkItem, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	function onNavClick(ev: Event) {
		console.log("Nav link/group clicked", ev)
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const navMenuProperties: Property[] = [
		{name: "width", type: "string", default: "undefined", description: "Explicit NavMenu width. Defaults to 100% of parent"},
		{name: "collapsed", type: "boolean", default: "undefined", description: "Collapsed state (bindable). Shrinks the menu to a narrow rail"},
		{name: "collapsible", type: "boolean", default: "undefined", description: "Show a collapse/expand button at the top of the menu"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class"}
	]

	const navMenuCallbacks: Property[] = []

	const navMenuSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "NavLinkItem, NavGroup and nested NavMenu components"}
	]

	const navGroupProperties: Property[] = [
		{name: "title", type: "string", default: "undefined", description: "Unique identifier used to persist expanded state in localStorage"},
		{name: "expanded", type: "boolean", default: "false", description: "Expanded state (bindable)"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the group and all its children"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class"}
	]

	const navGroupCallbacks: Property[] = []

	const navGroupSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "NavLinkItem or nested NavGroup components"},
		{name: "linkIcon", type: "SlotType", default: "undefined", description: "Icon rendered at the start of the group header"},
		{name: "linkText", type: "SlotType", default: "undefined", description: "Custom header text content"}
	]

	const navLinkItemProperties: Property[] = [
		{name: "href", type: "string", default: "undefined", description: "URL — renders the item as a link"},
		{name: "rel", type: "string", default: "undefined", description: "Link rel attribute"},
		{name: "target", type: "string", default: "undefined", description: "Link target attribute"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text (useful in collapsed mode)"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the item"},
		{name: "group", type: "boolean", default: "undefined", description: "Style the item as a group header"}
	]

	const navLinkItemCallbacks: Property[] = [
		{name: "onClick", type: "(ev: MouseEvent) => void", default: "undefined", description: "Fires when the item is clicked"},
		{name: "linkAction", type: "(node: HTMLElement) => void", default: "undefined", description: "Svelte action invoked on the underlying link element"}
	]

	const navLinkItemSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Link label content"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Icon rendered before the label"},
		{name: "afterText", type: "SlotType", default: "undefined", description: "Content rendered after the label (e.g. badges)"}
	]

	const navItemProperties: Property[] = [
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the item"},
		{name: "group", type: "boolean", default: "undefined", description: "Style the item as a group header"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class"}
	]

	const navItemCallbacks: Property[] = [
		{name: "onClick", type: "(ev: MouseEvent) => void", default: "undefined", description: "Fires when the item is clicked"}
	]

	const navItemSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Generic item content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Navigation</h1>

	<p>
		The Navigation system is composed of several building blocks:
		<span class="component-name">NavMenu</span>,
		<span class="component-name">NavGroup</span>,
		<span class="component-name">NavLinkItem</span>, and
		<span class="component-name">NavItem</span>.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">NavMenu (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/NavMenu" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavMenu Properties</h2>
				<QuickGrid items={navMenuProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavMenu Callbacks</h2>
				<QuickGrid items={navMenuCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavMenu Slots</h2>
				<QuickGrid items={navMenuSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavGroup Properties</h2>
				<QuickGrid items={navGroupProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavGroup Callbacks</h2>
				<QuickGrid items={navGroupCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavGroup Slots</h2>
				<QuickGrid items={navGroupSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavLinkItem Properties</h2>
				<QuickGrid items={navLinkItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavLinkItem Callbacks</h2>
				<QuickGrid items={navLinkItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavLinkItem Slots</h2>
				<QuickGrid items={navLinkItemSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavItem Properties</h2>
				<QuickGrid items={navItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavItem Callbacks</h2>
				<QuickGrid items={navItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>NavItem Slots</h2>
				<QuickGrid items={navItemSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<div class="examples-container">
			<div class="example-item">
				<h3>Regular nav menu</h3>

				<NavMenu width="250px">
					<NavLinkItem href="https://microsoft.com" rel="noreferer noorigin" target="_blank">
						Microsoft
					</NavLinkItem>

					<NavLinkItem href="/">
						Home
					</NavLinkItem>
					<NavLinkItem href="/NavMenu">Item 2</NavLinkItem>
					<NavGroup onClick={onNavClick}>
						{#snippet linkText()}
							<h3>Item 3</h3>
						{/snippet}

						<NavLinkItem onClick={onNavClick}>
							Item 3.1
						</NavLinkItem>
						<NavLinkItem onClick={onNavClick}>
							Item 3.2
						</NavLinkItem>
					</NavGroup>
					<NavLinkItem disabled href="https://microsoft.com">
						Item 4
					</NavLinkItem>
					<NavLinkItem disabled>
						Item 5
					</NavLinkItem>
					<NavGroup
						expanded
					>
						{#snippet linkText()}
							Item 6 Item 6 Item 6 Item 6 Item 6
						{/snippet}

						<NavLinkItem>
							Item 6.1
						</NavLinkItem>
						<NavLinkItem>
							Item 6.2
						</NavLinkItem>
						<NavGroup expanded>
							{#snippet linkText()}
								Item 6.3
							{/snippet}

							<NavLinkItem>
								Item 6.3.1 Item 6.3.1 Item 6.3.1
							</NavLinkItem>
							<NavLinkItem>
								Item 6.3.2
							</NavLinkItem>
							<NavGroup
								expanded
							>
								{#snippet linkText()}
									Item 6.3.3 Item 6.3.3 Item 6.3.3
								{/snippet}

								<NavLinkItem>
									Item 6.3.3.1
								</NavLinkItem>
								<NavLinkItem disabled>
									Item 6.3.3.2
								</NavLinkItem>
								<NavGroup
									disabled
									expanded
								>
									{#snippet linkText()}
										Item 6.3.3.3
									{/snippet}

									<NavLinkItem>
										Item 6.3.3.3.1
									</NavLinkItem>
									<NavLinkItem>
										Item 6.3.3.3.2
									</NavLinkItem>
								</NavGroup>
							</NavGroup>
						</NavGroup>
					</NavGroup>
				</NavMenu>
			</div>
			<NavMenu class="example-item">
				<h3>Collapsible nav menu</h3>

				<NavMenu collapsible>
					<NavLinkItem title="Item 1 tooltip">
						Item 1
					</NavLinkItem>
					<NavLinkItem title="Item 2 tooltip" disabled>
						Item 2
					</NavLinkItem>
					<NavGroup>
						{#snippet linkText()}
							Item 3
						{/snippet}

						<NavMenu>
							<NavLinkItem title="Item 3.1 tooltip">
								Item 3.1
							</NavLinkItem>
							<NavLinkItem title="Item 3.2 tooltip" disabled>
								Item 3.2
							</NavLinkItem>
							<NavGroup>
								{#snippet linkText()}
									Item 3.3
								{/snippet}

								<NavMenu>
									<NavLinkItem href="https://microsoft.com" title="Item 3.3.1 tooltip">
										https://microsoft.com
									</NavLinkItem>
								</NavMenu>
							</NavGroup>
							<NavGroup title="Item 3.4 tooltip" disabled>
								{#snippet linkText()}
									Item 3.4
								{/snippet}

								<NavMenu>
									<NavLinkItem
										title="Item 3.4.1 tooltip"
										href="https://microsoft.com"
										rel=""
									>
										https://microsoft.com
									</NavLinkItem>
								</NavMenu>
							</NavGroup>
						</NavMenu>
					</NavGroup>
					<NavLinkItem title="Item 4 tooltip" disabled>
						Item 4
					</NavLinkItem>
				</NavMenu>
			</NavMenu>
		</div>
	</Card>
</Stack>

<style>
	.component-name {
		font-family: monospace;
	}

	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.example-item {
		flex: 1;
	}
</style>
