<script lang="ts">
	import { fluentSelect, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentSelect());

	type SelectChangeDetail = {
		value: string;
		data?: Record<string, unknown>;
	};

	type Props = {
		id?: string;
		class?: string;
		style?: string;
		open?: boolean;
		position?: "above" | "below";
		multiple?: boolean;
		disabled?: boolean;
		appearance?: "outline" | "filled";
		required?: boolean;
		autofocus?: boolean;
		name?: string;
		value?: string;
		label?: string;
		ariaLabel?: string;
		labelTemplate?: SlotType;
		children?: SlotType;
		onchange?: (detail: SelectChangeDetail) => void;
	};

	let {
		id = undefined,
		class: className = "",
		style = "",
		open = undefined,
		position = undefined,
		multiple = false,
		disabled = undefined,
		appearance = undefined,
		required = undefined,
		autofocus = undefined,
		name = undefined,
		value = $bindable(),
		label = undefined,
		ariaLabel = undefined,
		labelTemplate = undefined,
		children = undefined,
		onchange = undefined
	}: Props = $props();

	let selectElement: HTMLElement | undefined = $state();

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		value = target.value;

		// Find selected option and extract its data
		const selectedOption = selectElement?.querySelector(`fluent-option[value="${target.value}"]`) as HTMLElement | null;
		const contextData = selectedOption?.dataset.optionContext;
		const data = contextData ? JSON.parse(contextData) : undefined;

		onchange?.({ value: target.value, data });
	}
</script>

{#if label || labelTemplate}
	<label for={id} class="fluent-label">
		{#if label}
			{label}
		{/if}
		{#if labelTemplate}
			{@render labelTemplate?.()}
		{/if}
	</label>
{/if}

<!-- svelte-ignore a11y_autofocus -->
<fluent-select
	bind:this={selectElement}
	id={id}
	class={className}
	style={style}
	{open}
	position={position}
	{multiple}
	{disabled}
	appearance={appearance}
	required={required}
	{autofocus}
	{name}
	current-value={value}
	aria-label={ariaLabel || label}
	onchange={handleChange}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-select>
