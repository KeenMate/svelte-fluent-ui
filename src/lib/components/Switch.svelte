<script lang="ts">
	import {fluentSwitch, provideFluentDesignSystem} from "@fluentui/web-components"
	import { untrack } from 'svelte'
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
		checkedMessage?: string | SlotType
		uncheckedMessage?: string | SlotType
		onChange?: (checked: boolean) => void
		children?: SlotType
		labelTemplate?: SlotType
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
		labelTemplate = undefined
	}: Props = $props()

	// Check if messages are snippets or strings
	let isCheckedMessageSnippet = $derived(typeof checkedMessage === 'function')
	let isUncheckedMessageSnippet = $derived(typeof uncheckedMessage === 'function')

	function handleChange(e: Event) {
		const target = e.target as any
		const newChecked = target.checked ?? false

		// Update the bindable value without creating reactive tracking
		untrack(() => {
			checked = newChecked
		})

		// Call onChange callback if provided
		if (onChange) {
			onChange(newChecked)
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
	onchange={handleChange}
	role="switch"
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
		<span slot="checked-message" class="switch-message">
			{#if isCheckedMessageSnippet}
				{@render (checkedMessage as SlotType)?.()}
			{:else}
				{checkedMessage}
			{/if}
		</span>
	{/if}

	{#if uncheckedMessage}
		<span slot="unchecked-message" class="switch-message">
			{#if isUncheckedMessageSnippet}
				{@render (uncheckedMessage as SlotType)?.()}
			{:else}
				{uncheckedMessage}
			{/if}
		</span>
	{/if}
</fluent-switch>

<style>
	.switch-message {
		margin-left: 0.5rem;
	}
</style>
