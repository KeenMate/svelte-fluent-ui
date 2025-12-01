<script lang="ts">
	import { fluentTextArea, provideFluentDesignSystem } from "@fluentui/web-components"
	import type { SlotType } from "../types/index.js"
	import { setAutocompleteOnShadowInput } from "../utils/shadow-dom.js"

	provideFluentDesignSystem().register(fluentTextArea())

	type Props = {
		class?: string
		style?: string
		readonly?: boolean
		resize?: "none" | "both" | "horizontal" | "vertical"
		autofocus?: boolean
		autocomplete?: string
		form?: string
		list?: string
		maxlength?: number
		minlength?: number
		placeholder?: string
		cols?: number
		rows?: number
		spellcheck?: boolean
		id?: string
		name?: string
		disabled?: boolean
		required?: boolean
		appearance?: "outline" | "filled"
		value?: string
		label?: string
		ariaLabel?: string
		labelTemplate?: SlotType
		children?: SlotType
		oninput?: (value: string) => void
		onchange?: (value: string) => void
	}

	let {
		class: className = "",
		style = "",
		readonly = undefined,
		resize = undefined,
		autofocus = undefined,
		autocomplete = "off",
		form = undefined,
		list = undefined,
		maxlength = undefined,
		minlength = undefined,
		placeholder = undefined,
		cols = undefined,
		rows = undefined,
		spellcheck = undefined,
		id = undefined,
		name = undefined,
		disabled = undefined,
		required = undefined,
		appearance = undefined,
		value = $bindable(),
		label = undefined,
		ariaLabel = undefined,
		labelTemplate = undefined,
		children = undefined,
		oninput = undefined,
		onchange = undefined
	}: Props = $props()

	let element: HTMLElement | undefined

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement
		if (oninput) oninput(target.value)
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLTextAreaElement
		if (onchange) onchange(target.value)
	}

	// Apply autocomplete attribute via shadow DOM (use 'textarea' selector)
	$effect(() => {
		if (autocomplete !== undefined) {
			setAutocompleteOnShadowInput(element, autocomplete, "textarea")
		}
	})
</script>

{#if label || labelTemplate}
	<label for={id}>
		{label}
		{#if labelTemplate}
			{@render labelTemplate?.()}
		{/if}
	</label>
{/if}

<fluent-text-area
	bind:this={element}
	class={className}
	{style}
	{readonly}
	{resize}
	{autofocus}
	autocomplete={autocomplete}
	{form}
	{list}
	{...(maxlength !== undefined ? { maxlength } : {})}
	{...(minlength !== undefined ? { minlength } : {})}
	{placeholder}
	{...(cols !== undefined ? { cols } : {})}
	{...(rows !== undefined ? { rows } : {})}
	{spellcheck}
	{id}
	{name}
	{disabled}
	{required}
	{appearance}
	{value}
	aria-label={ariaLabel}
	oninput={handleInput}
	onchange={handleChange}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-text-area>
