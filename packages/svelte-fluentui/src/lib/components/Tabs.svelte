<script lang="ts" module>
	import type { SlotType } from "../types/index.js"

	/**
	 * Shape of a registered tab entry inside the Tabs context. Tab.svelte
	 * populates this and calls `register`; Tabs.svelte reads the array and
	 * renders the real tablist + panels from it.
	 */
	export type TabEntry = {
		id: string
		label?: string
		icon?: SlotType
		header?: SlotType
		content?: SlotType
		childContent?: SlotType
		disabled?: boolean
		ariaLabel?: string
		labelEditable?: boolean
		showClose?: boolean
		visible?: boolean
		data?: Record<string, unknown>
		oncloseclick?: () => void
		class?: string
		style?: string
	}

	export type TabsContext = {
		register: (entry: TabEntry) => void
		unregister: (id: string) => void
	}

	export const TABS_CONTEXT_KEY = Symbol("fluent-tabs-context")
</script>

<script lang="ts">
	import { setContext, untrack } from "svelte"
	import { fluentMenu, fluentMenuItem, provideFluentDesignSystem } from "@fluentui/web-components"
	import PositioningRegion from "./PositioningRegion.svelte"

	provideFluentDesignSystem().register(fluentMenu(), fluentMenuItem())

	type TabChangeDetail = {
		tabId: string
		data?: Record<string, unknown>
	}

	type Props = {
		id?: string
		class?: string
		style?: string
		orientation?: "horizontal" | "vertical"
		activeId?: string
		showActiveIndicator?: boolean
		childContent?: SlotType
		/** Legacy prop kept for API compat — the overflow dropdown was rarely used and is not re-implemented in the Svelte rewrite. Consumers who need an overflow menu should render their own dropdown next to `<Tabs>` or use `responsive="menu"`. */
		overflow?: { label: string; onclick?: () => void }[]
		moreButtonId?: string
		styleMoreValues?: string
		/**
		 * How the tab list handles widths wider than the container.
		 *  - `scroll` (default): tab strip scrolls horizontally (vertical: vertically). Scroll arrows appear at the ends when there's overflow.
		 *  - `wrap`: tabs flow onto multiple rows (horizontal) / columns (vertical).
		 *  - `menu`: tabs that don't fit collapse into an overflow `⋯` button at the end of the strip. Clicking the button opens a floating menu of the hidden tabs. Selecting a hidden tab swaps its position with the last-visible tab so the selection stays visible.
		 */
		responsive?: "scroll" | "wrap" | "menu"
		/** Stretch tabs to fill the strip (each tab takes an equal share). */
		justify?: boolean
		/**
		 * Fixed width for the tab strip (CSS length — `"200px"`, `"12rem"`, `"20%"`, etc.).
		 * Most useful in `orientation="vertical"`: caps the strip's cross-axis so the stack
		 * of tabs doesn't grow to fit the widest label. When set in vertical, each tab's
		 * label auto-ellipsises if it exceeds the available width. In horizontal mode
		 * this just caps the strip's total width (falls through to the parent's width
		 * otherwise) and tabs fall back to their `responsive` mode when the sum of tab
		 * widths exceeds it.
		 */
		stripWidth?: string
		/**
		 * Fixed height for the tab strip. Symmetric counterpart to `stripWidth` — most
		 * useful in `orientation="horizontal"` if you want a taller strip (e.g. to show
		 * multi-line tab content). Rarely needed.
		 */
		stripHeight?: string
		/** Enable horizontal-swipe (or vertical-swipe in vertical orientation) to navigate between tabs. Default `true`. Swipes starting on interactive elements (input, button, slider, contenteditable) are ignored so form controls keep working. */
		swipe?: boolean
		ontabchange?: (detail: TabChangeDetail) => void
	}

	let {
		id = undefined,
		class: className = "",
		style = "",
		orientation = "horizontal",
		activeId = $bindable(undefined),
		showActiveIndicator = true,
		childContent = undefined,
		overflow = [],
		moreButtonId: _moreButtonId = "more-button",
		styleMoreValues: _styleMoreValues = "",
		responsive = "scroll",
		justify = false,
		stripWidth = undefined,
		stripHeight = undefined,
		swipe = true,
		ontabchange = undefined
	}: Props = $props()

	const stripStyle = $derived.by(() => {
		const parts: string[] = []
		if (stripWidth) parts.push(`width: ${stripWidth}`)
		if (stripHeight) parts.push(`height: ${stripHeight}`)
		return parts.join("; ")
	})

	let tabs = $state<TabEntry[]>([])

	setContext<TabsContext>(TABS_CONTEXT_KEY, {
		register: (entry) => {
			const idx = tabs.findIndex(t => t.id === entry.id)
			if (idx >= 0) tabs[idx] = entry
			else tabs.push(entry)
		},
		unregister: (tabId) => {
			const idx = tabs.findIndex(t => t.id === tabId)
			if (idx >= 0) tabs.splice(idx, 1)
		}
	})

	/*
	 * `displayOrder` is a custom-ordering layer on top of the source
	 * (registration) order. Starts empty — meaning "use source order as-is".
	 * `responsive="menu"` mutates this array when the user picks a hidden
	 * tab from the overflow menu (swap-with-last-visible UX), so the
	 * selection stays in the strip after it's chosen. Other responsive
	 * modes never write to it.
	 */
	let displayOrder = $state<string[]>([])

	const orderedTabs = $derived.by(() => {
		const filtered = tabs.filter(t => t.visible !== false)
		if (displayOrder.length === 0) return filtered
		const byId = new Map(filtered.map(t => [t.id, t]))
		const seen = new Set<string>()
		const result: TabEntry[] = []
		for (const id of displayOrder) {
			const tab = byId.get(id)
			if (tab) {
				result.push(tab)
				seen.add(id)
			}
		}
		// Append newly-registered tabs that displayOrder doesn't know about yet.
		for (const tab of filtered) {
			if (!seen.has(tab.id)) result.push(tab)
		}
		return result
	})

	const isHorizontal = $derived(orientation === "horizontal")
	const isMenuMode = $derived(responsive === "menu")

	/*
	 * Menu-mode state: `visibleCount` is how many tabs fit in the strip
	 * before the `⋯` button kicks in. The measurement is driven by a
	 * shadow tablist that holds every tab at its natural width so adding
	 * or hiding the `⋯` button doesn't feed back into the measurement.
	 */
	let visibleCount = $state(Number.POSITIVE_INFINITY)
	let overflowOpen = $state(false)
	let moreBtnRef: HTMLElement | undefined = $state()
	let shadowTablistRef: HTMLElement | undefined = $state()
	/*
	 * When the last tab that would otherwise overflow fits only *partially*
	 * into the remaining strip space, we still include it as the last
	 * visible tab and cap its width here (pixels). The CSS then truncates
	 * its label with an ellipsis. 0 = no truncation applied.
	 */
	let truncateLastTabSize = $state(0)
	const MIN_TRUNCATED_TAB_SIZE = 60

	const renderedTabs = $derived(
		isMenuMode ? orderedTabs.slice(0, visibleCount) : orderedTabs
	)
	const overflowTabs = $derived(
		isMenuMode ? orderedTabs.slice(visibleCount) : []
	)

	// Default-select the first visible tab if caller didn't set activeId.
	$effect(() => {
		if (!activeId && orderedTabs.length > 0) {
			activeId = orderedTabs[0].id
		}
	})

	let tablistRef: HTMLElement | undefined = $state()
	let indicatorStyle = $state("opacity: 0;")

	function cssIdSelector(tabId: string): string {
		return `[data-tab-id="${CSS.escape(tabId)}"]`
	}

	function updateIndicator() {
		if (!tablistRef || !activeId || !showActiveIndicator) {
			indicatorStyle = "opacity: 0;"
			return
		}
		const activeBtn = tablistRef.querySelector<HTMLButtonElement>(
			`button${cssIdSelector(activeId)}`
		)
		if (!activeBtn) {
			indicatorStyle = "opacity: 0;"
			return
		}
		const thickness = 2
		// Use translate(x, y) on BOTH axes so the indicator tracks the
		// active tab's row/column in wrap mode — not just its horizontal
		// (or vertical) position. Without both axes, in a wrap-mode layout
		// the indicator would appear under the entire tablist's bottom edge
		// even when the active tab is on an earlier row.
		if (isHorizontal) {
			const x = activeBtn.offsetLeft
			const y = activeBtn.offsetTop + activeBtn.offsetHeight - thickness
			indicatorStyle =
				`opacity: 1;` +
				`transform: translate(${x}px, ${y}px);` +
				`width: ${activeBtn.offsetWidth}px;` +
				`height: ${thickness}px;`
		} else {
			const x = activeBtn.offsetLeft + activeBtn.offsetWidth - thickness
			const y = activeBtn.offsetTop
			indicatorStyle =
				`opacity: 1;` +
				`transform: translate(${x}px, ${y}px);` +
				`width: ${thickness}px;` +
				`height: ${activeBtn.offsetHeight}px;`
		}
	}

	// Indicator reposition — runs on activeId / orientation / tabs change.
	$effect(() => {
		// Reactive dependencies
		void activeId
		void isHorizontal
		void orderedTabs.length
		updateIndicator()
	})

	// Resize/scroll observers — keep indicator aligned when tab sizes change
	// (label edit, font load, container resize, horizontal scroll etc.) and
	// drive the scroll-arrow visibility in `responsive="scroll"` mode.
	let canScrollStart = $state(false)
	let canScrollEnd = $state(false)

	function updateScrollState() {
		if (!tablistRef) {
			canScrollStart = false
			canScrollEnd = false
			return
		}
		if (responsive !== "scroll") {
			canScrollStart = false
			canScrollEnd = false
			return
		}
		if (isHorizontal) {
			const { scrollLeft, clientWidth, scrollWidth } = tablistRef
			canScrollStart = scrollLeft > 0
			canScrollEnd = scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 1
		} else {
			const { scrollTop, clientHeight, scrollHeight } = tablistRef
			canScrollStart = scrollTop > 0
			canScrollEnd = scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 1
		}
	}

	function onTablistScroll() {
		updateScrollState()
		updateIndicator()
	}

	$effect(() => {
		if (!tablistRef) return
		const list = tablistRef
		list.addEventListener("scroll", onTablistScroll)
		const ro = new ResizeObserver(() => {
			updateScrollState()
			updateIndicator()
		})
		ro.observe(list)
		list.querySelectorAll<HTMLElement>("button[data-tab-id]").forEach(btn => ro.observe(btn))
		// Re-run once after layout
		requestAnimationFrame(() => {
			updateScrollState()
			updateIndicator()
		})
		return () => {
			list.removeEventListener("scroll", onTablistScroll)
			ro.disconnect()
		}
	})

	function scrollArrow(direction: 1 | -1) {
		if (!tablistRef) return
		if (isHorizontal) {
			const step = tablistRef.clientWidth * 0.8
			tablistRef.scrollBy({ left: direction * step, behavior: "smooth" })
		} else {
			const step = tablistRef.clientHeight * 0.8
			tablistRef.scrollBy({ top: direction * step, behavior: "smooth" })
		}
	}

	function selectTab(tabId: string, focus = false) {
		const tab = orderedTabs.find(t => t.id === tabId)
		if (!tab || tab.disabled) return
		if (activeId !== tabId) {
			activeId = tabId
			ontabchange?.({ tabId, data: tab.data })
		}
		// Scroll the selected tab into view in scroll mode.
		requestAnimationFrame(() => {
			const btn = tablistRef?.querySelector<HTMLButtonElement>(`button${cssIdSelector(tabId)}`)
			if (!btn) return
			if (responsive === "scroll") {
				btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
			}
			if (focus) btn.focus()
		})
	}

	function handleTabKeydown(e: KeyboardEvent) {
		if (orderedTabs.length === 0) return
		const idx = orderedTabs.findIndex(t => t.id === activeId)
		if (idx < 0) return

		const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp"
		const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown"
		let targetIdx = idx
		let step = 0

		if (e.key === nextKey) step = 1
		else if (e.key === prevKey) step = -1
		else if (e.key === "Home") { targetIdx = -1; step = 1 }
		else if (e.key === "End") { targetIdx = orderedTabs.length; step = -1 }
		else return

		e.preventDefault()

		// Step until we find a non-disabled tab or loop back to start.
		const total = orderedTabs.length
		for (let guard = 0; guard < total; guard++) {
			targetIdx = (targetIdx + step + total) % total
			if (!orderedTabs[targetIdx].disabled) {
				selectTab(orderedTabs[targetIdx].id, true)
				return
			}
		}
	}

	function handleCloseClick(tab: TabEntry, e: MouseEvent) {
		e.stopPropagation()
		e.preventDefault()
		tab.oncloseclick?.()
	}

	/*
	 * Swipe-to-navigate on the tabpanels container. Touch start/end pair;
	 * we measure the net displacement on touchend rather than attempting
	 * to preview the swipe — that would require sliding-panel animation
	 * and momentum handling that's out of scope for the MVP.
	 *
	 * The dominant-axis check (MIN_RATIO) is what keeps vertical content
	 * scrolls from triggering tab changes: if the gesture has significant
	 * perpendicular motion, we treat it as scroll, not swipe.
	 *
	 * Interactive-target check aborts the swipe if the touch originated
	 * on an input/button/range/contenteditable so form controls keep
	 * working — a horizontal drag on a <input type="range"> inside a panel
	 * would otherwise steal the interaction and flip tabs instead.
	 */
	const SWIPE_THRESHOLD_PX = 50
	const SWIPE_MIN_RATIO = 1.5
	let swipeStart: { x: number; y: number; aborted: boolean } | null = null

	function isInteractiveSwipeTarget(target: EventTarget | null): boolean {
		if (!(target instanceof HTMLElement)) return false
		return !!target.closest(
			"input, textarea, select, button, a[href], [contenteditable='true'], [contenteditable=''], [role='slider'], [role='spinbutton']"
		)
	}

	function onPanelsTouchStart(e: TouchEvent) {
		if (!swipe || e.touches.length !== 1) {
			swipeStart = null
			return
		}
		const t = e.touches[0]
		swipeStart = {
			x: t.clientX,
			y: t.clientY,
			aborted: isInteractiveSwipeTarget(e.target)
		}
	}

	function onPanelsTouchEnd(e: TouchEvent) {
		if (!swipeStart || swipeStart.aborted) {
			swipeStart = null
			return
		}
		const t = e.changedTouches[0]
		const dx = t.clientX - swipeStart.x
		const dy = t.clientY - swipeStart.y
		swipeStart = null

		const absDx = Math.abs(dx)
		const absDy = Math.abs(dy)

		if (isHorizontal) {
			if (absDx < SWIPE_THRESHOLD_PX) return
			if (absDx < absDy * SWIPE_MIN_RATIO) return
			if (dx > 0) goToAdjacentTab(-1)
			else goToAdjacentTab(1)
		} else {
			if (absDy < SWIPE_THRESHOLD_PX) return
			if (absDy < absDx * SWIPE_MIN_RATIO) return
			if (dy > 0) goToAdjacentTab(-1)
			else goToAdjacentTab(1)
		}
	}

	function goToAdjacentTab(direction: 1 | -1) {
		if (orderedTabs.length === 0) return
		const currentIdx = orderedTabs.findIndex(t => t.id === activeId)
		if (currentIdx < 0) return
		for (let i = currentIdx + direction; i >= 0 && i < orderedTabs.length; i += direction) {
			if (!orderedTabs[i].disabled) {
				selectTab(orderedTabs[i].id)
				return
			}
		}
	}

	/*
	 * Menu-mode measurement. The shadow tablist holds every tab at its
	 * natural width in the same CSS layout, positioned off-screen with
	 * visibility: hidden so it takes no visible space but provides stable
	 * per-tab dimensions. We cumulative-sum those dimensions against the
	 * real tablist's clientWidth/clientHeight and fix `visibleCount` —
	 * when not everything fits, we also subtract the shadow `⋯` button's
	 * size so the real overflow button has somewhere to sit.
	 *
	 * Measuring in a shadow pass (not the real tablist) is what breaks
	 * the classic feedback loop where showing the overflow button would
	 * shrink the tablist, change the overflow condition, hide the
	 * button, restore the width, etc.
	 */
	function measureVisibleCount() {
		if (!tablistRef || !isMenuMode || !shadowTablistRef) return

		const shadowBtns = Array.from(
			shadowTablistRef.querySelectorAll<HTMLElement>("[data-shadow-tab-id]")
		)
		const shadowMoreBtn = shadowTablistRef.querySelector<HTMLElement>("[data-shadow-more]")

		if (shadowBtns.length === 0) {
			visibleCount = 0
			truncateLastTabSize = 0
			return
		}

		const containerSize = isHorizontal ? tablistRef.clientWidth : tablistRef.clientHeight
		const moreBtnSize = shadowMoreBtn
			? (isHorizontal ? shadowMoreBtn.offsetWidth : shadowMoreBtn.offsetHeight)
			: 40

		// First pass: does everything fit without the `⋯` button at all?
		let cumulative = 0
		let fitAll = true
		for (const btn of shadowBtns) {
			cumulative += isHorizontal ? btn.offsetWidth : btn.offsetHeight
			if (cumulative > containerSize) {
				fitAll = false
				break
			}
		}
		if (fitAll) {
			visibleCount = shadowBtns.length
			truncateLastTabSize = 0
			return
		}

		/*
		 * Second pass: reserve space for the `⋯` button, then walk tabs.
		 *  - Tab fully fits → include at full width
		 *  - Tab doesn't fit but remaining space >= MIN_TRUNCATED_TAB_SIZE
		 *    → include the tab as the last visible, capped to the remaining
		 *    space; CSS handles the label ellipsis
		 *  - Tab doesn't fit and too little remaining → push to overflow
		 *
		 * This keeps partially-fitting tabs visible (and interactable)
		 * instead of collapsing them into the `⋯` menu just because the
		 * prior tabs happened to be wide.
		 */
		const available = Math.max(0, containerSize - moreBtnSize)
		cumulative = 0
		let fit = 0
		let truncate = 0
		for (const btn of shadowBtns) {
			const size = isHorizontal ? btn.offsetWidth : btn.offsetHeight
			if (cumulative + size > available) {
				const remaining = available - cumulative
				if (remaining >= MIN_TRUNCATED_TAB_SIZE) {
					fit++
					truncate = remaining
				}
				break
			}
			cumulative += size
			fit++
		}
		// Always show at least one tab if any are registered, even if the
		// first tab alone is wider than available — the single tab gets
		// truncated to `available`.
		if (fit === 0 && shadowBtns.length > 0) {
			fit = 1
			truncate = available
		}
		visibleCount = fit
		truncateLastTabSize = truncate
	}

	// Re-measure on container size change, shadow size change, or tabs change.
	$effect(() => {
		if (!isMenuMode) {
			visibleCount = Number.POSITIVE_INFINITY
			return
		}
		if (!tablistRef || !shadowTablistRef) return

		const realList = tablistRef
		const shadowList = shadowTablistRef
		// Track orientation + tabs count as reactive deps so measurement
		// re-runs when orientation flips or tabs add/remove.
		void isHorizontal
		void orderedTabs.length

		const ro = new ResizeObserver(() => measureVisibleCount())
		ro.observe(realList)
		ro.observe(shadowList)
		requestAnimationFrame(() => measureVisibleCount())
		return () => ro.disconnect()
	})

	/*
	 * Swap UX: clicking a hidden overflow tab replaces the last-visible tab's
	 * position with the clicked tab, so the selection stays in the strip after
	 * it's activated. The displaced tab falls off into the overflow menu.
	 */
	function onOverflowTabClick(tabId: string) {
		const tab = orderedTabs.find(t => t.id === tabId)
		if (!tab || tab.disabled) return

		const currentOrder = displayOrder.length > 0
			? [...displayOrder]
			: orderedTabs.map(t => t.id)

		const selectedIdx = currentOrder.indexOf(tabId)
		const lastVisibleIdx = Math.max(0, Math.min(visibleCount - 1, currentOrder.length - 1))
		if (selectedIdx < 0 || selectedIdx === lastVisibleIdx) {
			activeId = tabId
			overflowOpen = false
			ontabchange?.({ tabId, data: tab.data })
			return
		}

		const next = [...currentOrder]
		;[next[selectedIdx], next[lastVisibleIdx]] = [next[lastVisibleIdx], next[selectedIdx]]
		displayOrder = next

		activeId = tabId
		overflowOpen = false
		ontabchange?.({ tabId, data: tab.data })
	}

	/*
	 * Programmatic activeId change can land on a tab that's currently in
	 * overflow — in that case the indicator has no target in the rendered
	 * strip. Auto-swap the activated overflow tab into the last-visible
	 * slot so the selection is always visible regardless of whether it
	 * was chosen via click or externally.
	 */
	$effect(() => {
		if (!isMenuMode || !activeId) return
		if (!Number.isFinite(visibleCount)) return
		const idx = orderedTabs.findIndex(t => t.id === activeId)
		if (idx < 0 || idx < visibleCount) return
		// Active tab is currently in overflow — swap into visible range.
		untrack(() => onOverflowTabClick(activeId!))
	})

	// Close the overflow menu on outside click / Escape / outside scroll.
	$effect(() => {
		if (!overflowOpen) return
		function onDocClick(e: MouseEvent) {
			const target = e.target as Node | null
			if (!target) return
			if (moreBtnRef?.contains(target)) return
			// The menu renders into a portal; we check by class attribute
			// rather than containment since the menu isn't a descendant of
			// Tabs in the DOM tree.
			const el = target as HTMLElement
			if (el.closest?.(".fluent-tabs-overflow-menu")) return
			overflowOpen = false
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") overflowOpen = false
		}
		/*
		 * Any scroll outside the menu closes it — scroll events don't
		 * bubble so the listener uses capture to catch scroll on any
		 * ancestor scroll container. Scrolls inside the menu itself are
		 * ignored so users can still scroll a long overflow list.
		 */
		function onScroll(e: Event) {
			const target = e.target as Node | null
			if (target instanceof HTMLElement && target.closest?.(".fluent-tabs-overflow-menu")) return
			overflowOpen = false
		}
		document.addEventListener("mousedown", onDocClick, true)
		document.addEventListener("keydown", onKey, true)
		document.addEventListener("scroll", onScroll, true)
		return () => {
			document.removeEventListener("mousedown", onDocClick, true)
			document.removeEventListener("keydown", onKey, true)
			document.removeEventListener("scroll", onScroll, true)
		}
	})

	// Warn once if legacy overflow prop is used — the feature was removed in the rewrite.
	$effect(() => {
		if (overflow.length > 0) {
			console.warn(
				"<Tabs overflow={...} /> is deprecated — the overflow dropdown was removed in the Svelte rewrite. " +
				"Render your own dropdown next to <Tabs> if you need one."
			)
		}
	})
</script>

<!--
 Hidden wrapper renders the consumer's Tab children so each Tab component's
 $effect fires and registers its data via setContext. Tab.svelte has no
 template of its own, so nothing visible is emitted — but we still gate it
 behind `hidden` + `aria-hidden` as a defensive measure in case consumers
 inline stray markup inside the snippet.
-->
<div hidden aria-hidden="true">
	{@render childContent?.()}
</div>

<div
	{id}
	class="fluent-tabs {className}"
	class:fluent-tabs-horizontal={isHorizontal}
	class:fluent-tabs-vertical={!isHorizontal}
	class:fluent-tabs-justify={justify}
	data-responsive={responsive}
	{style}
>
	<div class="fluent-tabs-strip" style={stripStyle}>
		{#if responsive === "scroll" && canScrollStart}
			<button
				type="button"
				class="fluent-tabs-scroll-btn fluent-tabs-scroll-btn-start"
				onclick={() => scrollArrow(-1)}
				aria-label={isHorizontal ? "Scroll tabs left" : "Scroll tabs up"}
				tabindex="-1"
			>
				{#if isHorizontal}
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M10.3 3.3a1 1 0 0 1 0 1.4L7 8l3.3 3.3a1 1 0 1 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0z"/>
					</svg>
				{:else}
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M3.3 10.3a1 1 0 0 0 1.4 0L8 7l3.3 3.3a1 1 0 1 0 1.4-1.4l-4-4a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4z"/>
					</svg>
				{/if}
			</button>
		{/if}

		<!--
			 svelte-ignore a11y_no_noninteractive_element_interactions
			 svelte-ignore a11y_interactive_supports_focus
		-->
		<div
			class="fluent-tabs-tablist"
			role="tablist"
			tabindex="-1"
			aria-orientation={orientation}
			bind:this={tablistRef}
			onkeydown={handleTabKeydown}
		>
			{#each renderedTabs as tab, i (tab.id)}
				{@const isLastAndTruncated = isMenuMode && truncateLastTabSize > 0 && i === renderedTabs.length - 1}
				<button
					type="button"
					role="tab"
					id={tab.id}
					class="fluent-tab {tab.class || ''}"
					class:active={tab.id === activeId}
					class:disabled={tab.disabled}
					class:truncated={isLastAndTruncated}
					style={`${tab.style || ''}${isLastAndTruncated ? `; max-width: ${truncateLastTabSize}px; ${isHorizontal ? '' : `max-height: ${truncateLastTabSize}px;`}` : ''}`}
					data-tab-id={tab.id}
					title={tab.label || undefined}
					aria-selected={tab.id === activeId}
					aria-controls={`${tab.id}-panel`}
					aria-label={tab.ariaLabel || undefined}
					aria-disabled={tab.disabled || undefined}
					disabled={tab.disabled}
					tabindex={tab.id === activeId ? 0 : -1}
					onclick={() => selectTab(tab.id)}
				>
					{#if tab.icon}
						<span class="fluent-tab-icon">{@render tab.icon()}</span>
					{/if}

					{#if tab.header}
						{@render tab.header()}
					{:else if tab.labelEditable}
						<span
							contenteditable="true"
							autocapitalize="off"
							spellcheck="false"
							class="fluent-tab-label editable-label"
							title="Click to edit this tab name"
						>{tab.label}</span>
					{:else if tab.label}
						<span class="fluent-tab-label">{tab.label}</span>
					{/if}

					{#if tab.showClose}
						<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
						<span
							class="fluent-tab-close"
							role="button"
							tabindex="-1"
							title="Close"
							aria-label="Close tab"
							onclick={(e) => handleCloseClick(tab, e)}
						>
							<svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
								<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
							</svg>
						</span>
					{/if}
				</button>
			{/each}

			{#if isMenuMode && overflowTabs.length > 0}
				<button
					type="button"
					bind:this={moreBtnRef}
					class="fluent-tab fluent-tabs-more-btn"
					class:active={overflowOpen}
					onclick={() => overflowOpen = !overflowOpen}
					aria-label="Show more tabs"
					aria-haspopup="menu"
					aria-expanded={overflowOpen}
				>
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M4.5 8a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm4.75 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12.75 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"/>
					</svg>
				</button>
			{/if}

			{#if showActiveIndicator}
				<div class="fluent-tabs-active-indicator" style={indicatorStyle}></div>
			{/if}
		</div>

		<!--
		 Shadow tablist (menu mode only). Renders every tab at its natural width
		 off-screen so `measureVisibleCount()` can read stable per-tab sizes
		 independent of what's currently displayed. Without this, hiding
		 overflowed tabs via the real tablist would flip the measurement
		 in a feedback loop.
		-->
		{#if isMenuMode}
			<div
				class="fluent-tabs-shadow-tablist"
				class:fluent-tabs-shadow-vertical={!isHorizontal}
				aria-hidden="true"
				bind:this={shadowTablistRef}
			>
				{#each orderedTabs as tab (tab.id)}
					<span class="fluent-tab fluent-tab-shadow" data-shadow-tab-id={tab.id}>
						{#if tab.icon}
							<span class="fluent-tab-icon">{@render tab.icon()}</span>
						{/if}
						{#if tab.header}
							{@render tab.header()}
						{:else if tab.label}
							<span class="fluent-tab-label">{tab.label}</span>
						{/if}
						{#if tab.showClose}
							<span class="fluent-tab-close">
								<svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true"></svg>
							</span>
						{/if}
					</span>
				{/each}
				<span class="fluent-tab fluent-tabs-more-btn fluent-tab-shadow" data-shadow-more>
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"></svg>
				</span>
			</div>
		{/if}

		{#if responsive === "scroll" && canScrollEnd}
			<button
				type="button"
				class="fluent-tabs-scroll-btn fluent-tabs-scroll-btn-end"
				onclick={() => scrollArrow(1)}
				aria-label={isHorizontal ? "Scroll tabs right" : "Scroll tabs down"}
				tabindex="-1"
			>
				{#if isHorizontal}
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M5.7 3.3a1 1 0 0 0 0 1.4L9 8l-3.3 3.3a1 1 0 1 0 1.4 1.4l4-4a1 1 0 0 0 0-1.4l-4-4a1 1 0 0 0-1.4 0z"/>
					</svg>
				{:else}
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M3.3 5.7a1 1 0 0 1 1.4 0L8 9l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"/>
					</svg>
				{/if}
			</button>
		{/if}
	</div>

	{#if isMenuMode && moreBtnRef}
		<PositioningRegion
			anchor={moreBtnRef}
			visible={overflowOpen && overflowTabs.length > 0}
			matchWidth={false}
			position={isHorizontal ? "bottom" : "right"}
		>
			<div class="fluent-tabs-overflow-menu context-menu">
				<fluent-menu>
					{#each overflowTabs as tab (tab.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
						<fluent-menu-item
							class={tab.disabled ? "disabled" : ""}
							role="menuitem"
							tabindex="-1"
							onclick={() => onOverflowTabClick(tab.id)}
						>
							{tab.label || tab.id}
						</fluent-menu-item>
					{/each}
				</fluent-menu>
			</div>
		</PositioningRegion>
	{/if}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fluent-tabs-panels"
		ontouchstart={swipe ? onPanelsTouchStart : undefined}
		ontouchend={swipe ? onPanelsTouchEnd : undefined}
		ontouchcancel={() => swipeStart = null}
	>
		{#each orderedTabs as tab (tab.id)}
			<div
				role="tabpanel"
				id={`${tab.id}-panel`}
				aria-labelledby={tab.id}
				class="fluent-tab-panel"
				class:active={tab.id === activeId}
				hidden={tab.id !== activeId}
			>
				{@render tab.content?.()}
				{@render tab.childContent?.()}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Host container — horizontal puts strip on top, vertical puts strip on left. */
	.fluent-tabs {
		display: flex;
		box-sizing: border-box;
		min-width: 0;
	}

	.fluent-tabs-horizontal {
		flex-direction: column;
	}

	.fluent-tabs-vertical {
		flex-direction: row;
	}

	/* Strip = scroll arrow + tablist + scroll arrow. */
	.fluent-tabs-strip {
		display: flex;
		position: relative;
		flex: none;
		min-width: 0;
		min-height: 0;
	}

	.fluent-tabs-horizontal .fluent-tabs-strip {
		flex-direction: row;
		align-items: stretch;
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, rgba(0, 0, 0, 0.1));
	}

	.fluent-tabs-vertical .fluent-tabs-strip {
		flex-direction: column;
		align-items: stretch;
		border-right: 1px solid var(--neutral-stroke-layer-rest, rgba(0, 0, 0, 0.1));
	}

	/* Tablist — holds tab buttons and the active indicator. */
	.fluent-tabs-tablist {
		display: flex;
		position: relative;
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
	}

	.fluent-tabs-horizontal .fluent-tabs-tablist {
		flex-direction: row;
	}

	.fluent-tabs-vertical .fluent-tabs-tablist {
		flex-direction: column;
	}

	/* --- responsive modes --- */

	.fluent-tabs-horizontal[data-responsive="scroll"] .fluent-tabs-tablist {
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
	}
	.fluent-tabs-horizontal[data-responsive="scroll"] .fluent-tabs-tablist::-webkit-scrollbar {
		display: none;
	}

	.fluent-tabs-vertical[data-responsive="scroll"] .fluent-tabs-tablist {
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
	}
	.fluent-tabs-vertical[data-responsive="scroll"] .fluent-tabs-tablist::-webkit-scrollbar {
		display: none;
	}

	.fluent-tabs[data-responsive="wrap"] .fluent-tabs-tablist {
		flex-wrap: wrap;
	}

	/*
	 * menu mode: tablist clips any overflow (should never actually overflow
	 * since visibleCount limits what we render, but belt-and-suspenders for
	 * any fractional-pixel slack during measurement). The overflow button
	 * is rendered INSIDE the tablist as a regular flex item so the active
	 * indicator and keyboard focus flow past it correctly.
	 */
	.fluent-tabs[data-responsive="menu"] .fluent-tabs-tablist {
		overflow: hidden;
	}

	/* Shadow tablist — off-screen copy used only for measurement. */
	.fluent-tabs-shadow-tablist {
		position: absolute;
		top: -9999px;
		left: -9999px;
		visibility: hidden;
		pointer-events: none;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
	}

	.fluent-tabs-shadow-vertical {
		flex-direction: column;
	}

	/* Overflow `⋯` button — styled like a tab so the strip looks uniform. */
	.fluent-tabs-more-btn {
		flex: none;
		padding: 0 calc((4 + (var(--design-unit, 4) * 2)) * 1px);
		cursor: pointer;
	}

	.fluent-tabs-more-btn.active {
		background-color: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.03));
	}

	/*
	 * Pin the real `⋯` button to the end of the strip via `auto` margin so
	 * its position doesn't shift with the last-visible tab's width. This
	 * works in flex because `margin-*-auto` absorbs free space; with the
	 * measurement already reserving `moreBtnSize`, there's always room for
	 * the button at the end. The shadow copy doesn't need the margin —
	 * `:not(.fluent-tab-shadow)` scopes the rule to the real button.
	 */
	.fluent-tabs-horizontal[data-responsive="menu"] .fluent-tabs-tablist > .fluent-tabs-more-btn:not(.fluent-tab-shadow) {
		margin-left: auto;
	}

	.fluent-tabs-vertical[data-responsive="menu"] .fluent-tabs-tablist > .fluent-tabs-more-btn:not(.fluent-tab-shadow) {
		margin-top: auto;
	}

	/*
	 * When the last visible tab has a `max-width` cap applied by the
	 * measurement pass, let its label collapse with an ellipsis instead
	 * of overflowing the tab box. Icon and close button stay intact.
	 */
	.fluent-tab.truncated {
		overflow: hidden;
	}

	.fluent-tab.truncated .fluent-tab-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex: 0 1 auto;
	}

	/*
	 * Vertical orientation: tabs stack, each takes the strip's cross-axis
	 * width. Always apply label ellipsis so a long label doesn't inflate
	 * the whole strip to match. `min-width: 0` + `flex: 0 1 auto` is what
	 * lets the label shrink below its natural size inside the flex tab
	 * container. Icon and close button (outside `.fluent-tab-label`) keep
	 * their natural widths.
	 */
	.fluent-tabs-vertical .fluent-tab {
		overflow: hidden;
	}

	.fluent-tabs-vertical .fluent-tab-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex: 0 1 auto;
	}

	/* Overflow menu — reuses the context-menu look from QuickGrid. */
	.fluent-tabs-overflow-menu {
		z-index: var(--fluent-z-popover, 1060);
	}

	.fluent-tabs-overflow-menu fluent-menu {
		min-width: 160px;
	}

	/* justify: stretch tabs to divide the row equally. */
	.fluent-tabs-justify .fluent-tab {
		flex: 1 1 0;
		min-width: 0;
	}

	/* --- tab button --- */
	.fluent-tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0 calc((6 + (var(--design-unit, 4) * 2)) * 1px);
		height: calc(((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) + (var(--design-unit, 4) * 2)) * 1px);
		min-height: 36px;
		box-sizing: border-box;
		background: transparent;
		border: 1px solid transparent;
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
		color: var(--neutral-foreground-rest);
		font-family: var(--body-font);
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		font-weight: 400;
		cursor: pointer;
		white-space: nowrap;
		flex-shrink: 0;
		user-select: none;
		position: relative;
		transition: color 0.15s ease, background-color 0.15s ease;
	}

	.fluent-tabs-vertical .fluent-tab {
		justify-content: flex-start;
		border-radius: calc(var(--control-corner-radius, 4) * 1px) 0 0 calc(var(--control-corner-radius, 4) * 1px);
	}

	.fluent-tab:hover:not(.disabled):not(:disabled) {
		color: var(--neutral-foreground-rest);
		background-color: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.03));
	}

	.fluent-tab.active {
		font-weight: 600;
		color: var(--accent-fill-rest, var(--neutral-foreground-rest));
	}

	.fluent-tab.disabled,
	.fluent-tab:disabled {
		cursor: not-allowed;
		color: var(--neutral-foreground-hint);
		opacity: 0.6;
	}

	.fluent-tab:focus-visible {
		outline: calc(var(--focus-stroke-width, 2) * 1px) solid var(--focus-stroke-outer);
		outline-offset: calc(var(--focus-stroke-width, 2) * -1px);
	}

	.fluent-tab-label {
		display: inline-block;
	}

	.fluent-tab-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	.fluent-tab-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 4px;
		color: var(--neutral-foreground-hint);
		cursor: pointer;
		margin-left: 4px;
	}

	.fluent-tab-close:hover {
		color: var(--neutral-foreground-rest);
		background-color: var(--neutral-fill-stealth-hover);
	}

	.editable-label {
		padding: 3px 5px;
		border-radius: 2px;
	}

	.editable-label:focus {
		outline: 1px solid var(--accent-fill-rest);
	}

	/*
	 * Animated active indicator — full tab width (horizontal) / height (vertical).
	 * Anchored to top: 0; left: 0 of the tablist; JS sets a `translate(x, y)`
	 * so the indicator tracks both axes. Two-axis translation is required
	 * for wrap mode, where the active tab may be on a later row/column;
	 * with a single-axis translate + static `bottom: 0`/`right: 0`, the
	 * indicator would pin to the last row's edge regardless of where the
	 * active tab actually is.
	 */
	.fluent-tabs-active-indicator {
		position: absolute;
		top: 0;
		left: 0;
		background-color: var(--accent-fill-rest);
		pointer-events: none;
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
		border-radius: 2px 2px 0 0;
	}

	.fluent-tabs-vertical .fluent-tabs-active-indicator {
		border-radius: 2px 0 0 2px;
	}

	/*
	 * Scroll arrow buttons — absolute-positioned over the strip edges so
	 * toggling their visibility does NOT change the tablist's client width.
	 *
	 * When scroll arrows are flex siblings of the tablist, showing an arrow
	 * shrinks the tablist by ~32px. At borderline widths (e.g. scrollWidth
	 * ≈ clientWidth + 32), this flips the overflow condition, which flips
	 * the arrow visibility, which flips the condition — oscillating forever
	 * as a reactive feedback loop. Overlaying them fixes the loop because
	 * the tablist's size is invariant to arrow visibility.
	 */
	.fluent-tabs-scroll-btn {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--neutral-layer-1, #fff) 85%, transparent);
		backdrop-filter: blur(4px);
		border: none;
		color: var(--neutral-foreground-rest);
		cursor: pointer;
		padding: 0;
		z-index: 2;
	}

	.fluent-tabs-horizontal .fluent-tabs-scroll-btn {
		top: 0;
		bottom: 0;
		width: 32px;
	}

	.fluent-tabs-horizontal .fluent-tabs-scroll-btn-start {
		left: 0;
	}

	.fluent-tabs-horizontal .fluent-tabs-scroll-btn-end {
		right: 0;
	}

	.fluent-tabs-vertical .fluent-tabs-scroll-btn {
		left: 0;
		right: 0;
		height: 32px;
	}

	.fluent-tabs-vertical .fluent-tabs-scroll-btn-start {
		top: 0;
	}

	.fluent-tabs-vertical .fluent-tabs-scroll-btn-end {
		bottom: 0;
	}

	.fluent-tabs-scroll-btn:hover {
		background: var(--neutral-fill-stealth-hover);
	}

	.fluent-tabs-scroll-btn:focus-visible {
		outline: calc(var(--focus-stroke-width, 2) * 1px) solid var(--focus-stroke-outer);
		outline-offset: calc(var(--focus-stroke-width, 2) * -1px);
	}

	/* Panels */
	.fluent-tabs-panels {
		flex: 1 1 auto;
		min-height: 0;
		min-width: 0;
	}

	.fluent-tab-panel {
		padding: 1rem 0;
	}

	.fluent-tabs-vertical .fluent-tab-panel {
		padding: 0 1rem;
	}
</style>
