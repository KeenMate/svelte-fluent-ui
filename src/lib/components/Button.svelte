<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentButton()
	)
	import type {
		SlotType,
	} from "../fluent-ui/types.js"
	import type {
		ButtonAppearance,
	} from "@fluentui/web-components"

	interface IProps {
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
	}

	let {
		    appearance = undefined,
		    autofocus = undefined,
		    disabled = undefined,
		    form = undefined,
		    formaction = undefined,
		    formenctype = undefined,
		    formmethod = undefined,
		    formnovalidate = undefined,
		    formtarget = undefined,
		    name = undefined,
		    type = undefined,
		    value = undefined,
		    start = undefined,
		    end = undefined,
		    children = undefined
	    }: IProps = $props()
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
>
	<template slot="start">
		{@render start?.()}
	</template>
	{@render children?.()}
	<template slot="end">
		{@render end?.()}
	</template>
</fluent-button>
