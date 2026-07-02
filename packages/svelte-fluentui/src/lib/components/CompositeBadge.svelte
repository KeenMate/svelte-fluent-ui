<script lang="ts">
	/**
	 * CompositeBadge — a three-section chip: [icon][label][button].
	 * Use for notification pills, status + count, or interactive/dismissible
	 * chips. Ported from pure-admin's `pa-composite-badge`.
	 *
	 * Each section can take the base `color`, or you can override the label and
	 * button sections independently via `labelColor` / `buttonColor` (e.g. a
	 * success chip with a red `danger` dismiss button). Colours resolve from the
	 * shared semantic palette (`--fluent-color-<name>-*`).
	 */
	import type {SlotType} from "../types/index.js"

	type CompositeColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark"

	type Props = {
		color?: CompositeColor
		/** Override only the label (middle) section colour. */
		labelColor?: CompositeColor
		/** Override only the button (right) section colour. Defaults to `color`. */
		buttonColor?: CompositeColor
		/** Icon slot (left section). Section is omitted when not provided. */
		icon?: SlotType
		/** Label content (middle section). */
		label?: SlotType
		/** Button content (right section). Defaults to a `×` dismiss glyph. */
		button?: SlotType
		/** Render the button section. */
		showButton?: boolean
		/** Accessible title/tooltip for the button. */
		buttonTitle?: string
		onlabelclick?: (ev: MouseEvent) => void
		onbuttonclick?: (ev: MouseEvent) => void
		class?: string
		style?: string
	}

	let {
		color = "primary",
		labelColor = undefined,
		buttonColor = undefined,
		icon = undefined,
		label = undefined,
		button = undefined,
		showButton = true,
		buttonTitle = undefined,
		onlabelclick = undefined,
		onbuttonclick = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	let classes = $derived.by(() => {
		let cls = ["composite-badge", `composite-badge-${color}`]
		if (labelColor) cls.push(`composite-badge-label-${labelColor}`)
		if (buttonColor) cls.push(`composite-badge-btn-${buttonColor}`)
		if (onlabelclick) cls.push("is-clickable")
		if (className) cls.push(className)
		return cls.join(" ")
	})
</script>

<div class={classes} style={style || null}>
	{#if icon}<span class="composite-badge-icon">{@render icon()}</span>{/if}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span class="composite-badge-label" onclick={onlabelclick}>{@render label?.()}</span>
	{#if showButton}
		<button class="composite-badge-button" type="button" title={buttonTitle || null} onclick={onbuttonclick}>
			{#if button}{@render button()}{:else}&times;{/if}
		</button>
	{/if}
</div>

<style>
	.composite-badge {
		display: inline-flex;
		align-items: stretch;
		height: 24px;
		font-family: var(--body-font);
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		font-weight: 500;
		border-radius: var(--control-corner-radius, 4px);
		overflow: hidden;
		box-sizing: border-box;
	}

	.composite-badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 24px;
		padding: 0 6px;
		flex-shrink: 0;
		background-color: var(--v-solid);
		color: var(--v-contrast);
	}

	.composite-badge-label {
		display: flex;
		align-items: center;
		padding: 0 8px;
		background-color: var(--lv-tint, var(--v-tint));
		color: var(--lv-emphasis, var(--v-emphasis));
		user-select: none;
		transition: background-color 150ms ease;
	}

	.composite-badge.is-clickable .composite-badge-label {
		cursor: pointer;
	}

	.composite-badge.is-clickable .composite-badge-label:hover {
		background-color: color-mix(in srgb, var(--lv-emphasis, var(--v-emphasis)) 18%, transparent);
	}

	.composite-badge-button {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 22px;
		padding: 0 6px;
		flex-shrink: 0;
		border: none;
		font: inherit;
		line-height: 1;
		cursor: pointer;
		background-color: var(--bv-solid, var(--v-solid));
		color: var(--bv-contrast, var(--v-contrast));
		transition: filter 150ms ease;
	}

	.composite-badge-button:hover {
		filter: brightness(0.92);
	}

	.composite-badge-button:focus-visible {
		outline: 2px solid var(--focus-stroke-outer, currentColor);
		outline-offset: -2px;
	}

	/* Variant palette — sets the section colour vars for all three sections. */
	.composite-badge-primary {
		--v-solid: var(--fluent-color-primary, #0078d4);
		--v-contrast: var(--fluent-color-primary-contrast, #fff);
		--v-tint: var(--fluent-color-primary-tint, rgba(0, 120, 212, 0.12));
		--v-emphasis: var(--fluent-color-primary-emphasis, #0067b8);
	}
	.composite-badge-secondary {
		--v-solid: var(--fluent-color-secondary, #616161);
		--v-contrast: var(--fluent-color-secondary-contrast, #fff);
		--v-tint: var(--fluent-color-secondary-tint, rgba(97, 97, 97, 0.12));
		--v-emphasis: var(--fluent-color-secondary-emphasis, #424242);
	}
	.composite-badge-success {
		--v-solid: var(--fluent-color-success, #107c10);
		--v-contrast: var(--fluent-color-success-contrast, #fff);
		--v-tint: var(--fluent-color-success-tint, rgba(16, 124, 16, 0.12));
		--v-emphasis: var(--fluent-color-success-emphasis, #0e700e);
	}
	.composite-badge-warning {
		--v-solid: var(--fluent-color-warning, #fde300);
		--v-contrast: var(--fluent-color-warning-contrast, #242424);
		--v-tint: var(--fluent-color-warning-tint, rgba(253, 227, 0, 0.22));
		--v-emphasis: var(--fluent-color-warning-emphasis, #8a6d00);
	}
	.composite-badge-danger {
		--v-solid: var(--fluent-color-danger, #c50f1f);
		--v-contrast: var(--fluent-color-danger-contrast, #fff);
		--v-tint: var(--fluent-color-danger-tint, rgba(197, 15, 31, 0.12));
		--v-emphasis: var(--fluent-color-danger-emphasis, #b10e1e);
	}
	.composite-badge-info {
		--v-solid: var(--fluent-color-info, #0a94d6);
		--v-contrast: var(--fluent-color-info-contrast, #fff);
		--v-tint: var(--fluent-color-info-tint, rgba(10, 148, 214, 0.12));
		--v-emphasis: var(--fluent-color-info-emphasis, #0a6a9a);
	}
	.composite-badge-light {
		--v-solid: var(--fluent-color-light, #f0f0f0);
		--v-contrast: var(--fluent-color-light-contrast, #242424);
		--v-tint: var(--fluent-color-light-tint, #f5f5f5);
		--v-emphasis: var(--fluent-color-light-emphasis, #8a8a8a);
	}
	.composite-badge-dark {
		--v-solid: var(--fluent-color-dark, #242424);
		--v-contrast: var(--fluent-color-dark-contrast, #fff);
		--v-tint: var(--fluent-color-dark-tint, rgba(36, 36, 36, 0.1));
		--v-emphasis: var(--fluent-color-dark-emphasis, #242424);
	}

	/* Label-section overrides */
	.composite-badge-label-primary {
		--lv-tint: var(--fluent-color-primary-tint, rgba(0, 120, 212, 0.12));
		--lv-emphasis: var(--fluent-color-primary-emphasis, #0067b8);
	}
	.composite-badge-label-secondary {
		--lv-tint: var(--fluent-color-secondary-tint, rgba(97, 97, 97, 0.12));
		--lv-emphasis: var(--fluent-color-secondary-emphasis, #424242);
	}
	.composite-badge-label-success {
		--lv-tint: var(--fluent-color-success-tint, rgba(16, 124, 16, 0.12));
		--lv-emphasis: var(--fluent-color-success-emphasis, #0e700e);
	}
	.composite-badge-label-warning {
		--lv-tint: var(--fluent-color-warning-tint, rgba(253, 227, 0, 0.22));
		--lv-emphasis: var(--fluent-color-warning-emphasis, #8a6d00);
	}
	.composite-badge-label-danger {
		--lv-tint: var(--fluent-color-danger-tint, rgba(197, 15, 31, 0.12));
		--lv-emphasis: var(--fluent-color-danger-emphasis, #b10e1e);
	}
	.composite-badge-label-info {
		--lv-tint: var(--fluent-color-info-tint, rgba(10, 148, 214, 0.12));
		--lv-emphasis: var(--fluent-color-info-emphasis, #0a6a9a);
	}
	.composite-badge-label-light {
		--lv-tint: var(--fluent-color-light-tint, #f5f5f5);
		--lv-emphasis: var(--fluent-color-light-emphasis, #8a8a8a);
	}
	.composite-badge-label-dark {
		--lv-tint: var(--fluent-color-dark-tint, rgba(36, 36, 36, 0.1));
		--lv-emphasis: var(--fluent-color-dark-emphasis, #242424);
	}

	/* Button-section overrides */
	.composite-badge-btn-primary {
		--bv-solid: var(--fluent-color-primary, #0078d4);
		--bv-contrast: var(--fluent-color-primary-contrast, #fff);
	}
	.composite-badge-btn-secondary {
		--bv-solid: var(--fluent-color-secondary, #616161);
		--bv-contrast: var(--fluent-color-secondary-contrast, #fff);
	}
	.composite-badge-btn-success {
		--bv-solid: var(--fluent-color-success, #107c10);
		--bv-contrast: var(--fluent-color-success-contrast, #fff);
	}
	.composite-badge-btn-warning {
		--bv-solid: var(--fluent-color-warning, #fde300);
		--bv-contrast: var(--fluent-color-warning-contrast, #242424);
	}
	.composite-badge-btn-danger {
		--bv-solid: var(--fluent-color-danger, #c50f1f);
		--bv-contrast: var(--fluent-color-danger-contrast, #fff);
	}
	.composite-badge-btn-info {
		--bv-solid: var(--fluent-color-info, #0a94d6);
		--bv-contrast: var(--fluent-color-info-contrast, #fff);
	}
	.composite-badge-btn-light {
		--bv-solid: var(--fluent-color-light, #f0f0f0);
		--bv-contrast: var(--fluent-color-light-contrast, #242424);
	}
	.composite-badge-btn-dark {
		--bv-solid: var(--fluent-color-dark, #242424);
		--bv-contrast: var(--fluent-color-dark-contrast, #fff);
	}
</style>
