<script lang="ts">
	import {fluentRadio, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {getContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentRadio()
	)

	type Props = {
		value: string
		label?: string
		labelTemplate?: SlotType
		ariaLabel?: string
		name?: string
		readonly?: boolean
		disabled?: boolean
		required?: boolean
		checked?: boolean
		autofocus?: boolean
		class?: string
		style?: string
		children?: SlotType
	}

	let {
		value,
		label = undefined,
		labelTemplate = undefined,
		ariaLabel = undefined,
		name = undefined,
		readonly = undefined,
		disabled = undefined,
		required = undefined,
		checked = undefined,
		autofocus = undefined,
		class: className = undefined,
		style = undefined,
		children = undefined
	}: Props = $props()

	const ctx: any = getContext("radio-group")

	// Determine if checked - explicit prop takes precedence over context
	const isChecked = $derived(checked !== undefined ? checked : (ctx?.value === value))

	function handleOnClick(ev: MouseEvent) {
		if (disabled || readonly) {
			return
		}

		ctx?.setValue(value)
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
<fluent-radio
	{value}
	{...(name ? { name } : {})}
	{...(disabled ? { disabled } : {})}
	{...(readonly ? { readonly } : {})}
	{...(required ? { required } : {})}
	{...(isChecked ? { checked: isChecked } : {})}
	{...(autofocus ? { autofocus } : {})}
	{...(ariaLabel ? { "aria-label": ariaLabel } : {})}
	{...(className ? { class: className } : {})}
	{...(style ? { style } : {})}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-radio>

