<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {
		SlotType,
	} from "../types/index.js"

	provideFluentDesignSystem().register(
		fluentButton()
	)

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
		[prop: string]: any
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
		...restProps
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
	{...restProps}
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
