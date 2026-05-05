<script lang="ts">
	import type {SlotType} from "../types/index.js"

	export type ValidationState = "none" | "warning" | "error" | "success"
	export type FieldOrientation = "vertical" | "horizontal"

	type Props = {
		label?: string | null | undefined
		labelTemplate?: SlotType | null | undefined
		required?: boolean
		hint?: string | null | undefined
		validationState?: ValidationState
		validationMessage?: string | null | undefined
		orientation?: FieldOrientation
		/**
		 * Optional id used both as the inner control's `id` (caller passes it through)
		 * and as the label's `for` attribute. If omitted, label clicks are not
		 * automatically associated with the inner control.
		 */
		id?: string | null | undefined
		class?: string
		style?: string
		children?: SlotType
	}

	let {
		label = undefined,
		labelTemplate = undefined,
		required = false,
		hint = undefined,
		validationState = "none",
		validationMessage = undefined,
		orientation = "vertical",
		id = undefined,
		class: className = "",
		style = "",
		children
	}: Props = $props()

	const showMessage = $derived(
		validationState !== "none" && validationMessage != null && validationMessage !== ""
	)
	const showHint = $derived(!showMessage && hint != null && hint !== "")
</script>

<div
	class="fluent-field fluent-field--{orientation} {className}"
	data-state={validationState}
	{style}
>
	{#if label || labelTemplate}
		<label class="fluent-field__label" for={id}>
			{#if label}{label}{/if}
			{#if labelTemplate}{@render labelTemplate?.()}{/if}
			{#if required}<span class="fluent-field__required" aria-hidden="true">*</span>{/if}
		</label>
	{/if}

	<div class="fluent-field__control">
		{#if children}{@render children()}{/if}
	</div>

	{#if showHint}
		<small class="fluent-field__hint">{hint}</small>
	{/if}

	{#if showMessage}
		<small
			class="fluent-field__message"
			role={validationState === "error" ? "alert" : undefined}
			aria-live={validationState === "error" ? "polite" : undefined}
		>
			{validationMessage}
		</small>
	{/if}
</div>
