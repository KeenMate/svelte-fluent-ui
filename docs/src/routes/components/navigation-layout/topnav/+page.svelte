<script lang="ts">
	import {TopNav, Button, Search, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	function onSignIn() {
		console.log("Sign in clicked")
	}

	function onSignOut() {
		console.log("Sign out clicked")
	}

	let searchValue = $state("")

	function onSearchInput(value: string) {
		console.log("Search:", value)
	}

	const simpleItems = [
		{label: "Home", href: "/"},
		{label: "Docs", href: "/getting-started"},
		{label: "Components", href: "/components"}
	]

	const iconItems = [
		{label: "Home", href: "/", icon: "🏠"},
		{label: "Docs", href: "/getting-started", icon: "📘"},
		{label: "Components", href: "/components", icon: "🧩"}
	]

	const navigationGroups = [
		{
			title: "Get Started",
			icon: "🚀",
			items: [
				{label: "Introduction", href: "/getting-started"},
				{label: "Installation", href: "/getting-started#install"}
			]
		},
		{
			title: "Components",
			icon: "🧩",
			items: [
				{label: "Button", href: "/components/button"},
				{label: "TextField", href: "/components/forms"},
				{label: "Card", href: "/components/card"}
			]
		}
	]

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const topNavProperties: Property[] = [
		{name: "brand", type: "string", default: '"Brand"', description: "Brand label shown on the left (ignored when brandTemplate is provided)"},
		{name: "brandHref", type: "string", default: '"/"', description: "URL the brand label links to (ignored when brandTemplate is provided)"},
		{name: "brandTemplate", type: "Snippet", default: "undefined", description: "Optional snippet that replaces the default brand link — use for logos, version badges, composite brand content"},
		{name: "items", type: "NavItem[]", default: "[]", description: "Desktop nav items — { label, href, icon?, onClick? }"},
		{name: "navigationGroups", type: "NavGroupItem[]", default: "[]", description: "Groups shown in the mobile sidebar — { title, icon, items: { label, href }[] }"},
		{name: "drawerContent", type: "Snippet<[() => void]>", default: "undefined", description: "Custom mobile drawer content (rendered after items + groups). Receives a closeDrawer fn so consumer-supplied links can dismiss the drawer on click."},
		{name: "collapse", type: '"auto" | "always" | "never"', default: '"auto"', description: 'Force the collapse state. "auto" uses the 960px container query; "always" keeps the hamburger visible at every width (useful when the consumer wants to hide a paired desktop sidebar at a custom breakpoint); "never" keeps items expanded at every width.'},
		{name: "height", type: "number", default: "60", description: "TopNav height in pixels"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class"},
		{name: "style", type: "string", default: "undefined", description: "Inline style appended after the computed height"}
	]

	const topNavCallbacks: Property[] = []

	const topNavSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Action area rendered after the items, separated by a divider (e.g. Sign-in button)"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="TopNav"
		description="A horizontal top navigation bar with brand, links, optional action slot, and a built-in mobile sidebar drawer."
		keywords="svelte, fluentui, topnav, navbar, navigation, header, mobile menu"
	/>

	<h1>TopNav</h1>

	<p>
		A horizontal top navigation bar — brand on the left, link items in the middle, optional action area
		on the right. Below the mobile breakpoint (960px) the items collapse into a hamburger-triggered
		sidebar driven by <span class="component-name">navigationGroups</span>.
	</p>

	<References links={[
		{label: "TopNav", custom: true}
	]} />

	<Card>
		<h2>Examples</h2>

		<Stack orientation="vertical" gap="2rem">
			<div class="example-item">
				<h3>Simple TopNav</h3>
				<p class="example-description">Brand and a flat list of link items.</p>
				<div class="topnav-frame">
					<TopNav brand="Svelte FluentUI" brandHref="/" items={simpleItems} />
				</div>
			</div>

			<div class="example-item">
				<h3>With item icons</h3>
				<p class="example-description">
					Items accept an optional <span class="component-name">icon</span> string rendered before the label.
				</p>
				<div class="topnav-frame">
					<TopNav brand="My App" items={iconItems} />
				</div>
			</div>

			<div class="example-item">
				<h3>With search input</h3>
				<p class="example-description">
					Drop a <span class="component-name">Search</span> into the action slot for a search-as-you-type
					navbar. Pair with <span class="component-name">immediate</span> + <span class="component-name">immediateDelay</span>
					for debounced input.
				</p>
				<div class="topnav-frame">
					<TopNav brand="Search Demo" items={simpleItems}>
						<Search
							bind:value={searchValue}
							placeholder="Search…"
							immediate
							immediateDelay={250}
							oninput={onSearchInput}
							width="240px"
						/>
						<Button appearance="accent" onclick={onSignIn}>Sign in</Button>
					</TopNav>
				</div>
			</div>

			<div class="example-item">
				<h3>With action slot</h3>
				<p class="example-description">
					Children render to the right of the items, after a vertical divider — perfect for sign-in / account
					controls.
				</p>
				<div class="topnav-frame">
					<TopNav brand="Acme" items={simpleItems}>
						<Button appearance="stealth" onclick={onSignOut}>Sign out</Button>
						<Button appearance="accent" onclick={onSignIn}>Audrey Horne</Button>
					</TopNav>
				</div>
			</div>

			<div class="example-item">
				<h3>With mobile navigation groups</h3>
				<p class="example-description">
					<span class="component-name">navigationGroups</span> drives the mobile sidebar drawer. Resize the
					window below 960px to see the hamburger toggle and grouped sidebar appear.
				</p>
				<div class="topnav-frame">
					<TopNav
						brand="Portal"
						items={simpleItems}
						{navigationGroups}
					>
						<Button appearance="accent" onclick={onSignIn}>Sign in</Button>
					</TopNav>
				</div>
			</div>

			<div class="example-item">
				<h3>Custom height</h3>
				<p class="example-description">Override the default 60px height.</p>
				<div class="topnav-frame">
					<TopNav brand="Tall Bar" items={simpleItems} height={80} />
				</div>
			</div>

			<div class="example-item">
				<h3>Force collapse (hamburger always visible)</h3>
				<p class="example-description">
					<span class="component-name">collapse="always"</span> keeps the hamburger visible and items
					hidden at every width — useful when you pair TopNav with a desktop sidebar that you want to
					hide at a custom breakpoint (e.g. the docs site hides its sidebar at &lt;960px and routes
					all nav through the drawer below that point).
				</p>
				<div class="topnav-frame">
					<TopNav brand="Always Collapsed" items={simpleItems} collapse="always" />
				</div>
			</div>

			<div class="example-item">
				<h3>RTL</h3>
				<p class="example-description">
					Set <span class="component-name">dir="rtl"</span> on a parent and the bar flips: brand on the
					right, items reading right-to-left, hamburger on the right, drawer anchoring to the right via
					<span class="component-name">side="start"</span> on the underlying Panel.
				</p>
				<div class="topnav-frame" dir="rtl">
					<TopNav brand="مرحبا" items={simpleItems}>
						<Button appearance="accent" onclick={onSignIn}>تسجيل الدخول</Button>
					</TopNav>
				</div>
			</div>
		</Stack>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>TopNav Properties</h2>
				<QuickGrid items={topNavProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>TopNav Callbacks</h2>
				<QuickGrid items={topNavCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>TopNav Slots</h2>
				<QuickGrid items={topNavSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.component-name {
		font-family: monospace;
	}

	.example-item {
		width: 100%;
	}

	.example-description {
		margin: 0 0 0.75rem 0;
		color: var(--neutral-foreground-hint-rest, #616161);
		font-size: 0.9rem;
	}

	.topnav-frame {
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: var(--fluent-border-radius-md, 4px);
		overflow: hidden;
	}
</style>
