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

	type Props = {
		color?: BadgeColor
		fill?: string
		appearance?: BadgeAppearance
		circular?: boolean
		children?: SlotType
		onclick?: (ev: MouseEvent) => void
		class?: string
		style?: string
	}

	let {
		color = undefined,
		fill = undefined,
		appearance = "lightweight",
		circular = false,
		children = undefined,
		onclick = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

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

	let computedStyle = $derived([colorStyles, style].filter(Boolean).join(" "))

	let classes = $derived.by(() => {
		let cls = ["badge"]
		if (appearance) cls.push(`badge-${appearance}`)
		if (circular) cls.push("badge-circular")
		if (className) cls.push(className)
		return cls.join(" ")
	})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<span
	class={classes}
	style={computedStyle || null}
	onclick={onclick}
>
	{@render children?.()}
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
		border-radius: 999px;
		min-width: 20px;
		padding: 2px 6px;
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
