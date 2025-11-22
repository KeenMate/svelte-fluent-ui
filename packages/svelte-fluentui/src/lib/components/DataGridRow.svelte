<script lang="ts">
	import { provideFluentDesignSystem, fluentDataGridRow } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentDataGridRow());

	type Props = {
		class?: string;
		style?: string;
		rowIndex?: number;
		rowType?: string;
		onkeydown?: (e: KeyboardEvent) => void;
		onclick?: (e: MouseEvent) => void;
		ondblclick?: (e: MouseEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		children?: SlotType;
	};

	let {
		class: className = "",
		style = "",
		rowIndex = undefined,
		rowType = undefined,
		onkeydown = undefined,
		onclick = undefined,
		ondblclick = undefined,
		onfocus = undefined,
		children = undefined
	}: Props = $props();

	function handleKeyDown(e: KeyboardEvent) {
		onkeydown?.(e);
	}

	function handleClick(e: MouseEvent) {
		onclick?.(e);
	}

	function handleDblClick(e: MouseEvent) {
		ondblclick?.(e);
	}

	function handleFocus(e: FocusEvent) {
		onfocus?.(e);
	}
</script>

<fluent-data-grid-row
	class={className}
	{style}
	data-row-index={rowIndex}
	row-type={rowType}
	role="row"
	onkeydown={handleKeyDown}
	onclick={handleClick}
	ondblclick={handleDblClick}
	onfocus={handleFocus}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-data-grid-row>
