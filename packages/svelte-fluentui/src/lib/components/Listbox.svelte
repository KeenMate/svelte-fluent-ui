<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import {setContext, untrack} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"
	import {createSelectedOptions} from "../data/selected-options.svelte.js"

	provideFluentDesignSystem().register(fluentListbox())

	type ValueType = string | string[] | null | undefined

	type Props = {
		value: ValueType
		multi?: boolean
		readonly?: boolean
		disabled?: boolean
		autofocus?: boolean
		name?: string
		label?: string
		ariaLabel?: string
		width?: string
		height?: string
		size?: number
		class?: string
		style?: string
		children?: SlotType
		onchange?: (ev: Event) => void
	}

	let {
		value = $bindable(),
		multi = undefined,
		disabled = undefined,
		readonly = undefined,
		autofocus = undefined,
		name = undefined,
		label = undefined,
		ariaLabel = undefined,
		width = undefined,
		height = undefined,
		size = undefined,
		class: className = "",
		style = "",
		children = undefined,
		onchange = undefined
	}: Props = $props()

	// Combine width/height with style (default width: 100%)
	// Note: height uses --listbox-max-height CSS variable which the FluentUI web component uses internally
	let computedStyle = $derived(() => {
		const styles: string[] = [`width: ${width || '100%'}`]
		if (height) {
			styles.push(`--listbox-max-height: ${height}`)
		}
		if (style) styles.push(style)
		return styles.join('; ')
	})

	let element:
		| (HTMLElement & {
				length: number
				value: any
				selectedIndex: number
				options: HTMLOptionElement[]
				selectFirstOption: VoidFunction
		  })
		| undefined = $state()

	const selectedOptions = createSelectedOptions(value, multi)
	setContext<SelectedOptionSvelteContext>("selected-options", selectedOptions)

	$effect(() => {
		const current = selectedOptions.value
		if (JSON.stringify(current) !== JSON.stringify(value)) {
			value = current
		}
	})

	let selectedOptionsAttr = $derived(() =>
		typeof value === "string" ? value : Array.isArray(value) ? value.join(",") : undefined
	)

	function handleOnChange(ev: Event) {
		const target = ev.target as HTMLSelectElement
		if (!target) return

		const selected = Array.from(target.selectedOptions).map((opt) => opt.value)
		value = multi ? selected : selected[0]
		onchange?.(ev)
	}
</script>

{#if label}
	<label style="display: block; margin-bottom: 0.25rem;">{label}</label>
{/if}
<!-- svelte-ignore a11y_autofocus -->
<fluent-listbox
	bind:this={element}
	selected-options={selectedOptionsAttr}
	{disabled}
	{autofocus}
	{name}
	{...(size !== undefined ? { size } : {})}
	aria-label={ariaLabel || null}
	class={className || null}
	style={computedStyle()}
	multiple={multi}
	onchange={handleOnChange}
>
	{@render children?.()}
</fluent-listbox>
