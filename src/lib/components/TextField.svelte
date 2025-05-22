<script lang="ts">
	import {fluentTextField, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(
		fluentTextField()
	)

	type Props = {
		value?: string
		placeholder?: string
		appearance?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		type?: string
		name?: string
		label?: string
		autofocus?: boolean
		children?: SlotType

		setSelectionRange?: (
			start: number,
			end: number,
			direction?: "forward" | "backward" | "none"
		) => void

		onInput?: (ev: InputEvent) => void
		onChange?: (ev: Event) => void
	}

	let {
		    value       = $bindable(),
		    placeholder = undefined,
		    appearance  = undefined,
		    disabled    = undefined,
		    readonly    = undefined,
		    required    = undefined,
		    type        = undefined,
		    name        = undefined,
		    label       = undefined,
		    autofocus   = undefined,
		    children    = undefined,


		    onInput     = undefined,
		    onChange    = undefined,
	    }: Props = $props()

	let element: HTMLElement & {
		value: string
		select: () => void
		checkValidity: () => boolean
		reportValidity: () => boolean
		setCustomValidity: (message: string) => void
		setSelectionRange: (
			start: number,
			end: number,
			direction?: "forward" | "backward" | "none"
		) => void
	}

	// Expose methods
	export function select() {
		element?.select()
	}

	export function checkValidity() {
		return element?.checkValidity()
	}

	export function reportValidity() {
		return element?.reportValidity()
	}

	export function setCustomValidity(message: string) {
		element?.setCustomValidity(message)
	}

	export function setSelectionRange(
		start: number,
		end: number,
		direction?: "forward" | "backward" | "none"
	) {
		element?.setSelectionRange(start, end, direction)
	}

	// Internal

	function handleOnInput(event: InputEvent) {
		const target = event.target as HTMLInputElement
		value        = target.value
		onInput?.(event)
	}

	function handleOnChange(event: Event) {
		onChange?.(event)
	}
</script>

<fluent-text-field
	bind:this={element}
	{value}
	{placeholder}
	{appearance}
	{disabled}
	{readonly}
	{required}
	{type}
	{name}
	{autofocus}
	oninput={handleOnInput}
	onchange={handleOnChange}
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</fluent-text-field>

<style>
	/* Optional: Add component-specific styles here */
</style>
