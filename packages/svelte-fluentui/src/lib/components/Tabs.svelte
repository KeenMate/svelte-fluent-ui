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
		/**
		 * How the tab list handles widths wider than the container.
		 *  - "scroll" (default): horizontal scrolling via `overflow-x: auto`
		 *  - "wrap": let tabs flow onto multiple rows
		 *  - "clip": FluentUI's original behavior (tablist grows to `max-content`,
		 *    overflowing the container). Kept for opt-out.
		 */
		responsive?: "scroll" | "wrap" | "clip";
		/**
		 * When true, the tab list stretches to fill the available width so the
		 * tabs are justified across the container (each tab takes an equal share
		 * of the row). Defaults to `false` — tabs stay compactly aligned at the
		 * start with their natural widths.
		 */
		justify?: boolean;
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
		responsive = "scroll",
		justify = false,
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
	class="fluent-tabs-wrapper responsive-{responsive}{justify ? ' justify' : ''} {className}"
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

<style>
	/*
	 * Responsive tab list.
	 *
	 * FluentUI's shadow DOM sets `.tablist { width: max-content }`, so the
	 * tab list always grows to fit its children and overflows narrow
	 * containers. We reach into the shadow DOM via ::part(tablist) (the
	 * fluent-tabs template exposes `part="tablist"`) to change the width
	 * strategy without touching any upstream code.
	 *
	 * Kept in the scoped style block with :global() so the rules ship
	 * automatically whenever this component is used, regardless of which
	 * SCSS bundles the consumer imports.
	 */

	/*
	 * scroll: horizontal overflow with a scroll bar (default).
	 *
	 * Do NOT set `width: 100%` on the tablist — FluentUI uses a CSS grid
	 * whose tracks stretch to fill, so forcing 100% width justifies the
	 * tabs across the whole container. Instead: cap via `max-width` and
	 * put the scroll on the host element, so the tablist keeps its natural
	 * `width: max-content` layout and scrolls only when it exceeds the
	 * container.
	 */
	:global(.fluent-tabs-wrapper.responsive-scroll) {
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
	}

	/* wrap: tabs flow onto multiple rows */
	:global(.fluent-tabs-wrapper.responsive-wrap) {
		max-width: 100%;
	}
	:global(.fluent-tabs-wrapper.responsive-wrap::part(tablist)) {
		max-width: 100%;
		flex-wrap: wrap;
	}

	/* clip: preserve the upstream behavior (tablist grows to max-content) */
	/* no override needed — the shadow DOM default applies */

	/*
	 * justify: stretch the tab list to fill the available width so tabs
	 * divide the row equally. Overrides FluentUI's `width: max-content` on
	 * the inner tablist. In "scroll" mode this disables scrolling (there
	 * won't be overflow because the list already fits). Does not apply in
	 * "clip" mode.
	 */
	:global(.fluent-tabs-wrapper.justify:not(.responsive-clip)::part(tablist)) {
		width: 100%;
	}
	:global(.fluent-tabs-wrapper.justify.responsive-scroll) {
		overflow-x: visible;
	}

	/* Tabs themselves should never compress their labels nor be shrunk by
	   the flex container.  Only matters in scroll/wrap modes but harmless
	   otherwise. */
	:global(.fluent-tabs-wrapper:not(.responsive-clip) fluent-tab) {
		white-space: nowrap;
		flex-shrink: 0;
	}
</style>
