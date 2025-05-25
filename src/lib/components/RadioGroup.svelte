<script lang="ts">
	import {fluentRadioGroup, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentRadioGroup()
	)

	type Props = {
		value: string | null | undefined
		name: string
		orientation?: string
		readonly?: boolean
		disabled?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		value = $bindable(),
		name,
		readonly = undefined,
		disabled = undefined,
		children = undefined,
		...restProps
	    }: Props = $props()

	const ctx = $state({
		value,
		setValue
	})

	setContext("radio-group", ctx)

	function setValue(newValue: string) {
		if (disabled || readonly) {
			return
		}

		value = newValue
	}
</script>

<fluent-radio-group
	{value}
	{name}
	{readonly}
	{disabled}
	{...restProps}
>
	{@render children?.()}
</fluent-radio-group>
