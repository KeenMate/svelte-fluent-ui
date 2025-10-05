<script lang="ts">
	import {NavMenu, NavGroup, NavLinkItem, BodyContent, Grid, GridItem} from "$lib/index.js"

	let {children} = $props()

	const navigation = [
		{
			title: "Home",
			icon: "🏠",
			items: [
				{label: "List of Components", href: "/"}
			]
		},
		{
			title: "Documentation",
			icon: "📚",
			items: [
				{label: "Getting Started", href: "#getting-started"},
				{label: "Installation", href: "#installation"},
				{label: "Usage", href: "#usage"}
			]
		},
		{
			title: "Resources",
			icon: "🔗",
			items: [
				{label: "GitHub", href: "https://github.com/KeenMate/svelte-fluentui"},
				{label: "FluentUI Docs", href: "https://docs.microsoft.com/en-us/fluent-ui/web-components/"}
			]
		},
		{
			title: "Forms & Inputs",
			icon: "📝",
			items: [
				{label: "TextField", href: "/components/forms/text-field"},
				{label: "TextArea", href: "/components/forms/text-area"},
				{label: "NumberField", href: "/components/forms/number-field"},
				{label: "Checkbox", href: "/components/checkbox"},
				{label: "Radio", href: "/components/forms/radio"},
				{label: "Switch", href: "/components/forms/switch"},
				{label: "Select", href: "/components/forms/select"},
				{label: "Combobox", href: "/components/forms/combobox"},
				{label: "Listbox", href: "/components/listbox"},
				{label: "Search", href: "/components/forms/search"},
				{label: "Calendar", href: "/components/forms/calendar"}
			]
		},
		{
			title: "Buttons & Actions",
			icon: "🔘",
			items: [
				{label: "Button", href: "/components/button"},
				{label: "Anchor", href: "/components/anchor"}
			]
		},
		{
			title: "Layout",
			icon: "📐",
			items: [
				{label: "Layout", href: "/components/navigation-layout/layout"},
				{label: "Grid", href: "/components/navigation-layout/grid"},
				{label: "Stack", href: "/components/navigation-layout/stack"},
				{label: "Spacer", href: "/components/navigation-layout/spacer"},
				{label: "MultiSplitter", href: "/components/navigation-layout/multisplitter"},
				{label: "BodyContent", href: "/components/navigation-layout/body-content"}
			]
		},
		{
			title: "Navigation",
			icon: "🧭",
			items: [
				{label: "NavMenu", href: "/components/navigation-layout/navigation"},
				{label: "AppBar", href: "/components/navigation-layout/appbar"},
				{label: "Breadcrumbs", href: "/components/breadcrumbs"},
				{label: "Tabs", href: "/components/tabs"},
				{label: "Accordion", href: "/components/navigation-layout/accordion"}
			]
		},
		{
			title: "Display",
			icon: "🎨",
			items: [
				{label: "Card", href: "/components/card"},
				{label: "Badge", href: "/components/badge"}
			]
		},
		{
			title: "Feedback",
			icon: "💬",
			items: [
				{label: "Dialog", href: "/components/dialog"},
				{label: "Toast", href: "/components/toast"},
				{label: "Tooltip", href: "/components/tooltip"}
			]
		},
		{
			title: "Data Display",
			icon: "📊",
			items: [
				{label: "DataGrid", href: "/components/datagrid"},
				{label: "QuickGrid", href: "/components/quickgrid"},
				{label: "Paginator", href: "/components/paginator"},
				{label: "Toolbar", href: "/components/toolbar"}
			]
		}
	]
</script>

<BodyContent>
	<Grid spacing={0}>
		<!-- Sidebar -->
		<GridItem xs={12} md={3} lg={2}>
			<div class="sidebar">
				<NavMenu>
					{#each navigation as group}
						<NavGroup>
							{#snippet linkIcon()}
								<span class="nav-icon">{group.icon}</span>
							{/snippet}
							{#snippet linkText()}
								{group.title}
							{/snippet}

							{#each group.items as item}
								<NavLinkItem href={item.href}>{item.label}</NavLinkItem>
							{/each}
						</NavGroup>
					{/each}
				</NavMenu>
			</div>
		</GridItem>

		<!-- Main content -->
		<GridItem xs={12} md={9} lg={10}>
			<div class="content">
				{@render children()}
			</div>
		</GridItem>
	</Grid>
</BodyContent>

<style>
	.sidebar {
		border-right: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-2, #faf9f8);
		min-height: 100vh;
		position: sticky;
		top: 0;
	}

	.content {
		padding: 2rem;
	}

	.nav-icon {
		font-size: 16px;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
