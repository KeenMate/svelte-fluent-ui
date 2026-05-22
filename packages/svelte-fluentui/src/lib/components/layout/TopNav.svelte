<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import Button from "../Button.svelte"
	import NavMenu from "../nav/NavMenu.svelte"
	import NavGroup from "../nav/NavGroup.svelte"
	import NavLinkItem from "../nav/NavLinkItem.svelte"

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
		items = [],
		children = undefined,
		navigationGroups = [],
		height = 60,
		class: className = "",
		style = ""
	}: Props = $props()

	let mobileMenuOpen = $state(false)

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
		<!-- Mobile menu toggle (left side) -->
		<Button appearance="stealth" class="mobile-menu-toggle" onclick={toggleMobileMenu}>
			<span class="hamburger-icon">
				{#if mobileMenuOpen}
					✕
				{:else}
					☰
				{/if}
			</span>
		</Button>

		<a href={brandHref} class="topnav-brand">
			{brand}
		</a>

		<!-- Desktop navigation items -->
		<div class="topnav-items">
			{#if items.length > 0}
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
			{/if}

			{#if children}
				<div class="nav-divider"></div>
				<div class="topnav-actions">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>

	<!-- Mobile sidebar navigation -->
	{#if navigationGroups.length > 0}
		<div class="mobile-sidebar" class:mobile-open={mobileMenuOpen}>
			<div class="mobile-sidebar-content">
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
			</div>
			{#if children}
				<div class="mobile-sidebar-actions">
					{@render children()}
				</div>
			{/if}
		</div>
	{/if}
</nav>

<style>
	.topnav {
		display: flex;
		align-items: center;
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		padding: 0 1.5rem;
	}

	.topnav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.topnav-brand {
		text-decoration: none;
		color: inherit;
		font-size: 1.25rem;
		font-weight: 600;
		z-index: var(--fluent-z-sticky, 1020);
	}

	/* Mobile menu toggle button */
	:global(.topnav .mobile-menu-toggle) {
		display: none;
		z-index: var(--fluent-z-sticky, 1020);
		order: -1;
	}

	.hamburger-icon {
		font-size: 1.5rem;
		line-height: 1;
	}

	/* Navigation items */
	.topnav-items {
		display: flex;
		gap: 1.5rem;
		align-items: center;
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
	}

	/* Mobile sidebar */
	.mobile-sidebar {
		display: none;
	}

	.mobile-sidebar-actions {
		padding: 1rem;
		border-top: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Responsive styles */
	@media (max-width: 768px) {
		:global(.topnav .mobile-menu-toggle) {
			display: flex;
		}

		.topnav-items {
			display: none;
		}

		.mobile-sidebar {
			display: block;
			position: fixed;
			top: 60px;
			left: -280px;
			width: 280px;
			height: calc(100vh - 60px);
			background: var(--neutral-layer-1, #ffffff);
			border-right: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
			transition: left 0.3s ease-in-out;
			z-index: var(--fluent-z-fixed, 1030);
			box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
			overflow-y: auto;
		}

		.mobile-sidebar.mobile-open {
			left: 0;
		}

		.mobile-sidebar-content {
			padding: 0;
		}
	}

	@media (max-width: 480px) {
		.topnav-brand {
			font-size: 1rem;
		}

		.topnav-items {
			width: 100%;
			right: -100%;
		}
	}
</style>
