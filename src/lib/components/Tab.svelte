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
		loadingContent?: SlotType;
		labelEditable?: boolean;
		showClose?: boolean;
		overflow?: string;
		visible?: boolean;
		onCloseClick?: () => void;
		[prop: string]: any;
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
		loadingContent = undefined,
		labelEditable = false,
		showClose = false,
		overflow = undefined,
		visible = true,
		onCloseClick = undefined,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<fluent-tab
		class={className}
		style={`margin-right: 0.5rem; ${style}`}
		{id}
		{disabled}
		aria-label={ariaLabel || label}
		{overflow}
		{...restProps}
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
				style="padding: 3px 5px;"
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
				on:click={onCloseClick}
			/>
		{/if}
	</fluent-tab>

	<fluent-tab-panel style={style} class={className} id={`${id}-panel`}>
		{@render content?.()}
		{@render childContent?.()}
	</fluent-tab-panel>
{/if}

<!-- <script lang="ts">
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
		loadingContent?: SlotType;
		labelEditable?: boolean;
		showClose?: boolean;
		overflow?: string;
		visible?: boolean;
		onCloseClick?: () => void;
		[prop: string]: any;
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
		loadingContent = undefined,
		labelEditable = false,
		showClose = false,
		overflow = undefined,
		visible = true,
		onCloseClick = undefined,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<fluent-tab
		class={className}
		{style}
		{id}
		{disabled}
		aria-label={ariaLabel || label}
		{overflow}
		{...restProps}
	>
		
		{#if labelEditable}
			<span
				contenteditable="true"
				autocapitalize="off"
				spellcheck="false"
				title="Click to edit this tab name"
				style="padding: 3px 5px;"
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
				on:click={onCloseClick}
			/>
		{/if}
	</fluent-tab>

	<fluent-tab-panel style={style} class={className} id={`${id}-panel`}>
		<slot />
	</fluent-tab-panel>
{/if} -->

