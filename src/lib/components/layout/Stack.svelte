<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		orientation?: "vertical" | "horizontal"
		gap?: string
		reversed?: boolean
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		orientation = "vertical",
		gap = undefined,
		reversed = false,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	const computedClass = $derived(`stack-${orientation} ${className}`.trim())
</script>

<div
	{...restProps}
	class={computedClass}
	reverse={reversed ? "true" : undefined}
	style:gap={gap}
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

	.stack-vertical[reverse="true"] {
		flex-direction: column-reverse;
	}

	.stack-horizontal[reverse="true"] {
		flex-direction: row-reverse;
	}
</style>
