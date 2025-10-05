<script lang="ts">
	import {fluentAnchor, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js";

	provideFluentDesignSystem().register(fluentAnchor())

	type Props = {
		id?: string
		title?: string
		timestamp?: Date
		topCTAType?: 'dismiss' | 'timestamp' | 'action'
		topAction?: string
		primaryAction?: string
		secondaryAction?: string
		onDismiss?: () => void
		onTopActionClick?: () => void
		onPrimaryActionClick?: () => void
		onSecondaryActionClick?: () => void
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
		onDismiss,
		onTopActionClick,
		onPrimaryActionClick,
		onSecondaryActionClick,
		children
	}: Props = $props()

	function handleDismiss() {
		onDismiss?.()
	}

	function handleTopActionClick() {
		onTopActionClick?.()
	}

	function handlePrimaryActionClick() {
		onPrimaryActionClick?.()
	}

	function handleSecondaryActionClick() {
		onSecondaryActionClick?.()
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

<div class="fluent-toast" id={id} tabindex="0">
	<div class="toast-header">
		<div class="fluent-toast-title">{title}</div>

		<div class="fluent-toast-action">
			{#if topCTAType === 'dismiss'}
				<button title="Close" onclick={handleDismiss} aria-label="Dismiss" class="dismiss-button">
					✕
				</button>
			{:else if topCTAType === 'timestamp' && timestamp}
				<span class="fluent-toast-small timestamp">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
			{:else if topCTAType === 'action' && topAction}
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
