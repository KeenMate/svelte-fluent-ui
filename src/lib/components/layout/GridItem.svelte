<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {getContext} from "svelte"

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

	const grid = getContext<{currentSize: string | undefined; adaptiveRendering: boolean}>("grid")

	const noBreakpointsDefined = xs == null && sm == null && md == null && lg == null && xl == null && xxl == null

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
		class={className}
		style={computedStyle}
		data-xs={noBreakpointsDefined ? 0 : xs}
		data-sm={sm}
		data-md={md}
		data-lg={lg}
		data-xl={xl}
		data-xxl={xxl}
		data-hidden-when={hiddenWhen}
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
</style>
