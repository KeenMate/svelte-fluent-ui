<!--
 * Chip Component (internal)
 *
 * The single selection-tag ("chip") used by Autocomplete and Combobox for
 * multi-select values. Previously each of those components defined its own chip
 * markup + CSS + design tokens, which drifted apart (different × colours, widths,
 * paddings). This is the one shared implementation so they can't diverge again.
 *
 * Not exported from the library index — it's an internal building block. Theme it
 * via the `--fluent-chip-*` custom properties.
 *
 * variant:
 *   "inline"   — sits inside a field's border (no border of its own).
 *   "external" — standalone row above/below a field (carries its own 1px border).
 * contrast:
 *   true when the host background equals the chip's default fill (readonly / filled
 *   fields), so the chip swaps to a white fill + inset ring to stay visible.
-->

<script lang="ts">
	type Props = {
		text?: string
		variant?: "inline" | "external"
		contrast?: boolean
		showRemove?: boolean
		removeLabel?: string
		title?: string
		onremove?: (event: MouseEvent) => void
	}

	let {
		text = "",
		variant = "inline",
		contrast = false,
		showRemove = true,
		removeLabel = undefined,
		title = undefined,
		onremove = undefined
	}: Props = $props()
</script>

<span
	class="fluent-chip"
	class:external={variant === "external"}
	class:contrast
	{...title ? {title} : {}}
>
	<span class="fluent-chip-text">{text}</span>
	{#if showRemove}
		<button
			type="button"
			class="fluent-chip-remove"
			tabindex="-1"
			aria-label={removeLabel ?? `Remove ${text}`}
			title={removeLabel ?? `Remove ${text}`}
			onclick={onremove}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
				<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
			</svg>
		</button>
	{/if}
</span>

<style>
	.fluent-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--fluent-chip-gap, 0.25rem);
		padding: var(--fluent-chip-padding-y, 0.125rem) var(--fluent-chip-padding-x, 0.5rem);
		background: var(--fluent-chip-background, var(--neutral-fill-secondary-rest, #f0f0f0));
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		font-size: var(--fluent-chip-font-size, 0.875rem);
		line-height: var(--fluent-chip-line-height, 1.4);
		white-space: nowrap;
		max-width: var(--fluent-chip-max-width, 9.375rem);
		color: var(--neutral-foreground-rest, #242424);
		box-sizing: border-box;
	}

	/* Standalone (above/below): its own 1px border since it doesn't sit inside a
	   field's border, and a little more room to breathe. */
	.fluent-chip.external {
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		max-width: var(--fluent-chip-external-max-width, 12.5rem);
	}

	/* Contrast: when the host background equals the chip's default fill (readonly /
	   filled fields), swap to a white fill + 1px inset ring so the chip stays visible
	   without changing height. */
	.fluent-chip.contrast {
		background: var(--neutral-fill-input-rest, #ffffff);
		box-shadow: inset 0 0 0 1px var(--neutral-stroke-rest, #d1d1d1);
	}

	.fluent-chip-text {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fluent-chip-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: var(--fluent-chip-remove-padding, 0.125rem);
		cursor: pointer;
		/* Accent by default — matches Microsoft's chips, and follows the theme accent
		   set by the Site settings "Color" combo (--accent-fill-rest). */
		color: var(--fluent-chip-remove-color, var(--accent-fill-rest, #0078d4));
		border-radius: var(--fluent-border-radius-sm);
		flex-shrink: 0;
		transition: color 0.1s ease, background 0.1s ease;
	}

	.fluent-chip-remove:hover {
		background: var(--fluent-chip-remove-background-hover, var(--neutral-fill-secondary-hover, #e0e0e0));
		color: var(--fluent-chip-remove-color-hover, var(--accent-fill-hover, #106ebe));
	}

	.fluent-chip-remove:focus-visible {
		outline: 1px solid var(--accent-fill-rest, #0078d4);
		outline-offset: 1px;
	}
</style>
