<script lang="ts">
	import {provideFluentDesignSystem, fluentDataGridCell} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentDataGridCell())

	type Props = {
		class?: string
		style?: string
		gridColumn?: number
		cellType?: "default" | "columnheader"
		colIndex?: number
		role?: string
		tabIndex?: number
		title?: string
		ariaLabel?: string
		onKeyDown?: (e: KeyboardEvent) => void
		onClick?: (e: MouseEvent) => void
		onFocus?: (e: FocusEvent) => void
		children?: SlotType
		[prop: string]: any
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
		onKeyDown = undefined,
		onClick = undefined,
		onFocus = undefined,
		children = undefined,
		...restProps
	}: Props = $props()

	function handleKeyDown(e: KeyboardEvent) {
		onKeyDown?.(e)
	}

	function handleClick(e: MouseEvent) {
		onClick?.(e)
	}

	function handleFocus(e: FocusEvent) {
		onFocus?.(e)
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
	on:keydown={handleKeyDown}
	on:click={handleClick}
	on:focus={handleFocus}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-data-grid-cell>
