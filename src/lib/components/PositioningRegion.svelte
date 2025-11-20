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

	let overlayElement: HTMLDivElement | undefined = undefined
	let position = $state({ top: 0, left: 0, width: 0 })

	// Update position when anchor or visibility changes
	async function updatePosition() {
		if (!anchor || !overlayElement || !visible) return

		await tick()

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

	$effect(() => {
		if (visible && anchor) {
			updatePosition()
		}
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
				min-width: {position.width}px;
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
