<script lang="ts">
	import { provideFluentDesignSystem, fluentDataGridRow } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentDataGridRow());

	type Props = {
		class?: string;
		style?: string;
		rowIndex?: number;
		rowType?: string;
		onKeyDown?: (e: KeyboardEvent) => void;
		onClick?: (e: MouseEvent) => void;
		onDblClick?: (e: MouseEvent) => void;
		onFocus?: (e: FocusEvent) => void;
		children?: SlotType;
		[prop: string]: any;
	};

	let {
		class: className = "",
		style = "",
		rowIndex = undefined,
		rowType = undefined,
		onKeyDown = undefined,
		onClick = undefined,
		onDblClick = undefined,
		onFocus = undefined,
		children = undefined,
		...restProps
	}: Props = $props();

	function handleKeyDown(e: KeyboardEvent) {
		onKeyDown?.(e);
	}

	function handleClick(e: MouseEvent) {
		onClick?.(e);
	}

	function handleDblClick(e: MouseEvent) {
		onDblClick?.(e);
	}

	function handleFocus(e: FocusEvent) {
		onFocus?.(e);
	}
</script>

<fluent-data-grid-row
	class={className}
	{style}
	data-row-index={rowIndex}
	row-type={rowType}
	role="row"
	on:keydown={handleKeyDown}
	on:click={handleClick}
	on:dblclick={handleDblClick}
	on:focus={handleFocus}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-data-grid-row>
