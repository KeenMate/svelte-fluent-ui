<script lang="ts">
	import { provideFluentDesignSystem, fluentDataGrid } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentDataGrid());

	type Props = {
		class?: string;
		style?: string;
		id?: string;
		ariaRowCount?: number;
		generateHeader?: "none" | "default" | "sticky";
		role?: string;
		onCloseColumnOptions?: (e: Event) => void;
		onCloseColumnResize?: (e: Event) => void;
		children?: SlotType;
	};

	let {
		class: className = "",
		style = "",
		id = undefined,
		ariaRowCount = undefined,
		generateHeader = undefined,
		role = "grid",
		onCloseColumnOptions = undefined,
		onCloseColumnResize = undefined,
		children = undefined
	}: Props = $props();

	function handleCloseColumnOptions(e: Event) {
		onCloseColumnOptions?.(e);
	}

	function handleCloseColumnResize(e: Event) {
		onCloseColumnResize?.(e);
	}
</script>

<fluent-data-grid
	class={className}
	{...(style ? { style } : {})}
	{...(id ? { id } : {})}
	{...(ariaRowCount !== undefined ? { "aria-rowcount": ariaRowCount } : {})}
	{...(generateHeader ? { "generate-header": generateHeader } : {})}
	role={role}
	onclosecolumnoptions={handleCloseColumnOptions}
	onclosecolumnresize={handleCloseColumnResize}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-data-grid>
