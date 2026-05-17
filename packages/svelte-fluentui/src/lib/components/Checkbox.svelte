<script lang="ts">
	import {fluentCheckbox, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	if (!customElements.get('fluent-checkbox')) {
		provideFluentDesignSystem().register(fluentCheckbox())
	}

	type Props = {
		checked: boolean | null;
		withIntermediate?: boolean;
		threeStateOrderUncheckToIntermediate?: boolean;
		autofocus?: boolean;
		children?: SlotType;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		id?: string;
		name?: string;
		label?: string;
		labelTemplate?: SlotType;
		labelPosition?: "top" | "start";
		ariaLabel?: string;
		class?: string;
		style?: string;
		onclick?: (ev: PointerEvent, previousValue: boolean | null) => void
	}

	let {
		checked = $bindable(),
		withIntermediate = undefined,
		threeStateOrderUncheckToIntermediate = false,
		autofocus = undefined,
		disabled = undefined,
		readonly = undefined,
		required = undefined,
		id = undefined,
		name = undefined,
		label = undefined,
		labelTemplate = undefined,
		labelPosition = "start",
		ariaLabel = undefined,
		class: className = "",
		style = "",
		children = undefined,
		onclick = undefined
	}: Props = $props()

	let element: HTMLElement & {
		checkValidity: () => boolean
		reportValidity: () => boolean
		setCustomValidity: (message: string) => void
		setValidity: (flags: any, message: any, anchor: any) => void
	}

	// Expose validation methods
	export function checkValidity() {
		return element?.checkValidity()
	}

	export function reportValidity() {
		return element?.reportValidity()
	}

	export function setCustomValidity(message: string) {
		element?.setCustomValidity(message)
	}

	export function setValidity(flags: any, message: any, anchor: any) {
		element?.setValidity(flags, message, anchor)
	}

	function handleOnClick(ev: PointerEvent) {
		ev.preventDefault()
		ev.stopImmediatePropagation()

		if (readonly || disabled) {
			return
		}

		const previousValue = $state.snapshot(checked)

		if (withIntermediate) {
			if (threeStateOrderUncheckToIntermediate) {
				// Blazor order: false -> null (indeterminate) -> true -> false
				if (previousValue === false) {
					checked = null
				} else if (previousValue === null) {
					checked = true
				} else {
					checked = false
				}
			} else {
				// Default order: false -> true -> null (indeterminate) -> false
				if (previousValue === true) {
					checked = null
				} else if (previousValue === null) {
					checked = false
				} else {
					checked = true
				}
			}
		} else {
			// Two-state toggle: true <-> false
			checked = (ev as any).target.checked
		}

		onclick?.(ev, previousValue)
	}
</script>

<span class="fluent-checkbox-wrapper" data-label-position={labelPosition}>
	{#if label || labelTemplate || children}
		<label for={id} class="fluent-label">
			{#if label}{label}{/if}
			{#if labelTemplate}{@render labelTemplate?.()}{/if}
			{#if children}{@render children?.()}{/if}
		</label>
	{/if}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_autofocus -->
	<fluent-checkbox
		bind:this={element}
		checked={checked === true}
		indeterminate={checked === null}
		{autofocus}
		{readonly}
		{disabled}
		{required}
		{id}
		{name}
		aria-label={ariaLabel || label || null}
		class={className || null}
		style={style || null}
		onclick={handleOnClick}
	></fluent-checkbox>
</span>

<style>
	:global(fluent-checkbox::part(label)) {
		display: none;
	}

	.fluent-checkbox-wrapper {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.fluent-checkbox-wrapper[data-label-position="top"] {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}
</style>
