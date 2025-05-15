<script lang="ts">
	import "@fluentui/web-components/button.js"
	import type {
		IFluentProps,
		IInteractiveFluentProps, SlotType
	} from "../fluent-ui/types.js"
	import type {ButtonAppearance, ButtonShape, ButtonSize} from "@fluentui/web-components"

	interface IButtonProps extends IInteractiveFluentProps, IFluentProps {
		appearance?: ButtonAppearance
		iconOnly?: boolean
		name?: string
		size?: ButtonSize
		shape?: ButtonShape
		type?: string
		value?: string

		children?: SlotType
		start?: SlotType
		end?: SlotType
	}

	let {
		    disabled          = undefined,
		    disabledFocusable = undefined,
		    formaction        = undefined,
		    form              = undefined,
		    formenctype       = undefined,
		    formmethod        = undefined,
		    formnovalidate    = undefined,
		    formtarget        = undefined,
		    appearance        = undefined,
		    iconOnly          = undefined,
		    name              = undefined,
		    size              = undefined,
		    shape             = undefined,
		    type              = undefined,
		    value             = undefined,
		    children          = undefined,
		    start             = undefined,
		    end               = undefined
	    }: IButtonProps = $props()
</script>

<!-- todo: make Button here -->
<fluent-button
	{type}
	{name}
	{value}
	{appearance}
	{size}
	{shape}
	{formaction}
	{form}
	{formenctype}
	{formmethod}
	{formnovalidate}
	{formtarget}
	{disabled}
	disabled-focusable={disabledFocusable}
	icon-only={iconOnly}
>
	<template slot="start">
		{@render start?.()}
	</template>
	{@render children?.()}
	<template slot="end">
		{@render end?.()}
	</template>
</fluent-button>

