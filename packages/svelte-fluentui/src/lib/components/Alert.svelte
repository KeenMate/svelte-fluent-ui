<script lang="ts">
	import type {SlotType} from "../types/index.js"

	type Intent = 'info' | 'success' | 'warning' | 'danger'

	type Props = {
		intent?: Intent
		title?: string
		dismissable?: boolean
		class?: string
		style?: string
		ondismiss?: () => void
		icon?: SlotType
		children?: SlotType
	}

	let {
		intent = 'info',
		title = undefined,
		dismissable = false,
		class: classParam = undefined,
		style: styleParam = undefined,
		ondismiss = undefined,
		icon = undefined,
		children = undefined
	}: Props = $props()

	let dismissed = $state(false)

	function handleDismiss() {
		dismissed = true
		ondismiss?.()
	}

	let computedClass = $derived.by(() => {
		let classes = `fluent-alert fluent-alert--${intent}`
		if (classParam) classes += ` ${classParam}`
		return classes.trim()
	})

	// Default icons for each intent
	const defaultIcons: Record<Intent, string> = {
		info: 'ℹ',
		success: '✓',
		warning: '⚠',
		danger: '✕'
	}
</script>

{#if !dismissed}
	<div class={computedClass} style={styleParam} role="alert">
		<div class="fluent-alert__icon">
			{#if icon}
				{@render icon()}
			{:else}
				<span class="fluent-alert__icon-default">{defaultIcons[intent]}</span>
			{/if}
		</div>

		<div class="fluent-alert__content">
			{#if title}
				<div class="fluent-alert__title">{title}</div>
			{/if}
			{#if children}
				<div class="fluent-alert__body">
					{@render children()}
				</div>
			{/if}
		</div>

		{#if dismissable}
			<button
				class="fluent-alert__dismiss"
				aria-label="Dismiss"
				onclick={handleDismiss}
			>
				✕
			</button>
		{/if}
	</div>
{/if}

<style>
	.fluent-alert {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 12px 16px;
		background-color: var(--neutral-layer-1, #ffffff);
		border: 1px solid var(--neutral-stroke-1, #e0e0e0);
		border-radius: var(--fluent-border-radius-md);
		border-left-width: 4px;
		position: relative;
	}

	/* Intent variants */
	.fluent-alert--info {
		border-left-color: #0078d4;
	}

	.fluent-alert--info .fluent-alert__icon {
		background-color: rgba(0, 120, 212, 0.1);
		color: #0078d4;
	}

	.fluent-alert--success {
		border-left-color: #107c10;
	}

	.fluent-alert--success .fluent-alert__icon {
		background-color: rgba(16, 124, 16, 0.1);
		color: #107c10;
	}

	.fluent-alert--warning {
		border-left-color: #ffb900;
	}

	.fluent-alert--warning .fluent-alert__icon {
		background-color: rgba(255, 185, 0, 0.1);
		color: #ffb900;
	}

	.fluent-alert--danger {
		border-left-color: #d13438;
	}

	.fluent-alert--danger .fluent-alert__icon {
		background-color: rgba(209, 52, 56, 0.1);
		color: #d13438;
	}

	/* Icon */
	.fluent-alert__icon {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--fluent-border-radius-md);
		font-size: 14px;
	}

	.fluent-alert__icon-default {
		font-weight: 600;
	}

	/* Content */
	.fluent-alert__content {
		flex: 1;
		min-width: 0;
	}

	.fluent-alert__title {
		font-weight: 600;
		font-size: 14px;
		color: var(--neutral-foreground-rest, #323130);
		margin-bottom: 4px;
	}

	.fluent-alert__title:last-child {
		margin-bottom: 0;
	}

	.fluent-alert__body {
		font-size: 14px;
		color: var(--neutral-foreground-rest, #323130);
		line-height: 1.5;
	}

	/* Dismiss button */
	.fluent-alert__dismiss {
		flex-shrink: 0;
		background: none;
		border: none;
		color: var(--neutral-foreground-rest, #323130);
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--fluent-border-radius-md);
		font-size: 14px;
		line-height: 1;
		transition: background-color 0.1s ease, color 0.1s ease;
	}

	.fluent-alert__dismiss:hover {
		background-color: var(--neutral-fill-secondary-hover, rgba(0, 0, 0, 0.05));
	}

	.fluent-alert__dismiss:focus {
		outline: 2px solid var(--accent-fill-rest, #0078d4);
		outline-offset: 2px;
	}
</style>
