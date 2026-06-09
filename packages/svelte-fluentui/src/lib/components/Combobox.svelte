<script lang="ts">
	import {
		provideFluentDesignSystem,
		fluentCombobox,
	} from "@fluentui/web-components"
	import type {OptionItem, SelectedValue, SlotType} from "../types/index.js"
	import Option from "./Option.svelte"
	import {setContext, untrack} from "svelte"
	import type {SelectedOptionSvelteContext, ValueType} from "../types/combobox.js"
	import {createSelectedOptions} from "../data/selected-options.svelte.js"

	provideFluentDesignSystem().register(fluentCombobox())

	type Props = {
		id: string
		value?: SelectedValue
		options?: OptionItem[]
		children?: SlotType
		autocomplete?: "inline" | "list" | "both" | "none"
		open?: boolean
		currentValue?: string
		placeholder?: string
		position?: "above" | "below"
		disabled?: boolean
		appearance?: "outline" | "filled"
		required?: boolean
		autofocus?: boolean
		name?: string
		// New properties
		class?: string
		style?: string
		label?: string
		labelTemplate?: SlotType
		ariaLabel?: string
		title?: string
		width?: string
		height?: string
		multiple?: boolean
		minSearchLength?: number
		onchange?: (value: SelectedValue) => void
	}

	let {
		id,
		value = $bindable(),
		options = undefined,
		autocomplete = undefined,
		open = undefined,
		currentValue = undefined,
		placeholder = undefined,
		position = undefined,
		disabled = undefined,
		appearance = undefined,
		required = undefined,
		autofocus = undefined,
		name = undefined,
		children = undefined,
		// New properties
		class: className = "",
		style = "",
		label = undefined,
		labelTemplate = undefined,
		ariaLabel = undefined,
		title = undefined,
		width = undefined,
		height = undefined,
		multiple = false,
		minSearchLength = undefined,
		onchange = undefined
	}: Props = $props()

	const selectedOptions = createSelectedOptions(value)
	setContext<SelectedOptionSvelteContext>(
		"selected-options",
		selectedOptions,
	)

	let element:
		    | (HTMLElement & {
		    // it is an array of <fluent-option> elements (but this is close enough :))
		    options: HTMLOptionElement[];
		    value: OptionItem["value"];
		    selectedIndex: number;
	    })
		    | undefined = undefined

	// Re-apply value when options are added asynchronously
	// The fluent-combobox web component only evaluates the value at init,
	// so if options arrive later (async), the selection is lost.
	$effect(() => {
		if (!element || !value?.[0]) return

		// Try to apply value immediately (handles options prop changes)
		function applyValue() {
			if (element && element.options?.length > 0 && value?.[0]) {
				const selectedOptionElement = element.options.find(
					(x: HTMLOptionElement) => x.value === value?.[0],
				)
				if (selectedOptionElement) {
					const displayText = selectedOptionElement.dataset.optionLabel ||
						selectedOptionElement.innerText.trim()
					if (element.value !== displayText) {
						element.value = displayText
						const idx = element.options.findIndex(
							(x: HTMLOptionElement) => x.value === value?.[0],
						)
						if (idx >= 0) element.selectedIndex = idx
					}
				}
			}
		}

		// Initial apply after options render
		setTimeout(applyValue, 0)

		// Watch for dynamically added options (children path)
		const observer = new MutationObserver(() => applyValue())
		observer.observe(element, { childList: true, subtree: true })

		return () => observer.disconnect()
	})

	// $inspect(id, "combobox selected options", selectedOptions.value)

	// update value: V
	$effect(() => {
		// console.log(id, "combobox V", {
		// 	value: untrack(() => $state.snapshot(value)),
		// 	selectedOptions: untrack(() => $state.snapshot(selectedOptions.value)),
		// 	equal:           isValueEqualToContext(untrack(() => value), untrack(() => selectedOptions.value))
		// })
		if (isValueEqualToContext(value, untrack(() => selectedOptions.value))) {
			// console.log(id, "combobox V equal", {value, selectedOptions: untrack(() => selectedOptions.value)})
			return
		}

		// reactivity-loop seems to be handled well by Svelte alone...
		selectedOptions.value = untrack(() => selectedOptions.toContextValue)($state.snapshot(value))

		// this is used to update this combobox's visible selected value's text inside the input
		if (element) {
			const selectedOptionElement = element.options.find(
				(x: HTMLOptionElement) => x.value === value?.[0],
			)
			const selectedIndex         = element.options.findIndex(
				(x: HTMLOptionElement) => x.value === value?.[0],
			)

			if (
				(element.value !== value?.[0] || element.selectedIndex !== selectedIndex) &&
				selectedOptionElement
			) {
				element.value         =
					selectedOptionElement.dataset.optionLabel ||
					selectedOptionElement.innerText.trim()
				element.selectedIndex = selectedIndex
			}
		}
	})

	// update value: ^
	$effect(() => {
		// console.log(id, "combobox ^", {
		// 	value: untrack(() => $state.snapshot(value)),
		// 	selectedOptions: $state.snapshot(untrack(() => selectedOptions.value)),
		// 	equal:           isValueEqualToContext(untrack(() => value), untrack(() => selectedOptions.value))
		// })
		if (isValueEqualToContext(untrack(() => value), selectedOptions.value)) {
			// console.log(id,
			// 	"combobox ^ equal",
			// 	{value: untrack(() => value), selectedOptions: $state.snapshot(selectedOptions.value)}
			// )
			return
		}
		if (untrack(() => disabled)) {
			selectedOptions.set(untrack(() => $state.snapshot(value)))
			return
		}

		// console.log(id, "setting value in effect", $selectedValue)
		// reactivity-loop seems to be handled well by Svelte alone...
		value = $state.snapshot(selectedOptions.value)
	})

	function isValueEqualToContext(value: ValueType, ctxValue: SelectedValue) {
		return (!value && !ctxValue)
			|| (value instanceof Array
				? value[0]
				: value) === ctxValue?.[0]
	}

	// Handle change event
	function handleChange() {
		onchange?.(value)
	}

	// Compute combined styles
	let computedStyle = $derived(() => {
		const styles: string[] = []
		if (width) styles.push(`width: ${width}`)
		if (height) styles.push(`--height: ${height}`)
		if (style) styles.push(style)
		return styles.join("; ")
	})

	// Conditional props for web component (to avoid rendering "undefined" or "null" as string values)
	let titleProps = $derived(title ? { title } : {})

	// Set position property on element (web components need property, not just attribute)
	$effect(() => {
		if (element && position) {
			(element as any).position = position
		}
	})

	// Gate the dropdown when the typed text is shorter than minSearchLength.
	// Why: against large/async option sets, opening on a single character like "a"
	// is wasteful (UX noise) or expensive (triggers consumer API calls).
	$effect(() => {
		if (!element || !minSearchLength || minSearchLength <= 0) return

		const el = element as any

		function enforce() {
			// Run after fluent-combobox has applied its own open state for this event.
			queueMicrotask(() => {
				if (!element) return
				const typed = (el.value ?? "") as string
				if (typed.length > 0 && typed.length < (minSearchLength ?? 0) && el.open) {
					el.open = false
				}
			})
		}

		element.addEventListener("input", enforce)
		return () => element?.removeEventListener("input", enforce)
	})
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
{#if label || labelTemplate}
	<label class="fluent-label" for={id}>
		{#if label}
			{label}
		{/if}
		{#if labelTemplate}
			{@render labelTemplate()}
		{/if}
		{#if required}<span class="required-indicator">*</span>{/if}
	</label>
{/if}

<!-- svelte-ignore a11y_autofocus -->
<fluent-combobox
	bind:this={element}
	class={className}
	{...(computedStyle() ? { style: computedStyle() } : {})}
	{...(id ? { id } : {})}
	{...(autocomplete ? { autocomplete } : {})}
	{...(open ? { open } : {})}
	{...(currentValue ? { "current-value": currentValue } : {})}
	{...(placeholder ? { placeholder } : {})}
	{...(position ? { position } : {})}
	{...(disabled ? { disabled } : {})}
	{...(appearance ? { appearance } : {})}
	{...(required ? { required } : {})}
	{...(autofocus ? { autofocus } : {})}
	{...(name ? { name } : {})}
	{...(ariaLabel || label ? { "aria-label": ariaLabel ?? label } : {})}
	{...titleProps}
	onchange={handleChange}
>
	{#if children}
		{@render children()}
	{:else}
		{#each options ?? [] as item (item.value)}
			<Option value={item.value} label={item.label} disabled={item.disabled}>
				{item.label}
			</Option>
		{/each}
	{/if}
</fluent-combobox>

<style>
	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}
</style>
