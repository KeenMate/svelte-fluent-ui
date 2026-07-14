<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {getContext, onMount} from "svelte"
	import {
		acquireContainer,
		DEFAULT_GRID_BREAKPOINTS,
		ensureAutoConfigured,
		warnIfContainerMissing,
		type GridBreakpoints
	} from "./containerQueries.js"

	type JustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
	type GridItemHidden = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xs-up" | "sm-up" | "md-up" | "lg-up" | "xl-up" | "xxl-up" | "xs-down" | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down"

	type Props = {
		children?: SlotType
		xs?: number
		sm?: number
		md?: number
		lg?: number
		xl?: number
		xxl?: number
		justify?: JustifyContent
		gap?: string
		adaptiveRendering?: boolean
		hiddenWhen?: GridItemHidden
		class?: string
		style?: string
	}

	let {
		children = undefined,
		xs = undefined,
		sm = undefined,
		md = undefined,
		lg = undefined,
		xl = undefined,
		xxl = undefined,
		justify = undefined,
		gap = undefined,
		adaptiveRendering = undefined,
		hiddenWhen = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	const grid = getContext<{
		currentSize: string | undefined
		adaptiveRendering: boolean
		container?: boolean
		cqName?: string
		external?: boolean
		breakpoints?: GridBreakpoints
		explicitBreakpoints?: boolean
	}>("grid")

	const noBreakpointsDefined = $derived(xs == null && sm == null && md == null && lg == null && xl == null && xxl == null)

	// Container-query mode: when the parent Grid opted in, tag the item with
	// `data-cq` so the @container rules apply. The value is the container name:
	// "" = the Grid's own anonymous container, or a named container. When off,
	// the attribute is absent and the item keeps viewport @media sizing.
	const cqValue = $derived(grid?.container ? (grid.cqName ?? "") : undefined)

	// In container mode every item must carry a data-xs (used by the base
	// @container rule + specificity); default to 12 (full width, mobile-first).
	const cqXs = $derived(cqValue != null ? (xs ?? 12) : xs)

	let itemElement: HTMLDivElement | undefined = $state()

	onMount(() => {
		if (cqValue == null) return
		// Let CSS-variable breakpoint config apply even if the app never called
		// configureGridBreakpoints() explicitly.
		ensureAutoConfigured()
		// The default "" container is handled by bundled scoped CSS; named
		// containers (external id or a Grid-generated name) need their
		// @container rules injected at runtime.
		if (!cqValue) return
		const release = acquireContainer(
			cqValue,
			grid?.breakpoints ?? DEFAULT_GRID_BREAKPOINTS,
			grid?.explicitBreakpoints ?? false
		)
		if (grid?.external) warnIfContainerMissing(itemElement, cqValue)
		return release
	})

	let shouldRender = $derived(() => {
		const adaptive = adaptiveRendering ?? grid?.adaptiveRendering
		if (!adaptive || !grid?.currentSize) return true

		const size = grid.currentSize
		// Determine which breakpoint to use based on current size
		if (size === "xxl" && xxl != null) return true
		if (size === "xl" && xl != null) return true
		if (size === "lg" && lg != null) return true
		if (size === "md" && md != null) return true
		if (size === "sm" && sm != null) return true
		if (size === "xs" && xs != null) return true

		return false
	})

	let isHidden = $derived(() => {
		if (!hiddenWhen) return false

		if (typeof window === "undefined") return false

		const width = window.innerWidth
		const breakpoint = hiddenWhen.replace("-up", "").replace("-down", "")
		const isUp = hiddenWhen.includes("-up")
		const isDown = hiddenWhen.includes("-down")

		const breakpoints: Record<string, number> = {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
			xxl: 2560
		}

		const breakpointValue = breakpoints[breakpoint]

		if (isUp) {
			return width >= breakpointValue
		} else if (isDown) {
			return width < breakpointValue
		} else {
			// Exact match
			const sizes = Object.keys(breakpoints)
			const currentIndex = sizes.findIndex((s) => {
				const min = breakpoints[s]
				const max = breakpoints[sizes[sizes.indexOf(s) + 1]] || Infinity
				return width >= min && width < max
			})
			return sizes[currentIndex] === breakpoint
		}
	})

	let computedStyle = $derived(
		[
			justify && `justify-content: ${justify};`,
			justify && "display: flex;",
			gap && `gap: ${gap};`,
			style
		]
			.filter(Boolean)
			.join(" ")
	)
</script>

{#if shouldRender() && !isHidden()}
	<div
		bind:this={itemElement}
		class={className}
		style={computedStyle}
		{...(cqValue != null ? { "data-cq": cqValue } : {})}
		{...(cqValue != null
			? { "data-xs": cqXs }
			: noBreakpointsDefined
				? { "data-xs": 0 }
				: xs !== undefined
					? { "data-xs": xs }
					: {})}
		{...(sm !== undefined ? { "data-sm": sm } : {})}
		{...(md !== undefined ? { "data-md": md } : {})}
		{...(lg !== undefined ? { "data-lg": lg } : {})}
		{...(xl !== undefined ? { "data-xl": xl } : {})}
		{...(xxl !== undefined ? { "data-xxl": xxl } : {})}
		{...(hiddenWhen !== undefined ? { "data-hidden-when": hiddenWhen } : {})}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	div {
		box-sizing: border-box;
	}

	/* Grid column sizing */
	div[data-xs="0"] {
		flex-basis: auto;
		flex-grow: 1;
		max-width: 100%;
	}

	div[data-xs="1"] {
		flex-basis: 8.333333%;
		max-width: 8.333333%;
	}
	div[data-xs="2"] {
		flex-basis: 16.666667%;
		max-width: 16.666667%;
	}
	div[data-xs="3"] {
		flex-basis: 25%;
		max-width: 25%;
	}
	div[data-xs="4"] {
		flex-basis: 33.333333%;
		max-width: 33.333333%;
	}
	div[data-xs="5"] {
		flex-basis: 41.666667%;
		max-width: 41.666667%;
	}
	div[data-xs="6"] {
		flex-basis: 50%;
		max-width: 50%;
	}
	div[data-xs="7"] {
		flex-basis: 58.333333%;
		max-width: 58.333333%;
	}
	div[data-xs="8"] {
		flex-basis: 66.666667%;
		max-width: 66.666667%;
	}
	div[data-xs="9"] {
		flex-basis: 75%;
		max-width: 75%;
	}
	div[data-xs="10"] {
		flex-basis: 83.333333%;
		max-width: 83.333333%;
	}
	div[data-xs="11"] {
		flex-basis: 91.666667%;
		max-width: 91.666667%;
	}
	div[data-xs="12"] {
		flex-basis: 100%;
		max-width: 100%;
	}

	/* Responsive breakpoints */
	@media (min-width: 600px) {
		div[data-sm="1"] {
			flex-basis: 8.333333%;
			max-width: 8.333333%;
		}
		div[data-sm="2"] {
			flex-basis: 16.666667%;
			max-width: 16.666667%;
		}
		div[data-sm="3"] {
			flex-basis: 25%;
			max-width: 25%;
		}
		div[data-sm="4"] {
			flex-basis: 33.333333%;
			max-width: 33.333333%;
		}
		div[data-sm="5"] {
			flex-basis: 41.666667%;
			max-width: 41.666667%;
		}
		div[data-sm="6"] {
			flex-basis: 50%;
			max-width: 50%;
		}
		div[data-sm="7"] {
			flex-basis: 58.333333%;
			max-width: 58.333333%;
		}
		div[data-sm="8"] {
			flex-basis: 66.666667%;
			max-width: 66.666667%;
		}
		div[data-sm="9"] {
			flex-basis: 75%;
			max-width: 75%;
		}
		div[data-sm="10"] {
			flex-basis: 83.333333%;
			max-width: 83.333333%;
		}
		div[data-sm="11"] {
			flex-basis: 91.666667%;
			max-width: 91.666667%;
		}
		div[data-sm="12"] {
			flex-basis: 100%;
			max-width: 100%;
		}
	}

	@media (min-width: 960px) {
		div[data-md="1"] {
			flex-basis: 8.333333%;
			max-width: 8.333333%;
		}
		div[data-md="2"] {
			flex-basis: 16.666667%;
			max-width: 16.666667%;
		}
		div[data-md="3"] {
			flex-basis: 25%;
			max-width: 25%;
		}
		div[data-md="4"] {
			flex-basis: 33.333333%;
			max-width: 33.333333%;
		}
		div[data-md="5"] {
			flex-basis: 41.666667%;
			max-width: 41.666667%;
		}
		div[data-md="6"] {
			flex-basis: 50%;
			max-width: 50%;
		}
		div[data-md="7"] {
			flex-basis: 58.333333%;
			max-width: 58.333333%;
		}
		div[data-md="8"] {
			flex-basis: 66.666667%;
			max-width: 66.666667%;
		}
		div[data-md="9"] {
			flex-basis: 75%;
			max-width: 75%;
		}
		div[data-md="10"] {
			flex-basis: 83.333333%;
			max-width: 83.333333%;
		}
		div[data-md="11"] {
			flex-basis: 91.666667%;
			max-width: 91.666667%;
		}
		div[data-md="12"] {
			flex-basis: 100%;
			max-width: 100%;
		}
	}

	@media (min-width: 1280px) {
		div[data-lg="1"] {
			flex-basis: 8.333333%;
			max-width: 8.333333%;
		}
		div[data-lg="2"] {
			flex-basis: 16.666667%;
			max-width: 16.666667%;
		}
		div[data-lg="3"] {
			flex-basis: 25%;
			max-width: 25%;
		}
		div[data-lg="4"] {
			flex-basis: 33.333333%;
			max-width: 33.333333%;
		}
		div[data-lg="5"] {
			flex-basis: 41.666667%;
			max-width: 41.666667%;
		}
		div[data-lg="6"] {
			flex-basis: 50%;
			max-width: 50%;
		}
		div[data-lg="7"] {
			flex-basis: 58.333333%;
			max-width: 58.333333%;
		}
		div[data-lg="8"] {
			flex-basis: 66.666667%;
			max-width: 66.666667%;
		}
		div[data-lg="9"] {
			flex-basis: 75%;
			max-width: 75%;
		}
		div[data-lg="10"] {
			flex-basis: 83.333333%;
			max-width: 83.333333%;
		}
		div[data-lg="11"] {
			flex-basis: 91.666667%;
			max-width: 91.666667%;
		}
		div[data-lg="12"] {
			flex-basis: 100%;
			max-width: 100%;
		}
	}

	@media (min-width: 1920px) {
		div[data-xl="1"] {
			flex-basis: 8.333333%;
			max-width: 8.333333%;
		}
		div[data-xl="2"] {
			flex-basis: 16.666667%;
			max-width: 16.666667%;
		}
		div[data-xl="3"] {
			flex-basis: 25%;
			max-width: 25%;
		}
		div[data-xl="4"] {
			flex-basis: 33.333333%;
			max-width: 33.333333%;
		}
		div[data-xl="5"] {
			flex-basis: 41.666667%;
			max-width: 41.666667%;
		}
		div[data-xl="6"] {
			flex-basis: 50%;
			max-width: 50%;
		}
		div[data-xl="7"] {
			flex-basis: 58.333333%;
			max-width: 58.333333%;
		}
		div[data-xl="8"] {
			flex-basis: 66.666667%;
			max-width: 66.666667%;
		}
		div[data-xl="9"] {
			flex-basis: 75%;
			max-width: 75%;
		}
		div[data-xl="10"] {
			flex-basis: 83.333333%;
			max-width: 83.333333%;
		}
		div[data-xl="11"] {
			flex-basis: 91.666667%;
			max-width: 91.666667%;
		}
		div[data-xl="12"] {
			flex-basis: 100%;
			max-width: 100%;
		}
	}

	@media (min-width: 2560px) {
		div[data-xxl="1"] {
			flex-basis: 8.333333%;
			max-width: 8.333333%;
		}
		div[data-xxl="2"] {
			flex-basis: 16.666667%;
			max-width: 16.666667%;
		}
		div[data-xxl="3"] {
			flex-basis: 25%;
			max-width: 25%;
		}
		div[data-xxl="4"] {
			flex-basis: 33.333333%;
			max-width: 33.333333%;
		}
		div[data-xxl="5"] {
			flex-basis: 41.666667%;
			max-width: 41.666667%;
		}
		div[data-xxl="6"] {
			flex-basis: 50%;
			max-width: 50%;
		}
		div[data-xxl="7"] {
			flex-basis: 58.333333%;
			max-width: 58.333333%;
		}
		div[data-xxl="8"] {
			flex-basis: 66.666667%;
			max-width: 66.666667%;
		}
		div[data-xxl="9"] {
			flex-basis: 75%;
			max-width: 75%;
		}
		div[data-xxl="10"] {
			flex-basis: 83.333333%;
			max-width: 83.333333%;
		}
		div[data-xxl="11"] {
			flex-basis: 91.666667%;
			max-width: 91.666667%;
		}
		div[data-xxl="12"] {
			flex-basis: 100%;
			max-width: 100%;
		}
	}

	/* ===== Container-query mode (opt-in via <Grid container>) ===== */
	/* Column values stay on data-* attributes (CSP-clean: no inline styles).
	   These map each data-* value to a CSS var, gated by [data-cq] so viewport
	   items are untouched. The base rule below sizes from --col; the @container
	   activations only reassign --col, so a named container needs just ~5 rules. */
	div[data-cq][data-xs="1"] { --xs: 1; }
	div[data-cq][data-xs="2"] { --xs: 2; }
	div[data-cq][data-xs="3"] { --xs: 3; }
	div[data-cq][data-xs="4"] { --xs: 4; }
	div[data-cq][data-xs="5"] { --xs: 5; }
	div[data-cq][data-xs="6"] { --xs: 6; }
	div[data-cq][data-xs="7"] { --xs: 7; }
	div[data-cq][data-xs="8"] { --xs: 8; }
	div[data-cq][data-xs="9"] { --xs: 9; }
	div[data-cq][data-xs="10"] { --xs: 10; }
	div[data-cq][data-xs="11"] { --xs: 11; }
	div[data-cq][data-xs="12"] { --xs: 12; }
	div[data-cq][data-sm="1"] { --sm: 1; }
	div[data-cq][data-sm="2"] { --sm: 2; }
	div[data-cq][data-sm="3"] { --sm: 3; }
	div[data-cq][data-sm="4"] { --sm: 4; }
	div[data-cq][data-sm="5"] { --sm: 5; }
	div[data-cq][data-sm="6"] { --sm: 6; }
	div[data-cq][data-sm="7"] { --sm: 7; }
	div[data-cq][data-sm="8"] { --sm: 8; }
	div[data-cq][data-sm="9"] { --sm: 9; }
	div[data-cq][data-sm="10"] { --sm: 10; }
	div[data-cq][data-sm="11"] { --sm: 11; }
	div[data-cq][data-sm="12"] { --sm: 12; }
	div[data-cq][data-md="1"] { --md: 1; }
	div[data-cq][data-md="2"] { --md: 2; }
	div[data-cq][data-md="3"] { --md: 3; }
	div[data-cq][data-md="4"] { --md: 4; }
	div[data-cq][data-md="5"] { --md: 5; }
	div[data-cq][data-md="6"] { --md: 6; }
	div[data-cq][data-md="7"] { --md: 7; }
	div[data-cq][data-md="8"] { --md: 8; }
	div[data-cq][data-md="9"] { --md: 9; }
	div[data-cq][data-md="10"] { --md: 10; }
	div[data-cq][data-md="11"] { --md: 11; }
	div[data-cq][data-md="12"] { --md: 12; }
	div[data-cq][data-lg="1"] { --lg: 1; }
	div[data-cq][data-lg="2"] { --lg: 2; }
	div[data-cq][data-lg="3"] { --lg: 3; }
	div[data-cq][data-lg="4"] { --lg: 4; }
	div[data-cq][data-lg="5"] { --lg: 5; }
	div[data-cq][data-lg="6"] { --lg: 6; }
	div[data-cq][data-lg="7"] { --lg: 7; }
	div[data-cq][data-lg="8"] { --lg: 8; }
	div[data-cq][data-lg="9"] { --lg: 9; }
	div[data-cq][data-lg="10"] { --lg: 10; }
	div[data-cq][data-lg="11"] { --lg: 11; }
	div[data-cq][data-lg="12"] { --lg: 12; }
	div[data-cq][data-xl="1"] { --xl: 1; }
	div[data-cq][data-xl="2"] { --xl: 2; }
	div[data-cq][data-xl="3"] { --xl: 3; }
	div[data-cq][data-xl="4"] { --xl: 4; }
	div[data-cq][data-xl="5"] { --xl: 5; }
	div[data-cq][data-xl="6"] { --xl: 6; }
	div[data-cq][data-xl="7"] { --xl: 7; }
	div[data-cq][data-xl="8"] { --xl: 8; }
	div[data-cq][data-xl="9"] { --xl: 9; }
	div[data-cq][data-xl="10"] { --xl: 10; }
	div[data-cq][data-xl="11"] { --xl: 11; }
	div[data-cq][data-xl="12"] { --xl: 12; }
	div[data-cq][data-xxl="1"] { --xxl: 1; }
	div[data-cq][data-xxl="2"] { --xxl: 2; }
	div[data-cq][data-xxl="3"] { --xxl: 3; }
	div[data-cq][data-xxl="4"] { --xxl: 4; }
	div[data-cq][data-xxl="5"] { --xxl: 5; }
	div[data-cq][data-xxl="6"] { --xxl: 6; }
	div[data-cq][data-xxl="7"] { --xxl: 7; }
	div[data-cq][data-xxl="8"] { --xxl: 8; }
	div[data-cq][data-xxl="9"] { --xxl: 9; }
	div[data-cq][data-xxl="10"] { --xxl: 10; }
	div[data-cq][data-xxl="11"] { --xxl: 11; }
	div[data-cq][data-xxl="12"] { --xxl: 12; }

	/* Base: mobile-first, sized from --col (defaults to --xs, else 12 = full).
	   Two attributes ([data-cq][data-xs]) outspecify the 1-attr viewport rules,
	   so container items never pick up viewport flex-basis regardless of order. */
	div[data-cq][data-xs] {
		--col: var(--xs, 12);
		flex-basis: calc(var(--col) / 12 * 100%);
		max-width: calc(var(--col) / 12 * 100%);
	}

	/* Default (unnamed) container: queries the nearest container = the Grid itself.
	   Named containers inject their own @container rules at runtime via
	   containerQueries.ts. Keep these min-widths in sync with DEFAULT_GRID_BREAKPOINTS.
	   The `:not(.fluent-grid-custom-bp)` gate lets an app-wide breakpoint config
	   (configureGridBreakpoints / --fluent-grid-breakpoint-* vars) disable these
	   defaults and replace them with generated rules — no threshold overlap. */
	@container (min-width: 480px) {
		:global(html:not(.fluent-grid-custom-bp)) div[data-cq=""][data-xs] { --col: var(--sm, var(--col)); }
	}
	@container (min-width: 640px) {
		:global(html:not(.fluent-grid-custom-bp)) div[data-cq=""][data-xs] { --col: var(--md, var(--col)); }
	}
	@container (min-width: 900px) {
		:global(html:not(.fluent-grid-custom-bp)) div[data-cq=""][data-xs] { --col: var(--lg, var(--col)); }
	}
	@container (min-width: 1200px) {
		:global(html:not(.fluent-grid-custom-bp)) div[data-cq=""][data-xs] { --col: var(--xl, var(--col)); }
	}
	@container (min-width: 1600px) {
		:global(html:not(.fluent-grid-custom-bp)) div[data-cq=""][data-xs] { --col: var(--xxl, var(--col)); }
	}
</style>
