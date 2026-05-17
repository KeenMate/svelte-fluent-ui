<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		orientation?: "vertical" | "horizontal"
		horizontalAlign?: "start" | "center" | "end" | "stretch" | "space-between" | "space-around"
		verticalAlign?: "start" | "center" | "end" | "stretch" | "space-between" | "space-around"
		verticalGap?: string
		horizontalGap?: string
		gap?: string
		width?: string
		height?: string
		reversed?: boolean
		/** Allow children to wrap onto multiple lines when they overflow the main axis. */
		wrap?: boolean
		class?: string
		style?: string
	}

	// Filter out null/undefined values from object to prevent Svelte 5 spreading errors
	function filterNullProps(obj: Record<string, any> | undefined): Record<string, any> {
		if (!obj) return {}
		return Object.fromEntries(
			Object.entries(obj).filter(([_, value]) => value != null)
		)
	}

	let {
		children = undefined,
		orientation = "vertical",
		horizontalAlign = undefined,
		verticalAlign = undefined,
		verticalGap = undefined,
		horizontalGap = undefined,
		gap = undefined,
		width = undefined,
		height = undefined,
		reversed = false,
		wrap = false,
		class: className = "",
		style = ""
	}: Props = $props()

	const computedClass = $derived([
		`stack-${orientation}`,
		verticalAlign && `vertical-align-${verticalAlign}`,
		horizontalAlign && `horizontal-align-${horizontalAlign}`,
		className
	]
		.filter(x => x)
		.join(" ")
		.trim()
	)
</script>

<div
	class={computedClass}
	data-reverse={reversed ? "true" : undefined}
	style:flex-wrap={wrap ? "wrap" : undefined}
	style:gap={gap}
	style:row-gap={verticalGap}
	style:column-gap={horizontalGap}
	style:width={width}
	style:height={height}
	style={style}
>
	{@render children?.()}
</div>

<style>
	/* Microsoft FluentUI Blazor Stack styles */
	.stack-vertical {
		display: flex;
		flex-direction: column;
	}

	.stack-horizontal {
		display: flex;
		flex-direction: row;
	}

	.stack-vertical[data-reverse="true"] {
		flex-direction: column-reverse;
	}

	.stack-horizontal[data-reverse="true"] {
		flex-direction: row-reverse;
	}

	/* Vertical alignment (cross-axis for vertical, main-axis for horizontal) */
	.stack-vertical.vertical-align-start { justify-content: flex-start; }
	.stack-vertical.vertical-align-center { justify-content: center; }
	.stack-vertical.vertical-align-end { justify-content: flex-end; }
	.stack-vertical.vertical-align-stretch { justify-content: stretch; }
	.stack-vertical.vertical-align-space-between { justify-content: space-between; }
	.stack-vertical.vertical-align-space-around { justify-content: space-around; }

	.stack-horizontal.vertical-align-start { align-items: flex-start; }
	.stack-horizontal.vertical-align-center { align-items: center; }
	.stack-horizontal.vertical-align-end { align-items: flex-end; }
	.stack-horizontal.vertical-align-stretch { align-items: stretch; }

	/* Horizontal alignment (cross-axis for horizontal, main-axis for vertical) */
	.stack-horizontal.horizontal-align-start { justify-content: flex-start; }
	.stack-horizontal.horizontal-align-center { justify-content: center; }
	.stack-horizontal.horizontal-align-end { justify-content: flex-end; }
	.stack-horizontal.horizontal-align-stretch { justify-content: stretch; }
	.stack-horizontal.horizontal-align-space-between { justify-content: space-between; }
	.stack-horizontal.horizontal-align-space-around { justify-content: space-around; }

	.stack-vertical.horizontal-align-start { align-items: flex-start; }
	.stack-vertical.horizontal-align-center { align-items: center; }
	.stack-vertical.horizontal-align-end { align-items: flex-end; }
	.stack-vertical.horizontal-align-stretch { align-items: stretch; }
</style>
