<script lang="ts">
	import {fluentTextField, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setAutocompleteOnShadowInput} from "../utils/shadow-dom.js"

	provideFluentDesignSystem().register(fluentTextField())

	type Props = {
		id?: string | null | undefined
		value?: string | null | undefined
		placeholder?: string | null | undefined
		appearance?: string | null | undefined
		disabled?: boolean | null | undefined
		readonly?: boolean | null | undefined
		required?: boolean | null | undefined
		type?: string | null | undefined
		name?: string | null | undefined
		label?: string | null | undefined
		labelTemplate?: SlotType | null | undefined
		autofocus?: boolean | null | undefined
		autocomplete?: string | null | undefined
		children?: SlotType | null | undefined
		end?: SlotType | null | undefined
		style?: string | null | undefined
		title?: string | null | undefined

		setSelectionRange?: (
			start: number,
			end: number,
			direction?: "forward" | "backward" | "none"
		) => void

		oninput?: (ev: InputEvent) => void
		onchange?: (ev: Event) => void
		onkeydown?: (ev: KeyboardEvent) => void
		onkeyup?: (ev: KeyboardEvent) => void
		onfocus?: (ev: FocusEvent) => void
		onblur?: (ev: FocusEvent) => void
	}

	let {
		id = undefined,
		value = $bindable(),
		placeholder = undefined,
		appearance = undefined,
		disabled = undefined,
		readonly = undefined,
		required = undefined,
		type = undefined,
		name = undefined,
		label = undefined,
		labelTemplate = undefined,
		autofocus = undefined,
		autocomplete = "off",
		children = undefined,
		end = undefined,
		style = "",
		title = undefined,

		oninput = undefined,
		onchange = undefined,
		onkeydown = undefined,
		onkeyup = undefined,
		onfocus = undefined,
		onblur = undefined
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
		oninput?.(event)
	}

	function handleOnChange(event: Event) {
		onchange?.(event)
	}

	function handleOnKeyDown(event: KeyboardEvent) {
		onkeydown?.(event)
	}

	function handleOnKeyUp(event: KeyboardEvent) {
		onkeyup?.(event)
	}

	function handleOnFocus(event: FocusEvent) {
		onfocus?.(event)
	}

	function handleOnBlur(event: FocusEvent) {
		onblur?.(event)
	}

	// Apply autocomplete attribute via shadow DOM
	$effect(() => {
		if (autocomplete != null) {
			setAutocompleteOnShadowInput(element, autocomplete)
		}
	})
</script>

{#if label || labelTemplate}
	<label for={id} class="fluent-label">
		{#if label}
			{label}
		{/if}
		{#if labelTemplate}
			{@render labelTemplate?.()}
		{/if}
	</label>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_autofocus -->
<fluent-text-field
	bind:this={element}
	{id}
	{value}
	{placeholder}
	{appearance}
	{disabled}
	{readonly}
	{required}
	{type}
	{name}
	{autofocus}
	{autocomplete}
	{style}
	{title}
	aria-label={!label && !labelTemplate ? undefined : label || undefined}
	oninput={handleOnInput}
	onchange={handleOnChange}
	onkeydown={handleOnKeyDown}
	onkeyup={handleOnKeyUp}
	onfocus={handleOnFocus}
	onblur={handleOnBlur}
>
	{#if children}
		{@render children()}
	{/if}
	{#if end}
		<div slot="end">
			{@render end()}
		</div>
	{/if}
</fluent-text-field>

<style>
	/* Optional: Add component-specific styles here */
</style>
