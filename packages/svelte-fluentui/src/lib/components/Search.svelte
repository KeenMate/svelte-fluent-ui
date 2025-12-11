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
		appearance?: "outline" | "filled";
		ariaLabel?: string;
		label?: string;
		labelTemplate?: SlotType;
		children?: SlotType;
		start?: SlotType;
		end?: SlotType;
		// New props from Blazor API
		immediate?: boolean;
		immediateDelay?: number;
		dataList?: string;
		displayName?: string;
		width?: string;
		height?: string;
		title?: string;
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
		start,
		end,
		// New props
		immediate = false,
		immediateDelay = 0,
		dataList,
		displayName,
		width,
		height,
		title,
		oninput,
		onchange
	}: Props = $props();

	let element: HTMLElement | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	// Expose focus method for parent components
	export function focusAsync(preventScroll: boolean = false) {
		if (element) {
			const shadowInput = element.shadowRoot?.querySelector("input");
			if (shadowInput) {
				shadowInput.focus({ preventScroll });
			} else {
				element.focus({ preventScroll });
			}
		}
	}

	function handleInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		value = val;

		if (immediate) {
			// Immediate mode: fire callback with optional debounce
			if (immediateDelay > 0) {
				if (debounceTimer) clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					oninput?.(val);
				}, immediateDelay);
			} else {
				oninput?.(val);
			}
		} else {
			// Standard mode: fire on every input
			oninput?.(val);
		}
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

	// Cleanup debounce timer
	$effect(() => {
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});

	// Compute combined style
	let computedStyle = $derived.by(() => {
		let s = style || "";
		if (width) s += (s ? "; " : "") + `width: ${width}`;
		if (height) s += (s ? "; " : "") + `height: ${height}`;
		return s || undefined;
	});

	// Title prop handling (spread to avoid "null" text)
	let titleProps = $derived(title ? { title } : {});
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
	{...(className ? { class: className } : {})}
	{...(computedStyle ? { style: computedStyle } : {})}
	{...(id ? { id } : {})}
	{...(name ? { name } : {})}
	{...(readonly ? { readonly } : {})}
	{...(autofocus ? { autofocus } : {})}
	{...(autocomplete ? { autocomplete } : {})}
	{...(placeholder ? { placeholder } : {})}
	{...(dataList || list ? { list: dataList || list } : {})}
	{...(maxlength !== undefined ? { maxlength } : {})}
	value={value ?? ""}
	{...(minlength !== undefined ? { minlength } : {})}
	{...(pattern ? { pattern } : {})}
	{...(size !== undefined ? { size } : {})}
	{...(spellcheck !== undefined ? { spellcheck } : {})}
	{...(disabled ? { disabled } : {})}
	{...(required ? { required } : {})}
	appearance={appearance ?? "outline"}
	{...(ariaLabel || label ? { "aria-label": ariaLabel || label } : {})}
	{...titleProps}
	oninput={handleInput}
	onchange={handleChange}
>
	{#if start}
		<span slot="start">
			{@render start()}
		</span>
	{/if}
	{@render children?.()}
	{#if end}
		<span slot="end">
			{@render end()}
		</span>
	{/if}
</fluent-search>
