<script lang="ts">
	import { computePosition, flip, shift, offset, size, autoUpdate } from "@floating-ui/dom"
	import { SvelteMap } from "svelte/reactivity"
	import Icon from "./Icon.svelte"
	import { portal } from "../actions/portal.js"
	import type { SlotType } from "../types/index.js"
	import type { MenuButtonItem } from "./MenuButton.svelte"

	type Props = {
		/** Menu items rendered when the children area is right-clicked. */
		items: MenuButtonItem[]
		/** Suppress the context menu entirely. When true, right-clicks fall through to the browser's native menu as usual. */
		disabled?: boolean
		/**
		 * Horizontal offset (pixels) pushing the menu further to the right of the
		 * cursor. Useful so the click position doesn't land directly on the first
		 * menu item — otherwise the user has to move the mouse away and back to
		 * select it. Added on top of a small baseline gap.
		 */
		offsetMenuX?: number
		/**
		 * Vertical offset (pixels) pushing the menu further below the cursor.
		 * Same rationale as `offsetMenuX`. Added on top of a small baseline gap.
		 */
		offsetMenuY?: number
		/** Children rendered inside the context-menu trigger zone. */
		children?: SlotType
		onopen?: (detail: { x: number; y: number }) => void
		onclose?: () => void
	}

	let {
		items,
		disabled = false,
		/*
		 * Default 8px on the X axis so the cursor sits safely off the
		 * left edge of the menu after right-click — otherwise the click
		 * position overlaps the first item and the user has to reset
		 * the mouse to hit anything.
		 */
		offsetMenuX = 8,
		offsetMenuY = 0,
		children = undefined,
		onopen = undefined,
		onclose = undefined
	}: Props = $props()

	let open = $state(false)
	let menuEl: HTMLElement | undefined = $state()
	let cursor = $state({ x: 0, y: 0 })

	const visibleItems = $derived(items.filter(i => i.visible !== false))

	function onContextMenu(e: MouseEvent) {
		if (disabled || visibleItems.length === 0) return
		e.preventDefault()
		e.stopPropagation()
		cursor = { x: e.clientX, y: e.clientY }
		open = true
		onopen?.({ x: e.clientX, y: e.clientY })
	}

	function closeMenu() {
		if (!open) return
		open = false
		closeAllSubmenus()
		onclose?.()
	}

	async function runItem(item: MenuButtonItem) {
		if (item.disabled) return
		closeMenu()
		await item.onclick?.()
	}

	/*
	 * Per-section expand state keyed by id (falls back to label). Sections
	 * default to expanded unless `defaultExpanded: false` on the item. User
	 * toggles persist across opens/closes of the menu — that's usually what
	 * people expect in sidebar-style menus.
	 */
	let expandedState = $state<Record<string, boolean>>({})

	function itemKey(item: MenuButtonItem): string {
		return item.id ?? item.label
	}

	function isExpanded(item: MenuButtonItem): boolean {
		const key = itemKey(item)
		if (expandedState[key] !== undefined) return expandedState[key]
		return item.defaultExpanded !== false
	}

	function toggleExpand(item: MenuButtonItem) {
		const key = itemKey(item)
		expandedState[key] = !isExpanded(item)
	}

	/*
	 * Submenu state. Items with `children` and without `expandable: true`
	 * render as side-opening submenu triggers. Each open submenu is tracked
	 * by the trigger item's key; the submenu body portals to <body> and
	 * positions itself with Floating UI (placement: `right-start`, flips to
	 * `left-start` when near the viewport's right edge). Hover-intent delays
	 * (open ~150ms / close ~250ms) prevent flicker and let the user
	 * diagonally swoop from trigger to submenu body without it snapping
	 * shut. Sibling submenus (same parent) auto-close when a new one opens.
	 */
	type SubmenuEntry = {
		items: MenuButtonItem[]
		triggerEl: HTMLElement
		parentKey: string | null
	}
	/*
	 * `SvelteMap` (from `svelte/reactivity`) is required here — a plain
	 * `new Map()` wrapped in `$state()` does NOT proxy Map mutations, so
	 * `openSubmenus.set(key, …)` wouldn't invalidate the `{#each …}` that
	 * renders submenu portals, and hovered submenus would never appear.
	 * The `openTimers` / `closeTimers` maps stay as plain Maps because
	 * they're only read/written from non-reactive code.
	 */
	const openSubmenus = new SvelteMap<string, SubmenuEntry>()

	const HOVER_OPEN_DELAY = 150
	const HOVER_CLOSE_DELAY = 250
	const openTimers = new Map<string, number>()
	const closeTimers = new Map<string, number>()

	function cancelOpen(key: string) {
		const t = openTimers.get(key)
		if (t !== undefined) {
			clearTimeout(t)
			openTimers.delete(key)
		}
	}
	function cancelClose(key: string) {
		const t = closeTimers.get(key)
		if (t !== undefined) {
			clearTimeout(t)
			closeTimers.delete(key)
		}
	}

	function scheduleOpenSubmenu(item: MenuButtonItem, triggerEl: HTMLElement, parentKey: string | null) {
		const key = itemKey(item)
		cancelClose(key)
		if (openSubmenus.has(key) || openTimers.has(key)) return
		const t = window.setTimeout(() => {
			// Close sibling submenus (same parent) before opening this one.
			for (const [k, v] of openSubmenus) {
				if (v.parentKey === parentKey && k !== key) closeSubmenuTree(k)
			}
			openSubmenus.set(key, { items: item.children ?? [], triggerEl, parentKey })
			openTimers.delete(key)
		}, HOVER_OPEN_DELAY) as unknown as number
		openTimers.set(key, t)
	}

	function scheduleCloseSubmenu(key: string) {
		cancelOpen(key)
		if (closeTimers.has(key)) return
		const t = window.setTimeout(() => {
			closeSubmenuTree(key)
			closeTimers.delete(key)
		}, HOVER_CLOSE_DELAY) as unknown as number
		closeTimers.set(key, t)
	}

	function closeSubmenuTree(key: string) {
		// Recursively close descendant submenus first so they don't leak.
		const childKeys = Array.from(openSubmenus.entries())
			.filter(([, v]) => v.parentKey === key)
			.map(([k]) => k)
		for (const ck of childKeys) closeSubmenuTree(ck)
		openSubmenus.delete(key)
		cancelOpen(key)
		cancelClose(key)
	}

	function closeAllSubmenus() {
		for (const key of Array.from(openSubmenus.keys())) closeSubmenuTree(key)
	}

	/*
	 * Floating UI action for each submenu body. `autoUpdate` keeps the
	 * submenu glued to its trigger as the viewport changes; since we also
	 * dismiss the whole menu on outside scroll (see effect below), this
	 * really only matters for resize and sibling movements while the menu
	 * is open.
	 */
	function positionSubmenu(node: HTMLElement, triggerEl: HTMLElement) {
		async function update() {
			const { x, y } = await computePosition(triggerEl, node, {
				placement: "right-start",
				strategy: "fixed",
				middleware: [
					offset(2),
					flip({ fallbackPlacements: ["left-start", "right-end", "left-end"] }),
					shift({ padding: 8 }),
					size({
						apply({ availableHeight, elements }) {
							elements.floating.style.maxHeight = `${Math.max(availableHeight - 8, 80)}px`
						},
						padding: 8
					})
				]
			})
			node.style.left = `${x}px`
			node.style.top = `${y}px`
		}
		const cleanup = autoUpdate(triggerEl, node, update)
		return {
			destroy() {
				cleanup()
			}
		}
	}

	/*
	 * Floating UI virtual element — a zero-sized anchor at the cursor
	 * position. `computePosition` and `autoUpdate` treat this the same as
	 * a DOM anchor, so the menu gets flipped / shifted / size-capped by
	 * the usual middleware when it'd otherwise clip the viewport.
	 */
	const virtualAnchor = $derived({
		getBoundingClientRect: () => ({
			x: cursor.x,
			y: cursor.y,
			top: cursor.y,
			left: cursor.x,
			right: cursor.x,
			bottom: cursor.y,
			width: 0,
			height: 0
		})
	})

	const BASE_OFFSET = 2

	async function updatePosition() {
		if (!menuEl) return
		const { x, y } = await computePosition(virtualAnchor, menuEl, {
			placement: "bottom-start",
			strategy: "fixed",
			middleware: [
				/*
				 * offset is { mainAxis, crossAxis } — with `bottom-start`
				 * mainAxis is vertical (positive = further below cursor)
				 * and crossAxis is horizontal (positive = further right).
				 * The consumer-provided `offsetMenuX` / `offsetMenuY`
				 * stack on top of a small baseline gap so the cursor
				 * isn't sitting on the first menu item at 0 offset.
				 */
				offset({
					mainAxis: BASE_OFFSET + offsetMenuY,
					crossAxis: offsetMenuX
				}),
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
	 * autoUpdate keeps the menu positioned relative to its *virtual anchor*
	 * (the cursor position captured at right-click). The cursor doesn't
	 * move while the menu is open, but autoUpdate still handles scrolling
	 * and viewport resize.
	 */
	$effect(() => {
		if (!open || !menuEl) return
		// Re-subscribe when offsets change so updatePosition gets the new values.
		void offsetMenuX
		void offsetMenuY
		const cleanup = autoUpdate(virtualAnchor, menuEl, updatePosition)
		return cleanup
	})

	/*
	 * Helper used by the outside-click / scroll / contextmenu listeners:
	 * is this target inside *any* of our menu surfaces (root or any open
	 * submenu)? Submenus are portalled to <body>, so `menuEl.contains` is
	 * not enough — we also accept any element inside a `.fluent-context-menu`
	 * ancestor.
	 */
	function isInsideAnyMenu(target: EventTarget | null): boolean {
		if (!(target instanceof HTMLElement)) return false
		if (menuEl?.contains(target)) return true
		return !!target.closest(".fluent-context-menu")
	}

	$effect(() => {
		if (!open) return
		function onDocPointer(e: MouseEvent) {
			if (isInsideAnyMenu(e.target)) return
			closeMenu()
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") {
				e.stopPropagation()
				// Escape pops submenus one at a time before closing the root.
				if (openSubmenus.size > 0) {
					const deepest = Array.from(openSubmenus.keys()).pop()
					if (deepest) closeSubmenuTree(deepest)
				} else {
					closeMenu()
				}
			}
		}
		/*
		 * A second right-click anywhere else should re-open the menu at
		 * the new position, not just close the old one. The document-level
		 * contextmenu listener below closes the existing menu; the new
		 * contextmenu event then re-fires on whatever wrapper is under
		 * the cursor, re-opening it. If the right-click is outside any
		 * <ContextMenu> trigger, the browser's native menu opens
		 * (we don't call preventDefault here).
		 */
		function onContext(e: MouseEvent) {
			if (isInsideAnyMenu(e.target)) {
				// Right-click inside our own menu — suppress the browser menu.
				e.preventDefault()
				return
			}
			closeMenu()
		}
		/*
		 * Scroll-to-close. Context menus traditionally dismiss on scroll
		 * because the menu was opened at a specific viewport position and
		 * that position loses its meaning once the underlying content
		 * moves. Scroll events don't bubble, so this listener uses capture
		 * to catch scroll on any ancestor. A scroll *inside* our own menu
		 * (e.g. a long list that's overflowing) is ignored so users can
		 * still wheel through it.
		 */
		function onScroll(e: Event) {
			if (isInsideAnyMenu(e.target)) return
			closeMenu()
		}
		document.addEventListener("mousedown", onDocPointer, true)
		document.addEventListener("keydown", onKey, true)
		document.addEventListener("contextmenu", onContext, true)
		document.addEventListener("scroll", onScroll, true)
		return () => {
			document.removeEventListener("mousedown", onDocPointer, true)
			document.removeEventListener("keydown", onKey, true)
			document.removeEventListener("contextmenu", onContext, true)
			document.removeEventListener("scroll", onScroll, true)
		}
	})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span class="fluent-context-menu-wrapper" oncontextmenu={onContextMenu}>
	{@render children?.()}
</span>

{#snippet renderItem(item: MenuButtonItem, depth: number, isFirst: boolean, parentKey: string | null)}
	{#if item.visible !== false}
		{#if item.dividerBefore && !isFirst}
			<div class="fluent-context-menu-divider" role="separator"></div>
		{/if}
		{#if item.children && item.expandable}
			<!-- Expandable section header — chevron rotates; children render
			     inline below it when expanded. -->
			<button
				type="button"
				class="fluent-context-menu-item fluent-context-menu-section-header"
				class:expanded={isExpanded(item)}
				style="padding-inline-start: {depth * 16 + 12}px;"
				onclick={() => toggleExpand(item)}
				aria-expanded={isExpanded(item)}
			>
				{#if item.icon}
					<span class="fluent-context-menu-item-icon">
						<Icon name={item.icon} size={16} />
					</span>
				{/if}
				<span class="fluent-context-menu-item-label">{item.label}</span>
				<svg class="fluent-context-menu-chevron" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
					<path d="M3.3 5.7a1 1 0 0 1 1.4 0L8 9l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"/>
				</svg>
			</button>
			{#if isExpanded(item)}
				{#each (item.children ?? []) as child, ci (itemKey(child))}
					{@render renderItem(child, depth + 1, ci === 0, parentKey)}
				{/each}
			{/if}
		{:else if item.children}
			<!-- Submenu trigger — side-opening popover on hover/focus. -->
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
				type="button"
				class="fluent-context-menu-item fluent-context-menu-submenu-trigger"
				class:active={openSubmenus.has(itemKey(item))}
				style="padding-inline-start: {depth * 16 + 12}px;"
				disabled={item.disabled || undefined}
				aria-haspopup="menu"
				aria-expanded={openSubmenus.has(itemKey(item))}
				onmouseenter={(e) => scheduleOpenSubmenu(item, e.currentTarget, parentKey)}
				onmouseleave={() => scheduleCloseSubmenu(itemKey(item))}
				onfocus={(e) => scheduleOpenSubmenu(item, e.currentTarget, parentKey)}
				onclick={(e) => scheduleOpenSubmenu(item, e.currentTarget, parentKey)}
			>
				{#if item.icon}
					<span class="fluent-context-menu-item-icon">
						<Icon name={item.icon} size={16} />
					</span>
				{/if}
				<span class="fluent-context-menu-item-label">{item.label}</span>
				<svg class="fluent-context-menu-submenu-arrow" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
					<path d="M5.7 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L9 8 5.7 4.7a1 1 0 0 1 0-1.4z"/>
				</svg>
			</button>
		{:else}
			<!-- Leaf item -->
			<button
				type="button"
				class="fluent-context-menu-item"
				class:danger={item.danger}
				style="padding-inline-start: {depth * 16 + 12}px;"
				disabled={item.disabled || undefined}
				onclick={() => runItem(item)}
			>
				{#if item.icon}
					<span class="fluent-context-menu-item-icon">
						<Icon name={item.icon} size={16} />
					</span>
				{/if}
				<span class="fluent-context-menu-item-label">{item.label}</span>
			</button>
		{/if}
	{/if}
{/snippet}

{#if open && visibleItems.length > 0}
	<div use:portal bind:this={menuEl} class="fluent-context-menu" role="menu">
		{#each visibleItems as item, i (itemKey(item))}
			{@render renderItem(item, 0, i === 0, null)}
		{/each}
	</div>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#each Array.from(openSubmenus.entries()) as [key, submenu] (key)}
	<div
		use:portal
		use:positionSubmenu={submenu.triggerEl}
		class="fluent-context-menu fluent-context-submenu"
		role="menu"
		tabindex="-1"
		onmouseenter={() => cancelClose(key)}
		onmouseleave={() => scheduleCloseSubmenu(key)}
	>
		{#each submenu.items as item, i (itemKey(item))}
			{@render renderItem(item, 0, i === 0, key)}
		{/each}
	</div>
{/each}

<style>
	/*
	 * `display: contents` keeps the wrapper span out of the layout flow —
	 * children render where they would have without the wrapper. Event
	 * handlers on the span still catch events that bubble up from the
	 * children, so `oncontextmenu` works normally.
	 */
	.fluent-context-menu-wrapper {
		display: contents;
	}

	/*
	 * Custom menu container — replaces fluent-menu so we can freely render
	 * nested items and expandable sections without wrestling the shadow
	 * DOM. Styled against FluentUI design tokens so the look still matches
	 * QuickGrid's context menu and MenuButton's dropdown.
	 */
	.fluent-context-menu {
		position: fixed;
		top: 0;
		left: 0;
		z-index: var(--fluent-z-popover, 1060);
		overflow-y: auto;
		overscroll-behavior: contain;
		min-width: 200px;
		padding: 0.25rem 0;
		background: var(--neutral-layer-1, #ffffff);
		border: 1px solid var(--neutral-stroke-layer-rest, rgba(0, 0, 0, 0.1));
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12);
		color: var(--neutral-foreground-rest);
		font-family: var(--body-font);
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
	}

	.fluent-context-menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.4rem 0.75rem;
		background: transparent;
		border: none;
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
		white-space: nowrap;
	}

	.fluent-context-menu-item:hover:not(:disabled) {
		background: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.03));
	}

	.fluent-context-menu-item:focus-visible {
		outline: calc(var(--focus-stroke-width, 2) * 1px) solid var(--focus-stroke-outer);
		outline-offset: calc(var(--focus-stroke-width, 2) * -1px);
	}

	.fluent-context-menu-item:disabled {
		cursor: not-allowed;
		color: var(--neutral-foreground-hint);
		opacity: 0.6;
	}

	.fluent-context-menu-item-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--accent-fill-rest);
	}

	.fluent-context-menu-item-label {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fluent-context-menu-section-header {
		font-weight: 600;
	}

	.fluent-context-menu-chevron {
		transition: transform 0.15s ease;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.fluent-context-menu-section-header.expanded .fluent-context-menu-chevron {
		transform: rotate(180deg);
	}

	.fluent-context-menu-submenu-arrow {
		flex-shrink: 0;
		opacity: 0.7;
	}

	.fluent-context-menu-submenu-trigger.active {
		background: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.03));
	}

	.fluent-context-menu-divider {
		height: 1px;
		background: var(--neutral-stroke-layer-rest, rgba(0, 0, 0, 0.1));
		margin: 0.25rem 0;
	}

	.fluent-context-menu-item.danger {
		color: var(--error-foreground, #d13438);
	}

	.fluent-context-menu-item.danger:hover:not(:disabled) {
		background: var(--error-fill-hover, #fde7e9);
	}

	:global([data-theme="dark"]) .fluent-context-menu-item.danger {
		color: var(--error-foreground, #f87c86);
	}

	:global([data-theme="dark"]) .fluent-context-menu-item.danger:hover:not(:disabled) {
		background: var(--error-fill-hover, #442726);
	}
</style>
