<script lang="ts">
	import { fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";
	import { setAutocompleteOnShadowInput } from "../utils/shadow-dom.js";

	provideFluentDesignSystem().register(fluentNumberField());

	type Props = {
		value?: string;
		placeholder?: string;
		appearance?: string;
		style?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		name?: string;
		label?: string;
		autofocus?: boolean;
		autocomplete?: string;
		step?: number;
		min?: number;
		max?: number;
		hideStep?: boolean;
		children?: SlotType;

		oninput?: (ev: InputEvent) => void;
		onchange?: (ev: Event) => void;
	};

	let {
		value = $bindable<string>(),
		placeholder,
		appearance,
		style,
		disabled,
		readonly,
		required,
		name,
		label,
		autofocus,
		autocomplete = "off",
		step,
		min,
		max,
		hideStep,
		children,
		oninput,
		onchange,
	}: Props = $props();

	step ??= 1;
	min ??= -Infinity;
	max ??= Infinity;

	let element: HTMLElement & {
		value: string;
		stepUp: () => void;
		stepDown: () => void;
		checkValidity: () => boolean;
		reportValidity: () => boolean;
		setCustomValidity: (message: string) => void;
	};

	// Exposed methods
	export function stepUp() {
		element?.stepUp();
	}

	export function stepDown() {
		element?.stepDown();
	}

	export function checkValidity() {
		return element?.checkValidity();
	}

	export function reportValidity() {
		return element?.reportValidity();
	}

	export function setCustomValidity(message: string) {
		element?.setCustomValidity(message);
	}

	function handleOnInput(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		oninput?.(event);
	}

	function handleOnChange(event: Event) {
		onchange?.(event);
	}

	// Apply autocomplete attribute via shadow DOM
	$effect(() => {
		if (autocomplete !== undefined) {
			setAutocompleteOnShadowInput(element, autocomplete);
		}
	});
</script>

<fluent-number-field
	bind:this={element}
	{placeholder}
	{appearance}
	{style}
	{disabled}
	{readonly}
	{required}
	{autofocus}
	autocomplete={autocomplete}
	{step}
	{min}
	{max}
	{hideStep}
	{name}
	value={value}
	oninput={handleOnInput}
	onchange={handleOnChange}
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</fluent-number-field>