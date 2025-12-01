<script lang="ts">
	import { fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";
	import { setAutocompleteOnShadowInput } from "../utils/shadow-dom.js";

	provideFluentDesignSystem().register(fluentNumberField());

	type Props = {
		value?: string;
		placeholder?: string;
		appearance?: "outline" | "filled";
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
		minlength?: number;
		maxlength?: number;
		size?: number;
		list?: string;
		hideStep?: boolean;
		ariaLabel?: string;
		title?: string;
		width?: string;
		height?: string;
		class?: string;
		style?: string;
		children?: SlotType;
		start?: SlotType;
		end?: SlotType;

		oninput?: (ev: InputEvent) => void;
		onchange?: (ev: Event) => void;
		onfocus?: (ev: FocusEvent) => void;
		onblur?: (ev: FocusEvent) => void;
		onkeydown?: (ev: KeyboardEvent) => void;
		onkeyup?: (ev: KeyboardEvent) => void;
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
		autocomplete = "off",
		step,
		min,
		max,
		minlength,
		maxlength,
		size,
		list,
		hideStep,
		ariaLabel,
		title,
		width,
		height,
		class: className,
		style,
		children,
		start,
		end,
		oninput,
		onchange,
		onfocus,
		onblur,
		onkeydown,
		onkeyup,
	}: Props = $props();

	// Compute style with width/height
	let computedStyle = $derived.by(() => {
		let s = style || "";
		if (width) s += (s ? "; " : "") + `width: ${width}`;
		if (height) s += (s ? "; " : "") + `height: ${height}`;
		return s || null;
	});

	// Handle title separately to avoid rendering "null" as text
	let titleProps = $derived(title ? { title } : {});

	let element: HTMLElement & {
		value: string;
		valueAsNumber: number;
		stepUp: () => void;
		stepDown: () => void;
		checkValidity: () => boolean;
		reportValidity: () => boolean;
		setCustomValidity: (message: string) => void;
		focus: () => void;
		blur: () => void;
		select: () => void;
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

	export function focus() {
		element?.focus();
	}

	export function blur() {
		element?.blur();
	}

	export function select() {
		element?.select();
	}

	function handleOnInput(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		oninput?.(event);
	}

	function handleOnChange(event: Event) {
		onchange?.(event);
	}

	function handleOnFocus(event: FocusEvent) {
		onfocus?.(event);
	}

	function handleOnBlur(event: FocusEvent) {
		onblur?.(event);
	}

	function handleOnKeydown(event: KeyboardEvent) {
		onkeydown?.(event);
	}

	function handleOnKeyup(event: KeyboardEvent) {
		onkeyup?.(event);
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
	class={className || null}
	style={computedStyle}
	placeholder={placeholder || null}
	appearance={appearance || null}
	disabled={disabled || null}
	readonly={readonly || null}
	required={required || null}
	autofocus={autofocus || null}
	autocomplete={autocomplete || null}
	{...(step !== undefined ? { step } : {})}
	{...(min !== undefined ? { min } : {})}
	{...(max !== undefined ? { max } : {})}
	{...(minlength !== undefined ? { minlength } : {})}
	{...(maxlength !== undefined ? { maxlength } : {})}
	{...(size !== undefined ? { size } : {})}
	list={list || null}
	hide-step={hideStep || null}
	name={name || null}
	aria-label={ariaLabel || null}
	value={value ?? ""}
	{...titleProps}
	oninput={handleOnInput}
	onchange={handleOnChange}
	onfocus={handleOnFocus}
	onblur={handleOnBlur}
	onkeydown={handleOnKeydown}
	onkeyup={handleOnKeyup}
>
	{#if start}
		<span slot="start">{@render start()}</span>
	{/if}
	{#if children}
		{@render children()}
	{:else if label}
		{label}
	{/if}
	{#if end}
		<span slot="end">{@render end()}</span>
	{/if}
</fluent-number-field>
