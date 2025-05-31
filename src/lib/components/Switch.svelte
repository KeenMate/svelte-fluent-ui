<script lang="ts">
	import {fluentSwitch, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentSwitch())

	type Props = {
		class?: string
		style?: string
		readonly?: boolean
		id?: string
		disabled?: boolean
		name?: string
		ariaLabel?: string
		label?: string
		checked?: boolean
		required?: boolean
		checkedMessage?: string
		uncheckedMessage?: string
		onChange?: (checked: boolean) => void
		children?: SlotType
		labelTemplate?: SlotType
		[prop: string]: any
	}

	let {
		class: className = "",
		style = "",
		readonly = undefined,
		id = undefined,
		disabled = undefined,
		name = undefined,
		ariaLabel = undefined,
		label = undefined,
		checked = $bindable(),
		required = undefined,
		checkedMessage = undefined,
		uncheckedMessage = undefined,
		onChange = undefined,
		children = undefined,
		labelTemplate = undefined,
		...restProps
	}: Props = $props()

	function handleChange(e: Event) {
		const target = e.target as any
		if (onChange) {
			onChange(target.checked ?? false)
		}
	}
</script>

<fluent-switch
	class={className}
	{style}
	{readonly}
	{id}
	{disabled}
	{name}
	aria-label={ariaLabel || label}
	{required}
	current-checked={checked}
	on:change={handleChange}
	role="switch"
	{...restProps}
>
	{#if label}
		{label}
	{/if}

	{#if labelTemplate}
		{@render labelTemplate?.()}
	{/if}

	{#if children}
		{@render children?.()}
	{/if}

	{#if checkedMessage}
		<span slot="checked-message" style="margin-left: 0.5rem;">{checkedMessage}</span>
	{/if}

	{#if uncheckedMessage}
		<span slot="unchecked-message" style="margin-left: 0.5rem;">{uncheckedMessage}</span>
	{/if}
</fluent-switch>
