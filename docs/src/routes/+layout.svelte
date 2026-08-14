<script lang="ts">
	import "../assets/styles/demo-pages.scss"
	import "svelte-fluentui/styles.scss"
	import {Layout, Footer, BodyContent, Button, NavMenu, NavGroup, NavLinkItem, ToastContainer, Icon, TopNav, CommandPalette, CommandPaletteTrigger} from "svelte-fluentui"
	import type {CommandPaletteItem} from "svelte-fluentui"
	import SiteSettings from "../lib/components/SiteSettings.svelte"
	import {settings, accentColors} from "svelte-fluentui"
	import {onMount, tick} from "svelte"
	import {baseLayerLuminance, StandardLuminance, accentBaseColor, neutralBaseColor, SwatchRGB} from "@fluentui/web-components"
	import {page} from "$app/stores"

	let {children} = $props()

	// Pin the TopNav drawer as a permanent left rail above this width; below it
	// the drawer becomes a hamburger-triggered overlay. Single source of truth
	// instead of rendering both a sidebar and a drawer at once.
	const PIN_BREAKPOINT = 1024
	let isWide = $state(false)

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

	// Track viewport width so we can flip TopNav between pinned and overlay
	// drawer. SSR is `false` so initial render assumes narrow; corrected on mount.
	onMount(() => {
		const mq = window.matchMedia(`(min-width: ${PIN_BREAKPOINT}px)`)
		isWide = mq.matches
		const update = (e: MediaQueryListEvent) => { isWide = e.matches }
		mq.addEventListener("change", update)
		return () => mq.removeEventListener("change", update)
	})

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
				document.documentElement.classList.add("fluent-theme-switching")
				document.documentElement.setAttribute("data-theme", systemTheme)
				baseLayerLuminance.setValueFor(
					document.documentElement,
					systemTheme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
				)
				endThemeTransitionSuppression()
			}
		}

		mediaQuery.addEventListener("change", handleSystemThemeChange)

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange)
		}
	})

	// Disable transitions for the couple of frames a theme swap takes, so
	// interactive-feedback transitions on custom controls (Combobox, Autocomplete,
	// Select, InputFile, CommandPaletteTrigger, …) and the Fluent switch track don't
	// animate their colours from the old palette to the new one (see the
	// `.fluent-theme-switching` rule in the library's theme.scss).
	function endThemeTransitionSuppression() {
		const root = document.documentElement
		void root.offsetHeight
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				root.classList.remove("fluent-theme-switching")
			})
		})
	}

	// Function to apply theme settings (called explicitly when settings change)
	function applyThemeSettings() {
		if (typeof window === "undefined") return

		const siteSettings = $settings
		let effectiveTheme = siteSettings.themeMode

		// Handle system theme
		if (effectiveTheme === "system") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		document.documentElement.classList.add("fluent-theme-switching")

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
			} finally {
				endThemeTransitionSuppression()
			}
		})

		// NOTE: We don't update the old theme store here because it has its own
		// baseLayerLuminance.setValueFor() call which causes circular dependencies
	}

	// Apply the FluentUI design tokens (luminance / accent / neutral) live whenever
	// any site setting changes — not only when the settings dialog closes. The
	// library store's applySettings() sets `data-theme` and a few raw CSS vars, but
	// the docs' dark/light rendering is driven by FluentUI's baseLayerLuminance,
	// which lives in applyThemeSettings(). Without this effect, picking "Dark" in
	// the dialog only flipped `data-theme` and appeared to do nothing until close.
	$effect(() => {
		void $settings // track: re-run on any settings change
		applyThemeSettings()
	})

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
				{label: "Working with Icons", href: "/guides/icons"},
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
				{label: "CommandPalette", href: "/components/command-palette"},
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
	const paletteItems: CommandPaletteItem[] = navigation
		.flatMap((navItem) =>
			navItem.href
				? [{title: navItem.title, href: navItem.href, icon: navItem.icon}]
				: (navItem.items ?? []).map((it) => ({
					title: it.label,
					href: it.href,
					group: navItem.title,
					icon: navItem.icon,
					target: (it as any).target,
					rel: (it as any).rel
				}))
		)
		.sort((a, b) => a.title.localeCompare(b.title))

	let paletteOpen = $state(false)

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

<Layout orientation="vertical" class="docs-layout" style="min-height: 100vh;">
	<!-- Top Navigation Bar -->
	<TopNav class="docs-topnav" collapse="always" drawerPinned={isWide}>
		{#snippet brandTemplate()}
			<div class="docs-topnav-brand-group">
				<a href="/" class="topnav-brand">Svelte FluentUI</a>
				<span class="docs-topnav-version">v{__SVELTE_FLUENTUI_VERSION__}</span>
			</div>
		{/snippet}

		{#snippet drawerContent(closeDrawer: () => void)}
			{@render sidebarNav(closeDrawer)}
		{/snippet}

		<CommandPaletteTrigger placeholder="Search…" onclick={() => (paletteOpen = true)} />
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
	<CommandPalette bind:open={paletteOpen} items={paletteItems} placeholder="Search pages and components…" />

	<!-- Toast Container for programmatic toasts -->
	<ToastContainer />

	<!-- Main Content — sidebar nav is the TopNav drawer (pinned on desktop,
	     hamburger overlay on narrow widths). No duplicate sidebar. -->
	<BodyContent>
		<div class="content">
			{@render children()}
		</div>
	</BodyContent>

	<!-- Footer -->
	<Footer>
		{#snippet start()}
			<span>© 2025–2026 KeenMate</span>
			<span class="docs-footer-sep" aria-hidden="true">·</span>
			<a
				href="https://github.com/KeenMate/svelte-fluentui/blob/master/LICENSE"
				target="_blank"
				rel="noopener noreferrer"
			>MIT</a>
		{/snippet}
		{#snippet center()}
			Built with FluentUI Web Components
		{/snippet}
		{#snippet end()}
			<a href="https://github.com/KeenMate/svelte-fluentui" target="_blank" rel="noopener noreferrer">GitHub</a>
			<span class="docs-footer-sep" aria-hidden="true">·</span>
			<a href="https://www.npmjs.com/package/svelte-fluentui" target="_blank" rel="noopener noreferrer">npm</a>
			<span class="docs-footer-sep" aria-hidden="true">·</span>
			<span class="docs-footer-version">v{__SVELTE_FLUENTUI_VERSION__}</span>
		{/snippet}
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

	/* Footer sections — inline gap between items in each snippet, plus a
	   muted separator colour and a version chip that matches the topnav one. */
	:global(.fluent-footer__start),
	:global(.fluent-footer__center),
	:global(.fluent-footer__end) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	:global(.fluent-footer__center) {
		color: var(--neutral-foreground-hint, #666);
	}

	:global(.fluent-footer a) {
		color: inherit;
		text-decoration: none;
	}

	:global(.fluent-footer a:hover) {
		text-decoration: underline;
	}

	.docs-footer-sep {
		color: var(--neutral-foreground-hint, #999);
		user-select: none;
	}

	.docs-footer-version {
		font-size: 0.8rem;
		color: var(--neutral-foreground-hint, #666);
		background: var(--neutral-layer-3, #f0f0f0);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-weight: 500;
	}

	/* Docs layout uses CSS Grid so TopNav spans the top, the pinned drawer
	   sits as the left rail (when wide), content fills the remainder, and
	   Footer spans the bottom. At narrow widths the drawer isn't pinned
	   (overlay instead), so the second column collapses to a single track. */
	:global(.layout.docs-layout) {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			"top"
			"body"
			"footer";
	}

	:global(.docs-layout > .topnav) {
		grid-area: top;
	}

	:global(.docs-layout > .body-content) {
		grid-area: body;
		min-width: 0;
	}

	:global(.docs-layout > .fluent-footer) {
		grid-area: footer;
	}

	@media (min-width: 1024px) {
		:global(.layout.docs-layout) {
			grid-template-columns: auto minmax(0, 1fr);
			grid-template-areas:
				"top    top"
				"drawer body"
				"footer footer";
		}

		/* Pinned drawer = the desktop rail. Sticky so it stays visible while
		   the content column scrolls. Height clears the 60px sticky topnav.
		   No padding on the aside itself — the scrollable inner body owns
		   the lane, which keeps the scrollbar flush against the rail's edge
		   instead of floating inside a padding gap. */
		:global(.docs-layout > .fluent-panel--pinned) {
			grid-area: drawer;
			position: sticky;
			top: 60px;
			height: calc(100vh - 60px);
			background: var(--neutral-layer-2, #faf9f8);
			padding: 0;
		}

		:global(.docs-layout > .fluent-panel--pinned .topnav-drawer-body) {
			padding: var(--fluent-sidebar-padding) 0 var(--fluent-sidebar-padding) var(--fluent-sidebar-padding);
		}

		:global(.docs-layout > .fluent-panel--pinned .fluent-nav-menu) {
			padding: 0 !important;
		}

		:global(.docs-layout > .fluent-panel--pinned .fluent-icon) {
			margin-right: var(--fluent-sidebar-icon-gap);
		}

		:global(.docs-layout > .fluent-panel--pinned .fluent-nav-menu > .fluent-nav-item) {
			margin: 2px 0;
		}
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
		.content {
			padding: 1rem;
		}
	}
</style>
