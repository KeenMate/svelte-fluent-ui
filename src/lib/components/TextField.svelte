<script lang="ts">
	import {fluentTextField, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentTextField())

	type Props = {
		value?: string | null | undefined
		placeholder?: string | null | undefined
		appearance?: string | null | undefined
		disabled?: boolean | null | undefined
		readonly?: boolean | null | undefined
		required?: boolean | null | undefined
		type?: string | null | undefined
		name?: string | null | undefined
		autocomplete?: string | null | undefined
		label?: string | null | undefined
		autofocus?: boolean | null | undefined
		children?: SlotType | null | undefined
		style?: string | null | undefined

		setSelectionRange?: (
			start: number,
			end: number,
			direction?: "forward" | "backward" | "none"
		) => void

		onInput?: (ev: InputEvent) => void
		onChange?: (ev: Event) => void
		onKeyDown?: (ev: KeyboardEvent) => void
		onKeyUp?: (ev: KeyboardEvent) => void
		onFocus?: (ev: FocusEvent) => void
		onBlur?: (ev: FocusEvent) => void
	}

	let {
		value = $bindable(),
		placeholder = undefined,
		appearance = undefined,
		disabled = undefined,
		readonly = undefined,
		required = undefined,
		type = undefined,
		name = undefined,
		autocomplete = undefined,
		label = undefined,
		autofocus = undefined,
		children = undefined,
		style = "",

		onInput = undefined,
		onChange = undefined,
		onKeyDown = undefined,
		onKeyUp = undefined,
		onFocus = undefined,
		onBlur = undefined
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
		value = target.value
		onInput?.(event)
	}

	function handleOnChange(event: Event) {
		onChange?.(event)
	}

	function handleOnKeyDown(event: KeyboardEvent) {
		onKeyDown?.(event)
	}

	function handleOnKeyUp(event: KeyboardEvent) {
		onKeyUp?.(event)
	}

	function handleOnFocus(event: FocusEvent) {
		onFocus?.(event)
	}

	function handleOnBlur(event: FocusEvent) {
		onBlur?.(event)
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
	{autocomplete}
	{autofocus}
	{style}
	oninput={handleOnInput}
	onchange={handleOnChange}
	onkeydown={handleOnKeyDown}
	onkeyup={handleOnKeyUp}
	onfocus={handleOnFocus}
	onblur={handleOnBlur}
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
