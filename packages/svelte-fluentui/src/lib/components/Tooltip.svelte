<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {onMount, onDestroy, untrack} from "svelte"
	import {portal} from "../actions/portal.js"
	import {
		computePosition,
		flip,
		shift,
		offset,
		arrow,
		hide,
		autoUpdate,
		type Placement
	} from "@floating-ui/dom"

	type Position = "top" | "bottom" | "left" | "right"

	type Props = {
		class?: string
		style?: string
		/** Forces visibility (default: shows on hover). */
		visible?: boolean
		/** HTML id of the element the tooltip is positioned relative to. */
		anchor?: string
		/** Delay before showing on hover (default 250ms). */
		delay?: number
		/** Preferred placement; flips to opposite if no room. */
		position?: Position
		children?: SlotType
		/** Max width for wrapping long content. */
		maxWidth?: string
	}

	let {
		class: className = "",
		style = "",
		visible = undefined,
		anchor = undefined,
		delay = 250,
		position = "top",
		children = undefined,
		maxWidth = undefined
	}: Props = $props()

	const GAP = 8

	let tooltipElement: HTMLDivElement | undefined = $state()
	let arrowElement: HTMLDivElement | undefined = $state()
	let isVisible = $state(false)
	let isRendered = $state(false)
	let actualPlacement = $state<Placement>(untrack(() => position) as Placement)
	let referenceHidden = $state(false)
	let showDelayTimer: ReturnType<typeof setTimeout> | null = null
	let hideDelayTimer: ReturnType<typeof setTimeout> | null = null
	let cleanupAutoUpdate: (() => void) | null = null

	const shouldShow = $derived(visible === true || (visible === undefined && isVisible))

	function getAnchorElement(): HTMLElement | null {
		return anchor ? document.getElementById(anchor) : null
	}

	async function updatePosition() {
		const anchorEl = getAnchorElement()
		if (!anchorEl || !tooltipElement) return

		const middleware = [
			offset(GAP),
			flip(),
			shift({padding: 8}),
			hide()
		]
		if (arrowElement) {
			middleware.push(arrow({element: arrowElement, padding: 4}))
		}

		const result = await computePosition(anchorEl, tooltipElement, {
			placement: position as Placement,
			strategy: "fixed",
			middleware
		})

		tooltipElement.style.left = `${result.x}px`
		tooltipElement.style.top = `${result.y}px`
		actualPlacement = result.placement
		referenceHidden = result.middlewareData.hide?.referenceHidden ?? false

		const arrowData = result.middlewareData.arrow
		if (arrowElement && arrowData) {
			const side = result.placement.split("-")[0] as Position
			const staticSideMap: Record<Position, string> = {
				top: "bottom",
				bottom: "top",
				left: "right",
				right: "left"
			}
			const staticSide = staticSideMap[side]
			Object.assign(arrowElement.style, {
				left: arrowData.x != null ? `${arrowData.x}px` : "",
				top: arrowData.y != null ? `${arrowData.y}px` : "",
				right: "",
				bottom: "",
				[staticSide]: "-5px"
			})
		}
	}

	function startAutoUpdate() {
		const anchorEl = getAnchorElement()
		if (!anchorEl || !tooltipElement) return
		stopAutoUpdate()
		cleanupAutoUpdate = autoUpdate(anchorEl, tooltipElement, updatePosition)
	}

	function stopAutoUpdate() {
		cleanupAutoUpdate?.()
		cleanupAutoUpdate = null
	}

	function show() {
		isRendered = true
		// Wait for DOM, then position and reveal
		requestAnimationFrame(() => {
			startAutoUpdate()
			isVisible = true
		})
	}

	function hideFn() {
		isVisible = false
	}

	function startShowDelay() {
		clearHideDelay()
		if (isVisible) return
		if (delay > 0) {
			showDelayTimer = setTimeout(show, delay)
		} else {
			show()
		}
	}

	function startHideDelay() {
		clearShowDelay()
		hideDelayTimer = setTimeout(hideFn, 100)
	}

	function clearShowDelay() {
		if (showDelayTimer) {
			clearTimeout(showDelayTimer)
			showDelayTimer = null
		}
	}

	function clearHideDelay() {
		if (hideDelayTimer) {
			clearTimeout(hideDelayTimer)
			hideDelayTimer = null
		}
	}

	function handleAnchorMouseEnter() {
		if (visible === undefined) startShowDelay()
	}
	function handleAnchorMouseLeave() {
		if (visible === undefined) startHideDelay()
	}
	function handleTooltipMouseEnter() {
		clearHideDelay()
	}
	function handleTooltipMouseLeave() {
		if (visible === undefined) startHideDelay()
	}
	function handleTransitionEnd() {
		if (!isVisible && !shouldShow) {
			isRendered = false
			stopAutoUpdate()
		}
	}

	onMount(() => {
		const anchorEl = getAnchorElement()
		if (anchorEl) {
			anchorEl.addEventListener("mouseenter", handleAnchorMouseEnter)
			anchorEl.addEventListener("mouseleave", handleAnchorMouseLeave)
			anchorEl.addEventListener("focusin", handleAnchorMouseEnter)
			anchorEl.addEventListener("focusout", handleAnchorMouseLeave)
		}
		if (visible === true) {
			isRendered = true
			requestAnimationFrame(() => {
				startAutoUpdate()
				isVisible = true
			})
		}
	})

	onDestroy(() => {
		clearShowDelay()
		clearHideDelay()
		stopAutoUpdate()
		const anchorEl = getAnchorElement()
		if (anchorEl) {
			anchorEl.removeEventListener("mouseenter", handleAnchorMouseEnter)
			anchorEl.removeEventListener("mouseleave", handleAnchorMouseLeave)
			anchorEl.removeEventListener("focusin", handleAnchorMouseEnter)
			anchorEl.removeEventListener("focusout", handleAnchorMouseLeave)
		}
	})

	$effect(() => {
		if (visible === true && tooltipElement && !cleanupAutoUpdate) {
			startAutoUpdate()
		}
	})

	const placementSide = $derived(actualPlacement.split("-")[0])
</script>

{#if isRendered || shouldShow}
	<div
		use:portal
		bind:this={tooltipElement}
		class="fluent-tooltip {placementSide} {className}"
		class:visible={shouldShow && !referenceHidden}
		class:has-max-width={maxWidth}
		style:max-width={maxWidth}
		style={style}
		role="tooltip"
		onmouseenter={handleTooltipMouseEnter}
		onmouseleave={handleTooltipMouseLeave}
		ontransitionend={handleTransitionEnd}
	>
		{#if children}
			{@render children()}
		{/if}
		<div class="fluent-tooltip-arrow" bind:this={arrowElement} aria-hidden="true"></div>
	</div>
{/if}

<style>
	.fluent-tooltip {
		position: fixed;
		top: 0;
		left: 0;
		z-index: var(--fluent-z-tooltip, 1070);
		box-sizing: border-box;
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-floating, #ffffff);
		color: var(--neutral-foreground-rest, #242424);
		padding: 4px 11px 6px 11px;
		font-family: var(--body-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		white-space: nowrap;
		box-shadow: var(
			--elevation-shadow-tooltip,
			0 0 2px rgba(0, 0, 0, 0.12),
			0 8px 16px rgba(0, 0, 0, 0.14)
		);
		pointer-events: auto;
		opacity: 0;
		transform: scale(0.95);
		transition:
			opacity 0.1s ease-out,
			transform 0.1s ease-out;
	}

	.fluent-tooltip.visible {
		opacity: 1;
		transform: scale(1);
	}

	.fluent-tooltip.has-max-width {
		white-space: normal;
		word-wrap: break-word;
	}

	/* Arrow rendered as a rotated square. Floating UI's `arrow` middleware
	 * sets the in-axis offset (left/top); the perpendicular axis is anchored
	 * to the side of the tooltip via the `staticSide` property assigned in
	 * updatePosition() (e.g. bottom: -5px on a top-placed tooltip). */
	.fluent-tooltip-arrow {
		position: absolute;
		width: 8.5px;
		height: 8.5px;
		background: var(--neutral-layer-floating, #ffffff);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		transform: rotate(45deg);
	}

	/* Hide the borders on the two sides facing into the tooltip body so the
	 * arrow looks like a triangle pointing outward, not a diamond. */
	.fluent-tooltip.top .fluent-tooltip-arrow {
		border-top: none;
		border-left: none;
	}
	.fluent-tooltip.bottom .fluent-tooltip-arrow {
		border-bottom: none;
		border-right: none;
	}
	.fluent-tooltip.left .fluent-tooltip-arrow {
		border-left: none;
		border-bottom: none;
	}
	.fluent-tooltip.right .fluent-tooltip-arrow {
		border-right: none;
		border-top: none;
	}
</style>
