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
		[prop: string]: any
	}

	let {
		children = undefined,
		size = undefined,
		minSize = undefined,
		maxSize = undefined,
		resizable = true,
		collapsible = false,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLDivElement | undefined = $state()
	let index = $state(-1)
	let status: PaneStatus = $state("normal")
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
	{...restProps}
	class="fluent-multi-splitter-pane {className}"
	style={computedStyle}
	data-index={index}
	data-status={status}
>
	{@render children?.()}
</div>

{#if !isLast}
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
			<span
				data-part="collapse"
				onmousedown={(e) => {
					e.preventDefault()
					e.stopPropagation()
					splitter.collapseExec(e, index)
				}}
			/>
		{/if}

		{#if isResizable}
			<span data-part="resize" />
		{/if}

		{#if isExpandable}
			<span
				data-part="expand"
				onmousedown={(e) => {
					e.preventDefault()
					e.stopPropagation()
					splitter.expandExec(e, index)
				}}
			/>
		{/if}
	</div>
{/if}
