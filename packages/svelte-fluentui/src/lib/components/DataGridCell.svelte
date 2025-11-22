<script lang="ts">
	import {provideFluentDesignSystem, fluentDataGridCell} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentDataGridCell())

	type Props = {
		class?: string
		style?: string
		gridColumn?: number | string
		cellType?: "default" | "columnheader"
		colIndex?: number
		role?: string
		tabIndex?: number
		title?: string
		ariaLabel?: string
		onkeydown?: (e: KeyboardEvent) => void
		onclick?: (e: MouseEvent) => void
		onfocus?: (e: FocusEvent) => void
		children?: SlotType
	}

	let {
		class: className = "",
		style = "",
		gridColumn = undefined,
		cellType = "default",
		colIndex = undefined,
		role = undefined,
		tabIndex = undefined,
		title = undefined,
		ariaLabel = undefined,
		onkeydown = undefined,
		onclick = undefined,
		onfocus = undefined,
		children = undefined
	}: Props = $props()

	function handleKeyDown(e: KeyboardEvent) {
		onkeydown?.(e)
	}

	function handleClick(e: MouseEvent) {
		onclick?.(e)
	}

	function handleFocus(e: FocusEvent) {
		onfocus?.(e)
	}
</script>

<fluent-data-grid-cell
	class={className}
	{style}
	grid-column={gridColumn}
	cell-type={cellType}
	col-index={colIndex}
	{role}
	tabindex={tabIndex}
	{title}
	aria-label={ariaLabel}
	onkeydown={handleKeyDown}
	onclick={handleClick}
	onfocus={handleFocus}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-data-grid-cell>
