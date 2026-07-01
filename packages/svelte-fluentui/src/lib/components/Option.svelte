<!--
 * Option Component
 *
 * Renders a single listbox option as a plain themed <div role="option">.
 *
 * Previously this wrapped <fluent-option> (a FAST custom element with its own
 * shadow DOM). Now that Select/Combobox/Autocomplete are all custom components
 * that own their listbox, style options via design tokens, and drive highlight/
 * filter/selection with data-attributes, <fluent-option> only added cost: every
 * option was a custom element whose shadow-DOM upgrade blocked the main thread
 * on open (~185ms for ~60 options). A plain <div> renders instantly and gives us
 * full CSS control — Autocomplete already renders plain option buttons.
 *
 * The public API (value, label, data, icon, selected, disabled) and the
 * 'selected-options' context contract are unchanged, so this stays a drop-in.
 * Parents read `data-value` / `data-option-label` / `data-option-context`
 * and set `data-highlighted` / `data-filtered-out` / `disabled` on this element.
-->

<script lang="ts">
	import {getContext} from "svelte"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"
	import type { SlotType } from "../types/index.js"

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

	// Selection is either forced via the `selected` prop or derived from the
	// shared context. Reading ctx.value here tracks the parent's selection state.
	const isSelected = $derived(
		selected !== undefined ? selected : !!selectedValue?.value?.includes(value)
	)

	function handleOnClick(ev: MouseEvent) {
		if (disabled) {
			return
		}

		// Only handle context-based selection if we're in a listbox parent.
		if (selectedValue) {
			selectedValue.toggle(value)
		}

		onclick?.(ev)
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class={`fluent-option${className ? ` ${className}` : ""}`}
	role="option"
	aria-selected={isSelected ? "true" : "false"}
	data-value={value}
	data-option-label={label ?? null}
	data-option-context={data ? JSON.stringify(data) : null}
	{...(disabled ? {disabled: "", "aria-disabled": "true"} : {})}
	{...(style ? {style} : {})}
	onclick={handleOnClick}
>
	{#if icon}
		<span class="option-icon">
			{@render icon()}
		</span>
	{/if}
	{@render children()}
</div>

<style>
	/* One row of a listbox. Sized/typed against FluentUI design tokens so it
	 * matches the trigger and the rest of the library. Scoped styles live here
	 * (not in each parent) so the same look applies wherever an Option renders —
	 * portalled popover, inline multi-select list, etc. */
	.fluent-option {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		box-sizing: border-box;
		flex-shrink: 0;
		min-height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		padding: 0 calc(var(--design-unit, 4) * 2 * 1px);
		font-family: inherit;
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		color: var(--neutral-foreground-rest, #242424);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		cursor: pointer;
		user-select: none;
	}

	.fluent-option:hover:not([disabled]),
	.fluent-option[data-highlighted]:not([disabled]) {
		background: var(--neutral-fill-stealth-hover, #f0f0f0);
	}

	.fluent-option[aria-selected="true"] {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		font-weight: 600;
	}

	.fluent-option[aria-selected="true"]:hover:not([disabled]),
	.fluent-option[aria-selected="true"][data-highlighted]:not([disabled]) {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
	}

	.fluent-option[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Parents (Combobox) hide non-matching rows by toggling this attribute. */
	.fluent-option[data-filtered-out] {
		display: none !important;
	}

	.option-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}
</style>
