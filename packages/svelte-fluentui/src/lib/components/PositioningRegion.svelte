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
		/** When true, exposes the remaining viewport height as the CSS custom
		 * property `--available-height` on the floating element (minus the
		 * shift padding). Consumers should set max-height: var(--available-height)
		 * on a scroll container inside, so the dropdown stays inside the viewport
		 * regardless of which side flip() picks. */
		availableHeight?: boolean
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
		availableHeight = false,
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
		availableHeight: boolean
	}

	// Promote the floating element into the browser top layer via the Popover API.
	// The top layer paints above ALL z-indexed content — including a modal dialog
	// with an arbitrarily high z-index (the docs set the settings dialog to 10000),
	// which a fixed popover z-index (1060) can never reliably beat. We still position
	// the element ourselves with Floating UI; `popover` only governs stacking.
	//
	// "manual" (not "auto") so the browser's light-dismiss doesn't fight our own
	// outside-pointerdown / focus / scroll close logic. Falls back to the CSS
	// z-index when the API is unavailable (older browsers).
	function topLayer(node: HTMLElement & {showPopover?: () => void; hidePopover?: () => void}) {
		// Unsupported: drop the `popover` attribute so the UA's
		// `:not(:popover-open){display:none}` can't hide the element; z-index fallback.
		if (typeof node.showPopover !== "function") {
			node.removeAttribute("popover")
			return
		}
		try {
			node.showPopover()
		} catch {
			// Failed to promote (e.g. disconnected mid-mount) — same reasoning: don't
			// leave a non-open popover behind, or it renders as display:none.
			node.removeAttribute("popover")
			return
		}
		return {
			destroy() {
				try { node.hidePopover?.() } catch { /* already hidden */ }
			}
		}
	}

	function position(node: HTMLElement, params: PositionParams) {
		let cleanup: () => void = () => {}
		const SHIFT_PADDING = 8

		function attach(p: PositionParams) {
			cleanup()
			async function update() {
				const middleware = [
					offset(0),
					flip(),
					shift({padding: SHIFT_PADDING})
				]
				if (p.matchWidth || p.availableHeight) {
					middleware.push(
						size({
							padding: SHIFT_PADDING,
							apply({rects, elements, availableHeight: h}) {
								if (p.matchWidth) {
									elements.floating.style.width = `${rects.reference.width}px`
								}
								if (p.availableHeight) {
									elements.floating.style.setProperty(
										"--available-height",
										`${Math.max(0, Math.floor(h))}px`
									)
								}
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
			use:topLayer
			use:position={{anchor, placement, matchWidth, availableHeight}}
			popover="manual"
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
	 * item above modals.
	 *
	 * z-index is the fallback for browsers without the Popover API; when
	 * `popover` is supported the element is in the top layer and z-index is moot.
	 * The remaining rules undo the UA `[popover]` defaults (border, padding,
	 * margin, centered `inset`, opaque background) so our Floating-UI `left`/`top`
	 * drive the position and the wrapper stays visually transparent. */
	.positioning-region-floating {
		z-index: var(--fluent-z-popover, 1060);
		inset: auto;
		margin: 0;
		border: 0;
		padding: 0;
		width: auto;
		height: auto;
		max-width: none;
		max-height: none;
		overflow: visible;
		background: transparent;
		color: inherit;
	}
</style>
