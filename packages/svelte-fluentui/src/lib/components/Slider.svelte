<script lang="ts">
	import {fluentSlider, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	if (!customElements.get("fluent-slider")) {
		provideFluentDesignSystem().register(fluentSlider())
	}

	type Props = {
		id?: string
		value?: number | null
		min?: number
		max?: number
		step?: number
		orientation?: "horizontal" | "vertical"
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		name?: string
		label?: string
		labelTemplate?: SlotType
		ariaLabel?: string
		class?: string
		style?: string
		children?: SlotType
		onchange?: (value: number) => void
		oninput?: (value: number) => void
	}

	let {
		id = undefined,
		value = $bindable(),
		min = 0,
		max = 10,
		step = 1,
		orientation = "horizontal",
		disabled = undefined,
		readonly = undefined,
		required = undefined,
		name = undefined,
		label = undefined,
		labelTemplate = undefined,
		ariaLabel = undefined,
		class: className = "",
		style = "",
		children = undefined,
		onchange = undefined,
		oninput = undefined
	}: Props = $props()

	let element: (HTMLElement & {value: string; valueAsNumber: number}) | undefined = $state()

	// Keep the web component's value in sync with the bound `value` prop.
	// fluent-slider exposes `value` as a string attribute, so we set it directly
	// on the element to avoid attribute/property mismatch warnings.
	$effect(() => {
		if (!element) return
		const next = value ?? min
		const str = String(next)
		if (element.value !== str) {
			element.value = str
		}
	})

	function handleChange(ev: Event) {
		const target = ev.target as HTMLElement & {valueAsNumber: number}
		const numeric = Number(target.valueAsNumber)
		if (!Number.isNaN(numeric)) {
			value = numeric
			onchange?.(numeric)
		}
	}

	function handleInput(ev: Event) {
		const target = ev.target as HTMLElement & {valueAsNumber: number}
		const numeric = Number(target.valueAsNumber)
		if (!Number.isNaN(numeric)) {
			value = numeric
			oninput?.(numeric)
		}
	}
</script>

{#if label || labelTemplate}
	<label for={id} class="fluent-field-label">
		{#if label}{label}{/if}
		{#if labelTemplate}{@render labelTemplate?.()}{/if}
	</label>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<fluent-slider
	bind:this={element}
	{...(id ? { id } : {})}
	{...(min !== undefined ? { min } : {})}
	{...(max !== undefined ? { max } : {})}
	{...(step !== undefined ? { step } : {})}
	{...(orientation ? { orientation } : {})}
	{...(disabled ? { disabled } : {})}
	{...(readonly ? { readonly } : {})}
	{...(required ? { required } : {})}
	{...(name ? { name } : {})}
	{...(ariaLabel || label ? { "aria-label": ariaLabel || label } : {})}
	{...(className ? { class: className } : {})}
	{...(style ? { style } : {})}
	onchange={handleChange}
	oninput={handleInput}
>
	{#if children}
		{@render children()}
	{/if}
</fluent-slider>
