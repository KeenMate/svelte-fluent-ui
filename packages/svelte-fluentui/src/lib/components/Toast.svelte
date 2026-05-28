<script lang="ts">
	import {fluentAnchor, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js";
	import DismissIcon from "./icons/DismissIcon.svelte"

	provideFluentDesignSystem().register(fluentAnchor())

	type Props = {
		id?: string
		title?: string
		timestamp?: Date
		topCTAType?: 'dismiss' | 'timestamp' | 'action'
		topAction?: string
		primaryAction?: string
		secondaryAction?: string
		ondismiss?: () => void
		ontopactionclick?: () => void
		onprimaryactionclick?: () => void
		onsecondaryactionclick?: () => void
		children?: SlotType
	}

	let {
		id,
		title,
		timestamp,
		topCTAType,
		topAction,
		primaryAction,
		secondaryAction,
		ondismiss,
		ontopactionclick,
		onprimaryactionclick,
		onsecondaryactionclick,
		children
	}: Props = $props()

	function handleDismiss() {
		ondismiss?.()
	}

	function handleTopActionClick() {
		ontopactionclick?.()
	}

	function handlePrimaryActionClick() {
		onprimaryactionclick?.()
	}

	function handleSecondaryActionClick() {
		onsecondaryactionclick?.()
	}
</script>

<style>
	.toast-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
	}

	.dismiss-button {
		background: none;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		color: var(--neutral-foreground-rest);
	}

	.toast-action-link {
		font-size: 14px;
		font-weight: 400;
	}

	.fluent-toast-actions {
		margin-top: 0.5rem;
	}

	.primary-action {
		margin-right: 1rem;
	}
</style>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="fluent-toast" id={id} tabindex="0">
	<div class="toast-header">
		<div class="fluent-toast-title">{title}</div>

		<div class="fluent-toast-action">
			{#if topCTAType === 'dismiss'}
				<button title="Close" onclick={handleDismiss} aria-label="Dismiss" class="dismiss-button">
					<DismissIcon size={14} />
				</button>
			{:else if topCTAType === 'timestamp' && timestamp}
				<span class="fluent-toast-small timestamp">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
			{:else if topCTAType === 'action' && topAction}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<fluent-anchor
					href="#"
					title={topAction}
					class="toast-action-link"
					appearance="hypertext"
					onfocusin={() => {}}
					onfocusout={() => {}}
					onclick={handleTopActionClick}
				>
					{topAction}
				</fluent-anchor>
			{/if}
		</div>
	</div>

	{#if children}
		{@render children?.()}
	{/if}

	{#if primaryAction || secondaryAction}
		<div class="fluent-toast-actions">
			{#if primaryAction}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<fluent-anchor
					href="#"
					title={primaryAction}
					class="toast-action-link primary-action"
					appearance="hypertext"
					onfocusin={() => {}}
					onfocusout={() => {}}
					onclick={handlePrimaryActionClick}
				>
					{primaryAction}
				</fluent-anchor>
			{/if}
			{#if secondaryAction}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<fluent-anchor
					href="#"
					title={secondaryAction}
					class="toast-action-link"
					appearance="hypertext"
					onfocusin={() => {}}
					onfocusout={() => {}}
					onclick={handleSecondaryActionClick}
				>
					{secondaryAction}
				</fluent-anchor>
			{/if}
		</div>
	{/if}
</div>
