<script lang="ts">
	import { fluentTabs, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentTabs());

	type TabChangeDetail = {
		tabId: string;
		data?: Record<string, unknown>;
	};

	type Props = {
		id?: string;
		class?: string;
		style?: string;
		orientation?: "horizontal" | "vertical";
		activeId?: string;
		showActiveIndicator?: boolean;
		childContent?: SlotType;
		overflow?: { label: string; onclick?: () => void }[];
		moreButtonId?: string;
		styleMoreValues?: string;
		ontabchange?: (detail: TabChangeDetail) => void;
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
		ontabchange = undefined
	}: Props = $props();

	let tabsElement: HTMLElement | undefined = $state();

	function handleTabChange(e: Event) {
		const target = e.target as HTMLElement;
		const activeTab = target.querySelector('fluent-tab[aria-selected="true"]') as HTMLElement | null;

		if (activeTab) {
			const tabId = activeTab.id || "";
			const contextData = activeTab.dataset.tabContext;
			const data = contextData ? JSON.parse(contextData) : undefined;

			ontabchange?.({ tabId, data });
		}
	}

	$effect(() => {
		if (tabsElement) {
			tabsElement.addEventListener('change', handleTabChange);
			return () => {
				tabsElement?.removeEventListener('change', handleTabChange);
			};
		}
	});
</script>

<fluent-tabs
	bind:this={tabsElement}
	{id}
	class={className}
	{style}
	orientation={orientation}
	activeid={activeId}
	activeindicator={showActiveIndicator.toString()}
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
			<fluent-menu-item label={item.label} onclick={() => item.onclick?.()} />
		{/each}
	</fluent-menu>
{/if}
