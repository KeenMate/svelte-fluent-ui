<script lang="ts">
	import "../assets/styles/demo-pages.scss"
	import "svelte-fluentui/styles.scss"
	import {Layout, Footer, BodyContent, Grid, GridItem, Button, NavMenu, NavGroup, NavLinkItem, ToastContainer} from "svelte-fluentui"
	import SiteSettings from "../lib/components/SiteSettings.svelte"
	import {settings, accentColors} from "svelte-fluentui"
	import {onMount, tick} from "svelte"
	import {baseLayerLuminance, StandardLuminance, accentBaseColor, neutralBaseColor, SwatchRGB} from "@fluentui/web-components"
	import {page} from "$app/stores"

	let {children} = $props()

	// Check if a link is active based on current route
	function isActive(href: string): boolean {
		if (!href) return false
		// Exact match for home page
		if (href === "/" && $page.url.pathname === "/") return true
		// For other pages, check if current path starts with href (but not for home)
		if (href !== "/" && $page.url.pathname.startsWith(href)) return true
		return false
	}

	let settingsOpen = $state(false)

	// Convert hex color to SwatchRGB for FluentUI
	function hexToSwatchRGB(hex: string): SwatchRGB {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		if (!result) {
			throw new Error(`Invalid hex color: ${hex}`)
		}
		return SwatchRGB.create(
			parseInt(result[1], 16) / 255,
			parseInt(result[2], 16) / 255,
			parseInt(result[3], 16) / 255
		)
	}

	// Set data-theme attribute and colors immediately for CSS (before render to avoid FOUC)
	if (typeof window !== "undefined") {
		const siteSettings = $settings
		let effectiveTheme = siteSettings.themeMode

		// Handle system theme
		if (effectiveTheme === "system") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		document.documentElement.setAttribute("data-theme", effectiveTheme)
		document.documentElement.setAttribute("dir", siteSettings.direction)

		// Apply colors immediately to avoid FOUC
		try {
			// Apply luminance to document element (html tag)
			baseLayerLuminance.setValueFor(
				document.documentElement,
				effectiveTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
			)

			// Apply accent color
			const accentColorHex = accentColors[siteSettings.accentColor as keyof typeof accentColors]
			if (accentColorHex) {
				const accentSwatch = hexToSwatchRGB(accentColorHex)
				accentBaseColor.setValueFor(document.documentElement, accentSwatch)
			}

			// Apply neutral base color
			const neutralSwatch = hexToSwatchRGB(siteSettings.neutralColor)
			neutralBaseColor.setValueFor(document.documentElement, neutralSwatch)
		} catch (e) {
			console.warn("Failed to apply initial theme colors:", e)
		}
	}

	// Set FluentUI luminance and apply settings after components mount
	onMount(async () => {
		const siteSettings = $settings
		let effectiveTheme = siteSettings.themeMode

		// Handle system theme
		if (effectiveTheme === "system") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		await tick()

		// Apply theme
		document.documentElement.setAttribute("data-theme", effectiveTheme)
		baseLayerLuminance.setValueFor(
			document.documentElement,
			effectiveTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
		)

		// Apply direction
		document.documentElement.setAttribute("dir", siteSettings.direction)

		// Watch for system theme changes if mode is "system"
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleSystemThemeChange = () => {
			const currentSettings = $settings
			if (currentSettings.themeMode === "system") {
				const systemTheme = mediaQuery.matches ? "dark" : "light"
				document.documentElement.setAttribute("data-theme", systemTheme)
				baseLayerLuminance.setValueFor(
					document.documentElement,
					systemTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
				)
			}
		}

		mediaQuery.addEventListener("change", handleSystemThemeChange)

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange)
		}
	})

	// Function to apply theme settings (called explicitly when settings change)
	function applyThemeSettings() {
		if (typeof window === "undefined") return

		const siteSettings = $settings
		let effectiveTheme = siteSettings.themeMode

		// Handle system theme
		if (effectiveTheme === "system") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		// Apply theme attribute
		document.documentElement.setAttribute("data-theme", effectiveTheme)

		// Apply direction
		document.documentElement.setAttribute("dir", siteSettings.direction)

		// Apply FluentUI design tokens in next microtask to avoid circular dependencies
		queueMicrotask(() => {
			try {
				// Apply luminance first
				baseLayerLuminance.setValueFor(
					document.documentElement,
					effectiveTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
				)

				// Apply accent color
				const accentColorHex = accentColors[siteSettings.accentColor as keyof typeof accentColors]
				if (accentColorHex) {
					const accentSwatch = hexToSwatchRGB(accentColorHex)
					accentBaseColor.setValueFor(document.documentElement, accentSwatch)
				}

				// Apply neutral base color last (it generates the most derived tokens)
				const neutralSwatch = hexToSwatchRGB(siteSettings.neutralColor)
				neutralBaseColor.setValueFor(document.documentElement, neutralSwatch)
			} catch (e) {
				console.error("Error applying FluentUI design tokens:", e)
			}
		})

		// NOTE: We don't update the old theme store here because it has its own
		// baseLayerLuminance.setValueFor() call which causes circular dependencies
	}

	// Derive the effective theme for UI display
	let effectiveTheme = $derived.by(() => {
		const siteSettings = $settings
		let theme = siteSettings.themeMode

		// Handle system theme
		if (theme === "system" && typeof window !== "undefined") {
			theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		return theme as "light" | "dark"
	})

	function toggleTheme() {
		const currentSettings = $settings
		let currentTheme = currentSettings.themeMode

		// Handle system theme
		if (currentTheme === "system") {
			currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		// Toggle between light and dark
		settings.setThemeMode(currentTheme === "light" ? "dark" : "light")

		// Apply the theme immediately
		applyThemeSettings()
	}

	function openSettings() {
		settingsOpen = true
	}

	function closeSettings() {
		settingsOpen = false
		// Apply theme settings when dialog closes
		applyThemeSettings()
	}

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
				{label: "Getting Started", href: "/getting-started"},
				{label: "Layout Example", href: "/layout-example"}
			]
		},
		{
			title: "Theme",
			icon: "🎨",
			items: [
				{label: "CSS Variables", href: "/theme/variables"}
			]
		},
		{
			title: "Resources",
			icon: "🔗",
			items: [
				{label: "GitHub", href: "https://github.com/KeenMate/svelte-fluentui", target: "_blank", rel: "noopener noreferrer"},
				{label: "FluentUI Docs", href: "https://docs.microsoft.com/en-us/fluent-ui/web-components/", target: "_blank", rel: "noopener noreferrer"}
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
				{label: "Autocomplete", href: "/components/autocomplete"},
				{label: "Listbox", href: "/components/listbox"},
				{label: "Search", href: "/components/forms/search"},
				{label: "Calendar", href: "/components/forms/calendar"},
				{label: "DatePicker", href: "/components/datepicker"},
				{label: "TimePicker", href: "/components/timepicker"},
				{label: "InputFile", href: "/components/inputfile"}
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
			icon: "🖼️",
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
				{label: "Toast Service", href: "/components/toast-service"},
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
	<!-- Top Navigation Bar -->
	<div class="topnav">
		<a href="/" class="topnav-brand">Svelte FluentUI</a>
		<div class="topnav-actions">
			<Button appearance="stealth" onClick={toggleTheme}>
				{effectiveTheme === "light" ? "🌙" : "☀️"}
			</Button>
			<Button appearance="stealth" onClick={openSettings}>
				⚙️
			</Button>
		</div>
	</div>

	<!-- Site Settings Dialog -->
	<SiteSettings open={settingsOpen} onClose={closeSettings} />

	<!-- Toast Container for programmatic toasts -->
	<ToastContainer />

	<!-- Main Content Area with Sidebar -->
	<BodyContent>
		<Grid spacing={0}>
			<!-- Sidebar -->
			<GridItem xs={12} md={3} lg={2}>
				<div class="sidebar">
					<NavMenu>
						{#each navigation as group}
							<NavGroup title={group.title}>
								{#snippet linkIcon()}
									<span class="nav-icon">{group.icon}</span>
								{/snippet}
								{#snippet linkText()}
									{group.title}
								{/snippet}

								{#each group.items as item}
									<NavLinkItem
										href={item.href}
										target={item.target}
										rel={item.rel}
										class={isActive(item.href) ? "active" : ""}
									>
										{item.label}
									</NavLinkItem>
								{/each}
							</NavGroup>
						{/each}
					</NavMenu>
				</div>
			</GridItem>

			<!-- Main Content -->
			<GridItem xs={12} md={9} lg={10}>
				<div class="content">
					{@render children()}
				</div>
			</GridItem>
		</Grid>
	</BodyContent>

	<!-- Footer -->
	<Footer class="footer">
		© 2025 Svelte FluentUI - Built with Fluent UI Web Components
	</Footer>
</Layout>

<style>
	.topnav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		padding: 0 1.5rem;
		height: 60px;
	}

	.topnav-brand {
		text-decoration: none;
		color: inherit;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.topnav-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sidebar {
		border-right: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-2, #faf9f8);
		min-height: calc(100vh - 60px);
		position: sticky;
		top: 0;
		padding: var(--fluent-sidebar-padding);
	}

	.sidebar :global(.fluent-nav-menu) {
		padding: 0 !important;
	}

	.sidebar :global(.nav-icon) {
		margin-right: var(--fluent-sidebar-icon-gap);
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
