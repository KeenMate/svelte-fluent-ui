	<script lang="ts">
		import {fluentOption, provideFluentDesignSystem} from "@fluentui/web-components"
		import {getContext} from "svelte"
		import type {SelectedOptionSvelteContext} from "../types/combobox.js"
		import type { SlotType } from "../types/index.js"

		provideFluentDesignSystem().register(
			fluentOption()
		)

		type Props = {
			value: string
			label?: string
			class?: string
			style?: string
			onclick?: (ev: MouseEvent) => void
			selected?: boolean
			disabled?: boolean
			/** Arbitrary context data passed to onchange when this option is selected */
			data?: Record<string, unknown>
			/** Icon slot rendered before option text */
			icon?: SlotType
			children: SlotType
		}

		let {
				value,
				label    = undefined,
				class: className = undefined,
				style    = undefined,
				disabled = false,
				selected = undefined,
				onclick  = undefined,
				data     = undefined,
				icon     = undefined,
				children
			}: Props = $props()

		const selectedValue = getContext<SelectedOptionSvelteContext | undefined>("selected-options")

		function handleOnClick(ev: MouseEvent) {
			if (disabled) {
				return
			}

			// Only handle context-based selection if we're in a Combobox
			if (selectedValue) {
				selectedValue.toggle(value)
			}

			onclick?.(ev)
		}
	</script>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<fluent-option
		{...(value != null ? { value } : {})}
		{...((selected !== undefined ? selected : selectedValue?.value?.includes(value)) ? { selected: true } : {})}
		class={className}
		{...(style ? { style } : {})}
		{...(label ? { "data-option-label": label } : {})}
		{...(data ? { "data-option-context": JSON.stringify(data) } : {})}
		{...(disabled ? { disabled } : {})}
		onclick={handleOnClick}
	>
		{#if icon}
			<span slot="start" class="option-icon">
				{@render icon()}
			</span>
		{/if}
		{@render children()}
	</fluent-option>
