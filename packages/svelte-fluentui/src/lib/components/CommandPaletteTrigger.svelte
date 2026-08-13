<script lang="ts">
	import Button from "./Button.svelte"

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

{#snippet searchIcon()}
	<svg class="cp-trigger-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M7 1.75a5.25 5.25 0 1 0 3.215 9.4l3.067 3.068a.75.75 0 1 0 1.061-1.061l-3.066-3.066A5.25 5.25 0 0 0 7 1.75zM3.25 7a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z" fill="currentColor"/>
	</svg>
{/snippet}

{#snippet kbdHint()}
	<span class="cp-trigger-kbd">{shortcut}</span>
{/snippet}

<!--
	A launcher styled like a search field, built on the native Fluent button so it
	inherits Fluent's focus/hover/press states. It stays a button (opens the
	CommandPalette on click) — the search-box layout (icon · placeholder · shortcut)
	is composed via the button's start / default / end slots, and the `::part`
	overrides below only relax the control's centred layout so the placeholder fills
	and the shortcut hint pins to the trailing edge.
-->
<Button
	appearance="neutral"
	type="button"
	class={`cp-trigger cp-trigger--${size} ${className}`.trim()}
	aria-label={placeholder}
	start={searchIcon}
	end={shortcut ? kbdHint : undefined}
	{onclick}
>
	<span class="cp-trigger-label">{placeholder}</span>
</Button>

<style>
	/* Widen the control into a search-field pill (Fluent's host min-width is ~1 line height). */
	:global(fluent-button.cp-trigger) {
		min-width: 200px;
	}
	:global(fluent-button.cp-trigger--small) {
		min-width: 160px;
	}
	:global(fluent-button.cp-trigger--large) {
		min-width: 240px;
	}

	/* Left-align the row and let the placeholder grow so the shortcut sits at the end. */
	:global(fluent-button.cp-trigger::part(control)) {
		width: 100%;
		justify-content: flex-start;
		gap: 0.5rem;
	}
	:global(fluent-button.cp-trigger::part(content)) {
		flex: 1 1 auto;
		justify-content: flex-start;
	}

	/* Slotted content — muted "placeholder" look, matching a real search input. */
	.cp-trigger-icon {
		flex-shrink: 0;
		color: var(--neutral-foreground-hint);
	}

	.cp-trigger-label {
		color: var(--neutral-foreground-hint);
		font-weight: 400;
		text-align: start;
	}

	:global(fluent-button.cp-trigger--small) .cp-trigger-label {
		font-size: 0.8125rem;
	}
	:global(fluent-button.cp-trigger--large) .cp-trigger-label {
		font-size: 0.9375rem;
	}

	.cp-trigger-kbd {
		flex-shrink: 0;
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--neutral-stroke-layer-rest, #d0d0d0);
		border-radius: 3px;
		background: var(--neutral-layer-1, #ffffff);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--neutral-foreground-hint);
	}

	@media (max-width: 768px) {
		.cp-trigger-label,
		.cp-trigger-kbd {
			display: none;
		}
		:global(fluent-button.cp-trigger) {
			min-width: auto;
		}
	}
</style>
