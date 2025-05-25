<script lang="ts">
	import {fluentRadio, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {getContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentRadio()
	)

	type Props = {
		value: string
		readonly?: boolean
		disabled?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		value,
		    readonly = undefined,
		    disabled = undefined,
		children = undefined,
		...restProps
  }: Props = $props()

	const ctx: any = getContext("radio-group")

	function handleOnClick(ev: MouseEvent) {
		// console.log("radio clicked", ev)
		if (disabled || readonly) {
			return
		}

		ctx.setValue(value)
	}
</script>

<fluent-radio
	{value}
	checked={ctx.value === value}
	{...restProps}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-radio>

