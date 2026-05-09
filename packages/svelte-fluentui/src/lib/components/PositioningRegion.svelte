<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {portal} from "../actions/portal.js"
	import {
		computePosition,
		flip,
		shift,
		offset,
		size,
		autoUpdate,
		type Placement
	} from "@floating-ui/dom"

	type PositionType = "bottom" | "left" | "right" | "top"
	type AlignType = "center" | "top"

	type Props = {
		anchor?: HTMLElement
		visible?: boolean
		style?: string
		title?: string
		position?: PositionType
		/** Vertical alignment for left/right positions. "top" anchors the
		 * overlay's bottom edge to the anchor's bottom (so it extends upward);
		 * "center" centers it on the anchor (default). */
		align?: AlignType
		/** When true (default), the overlay width is forced to match the anchor's
		 * width via Floating UI's `size` middleware. Useful for dropdowns whose
		 * options should align under the input. */
		matchWidth?: boolean
		children?: SlotType
	}

	let {
		anchor = undefined,
		visible = false,
		style = "",
		title = undefined,
		position: positionProp = "bottom",
		align: alignProp = "center",
		matchWidth = true,
		children = undefined
	}: Props = $props()

	const placement = $derived<Placement>(
		positionProp === "bottom"
			? "bottom-start"
			: positionProp === "top"
				? "top-start"
				: positionProp === "left"
					? alignProp === "top"
						? "left-end"
						: "left"
					: alignProp === "top"
						? "right-end"
						: "right"
	)

	type PositionParams = {
		anchor: HTMLElement
		placement: Placement
		matchWidth: boolean
	}

	function position(node: HTMLElement, params: PositionParams) {
		let cleanup: () => void = () => {}

		function attach(p: PositionParams) {
			cleanup()
			async function update() {
				const middleware = [
					offset(0),
					flip(),
					shift({padding: 8})
				]
				if (p.matchWidth) {
					middleware.push(
						size({
							apply({rects, elements}) {
								elements.floating.style.width = `${rects.reference.width}px`
							}
						})
					)
				}
				const result = await computePosition(p.anchor, node, {
					placement: p.placement,
					strategy: "fixed",
					middleware
				})
				node.style.left = `${result.x}px`
				node.style.top = `${result.y}px`
			}
			cleanup = autoUpdate(p.anchor, node, update)
		}

		attach(params)

		return {
			update(newParams: PositionParams) {
				attach(newParams)
			},
			destroy() {
				cleanup()
			}
		}
	}
</script>

{#if anchor}
	{#if visible}
		<div
			use:portal
			use:position={{anchor, placement, matchWidth}}
			class="positioning-region positioning-region-floating"
			{title}
			style="position: fixed; top: 0; left: 0; {style}"
		>
			{@render children?.()}
		</div>
	{/if}
{:else}
	<!-- Static wrapper mode (NavLink, NavExpander) — no anchor, just a layout passthrough. -->
	<div class="positioning-region" {title} {style}>
		{@render children?.()}
	</div>
{/if}

<style>
	/* Floating variant lifts above page content. The static wrapper mode is
	 * used inside NavLink etc. — applying z-index there would lift every nav
	 * item above modals. */
	.positioning-region-floating {
		z-index: var(--fluent-z-popover, 1060);
	}
</style>
