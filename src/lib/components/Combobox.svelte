<script lang="ts">
	import {
		provideFluentDesignSystem,
		fluentCombobox,
	} from "@fluentui/web-components"
	import type {OptionItem, SelectedValue, SlotType} from "../types/index.js"
	import Option from "$lib/components/Option.svelte"
	import {setContext, untrack} from "svelte"
	import type {ComboboxSelectedValueSvelteContext} from "../types/combobox.js"
	import {writable} from "svelte/store"

	provideFluentDesignSystem()
		.register(
			fluentCombobox(),
		)

	type Props = {
		value: SelectedValue
		options?: OptionItem[]
		children?: SlotType
		autocomplete?: any
		open?: boolean
		currentValue?: any
		placeholder?: string
		position?: string
		disabled?: boolean
		readonly?: boolean
		appearance?: string
		required?: boolean
		autofocus?: any
		name?: string
		onComboboxChange?: any
		onControlInput?: any
	}

	let {
		    value            = $bindable(),
		    options          = undefined,
		    autocomplete     = undefined,
		    open             = undefined,
		    currentValue     = undefined,
		    placeholder      = undefined,
		    position         = undefined,
		    disabled         = undefined,
		    readonly         = undefined,
		    appearance       = undefined,
		    required         = undefined,
		    autofocus        = undefined,
		    name             = undefined,
		    onComboboxChange = undefined,
		    onControlInput   = undefined,
		    children         = undefined,
		    ...restProps
	    }: Props = $props()

	const selectedValue = writable<SelectedValue>(value)
	setContext<ComboboxSelectedValueSvelteContext>("selectedValue", selectedValue)

	let element: (HTMLElement & {
		// it is an array of <fluent-option> elements (but this is close enough :))
		options: HTMLOptionElement[]
		value: OptionItem["value"]
		selectedIndex: number
	}) | undefined = undefined

	// update value: above -> down
	$effect(() => {
		if (value === untrack(() => $selectedValue)) {
			return
		}

		// reactivity-loop seems to be handled well by Svelte alone...
		$selectedValue = value

		// this is used to update this combobox's visible selected value's text inside the input
		if (element) {
			const selectedOptionElement = element.options.find((x: HTMLOptionElement) => x.value === value)
			const selectedIndex         = element.options.findIndex((x: HTMLOptionElement) => x.value === value)

			if ((element.value !== value || element.selectedIndex !== selectedIndex) && selectedOptionElement) {
				element.value         = selectedOptionElement.dataset.optionLabel || selectedOptionElement.innerText.trim()
				element.selectedIndex = selectedIndex
			}
		}
	})

	// update value: below -> up
	$effect(() => {
		if (untrack(() => value) === $selectedValue) {
			return
		}
		if (untrack(() => readonly || disabled)) {
			$selectedValue = value
			return
		}

		// console.log("setting value in effect", $selectedValue)
		// reactivity-loop seems to be handled well by Svelte alone...
		value = $selectedValue
	})

	function handleOnComboboxChange(ev: Event) {
		// console.log("handleOnComboboxChange", ev)
		onComboboxChange?.()
	}

	function handleOnControlInput(ev: Event) {
		// console.log("handleOnControlInput", ev)
		onControlInput?.()
	}
</script>

<fluent-combobox
	bind:this={element}
	{autocomplete}
	{open}
	{currentValue}
	{placeholder}
	{position}
	{disabled}
	{readonly}
	{appearance}
	{required}
	{autofocus}
	{name}
	oncomboboxchange={handleOnComboboxChange}
	oncontrolinput={handleOnControlInput}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{#each options ?? [] as item (item.value)}
			<Option value={item.value} label={item.label}>
				{item.label}
			</Option>
		{/each}
	{/if}
</fluent-combobox>
