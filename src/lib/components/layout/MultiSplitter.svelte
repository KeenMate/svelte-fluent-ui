<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {setContext} from "svelte"

	type Orientation = "horizontal" | "vertical"
	type PaneStatus = "normal" | "collapsed" | "expanded"

	export type MultiSplitterEventArgs = {
		index: number
		pane: HTMLElement
	}

	export type MultiSplitterResizeEventArgs = {
		index: number
		pane: HTMLElement
		size: number
	}

	type Props = {
		children?: SlotType
		orientation?: Orientation
		barSize?: string
		width?: string
		height?: string
		onCollapse?: (args: MultiSplitterEventArgs) => void
		onExpand?: (args: MultiSplitterEventArgs) => void
		onResize?: (args: MultiSplitterResizeEventArgs) => void
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		orientation = "horizontal",
		barSize = "6px",
		width = undefined,
		height = undefined,
		onCollapse = undefined,
		onExpand = undefined,
		onResize = undefined,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLDivElement | undefined = $state()
	let panes: Array<{
		element: HTMLElement
		size?: string
		minSize?: string
		maxSize?: string
		resizable: boolean
		collapsible: boolean
		status: PaneStatus
	}> = $state([])

	let isResizing = $state(false)
	let resizingIndex = $state<number>(-1)
	let startPos = $state(0)
	let startSize = $state(0)

	// Set context for child panes
	setContext("multisplitter", {
		orientation,
		registerPane: (pane: any) => {
			panes = [...panes, pane]
			return panes.length - 1
		},
		unregisterPane: (index: number) => {
			panes = panes.filter((_, i) => i !== index)
		},
		resizeExec: async (e: MouseEvent, index: number) => {
			e.preventDefault()
			e.stopPropagation()

			if (!panes[index]?.resizable) return

			isResizing = true
			resizingIndex = index
			startPos = orientation === "horizontal" ? e.clientX : e.clientY
			const paneElement = panes[index].element
			startSize =
				orientation === "horizontal" ? paneElement.offsetWidth : paneElement.offsetHeight
		},
		collapseExec: async (e: MouseEvent, index: number) => {
			e.preventDefault()
			e.stopPropagation()

			if (!panes[index]?.collapsible) return

			const pane = panes[index]
			pane.status = "collapsed"
			panes = [...panes]

			onCollapse?.({
				index,
				pane: pane.element
			})
		},
		expandExec: async (e: MouseEvent, index: number) => {
			e.preventDefault()
			e.stopPropagation()

			const pane = panes[index]
			if (pane.status !== "collapsed") return

			pane.status = "normal"
			panes = [...panes]

			onExpand?.({
				index,
				pane: pane.element
			})
		}
	})

	function handleMouseMove(e: MouseEvent) {
		if (!isResizing || resizingIndex < 0) return

		const currentPos = orientation === "horizontal" ? e.clientX : e.clientY
		const delta = currentPos - startPos
		const newSize = startSize + delta

		const pane = panes[resizingIndex]
		const minSize = pane.minSize ? parseFloat(pane.minSize) : 0
		const maxSize = pane.maxSize ? parseFloat(pane.maxSize) : Infinity

		if (newSize >= minSize && newSize <= maxSize) {
			if (orientation === "horizontal") {
				pane.element.style.width = `${newSize}px`
			} else {
				pane.element.style.height = `${newSize}px`
			}

			onResize?.({
				index: resizingIndex,
				pane: pane.element,
				size: newSize
			})
		}
	}

	function handleMouseUp() {
		isResizing = false
		resizingIndex = -1
	}

	let computedStyle = $derived(
		[
			width && `width: ${width};`,
			height && `height: ${height};`,
			`--bar-size: ${barSize};`,
			style
		]
			.filter(Boolean)
			.join(" ")
	)
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div
	bind:this={element}
	{...restProps}
	class="fluent-multi-splitter {className}"
	style={computedStyle}
	data-orientation={orientation}
>
	{@render children?.()}
</div>

<style>
	.fluent-multi-splitter {
		display: flex;
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.fluent-multi-splitter[data-orientation="horizontal"] {
		flex-direction: row;
	}

	.fluent-multi-splitter[data-orientation="vertical"] {
		flex-direction: column;
	}

	:global(.fluent-multi-splitter-bar) {
		background-color: var(--neutral-stroke-divider-rest, #e1dfdd);
		flex-shrink: 0;
		position: relative;
		cursor: ew-resize;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.fluent-multi-splitter[data-orientation="horizontal"] .fluent-multi-splitter-bar) {
		width: var(--bar-size, 6px);
		height: 100%;
		cursor: ew-resize;
	}

	:global(.fluent-multi-splitter[data-orientation="vertical"] .fluent-multi-splitter-bar) {
		height: var(--bar-size, 6px);
		width: 100%;
		cursor: ns-resize;
	}

	:global(.fluent-multi-splitter-bar:hover) {
		background-color: var(--neutral-stroke-divider-hover, #c8c6c4);
	}

	:global(.fluent-multi-splitter-bar span) {
		display: block;
		width: 20px;
		height: 20px;
		cursor: pointer;
		background-color: var(--neutral-fill-rest, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #8a8886);
		border-radius: 50%;
		margin: 2px;
	}

	:global(.fluent-multi-splitter-bar span:hover) {
		background-color: var(--neutral-fill-hover, #f3f2f1);
	}

	:global(.fluent-multi-splitter-pane) {
		flex-shrink: 0;
		overflow: auto;
		box-sizing: border-box;
	}

	:global(.fluent-multi-splitter-pane[data-status="collapsed"]) {
		flex-basis: 0 !important;
		min-width: 0 !important;
		min-height: 0 !important;
		overflow: hidden !important;
	}
</style>
