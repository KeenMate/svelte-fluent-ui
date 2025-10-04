<script lang="ts">
	import "../assets/styles/demo-pages.scss"
	import "$lib/main.scss"
	import {Layout, Header, Footer, Grid, GridItem} from "$lib/index.js"
	import {theme} from "$lib/stores/theme.js"
	import {onMount, tick} from "svelte"
	import {Button} from "$lib/index.js"
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
</script>

<Layout orientation="vertical" style="min-height: 100vh;">
	<Header height={60}>
		<div class="header-container">
			<a href="/" class="header-title">
				Svelte FluentUI
			</a>
			<nav class="header-nav">
				<a href="/components" class="nav-link">Components</a>
				<a href="/components/forms" class="nav-link">Forms</a>
				<a href="/components/navigation-layout" class="nav-link">
					Layout
				</a>
				<Button appearance="stealth" onClick={toggleTheme}>
					{$theme === "light" ? "🌙" : "☀️"}
				</Button>
			</nav>
		</div>
	</Header>

	<div class="main-content">
		{@render children()}
	</div>

	<Footer class="footer">
		© 2025 Svelte FluentUI - Built with Fluent UI Web Components
	</Footer>
</Layout>

<style>
	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.header-title {
		text-decoration: none;
		color: inherit;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.header-nav {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-link {
		text-decoration: none;
		color: inherit;
	}

	.main-content {
		flex: 1;
		overflow: auto;
		padding: 2rem;
	}

	.footer {
		padding: 1rem;
		text-align: center;
		font-size: 0.875rem;
	}
</style>
