<script lang="ts">
	import { fluentSearch, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";
	import { setAutocompleteOnShadowInput } from "../utils/shadow-dom.js";

	provideFluentDesignSystem().register(fluentSearch());

	type Props = {
		class?: string;
		style?: string;
		id?: string;
		name?: string;
		value?: string;
		readonly?: boolean;
		autofocus?: boolean;
		autocomplete?: string;
		placeholder?: string;
		list?: string;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		size?: number;
		spellcheck?: boolean;
		disabled?: boolean;
		required?: boolean;
		appearance?: string;
		ariaLabel?: string;
		label?: string;
		labelTemplate?: SlotType;
		children?: SlotType;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	};

	let {
		class: className = "",
		style = "",
		id,
		name,
		value = $bindable(),
		readonly,
		autofocus,
		autocomplete = "off",
		placeholder,
		list,
		maxlength,
		minlength,
		pattern,
		size,
		spellcheck,
		disabled,
		required,
		appearance,
		ariaLabel,
		label,
		labelTemplate,
		children,
		oninput,
		onchange
	}: Props = $props();

	let element: HTMLElement | undefined;

	function handleInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		value = val;
		oninput?.(val);
	}

	function handleChange(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		value = val;
		onchange?.(val);
	}

	// Apply autocomplete attribute via shadow DOM
	$effect(() => {
		if (autocomplete !== undefined) {
			setAutocompleteOnShadowInput(element, autocomplete);
		}
	});
</script>

{#if label}
	<label for={id} aria-label={ariaLabel || label}>
		{label}
		{#if required}<span aria-hidden="true">*</span>{/if}
	</label>
{/if}

{#if labelTemplate}
	{@render labelTemplate?.()}
{/if}

<fluent-search
	bind:this={element}
	class={className}
	{style}
	{id}
	{name}
	{readonly}
	{autofocus}
	autocomplete={autocomplete}
	{placeholder}
	{list}
	{maxlength}
	{value}
	{minlength}
	{pattern}
	{size}
	{spellcheck}
	{disabled}
	{required}
	appearance={appearance}
	aria-label={ariaLabel || label}
	oninput={handleInput}
	onchange={handleChange}
>
	{@render children?.()}
</fluent-search>
