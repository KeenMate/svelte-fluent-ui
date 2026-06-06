<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import Button from "../Button.svelte"
	import Panel from "./Panel.svelte"
	import NavMenu from "../nav/NavMenu.svelte"
	import NavGroup from "../nav/NavGroup.svelte"
	import NavLinkItem from "../nav/NavLinkItem.svelte"
	import DismissIcon from "../icons/DismissIcon.svelte"

	type NavItem = {
		label: string
		href: string
		icon?: string
		onClick?: () => void
	}

	type NavGroupItem = {
		title: string
		icon: string
		items: Array<{label: string; href: string}>
	}

	type Props = {
		brand?: string
		brandHref?: string
		brandTemplate?: SlotType
		items?: NavItem[]
		children?: SlotType
		navigationGroups?: NavGroupItem[]
		height?: number
		class?: string
		style?: string
	}

	let {
		brand = "Brand",
		brandHref = "/",
		brandTemplate = undefined,
		items = [],
		children = undefined,
		navigationGroups = [],
		height = 60,
		class: className = "",
		style = ""
	}: Props = $props()

	let mobileMenuOpen = $state(false)

	// Drawer is only for collapsed nav items / groups. The action slot stays
	// visible at any width (search, account menu, theme toggle, etc. should
	// remain reachable on mobile rather than being hidden inside a hamburger).
	const hasDrawerContent = $derived(
		items.length > 0 || navigationGroups.length > 0
	)

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen
	}

	function closeMobileMenu() {
		mobileMenuOpen = false
	}

	function handleNavClick(item: NavItem) {
		item.onClick?.()
		closeMobileMenu()
	}
</script>

<nav
	class="topnav {className}"
	style="height: {height}px; {style}"
>
	<div class="topnav-container">
		{#if hasDrawerContent}
			<Button
				appearance="stealth"
				class="mobile-menu-toggle"
				onclick={toggleMobileMenu}
				aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
				aria-expanded={mobileMenuOpen}
			>
				<span class="hamburger-icon">
					{#if mobileMenuOpen}
						<DismissIcon size={20} />
					{:else}
						☰
					{/if}
				</span>
			</Button>
		{/if}

		{#if brandTemplate}
			{@render brandTemplate()}
		{:else}
			<a href={brandHref} class="topnav-brand">
				{brand}
			</a>
		{/if}

		<div class="topnav-trailing">
			{#if items.length > 0}
				<div class="topnav-items">
					{#each items as item}
						<a
							href={item.href}
							class="nav-item"
							onclick={() => handleNavClick(item)}
						>
							{#if item.icon}
								<span class="nav-icon">{item.icon}</span>
							{/if}
							<span class="nav-text">{item.label}</span>
						</a>
					{/each}
				</div>
			{/if}

			{#if children}
				{#if items.length > 0}
					<div class="nav-divider"></div>
				{/if}
				<div class="topnav-actions">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</nav>

{#if hasDrawerContent}
	<Panel bind:open={mobileMenuOpen} side="start" width="280px" class="topnav-drawer">
		<div class="topnav-drawer-body">
			{#if items.length > 0}
				<div class="topnav-drawer-items">
					{#each items as item}
						<a
							href={item.href}
							class="nav-item"
							onclick={() => handleNavClick(item)}
						>
							{#if item.icon}
								<span class="nav-icon">{item.icon}</span>
							{/if}
							<span class="nav-text">{item.label}</span>
						</a>
					{/each}
				</div>
			{/if}

			{#if navigationGroups.length > 0}
				{#if items.length > 0}
					<hr class="topnav-drawer-separator" />
				{/if}
				<NavMenu>
					{#each navigationGroups as group}
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
			{/if}
		</div>
	</Panel>
{/if}

<style>
	.topnav {
		display: flex;
		align-items: center;
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		padding: 0 1.5rem;
		container-type: inline-size;
		container-name: topnav;
	}

	.topnav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		position: relative;
		gap: 1rem;
		min-width: 0;
	}

	.topnav-brand {
		text-decoration: none;
		color: inherit;
		font-size: 1.25rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	/* Mobile menu toggle button — hidden by default, shown when container is narrow */
	:global(.topnav .mobile-menu-toggle) {
		display: none;
		order: -1;
		flex-shrink: 0;
	}

	.hamburger-icon {
		font-size: 1.5rem;
		line-height: 1;
		display: flex;
		align-items: center;
	}

	/* Trailing flex group: items + divider + actions. Brand sits opposite
	   it (justify-content: space-between on .topnav-container), so the
	   trailing group right-anchors as a single unit. */
	.topnav-trailing {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		min-width: 0;
	}

	.topnav-items {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		min-width: 0;
		overflow: hidden;
	}

	.nav-item {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--fluent-border-radius-md);
		transition: background-color 0.2s;
	}

	.nav-item:hover {
		background-color: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.05));
	}

	.nav-icon {
		font-size: 1.1rem;
	}

	.nav-divider {
		width: 1px;
		height: 24px;
		background: var(--neutral-stroke-divider-rest, #e0e0e0);
	}

	.topnav-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	/* Drawer styling — Panel handles position / transition / a11y */
	.topnav-drawer-body {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		padding: 0.75rem 0;
	}

	.topnav-drawer-items {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		padding: 0 0.75rem;
	}

	.topnav-drawer-items .nav-item {
		padding: 0.6rem 0.75rem;
	}

	.topnav-drawer-separator {
		border: none;
		border-top: 1px solid var(--neutral-stroke-divider-rest, #e0e0e0);
		margin: 0.75rem 0;
	}

	@container topnav (max-width: 900px) {
		:global(.topnav .mobile-menu-toggle) {
			display: flex;
		}

		.topnav-items,
		.nav-divider {
			display: none;
		}
	}

	@container topnav (max-width: 480px) {
		.topnav-brand {
			font-size: 1rem;
		}
	}
</style>
