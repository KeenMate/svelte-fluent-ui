<script lang="ts">
	type Props = {
		/** Placeholder text shown in the pill. */
		placeholder?: string
		/**
		 * Keyboard hint shown on the trailing side. Defaults to the platform's
		 * command-palette shortcut (⌘K on Mac, Ctrl K elsewhere). Pass `null` to hide.
		 */
		shortcut?: string | null
		/** Size variant, matching the library's input/button sizing. */
		size?: "small" | "medium" | "large"
		class?: string
		onclick?: () => void
	}

	const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform)

	let {
		placeholder = "Search…",
		shortcut = isMac ? "⌘K" : "Ctrl K",
		size = "medium",
		class: className = "",
		onclick = undefined
	}: Props = $props()
</script>

<button
	type="button"
	class="cp-trigger cp-trigger--{size} {className}"
	aria-label={placeholder}
	{onclick}
>
	<svg class="cp-trigger-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M7 1.75a5.25 5.25 0 1 0 3.215 9.4l3.067 3.068a.75.75 0 1 0 1.061-1.061l-3.066-3.066A5.25 5.25 0 0 0 7 1.75zM3.25 7a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z" fill="currentColor"/>
	</svg>
	<span class="cp-trigger-label">{placeholder}</span>
	{#if shortcut}
		<span class="cp-trigger-kbd">{shortcut}</span>
	{/if}
</button>

<style>
	.cp-trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.625rem;
		background: var(--neutral-layer-2, #f5f5f5);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 6px;
		color: var(--neutral-foreground-hint, #888);
		cursor: pointer;
		font-family: var(--body-font, inherit);
		font-size: 0.875rem;
		min-width: 200px;
		transition: background 120ms ease, border-color 120ms ease;
	}

	.cp-trigger:hover {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
		border-color: var(--neutral-stroke-rest, #c8c8c8);
	}

	.cp-trigger:focus-visible {
		outline: calc(var(--focus-stroke-width, 2) * 1px) solid var(--focus-stroke-outer);
		outline-offset: 1px;
	}

	.cp-trigger--small {
		padding: 0.25rem 0.5rem;
		font-size: 0.8125rem;
		min-width: 160px;
	}

	.cp-trigger--large {
		padding: 0.5rem 0.75rem;
		font-size: 0.9375rem;
		min-width: 240px;
	}

	.cp-trigger-icon {
		flex-shrink: 0;
	}

	.cp-trigger-label {
		flex: 1;
		text-align: start;
	}

	.cp-trigger-kbd {
		flex-shrink: 0;
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--neutral-stroke-layer-rest, #d0d0d0);
		border-radius: 3px;
		background: var(--neutral-layer-1, #ffffff);
		font-size: 0.7rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.cp-trigger-label,
		.cp-trigger-kbd {
			display: none;
		}
		.cp-trigger {
			min-width: auto;
			padding: 0.5rem;
		}
	}
</style>
