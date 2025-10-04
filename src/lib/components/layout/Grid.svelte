<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {onMount, onDestroy} from "svelte"
	import {setContext} from "svelte"

	type JustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
	type GridItemSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

	type Props = {
		children?: SlotType
		spacing?: number
		justify?: JustifyContent
		adaptiveRendering?: boolean
		onBreakpointEnter?: (size: GridItemSize) => void
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		spacing = 3,
		justify = "flex-start",
		adaptiveRendering = false,
		onBreakpointEnter = undefined,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let gridElement: HTMLDivElement | undefined = $state()
	let currentSize: GridItemSize | undefined = $state()

	// Set context for child GridItem components
	setContext("grid", {
		get currentSize() {
			return currentSize
		},
		get adaptiveRendering() {
			return adaptiveRendering
		}
	})

	function updateBreakpoint() {
		if (!gridElement) return

		const width = gridElement.offsetWidth
		let newSize: GridItemSize

		if (width < 600) newSize = "xs"
		else if (width < 960) newSize = "sm"
		else if (width < 1280) newSize = "md"
		else if (width < 1920) newSize = "lg"
		else if (width < 2560) newSize = "xl"
		else newSize = "xxl"

		if (newSize !== currentSize) {
			currentSize = newSize
			onBreakpointEnter?.(newSize)
		}
	}

	onMount(() => {
		if (onBreakpointEnter) {
			updateBreakpoint()
			const resizeObserver = new ResizeObserver(updateBreakpoint)
			if (gridElement) resizeObserver.observe(gridElement)

			return () => {
				resizeObserver.disconnect()
			}
		}
	})
</script>

<div class="grid-container {className}" style="{style}" {...restProps}>
	<div
		bind:this={gridElement}
		class="fluent-grid"
		style:justify-content={justify}
		data-spacing={spacing}
	>
		{@render children?.()}
	</div>
</div>

<style>
	.fluent-grid {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	/* Spacing variations */
	.fluent-grid[data-spacing="1"] {
		width: calc(100% + 8px);
		margin: -4px;
	}

	.fluent-grid[data-spacing="1"] :global(> *) {
		padding: 4px;
	}

	.fluent-grid[data-spacing="2"] {
		width: calc(100% + 16px);
		margin: -8px;
	}

	.fluent-grid[data-spacing="2"] :global(> *) {
		padding: 8px;
	}

	.fluent-grid[data-spacing="3"] {
		width: calc(100% + 24px);
		margin: -12px;
	}

	.fluent-grid[data-spacing="3"] :global(> *) {
		padding: 12px;
	}

	.fluent-grid[data-spacing="4"] {
		width: calc(100% + 32px);
		margin: -16px;
	}

	.fluent-grid[data-spacing="4"] :global(> *) {
		padding: 16px;
	}

	.fluent-grid[data-spacing="5"] {
		width: calc(100% + 40px);
		margin: -20px;
	}

	.fluent-grid[data-spacing="5"] :global(> *) {
		padding: 20px;
	}

	.fluent-grid[data-spacing="6"] {
		width: calc(100% + 48px);
		margin: -24px;
	}

	.fluent-grid[data-spacing="6"] :global(> *) {
		padding: 24px;
	}

	.fluent-grid[data-spacing="7"] {
		width: calc(100% + 56px);
		margin: -28px;
	}

	.fluent-grid[data-spacing="7"] :global(> *) {
		padding: 28px;
	}

	.fluent-grid[data-spacing="8"] {
		width: calc(100% + 64px);
		margin: -32px;
	}

	.fluent-grid[data-spacing="8"] :global(> *) {
		padding: 32px;
	}

	.fluent-grid[data-spacing="9"] {
		width: calc(100% + 72px);
		margin: -36px;
	}

	.fluent-grid[data-spacing="9"] :global(> *) {
		padding: 36px;
	}

	.fluent-grid[data-spacing="10"] {
		width: calc(100% + 80px);
		margin: -40px;
	}

	.fluent-grid[data-spacing="10"] :global(> *) {
		padding: 40px;
	}
</style>
