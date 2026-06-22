<!--
 * MultiSplitterPane
 *
 * Child component of MultiSplitter. Registers itself with the parent via
 * "multi-splitter" context on mount, receives a stable handle, and reads
 * back a reactive `index` + `isLast` so it knows whether to render the
 * trailing gutter (every pane except the last renders one — gutters
 * alternate with panes in the parent flex row/column).
 *
 * Sizing/min/max/minimize are passed by prop instead of data-attrs.
 *
 * Drag/keyboard/click logic lives entirely in MultiSplitter; this component
 * just forwards events to the context with its own handle so the parent
 * knows which gutter was hit.
-->

<script lang="ts">
	import {getContext, onMount, onDestroy} from "svelte"
	import type {SlotType} from "../../types/index.js"
	import type {MultiSplitterContext, PaneHandle} from "../../types/multi-splitter.js"

	type Props = {
		children?: SlotType
		/** Initial size: "200px" or "30%". If omitted, shares leftover with other unsized panes. */
		size?: string
		/** Min size: "150px" or "10%". Default 0. */
		min?: string
		/** Max size: "400px" or "50%". Default unbounded. */
		max?: string
		/** If true, pane can collapse to a rail. */
		minimize?: boolean
		class?: string
		style?: string
	}

	let {
		children = undefined,
		size = undefined,
		min = undefined,
		max = undefined,
		minimize = false,
		class: className = "",
		style = ""
	}: Props = $props()

	const ctx = getContext<MultiSplitterContext>("multi-splitter")
	if (!ctx) {
		throw new Error("MultiSplitterPane must be a direct child of MultiSplitter")
	}

	let paneEl: HTMLDivElement | undefined = $state()
	let gutterEl: HTMLDivElement | undefined = $state()
	let handle: PaneHandle | undefined = $state()

	onMount(() => {
		if (!paneEl) return
		handle = ctx.registerPane({
			el: paneEl,
			getGutterEl: () => gutterEl,
			size,
			min,
			max,
			canMin: minimize
		})
	})

	onDestroy(() => {
		if (handle) ctx.unregisterPane(handle)
	})

	const index = $derived(handle ? ctx.indexOf(handle) : -1)
	const isLast = $derived(handle ? ctx.isLast(handle) : false)
	const isMinimized = $derived(handle ? ctx.isMinimized(handle) : false)

	function handleGutterPointerDown(e: PointerEvent) {
		if (handle) ctx.onGutterPointerDown(e, handle)
	}
	function handleGutterKeydown(e: KeyboardEvent) {
		if (handle) ctx.onGutterKeydown(e, handle)
	}
	function handleGutterDblClick(e: MouseEvent) {
		if (handle) ctx.onGutterDblClick(e, handle)
	}
	function handlePaneClick(e: MouseEvent) {
		if (handle) ctx.onPaneClick(e, handle)
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={paneEl}
	class="fluent-multi-splitter-pane fluent-multi-splitter-pane--{ctx.orientation} {className}"
	class:fluent-multi-splitter-pane--minimized={isMinimized}
	data-index={index}
	style={style}
	onclick={handlePaneClick}
>
	{@render children?.()}
</div>

{#if !isLast}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={gutterEl}
		class="fluent-multi-splitter-gutter"
		role="separator"
		aria-orientation={ctx.orientation === "vertical" ? "horizontal" : "vertical"}
		tabindex="0"
		onpointerdown={handleGutterPointerDown}
		onkeydown={handleGutterKeydown}
		ondblclick={handleGutterDblClick}
	></div>
{/if}
