<script lang="ts">
	import { fluentTextArea, provideFluentDesignSystem } from "@fluentui/web-components"
	import type { SlotType } from "../types/index.js"

	provideFluentDesignSystem().register(fluentTextArea())

	type Props = {
		class?: string
		style?: string
		readonly?: boolean
		resize?: "none" | "both" | "horizontal" | "vertical"
		autofocus?: boolean
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
		onInput?: (value: string) => void
		onChange?: (value: string) => void
		[prop: string]: any
	}

	let {
		class: className = "",
		style = "",
		readonly = undefined,
		resize = undefined,
		autofocus = undefined,
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
		onInput = undefined,
		onChange = undefined,
		...restProps
	}: Props = $props()

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement
		if (onInput) onInput(target.value)
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLTextAreaElement
		if (onChange) onChange(target.value)
	}
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
	class={className}
	{style}
	{readonly}
	resize={resize}
	{autofocus}
	{form}
	list={list}
	{maxlength}
	{minlength}
	{placeholder}
	{cols}
	{rows}
	{spellcheck}
	{id}
	{name}
	{disabled}
	{required}
	appearance={appearance}
	value={value}
	on:input={handleInput}
	on:change={handleChange}
	aria-label={ariaLabel || label}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-text-area>
