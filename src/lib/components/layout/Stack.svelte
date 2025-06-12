<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {classList} from "../../helpers/html.js"
	import {type StackHorizontalAlign, StackOrientation, StackVerticalAlign} from "../../fluent-ui/constants/stack.js"

	type Props = {
		children?: SlotType
		orientation?: StackOrientation
		horizontalAlign?: StackHorizontalAlign
		verticalAlign?: StackVerticalAlign
		verticalGap?: string | number
		horizontalGap?: string | number
		gap?: string | number
		width?: string
		height?: string
		reversed?: boolean
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
		    height = undefined,
		    reversed = undefined,
		    ...restProps
	    }: Props = $props()

	let classes = $derived(classList(
		`stack-${orientation?.toLowerCase() === "vertical" ? 'vertical' : 'horizontal'}`,
		verticalAlign && `vertical-align-${verticalAlign.toLowerCase()}`,
		horizontalAlign && `horizontal-align-${horizontalAlign.toLowerCase()}`,
		restProps.class
	))
</script>

<div
	{...restProps}
	class={classes}
	class:reversed
	style:--vertical-gap={verticalGap || gap}
	style:--horizontal-gap={horizontalGap || gap}
	style:--gap={gap}
	style:width={width}
	style:height={height}
>
	{@render children?.()}
</div>

