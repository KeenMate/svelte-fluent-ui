<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentButton())

	type Props = {
		appearance?: string
		autofocus?: string
		disabled?: string
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
		onclick = undefined
	}: Props = $props()
</script>

<fluent-button
	{type}
	{name}
	{value}
	{appearance}
	{formaction}
	{form}
	{formenctype}
	{formmethod}
	{formnovalidate}
	{formtarget}
	{disabled}
	{style}
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
