<script lang="ts">
	import {fluentRadioGroup, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentRadioGroup()
	)

	type Props = {
		value?: string | null
		name?: string
		label?: string
		labelTemplate?: SlotType
		ariaLabel?: string
		orientation?: "horizontal" | "vertical"
		readonly?: boolean
		disabled?: boolean
		required?: boolean
		autofocus?: boolean
		placeholder?: string
		class?: string
		style?: string
		children?: SlotType
		onchange?: (value: string) => void
	}

	let {
		value = $bindable(),
		name = undefined,
		label = undefined,
		labelTemplate = undefined,
		ariaLabel = undefined,
		orientation = undefined,
		readonly = undefined,
		disabled = undefined,
		required = undefined,
		autofocus = undefined,
		placeholder = undefined,
		class: className = undefined,
		style = undefined,
		children = undefined,
		onchange = undefined
	}: Props = $props()

	const ctx = $state({
		get value() { return value },
		setValue
	})

	setContext("radio-group", ctx)

	function setValue(newValue: string) {
		if (disabled || readonly) {
			return
		}

		value = newValue
		onchange?.(newValue)
	}
</script>

{#if label || labelTemplate}
	<label class="fluent-field-label">
		{#if label}
			{label}
		{/if}
		{#if labelTemplate}
			{@render labelTemplate?.()}
		{/if}
	</label>
{/if}

<!-- svelte-ignore a11y_autofocus -->
<fluent-radio-group
	{...(value ? { value } : {})}
	{...(name ? { name } : {})}
	{...(orientation ? { orientation } : {})}
	{...(readonly ? { readonly } : {})}
	{...(disabled ? { disabled } : {})}
	{...(autofocus ? { autofocus } : {})}
	{...(placeholder ? { placeholder } : {})}
	{...(ariaLabel ? { "aria-label": ariaLabel } : {})}
	{...(className ? { class: className } : {})}
	{...(style ? { style } : {})}
>
	{@render children?.()}
</fluent-radio-group>
