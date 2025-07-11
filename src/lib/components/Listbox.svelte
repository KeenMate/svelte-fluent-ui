<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setContext, untrack} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"
	import {createSelectedOptions} from "../data/selected-options.svelte.js"

	provideFluentDesignSystem().register(fluentListbox())

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
		value = $bindable(),
		multi = undefined,
		disabled = undefined,
		readonly = undefined,
		children = undefined,
		...restProps
	}: Props = $props()

	let element:
		| (HTMLElement & {
				length: number
				value: any
				selectedIndex: number
				options: HTMLOptionElement[]
				selectFirstOption: VoidFunction
		  })
		| undefined = $state()

	const selectedOptions = createSelectedOptions(value, multi)
	setContext<SelectedOptionSvelteContext>("selected-options", selectedOptions)

	$effect(() => {
		const current = selectedOptions.value
		if (JSON.stringify(current) !== JSON.stringify(value)) {
			value = current
		}
	})

	let selectedOptionsAttr = $derived(() =>
		typeof value === "string" ? value : Array.isArray(value) ? value.join(",") : undefined
	)

	function handleOnChange(ev: Event) {
		const target = ev.target as HTMLSelectElement
		if (!target) return

		const selected = Array.from(target.selectedOptions).map((opt) => opt.value)
		value = multi ? selected : selected[0]
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
