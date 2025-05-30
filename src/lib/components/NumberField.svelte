<script lang="ts">
	import { fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentNumberField());

	type Props = {
		value?: string;
		placeholder?: string;
		appearance?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		name?: string;
		label?: string;
		autofocus?: boolean;
		step?: number;
		min?: number;
		max?: number;
		hideStep?: boolean;
		children?: SlotType;

		onInput?: (ev: InputEvent) => void;
		onChange?: (ev: Event) => void;
	};

	let {
		value = $bindable<string>(),
		placeholder,
		appearance,
		disabled,
		readonly,
		required,
		name,
		label,
		autofocus,
		step,
		min,
		max,
		hideStep,
		children,
		onInput,
		onChange,
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
		onInput?.(event);
	}

	function handleOnChange(event: Event) {
		onChange?.(event);
	}
</script>

<fluent-number-field
	bind:this={element}
	{placeholder}
	{appearance}
	{disabled}
	{readonly}
	{required}
	{autofocus}
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