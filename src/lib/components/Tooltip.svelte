<script lang="ts">
	import { fluentTooltip, fluentAnchoredRegion, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentAnchoredRegion());
	provideFluentDesignSystem().register(fluentTooltip());

	type Props = {
		class?: string;
		style?: string;
		visible?: boolean;
		anchor?: string;
		delay?: number;
		position?: "top" | "bottom" | "start" | "end";
		autoUpdateMode?: "anchor" | "tooltip" | "auto";
		horizontalViewportLock?: boolean;
		verticalViewportLock?: boolean;
		children?: SlotType;
		maxWidth?: string;
		[prop:string]:any;
	};

	let {
		class: className = "",
		style = "",
		visible = undefined,
		anchor = undefined,
		delay = undefined,
		position = undefined,
		autoUpdateMode = undefined,
		horizontalViewportLock = undefined,
		verticalViewportLock = undefined,
		children = undefined,
		maxWidth = undefined,
		...restProps
	}: Props = $props();
</script>

<fluent-tooltip
	class={className}
	style={style}
	{visible}
	{anchor}
	{delay}
	{position}
	{autoUpdateMode}
	{horizontalViewportLock}
	{verticalViewportLock}
	role="tooltip"
	{...restProps}
>
	{#if children}
		{#if maxWidth}
			<div style={`max-width: ${maxWidth}; text-wrap: wrap;`}>
				{@render children()}
			</div>
		{:else}
			{@render children()}
		{/if}
	{/if}
</fluent-tooltip>
