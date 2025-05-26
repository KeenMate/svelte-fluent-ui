<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setContext, untrack} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"
	import {createSelectedOptions} from "../data/selected-options.svelte.js"

	provideFluentDesignSystem().register(
		fluentListbox()
	)

	type ValueType = string | string[] | null | undefined

	type Props = {
		value: ValueType
		multi?: boolean
		readonly?: boolean
		disabled?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		    value    = $bindable(),
		    multi    = undefined,
		    disabled = undefined,
		    readonly = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()

	let element: (HTMLElement & {
		length: number
		value: any
		selectedIndex: number
		options: HTMLOptionElement[]
		selectFirstOption: VoidFunction
	}) | undefined = $state()

	const selectedOptions = createSelectedOptions(value, multi)
	setContext<SelectedOptionSvelteContext>("selected-options", selectedOptions)

	let selectedOptionsAttr = $derived(value && typeof value === "string"
		? value
		: (value as string[])?.join(",")
	)

	// update value: above -> down
	$effect(() => {
		if (value === untrack(() => selectedOptions.value)) {
			return
		}

		// reactivity-loop seems to be handled well by Svelte alone...
		selectedOptions.set(value)

		console.log("Listbox update above down", element)
		// this is used to update this combobox's visible selected value's text inside the input
		if (element) {
			const selectedOptionElement = element.options.find(
				(x: HTMLOptionElement) => x.value === value,
			)
			const selectedIndex         = element.options.findIndex(
				(x: HTMLOptionElement) => x.value === value,
			)

			if (
				(element.value !== value || element.selectedIndex !== selectedIndex) &&
				selectedOptionElement
			) {
				element.value         =
					selectedOptionElement.dataset.optionLabel ||
					selectedOptionElement.innerText.trim()
				element.selectedIndex = selectedIndex
			}
		}
	})

	// update value: below -> up
	$effect(() => {
		if (untrack(() => value) === selectedOptions.value) {
			return
		}
		if (untrack(() => readonly || disabled)) {
			selectedOptions.set(value)
			return
		}

		// console.log("setting value in effect", $state.snapshot(selectedOptions.value))
		// reactivity-loop seems to be handled well by Svelte alone...
		value = multi
			? selectedOptions.value
			: selectedOptions.value?.[0]
	})

	function handleOnChange(ev: Event) {
		console.log("listbox change", ev)
	}
</script>

<fluent-listbox
	bind:this={element}
	selected-options={selectedOptionsAttr}
	{disabled}
	multiple={multi}
	{...restProps}
	onchange={handleOnChange}
>
	{@render children?.()}
</fluent-listbox>

