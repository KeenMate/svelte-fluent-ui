	<script lang="ts">
		import {fluentOption, provideFluentDesignSystem} from "@fluentui/web-components"
		import {getContext} from "svelte"
		import type {SelectedOptionSvelteContext} from "../types/combobox.js"

		provideFluentDesignSystem().register(
			fluentOption()
		)

		type Props = {
			value: string
			label?: string
			style?: string
			onclick?: Function
			selected?: boolean
			disabled?: boolean
			/** Arbitrary context data passed to onchange when this option is selected */
			data?: Record<string, unknown>
			children: any
		}

		let {
				value,
				label    = undefined,
				disabled = false,
				selected = undefined,
				onclick  = undefined,
				data     = undefined,
				children
			}: Props = $props()

		const selectedValue = getContext<SelectedOptionSvelteContext | undefined>("selected-options")

		function handleOnClick(ev: MouseEvent) {
			if (disabled) {
				return
			}

			// Only handle context-based selection if we're in a Combobox
			if (selectedValue) {
				console.log("Option on click", {
					ev,
					selectedValue: selectedValue.value
				})
				selectedValue.toggle(value)
			}

			onclick?.(ev)
		}
	</script>

	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<fluent-option
		{value}
		selected={selected !== undefined ? selected : selectedValue?.value?.includes(value) ?? false}
		data-option-label={label || null}
		data-option-context={data ? JSON.stringify(data) : undefined}
		{disabled}
		onclick={handleOnClick}
	>
		{@render children()}
	</fluent-option>
