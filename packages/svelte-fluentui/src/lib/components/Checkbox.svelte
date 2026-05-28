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
		labelPosition?: "top" | "start" | "end";
		ariaLabel?: string;
		class?: string;
		style?: string;
		// Tri-state status messages, mirroring Switch's checkedMessage/
		// uncheckedMessage. The intermediateMessage shows when checked is null
		// (only reachable when withIntermediate is true). Each accepts either a
		// plain string or a Snippet for richer content.
		checkedMessage?: string | SlotType;
		uncheckedMessage?: string | SlotType;
		intermediateMessage?: string | SlotType;
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
		labelPosition = "end",
		ariaLabel = undefined,
		class: className = "",
		style = "",
		children = undefined,
		checkedMessage = undefined,
		uncheckedMessage = undefined,
		intermediateMessage = undefined,
		onclick = undefined
	}: Props = $props()

	const currentMessage = $derived(
		checked === true ? checkedMessage
			: checked === false ? uncheckedMessage
			: intermediateMessage
	)
	const isCurrentMessageSnippet = $derived(typeof currentMessage === "function")

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

	{#if currentMessage}
		<span class="checkbox-message">
			{#if isCurrentMessageSnippet}
				{@render (currentMessage as SlotType)?.()}
			{:else}
				{currentMessage}
			{/if}
		</span>
	{/if}
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

	/* `.fluent-label` carries a 0.25rem bottom margin (set globally in
	   components.scss for stacked form-field labels). In inline layouts that
	   margin extends the label's flex-item box downward, so `align-items:
	   center` lifts the label's visible text above the checkbox midline. Zero
	   it out for start/end; keep it for top where the bottom margin is the
	   intended gap before the control. */
	.fluent-checkbox-wrapper[data-label-position="start"] .fluent-label,
	.fluent-checkbox-wrapper[data-label-position="end"] .fluent-label {
		margin-bottom: 0;
	}

	.fluent-checkbox-wrapper[data-label-position="top"] {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	/* Label appears AFTER the checkbox in the layout (checkbox on the left,
	   label on the right) without changing DOM order — accessible name remains
	   first in the source so screen readers announce it correctly.

	   We use the `order` property rather than `flex-direction: row-reverse`
	   so the optional status message always trails the [checkbox, label] pair
	   instead of jumping to the front (which row-reverse would do). */
	.fluent-checkbox-wrapper[data-label-position="end"] .fluent-label {
		order: 1;
	}
	.fluent-checkbox-wrapper[data-label-position="end"] .checkbox-message {
		order: 2;
	}

	.checkbox-message {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}
</style>
