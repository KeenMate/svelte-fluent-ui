<script lang="ts">
	import {fluentOption, provideFluentDesignSystem} from "@fluentui/web-components"
	import {getContext} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"

	provideFluentDesignSystem().register(
		fluentOption()
	)

	type Props = {
		value: string
		label?: string
		style?: string
		onClick?: Function
		selected?: boolean
		disabled?: boolean
		children: any
		[prop: string]: any
	}

	let {
		    value,
		    label    = undefined,
		    disabled = false,
		    selected = undefined,
		    onClick  = undefined,
		    children,
		    ...restProps
	    }: Props = $props()

	const selectedValue = getContext<SelectedOptionSvelteContext>("selected-options")

	function handleOnClick(ev: MouseEvent) {
		if (disabled) {
			return
		}

		console.log("Option on click", {
			ev,
			selectedValue: selectedValue.value
		})
		selectedValue.toggle(value)

		onClick?.(ev)
	}
</script>

<fluent-option
	{value}
	selected={selected !== undefined ? selected : selectedValue.value?.includes(value)}
	data-option-label={label}
	{disabled}
	{...restProps}
	onclick={handleOnClick}
>
	{@render children()}
</fluent-option>
