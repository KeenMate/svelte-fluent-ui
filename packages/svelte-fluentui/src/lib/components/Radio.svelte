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
		autofocus?: boolean
		children?: SlotType
	}

	let {
		value,
		readonly = undefined,
		disabled = undefined,
		autofocus = undefined,
		children = undefined
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

<!-- svelte-ignore a11y_autofocus -->
<fluent-radio
	{value}
	{autofocus}
	checked={ctx.value === value}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-radio>

