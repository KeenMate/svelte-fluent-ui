<script module lang="ts">
	// Module-scoped counter for auto-generated self-container names (used when a
	// Grid has per-Grid `containerBreakpoints` but no explicit `containerId`).
	// SSR and client walk the tree in the same order, so ids stay hydration-stable.
	let containerSeq = 0
</script>

<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {onMount, onDestroy} from "svelte"
	import {setContext} from "svelte"
	import {getEffectiveBreakpoints, type GridBreakpoints} from "./containerQueries.js"

	type JustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
	type GridItemSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

	type Props = {
		children?: SlotType
		spacing?: number
		justify?: JustifyContent
		adaptiveRendering?: boolean
		// Opt into container-query sizing: child GridItem xs/sm/md/… breakpoints
		// resolve against a container's width instead of the viewport. When
		// `containerId` is omitted the Grid marks itself as the query container
		// (children size against the Grid). When set, children size against the
		// nearest ancestor declaring `container-name: <containerId>` instead.
		container?: boolean
		containerId?: string
		// Per-Grid breakpoint override (px). Falls back to the app-wide config
		// (configureGridBreakpoints / --fluent-grid-breakpoint-* vars) and then the
		// built-in defaults. Only meaningful with `container`.
		containerBreakpoints?: Partial<GridBreakpoints>
		// When set, switches from 12-column flex mode to CSS grid mode:
		// `repeat(columns, 1fr)` tracks with a fixed `gap`. Children no longer
		// need xs/sm/md breakpoint props; each cell is an equal column.
		columns?: number
		gap?: string
		onBreakpointEnter?: (size: GridItemSize) => void
		class?: string
		style?: string
	}

	let {
		children = undefined,
		spacing = 3,
		justify = "flex-start",
		adaptiveRendering = false,
		container = false,
		containerId = undefined,
		containerBreakpoints = undefined,
		columns = undefined,
		gap = undefined,
		onBreakpointEnter = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	let gridElement: HTMLDivElement | undefined = $state()
	let currentSize: GridItemSize | undefined = $state()

	const hasCustomBreakpoints = $derived(containerBreakpoints != null && Object.keys(containerBreakpoints).length > 0)

	// A self-container with per-Grid breakpoints must be *named* so its custom
	// `@container` rules target only this Grid (assigned once, hydration-stable).
	const generatedName = `fluent-grid-cb-${++containerSeq}`

	// The container name children put in `data-cq`:
	//  ""            → default self-container (static/global CSS)
	//  containerId   → external ancestor named container
	//  generatedName → this Grid, with per-Grid breakpoints
	const cqName = $derived(!container ? undefined : containerId ?? (hasCustomBreakpoints ? generatedName : ""))
	// Whether the Grid itself is the query container (vs an external ancestor).
	const selfContainer = $derived(container && containerId == null)
	const effectiveBreakpoints = $derived(getEffectiveBreakpoints(containerBreakpoints))

	// Set context for child GridItem components
	setContext("grid", {
		get currentSize() {
			return currentSize
		},
		get adaptiveRendering() {
			return adaptiveRendering
		},
		get container() {
			return container
		},
		// Effective container name for children's data-cq (may be "" / generated).
		get cqName() {
			return cqName
		},
		// True only for a user-supplied external containerId (drives the dev warn).
		get external() {
			return container && containerId != null
		},
		get breakpoints() {
			return effectiveBreakpoints
		},
		get explicitBreakpoints() {
			return hasCustomBreakpoints
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

<div class="grid-container {className}" style="{style}" >
	<div
		bind:this={gridElement}
		class="fluent-grid"
		class:columns-mode={columns != null}
		style:container-type={selfContainer ? "inline-size" : null}
		style:container-name={selfContainer && hasCustomBreakpoints ? generatedName : null}
		style:grid-template-columns={columns != null ? `repeat(${columns}, minmax(0, 1fr))` : null}
		style:gap={columns != null ? (gap ?? "1rem") : null}
		style:justify-content={columns != null ? null : justify}
		data-spacing={columns != null ? null : spacing}
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

	/* CSS grid mode — activated by the `columns` prop. Cells are sized by
	   `grid-template-columns`, so flex-basis/max-width rules on children are
	   inert here and can't steal space based on content width. */
	.fluent-grid.columns-mode {
		display: grid;
		margin: 0;
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
