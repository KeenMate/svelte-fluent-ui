<script lang="ts">
	import { fluentTab, fluentTabPanel, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentTab(), fluentTabPanel());

	type Props = {
		class?: string;
		style?: string;
		id?: string;
		disabled?: boolean;
		ariaLabel?: string;
		label?: string;
		icon?: SlotType;
		header?: SlotType;
		content?: SlotType;
		childContent?: SlotType;
		labelEditable?: boolean;
		showClose?: boolean;
		overflow?: string;
		visible?: boolean;
		/** Arbitrary context data passed to ontabchange when this tab is selected */
		data?: Record<string, unknown>;
		oncloseclick?: () => void;
	};

	let {
		class: className = "",
		style = "",
		id = undefined,
		disabled = undefined,
		ariaLabel = undefined,
		label = undefined,
		icon = undefined,
		header = undefined,
		content = undefined,
		childContent = undefined,
		labelEditable = false,
		showClose = false,
		overflow = undefined,
		visible = true,
		data = undefined,
		oncloseclick = undefined
	}: Props = $props();
</script>

{#if visible}
	<fluent-tab
		class="tab-wrapper {className}"
		style={style}
		{id}
		{disabled}
		aria-label={ariaLabel || label}
		{overflow}
		data-tab-context={data ? JSON.stringify(data) : undefined}
	>
		{#if icon}
			{@render icon?.()}
		{/if}

		{#if header}
			{@render header?.()}
		{:else if labelEditable}
			<span
				contenteditable="true"
				autocapitalize="off"
				spellcheck="false"
				title="Click to edit this tab name"
				class="editable-label"
			>
				{label}
			</span>
		{:else if label}
			{label}
		{/if}

		{#if showClose}
			<fluent-icon
				value="dismiss"
				width="12px"
				class="fluent-tab-close"
				title="Close"
				onclick={oncloseclick}
			/>
		{/if}
	</fluent-tab>

	<fluent-tab-panel style={style} class={className} id={`${id}-panel`}>
		{@render content?.()}
		{@render childContent?.()}
	</fluent-tab-panel>
{/if}

<style>
	.tab-wrapper {
		margin-right: 0.5rem;
	}

	.editable-label {
		padding: 3px 5px;
	}

	/*
	 * Override Microsoft FluentUI's shipped rule:
	 *   fluent-tab[aria-selected="true"] { z-index: 1 }
	 *
	 * Combined with `position: relative` on tabs and an elevated parent
	 * stacking context (sticky header, transformed container, etc.), that
	 * rule makes selected tabs render above modals/overlays. Reset it.
	 *
	 * Lives here (not in a global SCSS file) so it ships automatically
	 * whenever the consumer uses our Tab component, regardless of which
	 * stylesheets they choose to import. !important is used because the
	 * upstream rule has identical specificity and we can't guarantee
	 * source order in the consumer's bundle.
	 */
	:global(fluent-tab[aria-selected="true"]) {
		z-index: auto !important;
	}
</style>

