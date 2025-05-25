<script lang="ts">
	import {fluentBadge, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(
		fluentBadge()
	)

	type Props = {
		/**
		 * for `color` prop to work a CSS variable `--badge-color-[color]` must be defined
		 */
		color?: string
		appearance?: string
		circular?: boolean
		children?: SlotType
		onClick?: (ev: MouseEvent) => void
		[prop: string]: any
	}

	let {
		    color      = undefined,
		    appearance = undefined,
		    circular   = undefined,
		    children   = undefined,
		    onClick    = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<fluent-badge
	{...restProps}
	{color}
	{appearance}
	{circular}
	onclick={onClick}
>
	{@render children?.()}
</fluent-badge>
