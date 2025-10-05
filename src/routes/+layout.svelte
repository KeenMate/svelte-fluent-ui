<script lang="ts">
	import "../assets/styles/demo-pages.scss"
	import "$lib/main.scss"
	import {Layout, Footer, TopNav, Button} from "$lib/index.js"
	import {theme} from "$lib/stores/theme.js"
	import {onMount, tick} from "svelte"
	import {baseLayerLuminance, StandardLuminance} from "@fluentui/web-components"

	let {children} = $props()

	// Set data-theme attribute immediately for CSS
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("theme")
		const initialTheme = stored === "light" || stored === "dark" ? stored : "light"
		document.documentElement.setAttribute("data-theme", initialTheme)
	}

	// Set FluentUI luminance after components mount
	onMount(async () => {
		const currentTheme = $theme
		await tick()
		baseLayerLuminance.setValueFor(
			document.body,
			currentTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
		)
	})

	function toggleTheme() {
		theme.toggle()
	}

	const navItems = [
		{label: "Home", href: "/", icon: "🏠"},
		{label: "Components", href: "/components", icon: "📦"},
		{label: "Forms", href: "/components/forms", icon: "📝"},
		{label: "Layout", href: "/components/navigation-layout", icon: "📐"}
	]

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

<Layout orientation="vertical" style="min-height: 100vh;">
	<TopNav brand="Svelte FluentUI" brandHref="/" items={navItems} navigationGroups={navigation}>
		<Button appearance="stealth" onClick={toggleTheme}>
			{$theme === "light" ? "🌙" : "☀️"}
		</Button>
	</TopNav>

	<div class="main-content">
		{@render children()}
	</div>

	<Footer class="footer">
		© 2025 Svelte FluentUI - Built with Fluent UI Web Components
	</Footer>
</Layout>

<style>
	.nav-icon {
		font-size: 16px;
	}

	.main-content {
		flex: 1;
	}
</style>
