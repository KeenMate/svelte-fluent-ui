<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		orientation?: "Horizontal" | "Vertical" | string
		horizontalAlign?: "Left" | "Start" | "Center" | "Right" | "End" | "Stretch" | "SpaceBetween" | string
		verticalAlign?: "Top" | "Center" | "Bottom" | "Stretch" | "SpaceBetween" | string
		verticalGap?: string | number
		horizontalGap?: string | number
		gap?: string | number
		width?: string
		reversed?: boolean
		vertical?: boolean
		[prop: string]: any
	}

	let {
		    children = undefined,
		    orientation = undefined,
		    horizontalAlign = undefined,
		    verticalAlign = undefined,
		    verticalGap = undefined,
		    horizontalGap = undefined,
		    gap = undefined,
		    width = undefined,
		    reversed = undefined,
		    ...restProps
	    }: Props = $props()

	let classes = $derived([
		`stack-${orientation?.toLowerCase() === "vertical" ? 'vertical' : 'horizontal'}`,
		verticalAlign && `vertical-align-${verticalAlign.toLowerCase()}`,
		horizontalAlign && `horizontal-align-${horizontalAlign.toLowerCase()}`,
		restProps.class
	]
			.filter(x => x)
			.join(" ")
	)
</script>

<div
	{...restProps}
	class={classes}
	class:reversed
	style:--vertical-gap={verticalGap || gap}
	style:--horizontal-gap={horizontalGap || gap}
	style:--gap={gap}
	style:width={width}
>
	{@render children?.()}
</div>

