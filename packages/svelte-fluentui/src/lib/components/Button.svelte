<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentButton())

	type Props = {
		appearance?: string
		autofocus?: boolean
		disabled?: boolean
		form?: string
		formaction?: string
		formenctype?: string
		formmethod?: string
		formnovalidate?: string
		formtarget?: string
		name?: string
		type?: string
		value?: string
		start?: SlotType
		end?: SlotType
		children?: SlotType
		style?: string
		class?: string
		"aria-label"?: string
		/** Native HTML `title` — text shown as a browser tooltip when hovering the button. */
		title?: string
		onclick?: (ev: MouseEvent) => void
	}

	let {
		appearance = undefined,
		autofocus = undefined,
		disabled = undefined,
		form = undefined,
		formaction = undefined,
		formenctype = undefined,
		formmethod = undefined,
		formnovalidate = undefined,
		formtarget = undefined,
		name = undefined,
		type = undefined,
		value = undefined,
		start = undefined,
		end = undefined,
		children = undefined,
		style= "",
		class: className = undefined,
		"aria-label": ariaLabel = undefined,
		title = undefined,
		onclick = undefined
	}: Props = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_autofocus -->
<fluent-button
	{...(type ? { type } : {})}
	{...(name ? { name } : {})}
	{...(value != null ? { value } : {})}
	{...(appearance ? { appearance } : {})}
	{...(autofocus ? { autofocus } : {})}
	{...(formaction ? { formaction } : {})}
	{...(form ? { form } : {})}
	{...(formenctype ? { formenctype } : {})}
	{...(formmethod ? { formmethod } : {})}
	{...(formnovalidate ? { formnovalidate } : {})}
	{...(formtarget ? { formtarget } : {})}
	{...(disabled ? { disabled } : {})}
	{...(style ? { style } : {})}
	{...(className ? { class: className } : {})}
	{...(ariaLabel ? { "aria-label": ariaLabel } : {})}
	{...(title ? { title } : {})}
	{onclick}
>
	{#if start}
		<span slot="start" class="button-icon-slot">
			{@render start()}
		</span>
	{/if}
	{@render children?.()}
	{#if end}
		<span slot="end" class="button-icon-slot">
			{@render end()}
		</span>
	{/if}
</fluent-button>

<style>
	.button-icon-slot {
		display: flex;
		align-items: center;
	}

	.button-icon-slot :global(svg) {
		display: block;
	}
</style>
