<script lang="ts" module>
	import type { SlotType } from "../types/index.js"

	export type MenuButtonItem = {
		/** Stable id used as an each-block key and to remember per-section expand state. Falls back to label when omitted. */
		id?: string
		/** Displayed text. */
		label: string
		/** Fluent icon name (regular variant) shown before the label. */
		icon?: string
		/** Disables the item. */
		disabled?: boolean
		/** When false, the item is skipped entirely. */
		visible?: boolean
		/** Paints the item in the destructive/error color. */
		danger?: boolean
		/** Render a divider above this item. */
		dividerBefore?: boolean
		/** Click handler — the menu closes automatically after `onclick` resolves. */
		onclick?: () => void | Promise<void>
		/**
		 * Nested menu items. When present with `expandable: true`, the item renders
		 * as an inline expandable section header (click the chevron to show/hide
		 * the children in-place). When present without `expandable`, it renders
		 * as a side-opening submenu trigger (planned — currently falls back to
		 * expandable inline).
		 */
		children?: MenuButtonItem[]
		/** When true + `children` present, renders an inline expandable section instead of a regular clickable item. */
		expandable?: boolean
		/** Initial expanded state for expandable sections. Default `true`. */
		defaultExpanded?: boolean
	}
</script>

<script lang="ts">
	import {
		fluentButton,
		fluentMenu,
		fluentMenuItem,
		fluentDivider,
		provideFluentDesignSystem
	} from "@fluentui/web-components"
	import { computePosition, flip, shift, offset, size, autoUpdate } from "@floating-ui/dom"
	import Icon from "./Icon.svelte"
	import { portal } from "../actions/portal.js"

	provideFluentDesignSystem().register(
		fluentButton(),
		fluentMenu(),
		fluentMenuItem(),
		fluentDivider()
	)

	type Props = {
		/** Menu items rendered as a dropdown when the button is clicked. */
		items: MenuButtonItem[]
		/** Button appearance (passed through to `<fluent-button>`). */
		appearance?: string
		/** Disables the trigger button entirely. */
		disabled?: boolean
		class?: string
		style?: string
		/**
		 * Preferred side of the button to open the menu on. `"bottom"` (default) opens
		 * below and auto-flips to above if there isn't enough room; `"top"` prefers above
		 * and flips to below when space is tighter overhead. Floating UI's `shift`
		 * middleware also nudges the menu horizontally to stay inside the viewport
		 * when the anchor is close to the left/right edge.
		 */
		position?: "bottom" | "top"
		/** Bindable open state. */
		open?: boolean
		children?: SlotType
		/** Slot rendered inside the button's `start` slot (icon before label). */
		start?: SlotType
		/** Slot rendered inside the button's `end` slot (icon after label). */
		end?: SlotType
		onopen?: () => void
		onclose?: () => void
	}

	let {
		items,
		appearance = undefined,
		disabled = undefined,
		class: className = "",
		style = "",
		position = "bottom",
		open = $bindable(false),
		children = undefined,
		start = undefined,
		end = undefined,
		onopen = undefined,
		onclose = undefined
	}: Props = $props()

	/*
	 * Anchor element (the span wrapping `<fluent-button>`) is what Floating UI
	 * positions the menu against. We render the fluent-button directly (not
	 * through our `<Button>` wrapper) so we can `bind:this` on the wrapping
	 * span and have a real DOM node to anchor to.
	 */
	let anchorEl: HTMLElement | undefined = $state()
	let menuEl: HTMLElement | undefined = $state()

	function toggleMenu() {
		if (disabled) return
		const next = !open
		open = next
		if (next) onopen?.()
		else onclose?.()
	}

	function closeMenu() {
		if (!open) return
		open = false
		onclose?.()
	}

	async function runItem(item: MenuButtonItem) {
		if (item.disabled) return
		closeMenu()
		await item.onclick?.()
	}

	const visibleItems = $derived(items.filter(i => i.visible !== false))

	/*
	 * Floating UI positioning. `autoUpdate` re-runs `computePosition` on
	 * scroll / resize / DOM mutation, so the menu follows its anchor live
	 * instead of floating detached the moment the user scrolls. Middleware:
	 *   - offset(4)   — 4px gap between anchor and menu
	 *   - flip()      — if the preferred placement would clip the viewport,
	 *                   flip to the other side (bottom ↔ top)
	 *   - shift()     — slide the menu along the cross axis to stay inside
	 *                   the viewport (with 8px padding) when the anchor is
	 *                   near the left/right edge of the screen
	 *   - size()      — cap the menu's max-height to whatever space is
	 *                   actually available so a tall menu near the bottom
	 *                   of the viewport doesn't get cut off — it becomes
	 *                   scrollable instead
	 */
	const preferredPlacement = $derived(position === "top" ? "top-start" : "bottom-start")

	async function updatePosition() {
		if (!anchorEl || !menuEl) return
		const { x, y } = await computePosition(anchorEl, menuEl, {
			placement: preferredPlacement,
			strategy: "fixed",
			middleware: [
				offset(4),
				flip(),
				shift({ padding: 8 }),
				size({
					apply({ availableHeight, elements }) {
						elements.floating.style.maxHeight = `${Math.max(availableHeight - 8, 80)}px`
					},
					padding: 8
				})
			]
		})
		menuEl.style.left = `${x}px`
		menuEl.style.top = `${y}px`
	}

	/*
	 * Wire autoUpdate while the menu is open. autoUpdate returns a cleanup
	 * fn that removes its own listeners; we call it in the effect's return.
	 * The effect also re-subscribes when `preferredPlacement` changes (the
	 * consumer toggled the `position` prop).
	 */
	$effect(() => {
		if (!open || !anchorEl || !menuEl) return
		void preferredPlacement
		const cleanup = autoUpdate(anchorEl, menuEl, updatePosition)
		return cleanup
	})

	// Close on outside click / Escape. `autoUpdate` keeps the menu stuck to
	// its anchor during scroll, so we no longer force-close on scroll.
	$effect(() => {
		if (!open) return
		function onDocPointer(e: MouseEvent) {
			const target = e.target as HTMLElement | null
			if (!target) return
			if (anchorEl?.contains(target)) return
			if (menuEl?.contains(target)) return
			closeMenu()
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") {
				e.stopPropagation()
				closeMenu()
			}
		}
		document.addEventListener("mousedown", onDocPointer, true)
		document.addEventListener("keydown", onKey, true)
		return () => {
			document.removeEventListener("mousedown", onDocPointer, true)
			document.removeEventListener("keydown", onKey, true)
		}
	})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span bind:this={anchorEl} class="fluent-menu-button-anchor">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<fluent-button
		{appearance}
		{disabled}
		class={className}
		{style}
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={toggleMenu}
	>
		{#if start}
			<span slot="start" class="fluent-menu-button-icon-slot">{@render start()}</span>
		{/if}
		{@render children?.()}
		{#if end}
			<span slot="end" class="fluent-menu-button-icon-slot">{@render end()}</span>
		{/if}
	</fluent-button>
</span>

{#if open && visibleItems.length > 0}
	<div
		use:portal
		bind:this={menuEl}
		class="fluent-menu-button-menu context-menu"
	>
		<fluent-menu>
			{#each visibleItems as item, i}
				{#if item.dividerBefore && i > 0}
					<fluent-divider></fluent-divider>
				{/if}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<fluent-menu-item
					class={item.danger ? "danger" : ""}
					role="menuitem"
					tabindex="-1"
					disabled={item.disabled || undefined}
					onclick={() => runItem(item)}
				>
					{#if item.icon}
						<span slot="start" class="fluent-menu-button-item-icon">
							<Icon name={item.icon} size={16} />
						</span>
					{/if}
					{item.label}
				</fluent-menu-item>
			{/each}
		</fluent-menu>
	</div>
{/if}

<style>
	.fluent-menu-button-anchor {
		display: inline-flex;
	}

	.fluent-menu-button-icon-slot {
		display: inline-flex;
		align-items: center;
	}

	.fluent-menu-button-icon-slot :global(svg) {
		display: block;
	}

	.fluent-menu-button-item-icon {
		display: inline-flex;
		align-items: center;
		margin-right: 0.25rem;
	}

	/*
	 * Menu element — positioned by Floating UI via top/left inline styles.
	 * `position: fixed` matches the `strategy: "fixed"` passed to
	 * computePosition(), and keeps the menu pinned to viewport coordinates
	 * (no ancestor-transform surprises).
	 */
	.fluent-menu-button-menu {
		position: fixed;
		top: 0;
		left: 0;
		z-index: var(--fluent-z-popover, 1060);
		overflow-y: auto;
	}

	.fluent-menu-button-menu :global(fluent-menu) {
		min-width: 160px;
	}

	.fluent-menu-button-menu :global(fluent-menu-item.danger) {
		color: var(--error-foreground, #d13438);
	}

	.fluent-menu-button-menu :global(fluent-menu-item.danger:hover) {
		background: var(--error-fill-hover, #fde7e9);
	}

	:global([data-theme="dark"]) .fluent-menu-button-menu :global(fluent-menu-item.danger) {
		color: var(--error-foreground, #f87c86);
	}

	:global([data-theme="dark"]) .fluent-menu-button-menu :global(fluent-menu-item.danger:hover) {
		background: var(--error-fill-hover, #442726);
	}
</style>
