<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import Stack from "$lib/components/layout/Stack.svelte"
	import {StackHorizontalAlign, StackOrientation, StackVerticalAlign} from "$lib/fluent-ui/constants/stack.js"

	type Props = {
		href?: string
		rel?: string
		count?: number
		active?: boolean
		onClick?: (ev: MouseEvent) => void
		icon?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		    href     = undefined,
		    rel      = undefined,
		    active   = $bindable(),
		    onClick = undefined,
		    icon = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<div
	{...restProps}
	class="fluent-appbar-item {restProps.class || ''}"
>
	<div class="fluentui-counterbadge-container">
		<a
			{href}
			{rel}
			class:active
		>
			<Stack
				orientation={StackOrientation.Vertical}
				verticalAlign={StackVerticalAlign.Center}
				horizontalAlign={StackHorizontalAlign.Center}
				horizontalGap="10px"
				verticalGap="0"
				width="100%"
				height="100%"
			>
				{@render icon?.()}

				<div part="label">
					{@render children?.()}
				</div>
			</Stack>
		</a>
	</div>

</div>
