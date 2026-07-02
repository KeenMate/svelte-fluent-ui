<script lang="ts">
	/**
	 * Label — a lightweight, tag-style indicator: tinted background + coloured
	 * border in the variant colour, medium weight. Sits alongside Badge for
	 * inline content tags / category chips. Ported from pure-admin's `pa-label`.
	 *
	 * Colours resolve from the shared semantic palette
	 * (`--fluent-color-<name>-*`, see fluent-blazor-compat.scss).
	 */
	import type {SlotType} from "../types/index.js"

	type LabelColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info"
	type LabelSize = "xs" | "sm" | "medium" | "lg" | "xl"

	type Props = {
		color?: LabelColor
		size?: LabelSize
		/** Transparent background; fills with the tint on hover. */
		outline?: boolean
		/** Icon slot rendered before the label text. */
		icon?: SlotType
		children?: SlotType
		onclick?: (ev: MouseEvent) => void
		class?: string
		style?: string
	}

	let {
		color = "primary",
		size = "medium",
		outline = false,
		icon = undefined,
		children = undefined,
		onclick = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	let classes = $derived.by(() => {
		let cls = ["fluent-label", `fluent-label-${color}`]
		if (size && size !== "medium") cls.push(`fluent-label-${size}`)
		if (outline) cls.push("fluent-label-outline")
		if (className) cls.push(className)
		return cls.join(" ")
	})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<span class={classes} style={style || null} onclick={onclick}>
	{#if icon}<span class="fluent-label-icon">{@render icon()}</span>{/if}
	{@render children?.()}
</span>

<style>
	.fluent-label {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		box-sizing: border-box;
		font-family: var(--body-font);
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		font-weight: 500;
		line-height: 1.2;
		padding: 3px 8px;
		border-radius: var(--control-corner-radius, 4px);
		border: 1px solid transparent;
		text-decoration: none;
		transition: background-color 100ms ease, color 100ms ease, border-color 100ms ease;
	}

	.fluent-label-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	/* Size scale (mirrors Badge) */
	.fluent-label-xs {
		font-size: var(--type-ramp-minus-2-font-size, 10px);
		padding: 1px 4px;
	}

	.fluent-label-sm {
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		padding: 2px 6px;
	}

	.fluent-label-lg {
		font-size: var(--type-ramp-base-font-size, 14px);
		padding: 4px 10px;
	}

	.fluent-label-xl {
		font-size: var(--type-ramp-plus-1-font-size, 16px);
		padding: 5px 12px;
	}

	/* Colour variants — tinted fill + coloured line, driven by the palette.
	   Each maps a --lc (line colour) and --tc (tint colour) so the shared
	   rules below stay DRY. */
	.fluent-label-primary {
		--lc: var(--fluent-color-primary-emphasis, #0067b8);
		--tc: var(--fluent-color-primary-tint, rgba(0, 120, 212, 0.12));
	}
	.fluent-label-secondary {
		--lc: var(--fluent-color-secondary-emphasis, #424242);
		--tc: var(--fluent-color-secondary-tint, rgba(97, 97, 97, 0.12));
	}
	.fluent-label-success {
		--lc: var(--fluent-color-success-emphasis, #0e700e);
		--tc: var(--fluent-color-success-tint, rgba(16, 124, 16, 0.12));
	}
	.fluent-label-warning {
		--lc: var(--fluent-color-warning-emphasis, #8a6d00);
		--tc: var(--fluent-color-warning-tint, rgba(253, 227, 0, 0.22));
	}
	.fluent-label-danger {
		--lc: var(--fluent-color-danger-emphasis, #b10e1e);
		--tc: var(--fluent-color-danger-tint, rgba(197, 15, 31, 0.12));
	}
	.fluent-label-info {
		--lc: var(--fluent-color-info-emphasis, #0a6a9a);
		--tc: var(--fluent-color-info-tint, rgba(10, 148, 214, 0.12));
	}

	.fluent-label {
		background-color: var(--tc);
		color: var(--lc);
		border-color: var(--lc);
	}

	.fluent-label:hover {
		background-color: var(--tc);
	}

	/* Outline — transparent until hover */
	.fluent-label-outline {
		background-color: transparent;
	}

	.fluent-label-outline:hover {
		background-color: var(--tc);
	}
</style>
