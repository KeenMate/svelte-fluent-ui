<script lang="ts">
	import { onMount, tick } from 'svelte'
	import type {SlotType} from "../types/index.js"

	type Props = {
		anchor?: HTMLElement
		visible?: boolean
		style?: string
		title?: string
		children?: SlotType
	}

	let {
		anchor = undefined,
		visible = false,
		style = '',
		title = undefined,
		children = undefined
	}: Props = $props()

	// svelte-ignore non_reactive_update
	let overlayElement: HTMLDivElement | undefined = undefined
	let position = $state({ top: 0, left: 0, width: 0 })
	let wasVisible = $state(false)

	// Update position - synchronous calculation
	function updatePosition() {
		if (!anchor || !overlayElement || !visible) return

		const anchorRect = anchor.getBoundingClientRect()
		const overlayRect = overlayElement.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		// Position below the anchor by default
		// Using viewport-relative coordinates (no scroll offsets needed for fixed positioning)
		let top = anchorRect.bottom
		const left = anchorRect.left
		const width = anchorRect.width

		// If dropdown would go off bottom of viewport, position above instead
		if (anchorRect.bottom + overlayRect.height > viewportHeight) {
			top = anchorRect.top - overlayRect.height
		}

		position = { top, left, width }
	}

	// Only update position when dropdown opens (visible becomes true), not on every re-render
	$effect(() => {
		if (visible && anchor && !wasVisible) {
			// Use tick to ensure element is mounted before calculating position
			tick().then(() => updatePosition())
		}
		wasVisible = visible
	})

	onMount(() => {
		if (visible && anchor) {
			updatePosition()
		}
	})
</script>

{#if anchor}
	<!-- Positioned overlay mode (for dropdowns, tooltips) -->
	{#if visible}
		<div
			bind:this={overlayElement}
			class="positioning-region"
			{title}
			style="
				position: fixed;
				top: {position.top}px;
				left: {position.left}px;
				width: {position.width}px;
				{style}
			"
		>
			{@render children?.()}
		</div>
	{/if}
{:else}
	<!-- Static wrapper mode (for NavLink, etc.) - always render -->
	<div
		class="positioning-region"
		{title}
		style={style}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.positioning-region {
		z-index: 1000;
	}
</style>
