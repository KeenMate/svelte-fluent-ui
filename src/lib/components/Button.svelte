<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentButton()
	)
	import type {
		SlotType,
	} from "../types/index.js"
	import type {
		ButtonAppearance,
	} from "@fluentui/web-components"

	type Props = {
		appearance?: string
		autofocus?: string
		disabled?: string
		form?: string
		formaction?: string
		formenctype?: string
		formmethod?: string
		formnovalidate?: string
		formtarget?: string
		name?: string
		type?: string
		value?: string
		start?: SlotType
		end?: SlotType
		children?: SlotType
		onClick?: (ev: MouseEvent) => void
	}

	let {
		    appearance     = undefined,
		    autofocus      = undefined,
		    disabled       = undefined,
		    form           = undefined,
		    formaction     = undefined,
		    formenctype    = undefined,
		    formmethod     = undefined,
		    formnovalidate = undefined,
		    formtarget     = undefined,
		    name           = undefined,
		    type           = undefined,
		    value          = undefined,
		    start          = undefined,
		    end            = undefined,
		    children       = undefined,
		    onClick       = undefined,
	    }: Props = $props()
</script>

<fluent-button
	{type}
	{name}
	{value}
	{appearance}
	{formaction}
	{form}
	{formenctype}
	{formmethod}
	{formnovalidate}
	{formtarget}
	{disabled}
	onclick={onClick}
>
	<template slot="start">
		{@render start?.()}
	</template>
	{@render children?.()}
	<template slot="end">
		{@render end?.()}
	</template>
</fluent-button>
