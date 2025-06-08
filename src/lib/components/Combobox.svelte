<script lang="ts">
	import {
		provideFluentDesignSystem,
		fluentCombobox,
	} from "@fluentui/web-components"
	import type {OptionItem, SelectedValue, SlotType} from "../types/index.js"
	import Option from "$lib/components/Option.svelte"
	import {setContext, untrack} from "svelte"
	import type {SelectedOptionSvelteContext, ValueType} from "../types/combobox.js"
	import {createSelectedOptions} from "../data/selected-options.svelte.js"

	provideFluentDesignSystem().register(fluentCombobox())

	type Props = {
		id: string
		value: SelectedValue;
		options?: OptionItem[];
		children?: SlotType;
		autocomplete?: any;
		open?: boolean;
		currentValue?: any;
		placeholder?: string;
		position?: string;
		disabled?: boolean;
		readonly?: boolean;
		appearance?: string;
		required?: boolean;
		autofocus?: any;
		name?: string;
	};

	let {
		id,
		    value        = $bindable(),
		    options      = undefined,
		    autocomplete = undefined,
		    open         = undefined,
		    currentValue = undefined,
		    placeholder  = undefined,
		    position     = undefined,
		    disabled     = undefined,
		    readonly     = undefined,
		    appearance   = undefined,
		    required     = undefined,
		    autofocus    = undefined,
		    name         = undefined,
		    children     = undefined,
		    ...restProps
	    }: Props = $props()

	const selectedOptions = createSelectedOptions(value)
	setContext<SelectedOptionSvelteContext>(
		"selected-options",
		selectedOptions,
	)

	let element:
		    | (HTMLElement & {
		    // it is an array of <fluent-option> elements (but this is close enough :))
		    options: HTMLOptionElement[];
		    value: OptionItem["value"];
		    selectedIndex: number;
	    })
		    | undefined = undefined

	// $inspect(id, "combobox selected options", selectedOptions.value)

	// update value: V
	$effect(() => {
		// console.log(id, "combobox V", {
		// 	value: untrack(() => $state.snapshot(value)),
		// 	selectedOptions: untrack(() => $state.snapshot(selectedOptions.value)),
		// 	equal:           isValueEqualToContext(untrack(() => value), untrack(() => selectedOptions.value))
		// })
		if (isValueEqualToContext(value, untrack(() => selectedOptions.value))) {
			// console.log(id, "combobox V equal", {value, selectedOptions: untrack(() => selectedOptions.value)})
			return
		}

		// reactivity-loop seems to be handled well by Svelte alone...
		selectedOptions.value = untrack(() => selectedOptions.toContextValue)($state.snapshot(value))

		// this is used to update this combobox's visible selected value's text inside the input
		if (element) {
			const selectedOptionElement = element.options.find(
				(x: HTMLOptionElement) => x.value === value?.[0],
			)
			const selectedIndex         = element.options.findIndex(
				(x: HTMLOptionElement) => x.value === value?.[0],
			)

			if (
				(element.value !== value?.[0] || element.selectedIndex !== selectedIndex) &&
				selectedOptionElement
			) {
				element.value         =
					selectedOptionElement.dataset.optionLabel ||
					selectedOptionElement.innerText.trim()
				element.selectedIndex = selectedIndex
			}
		}
	})

	// update value: ^
	$effect(() => {
		// console.log(id, "combobox ^", {
		// 	value: untrack(() => $state.snapshot(value)),
		// 	selectedOptions: $state.snapshot(untrack(() => selectedOptions.value)),
		// 	equal:           isValueEqualToContext(untrack(() => value), untrack(() => selectedOptions.value))
		// })
		if (isValueEqualToContext(untrack(() => value), selectedOptions.value)) {
			// console.log(id,
			// 	"combobox ^ equal",
			// 	{value: untrack(() => value), selectedOptions: $state.snapshot(selectedOptions.value)}
			// )
			return
		}
		if (untrack(() => readonly || disabled)) {
			selectedOptions.set(untrack(() => $state.snapshot(value)))
			return
		}

		// console.log(id, "setting value in effect", $selectedValue)
		// reactivity-loop seems to be handled well by Svelte alone...
		value = $state.snapshot(selectedOptions.value)
	})

	function isValueEqualToContext(value: ValueType, ctxValue: SelectedValue) {
		return (!value && !ctxValue)
			|| (value instanceof Array
				? value[0]
				: value) === ctxValue?.[0]
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
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{#each options ?? [] as item (item.value)}
			<Option value={item.value} label={item.label} disabled={item.disabled}>
				{item.label}
			</Option>
		{/each}
	{/if}
</fluent-combobox>
