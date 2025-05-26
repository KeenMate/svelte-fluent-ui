<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SelectedValue, SlotType} from "../types/index.js"
	import {setContext} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"
	import {writable} from "svelte/store"

	provideFluentDesignSystem().register(
		fluentListbox()
	)

	type ValueType = string | string[] | null | undefined

	type Props = {
		value: string | string[] | null | undefined
		multi?: boolean
		disabled?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		    value    = $bindable(),
		    multi    = undefined,
		    disabled = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()

	let element: (HTMLElement & {
		length: number
		options: HTMLElement[]
		selectFirstOption: VoidFunction
	}) | undefined = $state()

	const selectedOption: SelectedOptionSvelteContext = writable(toContextValue(value))
	setContext<SelectedOptionSvelteContext>("selected-option", selectedOption)

	let selectedOptionsAttr = $derived(value && typeof value === "string"
		? value
		: (value as string[])?.join(",")
	)

	$effect(() => {
		const newValue = toContextValue(value)

		if ($selectedOption !== newValue) {
			$selectedOption = newValue
		}
	})

	function toContextValue(value_: ValueType): SelectedValue | undefined {
		if (multi) {
			return typeof value_ === "string"
				? [$state.snapshot(value_)]
				: $state.snapshot(value_)
		} else {
			return typeof value_ === "string"
				? [value_]
				: null
		}
	}
</script>

<fluent-listbox
	bind:this={element}
	selected-options={selectedOptionsAttr}
	{disabled}
	{...restProps}
>
	{@render children?.()}
</fluent-listbox>

