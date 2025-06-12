<script lang="ts">
	import {fluentAnchor, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js";

	provideFluentDesignSystem().register(fluentAnchor())

	type Props = {
		id?: string
		title?: string
		timestamp?: Date
		topCTAType?: 'Dismiss' | 'Timestamp' | 'Action'
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
</style>

<div class="fluent-toast" id={id} tabindex="0">
	<div class="toast-header">
		<div class="fluent-toast-title">{title}</div>

		<div class="fluent-toast-action">
			{#if topCTAType === 'Dismiss'}
				<button title="Close" on:click={handleDismiss} aria-label="Dismiss" style="background: none; border: none; cursor: pointer;">
					✕
				</button>
			{:else if topCTAType === 'Timestamp' && timestamp}
				<span class="fluent-toast-small timestamp">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
			{:else if topCTAType === 'Action' && topAction}
				<fluent-anchor
					href="#"
					title={topAction}
					style="font-size: 14px; font-weight: 400;"
					appearance="hypertext"
					on:focusin={() => {}}
					on:focusout={() => {}}
					on:click={handleTopActionClick}
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
		<div class="fluent-toast-actions" style="margin-top: 0.5rem;">
			{#if primaryAction}
				<fluent-anchor
					href="#"
					title={primaryAction}
					style="font-size: 14px; font-weight: 400; margin-right: 1rem;"
					appearance="hypertext"
					on:focusin={() => {}}
					on:focusout={() => {}}
					on:click={handlePrimaryActionClick}
				>
					{primaryAction}
				</fluent-anchor>
			{/if}
			{#if secondaryAction}
				<fluent-anchor
					href="#"
					title={secondaryAction}
					style="font-size: 14px; font-weight: 400;"
					appearance="hypertext"
					on:focusin={() => {}}
					on:focusout={() => {}}
					on:click={handleSecondaryActionClick}
				>
					{secondaryAction}
				</fluent-anchor>
			{/if}
		</div>
	{/if}
</div>
