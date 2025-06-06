<script lang="ts">
	import { fluentTabs, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentTabs());

	type Props = {
		id?: string;
		class?: string;
		style?: string;
		orientation?: "horizontal" | "vertical";
		activeId?: string;
		showActiveIndicator?: boolean;
		childContent?: SlotType;
		overflow?: { label: string; onClick?: () => void }[];
		moreButtonId?: string;
		styleMoreValues?: string;
		onTabChange?: (e: Event) => void;
		[prop: string]: any;
	};

	let {
		id = undefined,
		class: className = "",
		style = "",
		orientation = "horizontal",
		activeId = undefined,
		showActiveIndicator = true,
		childContent = undefined,
		overflow = [],
		moreButtonId = "more-button",
		styleMoreValues = "",
		onTabChange = undefined,
		...restProps
	}: Props = $props();

	function handleTabChange(e: Event) {
		onTabChange?.(e);
	}
</script>

<fluent-tabs
	bind:this={Element}
	{id}
	class={className}
	{style}
	orientation={orientation}
	activeid={activeId}
	activeindicator={showActiveIndicator.toString()}
	ontabchange={handleTabChange}
	{...restProps}
>
	{@render childContent?.()}

	{#if overflow.length}
		<fluent-badge id={moreButtonId} appearance="neutral" style={styleMoreValues} slot="end">
			+{overflow.length}
		</fluent-badge>
	{/if}
</fluent-tabs>

{#if overflow.length}
	<fluent-menu anchor={moreButtonId} trigger="MouseButton.Left" anchored={true}>
		{#each overflow as item}
			<fluent-menu-item label={item.label} onclick={() => item.onClick?.()} />
		{/each}
	</fluent-menu>
{/if}
