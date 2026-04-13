<script lang="ts">
	import type { SlotType } from "../types/index.js";
	import { onMount, onDestroy } from "svelte";
	import {portal} from "../actions/portal.js";

	type Position = "top" | "bottom" | "left" | "right";

	type Props = {
		class?: string;
		style?: string;
		/** Forces the tooltip to be visible (default: shows on hover) */
		visible?: boolean;
		/** The HTML ID of the element the tooltip is positioned relative to */
		anchor?: string;
		/** Delay in milliseconds before showing tooltip after hover (default: 250) */
		delay?: number;
		/** Position relative to anchor element */
		position?: Position;
		/** Tooltip content */
		children?: SlotType;
		/** Maximum width for wrapping long content */
		maxWidth?: string;
	};

	let {
		class: className = "",
		style = "",
		visible = undefined,
		anchor = undefined,
		delay = 250,
		position = "top",
		children = undefined,
		maxWidth = undefined
	}: Props = $props();

	const GAP = 8;
	const VIEWPORT_PADDING = 8;

	let tooltipElement: HTMLDivElement | undefined = $state();
	let isVisible = $state(false);
	let isRendered = $state(false);
	let tooltipPosition = $state({ top: 0, left: 0 });
	let actualPosition = $state<Position>(position);
	let arrowOffset = $state<number | null>(null);
	let anchorInView = $state(true);
	let showDelayTimer: ReturnType<typeof setTimeout> | null = null;
	let hideDelayTimer: ReturnType<typeof setTimeout> | null = null;

	// Computed visibility - controls the fade animation
	const shouldShow = $derived(visible === true || (visible === undefined && isVisible));

	function getAnchorElement(): HTMLElement | null {
		return anchor ? document.getElementById(anchor) : null;
	}

	function getOppositePosition(pos: Position): Position {
		const opposites: Record<Position, Position> = {
			top: "bottom",
			bottom: "top",
			left: "right",
			right: "left"
		};
		return opposites[pos];
	}

	/**
	 * Calculate overflow for a given placement.
	 * Positive value = overflow (doesn't fit)
	 * Negative value = available space
	 */
	function getOverflowForPlacement(
		anchorRect: DOMRect,
		tooltipWidth: number,
		tooltipHeight: number,
		placement: Position
	): number {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		switch (placement) {
			case "top":
				// Check if tooltip would go above viewport
				return VIEWPORT_PADDING - (anchorRect.top - tooltipHeight - GAP);
			case "bottom":
				// Check if tooltip would go below viewport
				return (anchorRect.bottom + GAP + tooltipHeight) - (viewportHeight - VIEWPORT_PADDING);
			case "left":
				// Check if tooltip would go left of viewport
				return VIEWPORT_PADDING - (anchorRect.left - tooltipWidth - GAP);
			case "right":
				// Check if tooltip would go right of viewport
				return (anchorRect.right + GAP + tooltipWidth) - (viewportWidth - VIEWPORT_PADDING);
			default:
				return 0;
		}
	}

	/**
	 * Determine the best placement using Floating UI-style flip logic.
	 * Priority: preferred → opposite → whichever has most space
	 */
	function getBestPlacement(
		anchorRect: DOMRect,
		tooltipWidth: number,
		tooltipHeight: number,
		preferred: Position
	): Position {
		const preferredOverflow = getOverflowForPlacement(anchorRect, tooltipWidth, tooltipHeight, preferred);

		// If preferred placement fits, use it
		if (preferredOverflow <= 0) {
			return preferred;
		}

		// Try opposite placement
		const opposite = getOppositePosition(preferred);
		const oppositeOverflow = getOverflowForPlacement(anchorRect, tooltipWidth, tooltipHeight, opposite);

		// If opposite fits, use it
		if (oppositeOverflow <= 0) {
			return opposite;
		}

		// Neither fits perfectly - pick the one with less overflow (more space)
		return preferredOverflow <= oppositeOverflow ? preferred : opposite;
	}

	/**
	 * Get raw coordinates for a placement (before shift/clamping)
	 */
	function getCoordinatesForPlacement(
		anchorRect: DOMRect,
		tooltipWidth: number,
		tooltipHeight: number,
		placement: Position
	): { top: number; left: number } {
		switch (placement) {
			case "top":
				return {
					top: anchorRect.top - tooltipHeight - GAP,
					left: anchorRect.left + (anchorRect.width - tooltipWidth) / 2
				};
			case "bottom":
				return {
					top: anchorRect.bottom + GAP,
					left: anchorRect.left + (anchorRect.width - tooltipWidth) / 2
				};
			case "left":
				return {
					top: anchorRect.top + (anchorRect.height - tooltipHeight) / 2,
					left: anchorRect.left - tooltipWidth - GAP
				};
			case "right":
				return {
					top: anchorRect.top + (anchorRect.height - tooltipHeight) / 2,
					left: anchorRect.right + GAP
				};
		}
	}

	/**
	 * Check if anchor element is at least partially visible in viewport
	 */
	function isAnchorVisible(anchorRect: DOMRect): boolean {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		return (
			anchorRect.bottom > 0 &&
			anchorRect.top < viewportHeight &&
			anchorRect.right > 0 &&
			anchorRect.left < viewportWidth
		);
	}

	function calculatePosition() {
		const anchorEl = getAnchorElement();
		if (!anchorEl || !tooltipElement) return;

		const anchorRect = anchorEl.getBoundingClientRect();

		// Check if anchor is visible - hide tooltip if not
		anchorInView = isAnchorVisible(anchorRect);
		if (!anchorInView) return;

		const tooltipRect = tooltipElement.getBoundingClientRect();
		const tooltipWidth = tooltipRect.width;
		const tooltipHeight = tooltipRect.height;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Phase 1: FLIP - determine best placement
		actualPosition = getBestPlacement(anchorRect, tooltipWidth, tooltipHeight, position);

		// Phase 2: Get coordinates for chosen placement
		let { top, left } = getCoordinatesForPlacement(anchorRect, tooltipWidth, tooltipHeight, actualPosition);

		// Phase 3: SHIFT - clamp to viewport and track arrow offset
		let newArrowOffset: number | null = null;

		if (actualPosition === "top" || actualPosition === "bottom") {
			const originalLeft = left;
			left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - tooltipWidth - VIEWPORT_PADDING));

			// Calculate arrow offset if tooltip was shifted
			const shift = originalLeft - left;
			if (Math.abs(shift) > 1) {
				const anchorCenter = anchorRect.left + anchorRect.width / 2;
				newArrowOffset = anchorCenter - left;
				const arrowPadding = 12;
				newArrowOffset = Math.max(arrowPadding, Math.min(newArrowOffset, tooltipWidth - arrowPadding));
			}
		}

		if (actualPosition === "left" || actualPosition === "right") {
			const originalTop = top;
			top = Math.max(VIEWPORT_PADDING, Math.min(top, viewportHeight - tooltipHeight - VIEWPORT_PADDING));

			// Calculate arrow offset if tooltip was shifted
			const shift = originalTop - top;
			if (Math.abs(shift) > 1) {
				const anchorCenter = anchorRect.top + anchorRect.height / 2;
				newArrowOffset = anchorCenter - top;
				const arrowPadding = 12;
				newArrowOffset = Math.max(arrowPadding, Math.min(newArrowOffset, tooltipHeight - arrowPadding));
			}
		}

		// Final clamp for edge cases
		top = Math.max(VIEWPORT_PADDING, Math.min(top, viewportHeight - tooltipHeight - VIEWPORT_PADDING));
		left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - tooltipWidth - VIEWPORT_PADDING));

		tooltipPosition = { top, left };
		arrowOffset = newArrowOffset;
	}

	function show() {
		isRendered = true;
		// Wait for DOM to render, then calculate position and show
		requestAnimationFrame(() => {
			calculatePosition();
			isVisible = true;
		});
	}

	function hide() {
		isVisible = false;
	}

	function startShowDelay() {
		clearHideDelay();
		if (isVisible) return;

		if (delay > 0) {
			showDelayTimer = setTimeout(show, delay);
		} else {
			show();
		}
	}

	function startHideDelay() {
		clearShowDelay();
		hideDelayTimer = setTimeout(hide, 100);
	}

	function clearShowDelay() {
		if (showDelayTimer) {
			clearTimeout(showDelayTimer);
			showDelayTimer = null;
		}
	}

	function clearHideDelay() {
		if (hideDelayTimer) {
			clearTimeout(hideDelayTimer);
			hideDelayTimer = null;
		}
	}

	function handleAnchorMouseEnter() {
		if (visible === undefined) {
			startShowDelay();
		}
	}

	function handleAnchorMouseLeave() {
		if (visible === undefined) {
			startHideDelay();
		}
	}

	function handleTooltipMouseEnter() {
		clearHideDelay();
	}

	function handleTooltipMouseLeave() {
		if (visible === undefined) {
			startHideDelay();
		}
	}

	function handleTransitionEnd() {
		// Remove from DOM after fade out completes
		if (!isVisible && !shouldShow) {
			isRendered = false;
		}
	}

	function handleScrollOrResize() {
		if (shouldShow && tooltipElement) {
			calculatePosition();
		}
	}

	onMount(() => {
		const anchorEl = getAnchorElement();
		if (anchorEl) {
			anchorEl.addEventListener("mouseenter", handleAnchorMouseEnter);
			anchorEl.addEventListener("mouseleave", handleAnchorMouseLeave);
			anchorEl.addEventListener("focusin", handleAnchorMouseEnter);
			anchorEl.addEventListener("focusout", handleAnchorMouseLeave);
		}

		// Add scroll/resize listeners for position updates
		window.addEventListener("scroll", handleScrollOrResize, true);
		window.addEventListener("resize", handleScrollOrResize);

		// If visible is true, render and show immediately
		if (visible === true) {
			isRendered = true;
			requestAnimationFrame(() => {
				calculatePosition();
				isVisible = true;
			});
		}
	});

	onDestroy(() => {
		clearShowDelay();
		clearHideDelay();

		window.removeEventListener("scroll", handleScrollOrResize, true);
		window.removeEventListener("resize", handleScrollOrResize);

		const anchorEl = getAnchorElement();
		if (anchorEl) {
			anchorEl.removeEventListener("mouseenter", handleAnchorMouseEnter);
			anchorEl.removeEventListener("mouseleave", handleAnchorMouseLeave);
			anchorEl.removeEventListener("focusin", handleAnchorMouseEnter);
			anchorEl.removeEventListener("focusout", handleAnchorMouseLeave);
		}
	});

	// Recalculate position when forced visibility changes
	$effect(() => {
		if (visible === true && tooltipElement) {
			requestAnimationFrame(calculatePosition);
		}
	});
</script>

{#if isRendered || shouldShow}
	<div
		use:portal
		bind:this={tooltipElement}
		class="fluent-tooltip {actualPosition} {className}"
		class:visible={shouldShow && anchorInView}
		class:has-max-width={maxWidth}
		style:top="{tooltipPosition.top}px"
		style:left="{tooltipPosition.left}px"
		style:max-width={maxWidth}
		style:--arrow-offset={arrowOffset !== null ? `${arrowOffset}px` : undefined}
		style={style}
		role="tooltip"
		onmouseenter={handleTooltipMouseEnter}
		onmouseleave={handleTooltipMouseLeave}
		ontransitionend={handleTransitionEnd}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}

<style>
	.fluent-tooltip {
		position: fixed;
		z-index: var(--fluent-z-tooltip);
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
		box-shadow: var(--elevation-shadow-tooltip, 0 0 2px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.14));
		pointer-events: auto;

		/* Animation */
		opacity: 0;
		transform: scale(0.95);
		transition: opacity 0.1s ease-out, transform 0.1s ease-out;
	}

	.fluent-tooltip.visible {
		opacity: 1;
		transform: scale(1);
	}

	.fluent-tooltip.has-max-width {
		white-space: normal;
		word-wrap: break-word;
	}

	/* Arrow base styling */
	.fluent-tooltip::before {
		content: "";
		position: absolute;
		width: 8.5px;
		height: 8.5px;
		background: var(--neutral-layer-floating, #ffffff);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 0 0 2px 0;
	}

	/* Arrow positions */
	.fluent-tooltip.top::before {
		bottom: -5px;
		left: var(--arrow-offset, 50%);
		transform: translateX(-50%) rotate(45deg);
		border-top: none;
		border-left: none;
	}

	.fluent-tooltip.bottom::before {
		top: -5px;
		left: var(--arrow-offset, 50%);
		transform: translateX(-50%) rotate(-135deg);
		border-top: none;
		border-left: none;
	}

	.fluent-tooltip.left::before {
		right: -5px;
		top: var(--arrow-offset, 50%);
		transform: translateY(-50%) rotate(-45deg);
		border-top: none;
		border-left: none;
	}

	.fluent-tooltip.right::before {
		left: -5px;
		top: var(--arrow-offset, 50%);
		transform: translateY(-50%) rotate(135deg);
		border-top: none;
		border-left: none;
	}
</style>
