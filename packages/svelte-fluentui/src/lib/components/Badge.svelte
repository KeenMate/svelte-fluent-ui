<script lang="ts">
	/**
	 * Custom Badge Component - FluentUI styled
	 *
	 * Color system uses CSS variables:
	 * - --badge-fill-[color]: background color
	 * - --badge-color-[color]: text color
	 *
	 * Built-in colors: brand, danger, important, informative, severe, subtle, success, warning
	 */
	import type {SlotType} from "../types/index.js"

	type BadgeColor = "brand" | "danger" | "important" | "informative" | "severe" | "subtle" | "success" | "warning" | (string & {})
	type BadgeAppearance = "accent" | "lightweight" | "neutral" | "outline" | "tint" | (string & {})
	type BadgeSize = "xs" | "sm" | "medium" | "lg" | "xl"

	type Props = {
		color?: BadgeColor
		fill?: string
		appearance?: BadgeAppearance
		size?: BadgeSize
		circular?: boolean
		pill?: boolean
		radius?: string
		/** Icon slot rendered before the label. */
		icon?: SlotType
		/**
		 * Truncate overflowing text with an ellipsis. Requires a width
		 * constraint (`maxWidth`) to take effect. Pair with `title` so the
		 * full text is available on hover.
		 */
		truncate?: boolean
		/**
		 * Truncate from the START instead of the end — the visible tail is
		 * what matters (file paths, breadcrumbs, hierarchies). Implies
		 * `truncate`.
		 */
		ellipsisStart?: boolean
		/** Max width for the badge (any CSS length). Drives truncation. */
		maxWidth?: string
		/** Native tooltip; surface the full text here when truncating. */
		title?: string
		children?: SlotType
		onclick?: (ev: MouseEvent) => void
		class?: string
		style?: string
	}

	let {
		color = undefined,
		fill = undefined,
		appearance = "lightweight",
		size = "medium",
		circular = false,
		pill = false,
		radius = undefined,
		icon = undefined,
		truncate = false,
		ellipsisStart = false,
		maxWidth = undefined,
		title = undefined,
		children = undefined,
		onclick = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	// ellipsisStart implies truncate
	let isTruncated = $derived(truncate || ellipsisStart)

	// Auto-set fill to color value if color is set but fill is not
	let effectiveFill = $derived(fill ?? color)

	// Build inline styles for color
	let colorStyles = $derived.by(() => {
		if (!color && !effectiveFill) return ""
		let styles = ""
		if (effectiveFill) {
			styles += `background-color: var(--badge-fill-${effectiveFill});`
		}
		if (color) {
			styles += `color: var(--badge-color-${color});`
		}
		return styles
	})

	let radiusStyle = $derived(radius ? `border-radius: ${radius};` : "")

	let maxWidthStyle = $derived(maxWidth ? `max-width: ${maxWidth};` : "")

	let computedStyle = $derived([colorStyles, radiusStyle, maxWidthStyle, style].filter(Boolean).join(" "))

	let classes = $derived.by(() => {
		let cls = ["badge"]
		if (appearance) cls.push(`badge-${appearance}`)
		if (size && size !== "medium") cls.push(`badge-${size}`)
		if (circular) cls.push("badge-circular")
		if (pill) cls.push("badge-pill")
		if (className) cls.push(className)
		return cls.join(" ")
	})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<span
	class={classes}
	style={computedStyle || null}
	title={title || null}
	onclick={onclick}
>
	{#if icon}<span class="badge-icon">{@render icon()}</span>{/if}
	{#if isTruncated}
		<span class="badge-text" class:badge-ellipsis-start={ellipsisStart}>{@render children?.()}</span>
	{:else}
		{@render children?.()}
	{/if}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--body-font);
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		font-weight: 600;
		line-height: var(--type-ramp-minus-1-line-height, 16px);
		padding: 2px 8px;
		border-radius: var(--control-corner-radius, 4px);
		box-sizing: border-box;
		min-height: 20px;
	}

	.badge-circular {
		border-radius: var(--fluent-border-radius-pill);
		min-width: 20px;
		padding: 2px 6px;
	}

	.badge-pill {
		border-radius: var(--fluent-border-radius-pill, 9999px);
	}

	/* Size scale */
	.badge-xs {
		font-size: var(--type-ramp-minus-2-font-size, 10px);
		line-height: var(--type-ramp-minus-2-line-height, 14px);
		padding: 0 4px;
		min-height: 16px;
	}

	.badge-sm {
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		padding: 1px 6px;
		min-height: 18px;
	}

	.badge-lg {
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		padding: 3px 10px;
		min-height: 24px;
	}

	.badge-xl {
		font-size: var(--type-ramp-plus-1-font-size, 16px);
		line-height: var(--type-ramp-plus-1-line-height, 22px);
		padding: 4px 12px;
		min-height: 28px;
	}

	/* Leading icon */
	.badge-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-inline-end: 4px;
	}

	/* Truncation — the badge stays flex; the text child owns the ellipsis so
	   a leading icon still lines up. Needs min-width:0 to shrink below content. */
	.badge-text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Start-side ellipsis for paths/hierarchies where the end is the payload.
	   direction: rtl clips the leading edge; text-align keeps glyph order LTR. */
	.badge-ellipsis-start {
		direction: rtl;
		text-align: left;
	}

	:global([dir="rtl"]) .badge-ellipsis-start {
		direction: ltr;
		text-align: right;
	}

	/* Appearance variants */
	.badge-lightweight {
		background-color: transparent;
		color: var(--neutral-foreground-rest, #242424);
	}

	.badge-accent {
		background-color: var(--accent-fill-rest, #0078d4);
		color: var(--foreground-on-accent-rest, #ffffff);
	}

	.badge-neutral {
		background-color: var(--neutral-fill-secondary-rest, #f0f0f0);
		color: var(--neutral-foreground-rest, #242424);
	}

	.badge-outline {
		background-color: transparent;
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		color: var(--neutral-foreground-rest, #242424);
	}

	.badge-tint {
		background-color: var(--accent-fill-rest, #0078d4);
		opacity: 0.1;
		color: var(--accent-foreground-rest, #0078d4);
	}
</style>
