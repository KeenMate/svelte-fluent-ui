<script lang="ts">
	import "../assets/styles/demo-pages.scss"
	import "svelte-fluentui/styles.scss"
	import {Layout, Footer, BodyContent, Grid, GridItem, Button, NavMenu, NavGroup, NavLinkItem, ToastContainer, Icon, TopNav} from "svelte-fluentui"
	import SiteSettings from "../lib/components/SiteSettings.svelte"
	import CommandPalette from "../lib/components/CommandPalette.svelte"

	type CommandItem = {
		label: string
		href: string
		group?: string
		target?: string
		rel?: string
	}
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
			title: "Changelog",
			icon: "history",
			href: "/"
		},
		{
			title: "List of Components",
			icon: "library",
			href: "/components-list"
		},
		{
			title: "Documentation",
			icon: "book",
			items: [
				{label: "Getting Started", href: "/getting-started"},
				{label: "Layout Example", href: "/layout-example"}
			]
		},
		{
			title: "Theme",
			icon: "color",
			items: [
				{label: "CSS Variables", href: "/theme/variables"}
			]
		},
		{
			title: "Resources",
			icon: "link",
			items: [
				{label: "GitHub", href: "https://github.com/KeenMate/svelte-fluentui", target: "_blank", rel: "noopener noreferrer"},
				{label: "FluentUI Docs", href: "https://docs.microsoft.com/en-us/fluent-ui/web-components/", target: "_blank", rel: "noopener noreferrer"}
			]
		},
		{
			title: "Applications",
			icon: "apps",
			items: [
				{label: "Overview", href: "/applications"},
				{label: "Filter Card", href: "/applications/filter-card"},
				{label: "Form Validation", href: "/applications/form-validation"},
				{label: "Order Form", href: "/applications/order-form"}
			]
		},
		{
			title: "Forms & Inputs",
			icon: "textbox",
			items: [
				{label: "Autocomplete", href: "/components/autocomplete"},
				{label: "Calendar", href: "/components/forms/calendar"},
				{label: "Checkbox", href: "/components/checkbox"},
				{label: "Combobox", href: "/components/forms/combobox"},
				{label: "DatePicker", href: "/components/datepicker"},
				{label: "Field & ValidationSummary", href: "/components/forms/field"},
				{label: "InputFile", href: "/components/inputfile"},
				{label: "Listbox", href: "/components/listbox"},
				{label: "NumberField", href: "/components/forms/number-field"},
				{label: "Radio", href: "/components/forms/radio"},
				{label: "RadioGroup", href: "/components/forms/radiogroup"},
				{label: "Search", href: "/components/forms/search"},
				{label: "Select", href: "/components/forms/select"},
				{label: "Switch", href: "/components/forms/switch"},
				{label: "TextArea", href: "/components/forms/text-area"},
				{label: "TextField", href: "/components/forms/text-field"},
				{label: "TimePicker", href: "/components/timepicker"}
			]
		},
		{
			title: "Buttons & Actions",
			icon: "cursor_hover",
			items: [
				{label: "Anchor", href: "/components/anchor"},
				{label: "Button", href: "/components/button"},
				{label: "ContextMenu", href: "/components/context-menu"},
				{label: "MenuButton", href: "/components/menu-button"}
			]
		},
		{
			title: "Layout",
			icon: "panel_left",
			items: [
				{label: "BodyContent", href: "/components/navigation-layout/body-content"},
				{label: "Footer", href: "/components/navigation-layout/footer"},
				{label: "Grid", href: "/components/navigation-layout/grid"},
				{label: "Layout", href: "/components/navigation-layout/layout"},
				{label: "MultiSplitter", href: "/components/navigation-layout/multisplitter"},
				{label: "Panel", href: "/components/navigation-layout/panel"},
				{label: "Spacer", href: "/components/navigation-layout/spacer"},
				{label: "Stack", href: "/components/navigation-layout/stack"}
			]
		},
		{
			title: "Navigation",
			icon: "navigation",
			items: [
				{label: "Accordion", href: "/components/navigation-layout/accordion"},
				{label: "AppBar", href: "/components/navigation-layout/appbar"},
				{label: "Breadcrumbs", href: "/components/breadcrumbs"},
				{label: "NavMenu", href: "/components/navigation-layout/navigation"},
				{label: "Tabs", href: "/components/tabs"},
				{label: "TopNav", href: "/components/navigation-layout/topnav"}
			]
		},
		{
			title: "Display",
			icon: "image",
			items: [
				{label: "Badge", href: "/components/badge"},
				{label: "Card", href: "/components/card"},
				{label: "Divider", href: "/components/divider"},
				{label: "Icon", href: "/components/icon"}
			]
		},
		{
			title: "Feedback",
			icon: "chat",
			items: [
				{label: "Alert", href: "/components/alert"},
				{label: "Dialog", href: "/components/dialog"},
				{label: "Toast", href: "/components/toast"},
				{label: "Toast Service", href: "/components/toast-service"},
				{label: "Tooltip", href: "/components/tooltip"}
			]
		},
		{
			title: "Data Display",
			icon: "table",
			items: [
				{label: "DataGrid", href: "/components/datagrid"},
				{label: "Paginator", href: "/components/paginator"},
				{label: "QuickGrid", href: "/components/quickgrid"},
				{label: "QuickGrid Editable", href: "/components/quickgrid-editable"},
				{label: "QuickGrid Context Menu", href: "/components/quickgrid-contextmenu"},
				{label: "QuickGrid Tree", href: "/components/quickgrid-tree"},
				{label: "Toolbar", href: "/components/toolbar"}
			]
		}
	]

	// Flattened, alphabetised list of every navigable target — feeds the Ctrl+K command palette.
	const paletteItems: CommandItem[] = navigation
		.flatMap((navItem) =>
			navItem.href
				? [{label: navItem.title, href: navItem.href, group: ""}]
				: (navItem.items ?? []).map((it) => ({
					label: it.label,
					href: it.href,
					group: navItem.title,
					target: (it as any).target,
					rel: (it as any).rel
				}))
		)
		.sort((a, b) => a.label.localeCompare(b.label))

	const isMacUA = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform)
	const paletteShortcutLabel = isMacUA ? "⌘K" : "Ctrl K"

	function openPalette() {
		window.dispatchEvent(new CustomEvent("open-command-palette"))
	}

	// ---- Anchored headings + share button ----
	const headingLinkSvg = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M7.05 5.05a3.5 3.5 0 0 1 4.95 0l1 1a3.5 3.5 0 0 1-4.95 4.95l-.5-.5a.75.75 0 0 1 1.06-1.06l.5.5a2 2 0 0 0 2.83-2.83l-1-1a2 2 0 0 0-2.83 0l-.5.5a.75.75 0 1 1-1.06-1.06l.5-.5zM4.95 10.95a3.5 3.5 0 0 1 0-4.95l1-1a3.5 3.5 0 0 1 4.95 0 .75.75 0 1 1-1.06 1.06 2 2 0 0 0-2.83 0l-1 1a2 2 0 0 0 2.83 2.83l.5-.5a.75.75 0 1 1 1.06 1.06l-.5.5a3.5 3.5 0 0 1-4.95 0z"/></svg>`
	const headingCheckSvg = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L6.25 10.69l6.47-6.47a.75.75 0 0 1 1.06 0z"/></svg>`

	function slugifyHeading(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "")
	}

	async function decorateHeadings() {
		if (typeof window === "undefined") return
		await tick()
		const root = document.querySelector(".content")
		if (!root) return
		const used = new Set<string>()
		const headings = root.querySelectorAll<HTMLHeadingElement>("h1, h2, h3")
		headings.forEach((h) => {
			if (h.dataset.anchored === "true") {
				if (h.id) used.add(h.id)
				return
			}
			const rawText = (h.textContent ?? "").trim()
			if (!rawText) return
			const base = h.id || slugifyHeading(rawText)
			if (!base) return
			let slug = base
			let i = 2
			while (used.has(slug)) {
				slug = `${base}-${i++}`
			}
			used.add(slug)
			h.id = slug
			h.dataset.anchored = "true"
			h.classList.add("anchored-heading")

			const btn = document.createElement("button")
			btn.type = "button"
			btn.className = "heading-share-btn"
			btn.setAttribute("aria-label", "Copy link to this section")
			btn.title = "Copy link to this section"
			btn.innerHTML = headingLinkSvg
			btn.addEventListener("click", async (ev) => {
				ev.preventDefault()
				ev.stopPropagation()
				const url = `${window.location.origin}${window.location.pathname}#${slug}`
				try {
					await navigator.clipboard.writeText(url)
					history.replaceState(null, "", `#${slug}`)
					btn.classList.add("copied")
					btn.innerHTML = headingCheckSvg
					setTimeout(() => {
						btn.classList.remove("copied")
						btn.innerHTML = headingLinkSvg
					}, 1200)
				} catch {
					window.location.hash = slug
				}
			})
			h.appendChild(btn)
		})

		if (window.location.hash) {
			const id = decodeURIComponent(window.location.hash.slice(1))
			const target = document.getElementById(id)
			if (target) {
				target.scrollIntoView({behavior: "auto", block: "start"})
			}
		}
	}

	$effect(() => {
		// Re-decorate whenever the route changes
		void $page.url.pathname
		decorateHeadings()
	})

	// E2E test fixture routes get NO docs chrome — just the test layout below
	// renders. Tried `+layout@.svelte` at routes/test/ to break out of this
	// chain, but SvelteKit 2.48 doesn't honor the reset for our setup.
	let isTestRoute = $derived($page.url.pathname.startsWith("/test/"))
</script>

{#if isTestRoute}
	{@render children()}
{:else}
<!-- Shared sidebar nav — rendered both as the desktop sidebar and inside
     TopNav's mobile drawer. `closeDrawer` is a no-op on desktop, but closes
     the drawer when used in the mobile context so link clicks dismiss it. -->
{#snippet sidebarNav(closeDrawer: () => void)}
	<NavMenu>
		{#each navigation as navItem}
			{#if navItem.href}
				<!-- Top-level link -->
				<NavLinkItem
					href={navItem.href}
					class={isActive(navItem.href) ? "active" : ""}
					onClick={closeDrawer}
				>
					{#snippet icon()}
						<Icon name={navItem.icon} size={16} />
					{/snippet}
					{navItem.title}
				</NavLinkItem>
			{:else if navItem.items}
				<!-- Group with sub-items -->
				<NavGroup title={navItem.title}>
					{#snippet linkIcon()}
						<Icon name={navItem.icon} size={16} />
					{/snippet}
					{#snippet linkText()}
						{navItem.title}
					{/snippet}

					{#each navItem.items as item}
						<NavLinkItem
							href={item.href}
							target={item.target}
							rel={item.rel}
							class={isActive(item.href) ? "active" : ""}
							onClick={closeDrawer}
						>
							{item.label}
						</NavLinkItem>
					{/each}
				</NavGroup>
			{/if}
		{/each}
	</NavMenu>
{/snippet}

<Layout orientation="vertical" style="min-height: 100vh;">
	<!-- Top Navigation Bar -->
	<TopNav class="docs-topnav" collapse="always">
		{#snippet brandTemplate()}
			<div class="docs-topnav-brand-group">
				<a href="/" class="topnav-brand">Svelte FluentUI</a>
				<span class="docs-topnav-version">v{__SVELTE_FLUENTUI_VERSION__}</span>
			</div>
		{/snippet}

		{#snippet drawerContent(closeDrawer: () => void)}
			{@render sidebarNav(closeDrawer)}
		{/snippet}

		<button class="docs-topnav-search" onclick={openPalette} aria-label="Search pages">
			<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M7 1.75a5.25 5.25 0 1 0 3.215 9.4l3.067 3.068a.75.75 0 1 0 1.061-1.061l-3.066-3.066A5.25 5.25 0 0 0 7 1.75zM3.25 7a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z" fill="currentColor"/>
			</svg>
			<span class="docs-topnav-search-label">Search…</span>
			<span class="docs-topnav-search-kbd">{paletteShortcutLabel}</span>
		</button>
		<Button appearance="stealth" onclick={toggleTheme}>
			{#if effectiveTheme === "light"}
				<Icon name="weather_moon" size={20} />
			{:else}
				<Icon name="weather_sunny" size={20} />
			{/if}
		</Button>
		<Button appearance="stealth" onclick={openSettings}>
			<Icon name="settings" size={20} />
		</Button>
	</TopNav>

	<!-- Site Settings Dialog -->
	<SiteSettings open={settingsOpen} onClose={closeSettings} />

	<!-- Ctrl/Cmd + K command palette -->
	<CommandPalette items={paletteItems} />

	<!-- Toast Container for programmatic toasts -->
	<ToastContainer />

	<!-- Main Content Area with Sidebar -->
	<BodyContent>
		<Grid spacing={0}>
			<!-- Sidebar (desktop only; mobile uses the TopNav drawer) -->
			<GridItem xs={12} md={3} lg={2} class="sidebar-grid-item">
				<div class="sidebar">
					{@render sidebarNav(() => {})}
				</div>
			</GridItem>

			<!-- Main Content -->
			<GridItem xs={12} md={9} lg={10} class="content-grid-item">
				<div class="content">
					{@render children()}
				</div>
			</GridItem>
		</Grid>
	</BodyContent>

	<!-- Footer -->
	<Footer>
		© 2025 Svelte FluentUI - Built with Fluent UI Web Components
	</Footer>
</Layout>
{/if}

<style>
	:global(.docs-topnav) {
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.docs-topnav-brand-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.docs-topnav-brand-group .topnav-brand {
		text-decoration: none;
		color: inherit;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.docs-topnav-version {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint, #666);
		background: var(--neutral-layer-3, #f0f0f0);
		padding: 0.25rem 0.625rem;
		border-radius: 4px;
		font-weight: 500;
	}

	.docs-topnav-search {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.625rem;
		background: var(--neutral-layer-2, #f5f5f5);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 6px;
		color: var(--neutral-foreground-hint, #888);
		cursor: pointer;
		font-family: inherit;
		font-size: 0.875rem;
		min-width: 200px;
		transition: background 120ms ease, border-color 120ms ease;
	}

	.docs-topnav-search:hover {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
		border-color: var(--neutral-stroke-rest, #c8c8c8);
	}

	.docs-topnav-search-label {
		flex: 1;
		text-align: left;
	}

	.docs-topnav-search-kbd {
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--neutral-stroke-layer-rest, #d0d0d0);
		border-radius: 3px;
		background: var(--neutral-layer-1, #ffffff);
		font-size: 0.7rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.docs-topnav-search-label,
		.docs-topnav-search-kbd {
			display: none;
		}
		.docs-topnav-search {
			min-width: auto;
			padding: 0.5rem;
		}
	}

	.sidebar {
		border-right: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-2, #faf9f8);
		min-height: calc(100vh - 60px);
		position: sticky;
		top: 0;
		padding: var(--fluent-sidebar-padding);
	}

	/* TopNav uses collapse="always" so the hamburger is forced visible at
	   every width. Hide it above lg (1280px) where the desktop sidebar
	   takes over, so we never show two redundant nav surfaces at once. */
	@media (min-width: 1280px) {
		:global(.docs-topnav .mobile-menu-toggle) {
			display: none;
		}
	}

	/* Below lg (1280px) the desktop sidebar disappears and the hamburger
	   drawer is the sole navigation. Stretch the content GridItem to full
	   width (Grid keeps it at md=9 between 960-1280px, leaving an empty
	   25% gutter otherwise). */
	@media (max-width: 1279.98px) {
		:global(.sidebar-grid-item) {
			display: none;
		}
		:global(.content-grid-item) {
			flex-basis: 100% !important;
			max-width: 100% !important;
		}
	}

	.sidebar :global(.fluent-nav-menu) {
		padding: 0 !important;
	}

	.sidebar :global(.fluent-icon) {
		margin-right: var(--fluent-sidebar-icon-gap);
	}

	/* Reduce spacing for top-level nav items (direct children of nav-menu) */
	.sidebar :global(.fluent-nav-menu > .fluent-nav-item) {
		margin: 2px 0;
	}

	.content {
		padding: 2rem;
	}

	.content :global(.anchored-heading) {
		scroll-margin-top: 72px;
	}

	.content :global(.heading-share-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: 0.5rem;
		padding: 0.25rem;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: var(--neutral-foreground-hint, #888);
		cursor: pointer;
		opacity: 0;
		transition: opacity 120ms ease, background 120ms ease, color 120ms ease;
		vertical-align: middle;
		line-height: 0;
	}

	.content :global(.anchored-heading:hover .heading-share-btn),
	.content :global(.heading-share-btn:focus-visible) {
		opacity: 1;
	}

	.content :global(.heading-share-btn:hover) {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
		color: var(--accent-fill-rest, #0078d4);
	}

	.content :global(.heading-share-btn.copied) {
		opacity: 1;
		color: var(--accent-fill-rest, #0078d4);
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
