<script lang="ts">
	import { fluentSearch, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentSearch());

	type Props = {
		class?: string;
		style?: string;
		id?: string;
		name?: string;
		autocomplete?: string;
		value?: string;
		readonly?: boolean;
		autofocus?: boolean;
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
		onInput?: (value: string) => void;
		onChange?: (value: string) => void;
	};

	let {
		class: className = "",
		style = "",
		id,
		name,
		autocomplete,
		value = $bindable(),
		readonly,
		autofocus,
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
		onInput,
		onChange
	}: Props = $props();

	function handleInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		value = val;
		onInput?.(val);
	}

	function handleChange(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		value = val;
		onChange?.(val);
	}
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
	class={className}
	{style}
	{id}
	{name}
	{autocomplete}
	{readonly}
	{autofocus}
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
