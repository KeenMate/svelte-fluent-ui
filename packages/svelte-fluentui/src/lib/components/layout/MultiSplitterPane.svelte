<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {getContext, onMount, onDestroy} from "svelte"

	type PaneStatus = "normal" | "collapsed" | "expanded"

	type Props = {
		children?: SlotType
		size?: string
		minSize?: string
		maxSize?: string
		resizable?: boolean
		collapsible?: boolean
		class?: string
		style?: string
	}

	let {
		children = undefined,
		size = undefined,
		minSize = undefined,
		maxSize = undefined,
		resizable = true,
		collapsible = false,
		class: className = "",
		style = ""
	}: Props = $props()

	let element: HTMLDivElement | undefined = $state()
	let index = $state(-1)
	let status = $state<PaneStatus>("normal")
	let isLast = $state(false)

	const splitter = getContext<{
		orientation: "horizontal" | "vertical"
		registerPane: (pane: any) => number
		unregisterPane: (index: number) => void
		resizeExec: (e: MouseEvent, index: number) => void
		collapseExec: (e: MouseEvent, index: number) => void
		expandExec: (e: MouseEvent, index: number) => void
	}>("multisplitter")

	onMount(() => {
		if (splitter && element) {
			index = splitter.registerPane({
				element,
				size,
				minSize,
				maxSize,
				resizable,
				collapsible,
				status
			})
		}
	})

	onDestroy(() => {
		if (splitter && index >= 0) {
			splitter.unregisterPane(index)
		}
	})

	let computedStyle = $derived(
		[
			size && (splitter.orientation === "horizontal" ? `width: ${size};` : `height: ${size};`),
			minSize &&
				(splitter.orientation === "horizontal"
					? `min-width: ${minSize};`
					: `min-height: ${minSize};`),
			maxSize &&
				(splitter.orientation === "horizontal"
					? `max-width: ${maxSize};`
					: `max-height: ${maxSize};`),
			!size && "flex: 1;",
			style
		]
			.filter(Boolean)
			.join(" ")
	)

	let isExpandable = $derived(status === "collapsed")
	let isCollapsible = $derived(collapsible && status !== "collapsed")
	let isResizable = $derived(resizable && status !== "collapsed")
</script>

<div
	bind:this={element}
	class="fluent-multi-splitter-pane {className}"
	style={computedStyle}
	data-index={index}
	data-status={status}
>
	{@render children?.()}
</div>

{#if !isLast}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fluent-multi-splitter-bar"
		data-status={status}
		onmousedown={(e) => splitter.resizeExec(e, index)}
		onclick={(e) => {
			e.preventDefault()
			e.stopPropagation()
		}}
	>
		{#if isCollapsible}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				data-part="collapse"
				onmousedown={(e) => {
					e.preventDefault()
					e.stopPropagation()
					splitter.collapseExec(e, index)
				}}
			></span>
		{/if}

		{#if isResizable}
			<span data-part="resize"></span>
		{/if}

		{#if isExpandable}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				data-part="expand"
				onmousedown={(e) => {
					e.preventDefault()
					e.stopPropagation()
					splitter.expandExec(e, index)
				}}
			></span>
		{/if}
	</div>
{/if}
