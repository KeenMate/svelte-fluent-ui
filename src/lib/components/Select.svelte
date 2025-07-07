<script lang="ts">
	import { fluentSelect, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentSelect());

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
		name?: string;
		value?: string;
		label?: string;
		ariaLabel?: string;
		labelTemplate?: SlotType;
		children?: SlotType;
		onChange?: (value: string) => void;
		[prop: string]: any;
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
		name = undefined,
		value = $bindable(),
		label = undefined,
		ariaLabel = undefined,
		labelTemplate = undefined,
		children = undefined,
		onChange = undefined,
		...restProps
	}: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		value = target.value;
		onChange?.(target.value);
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

<fluent-select
	id={id}
	class={className}
	style={style}
	{open}
	position={position}
	{multiple}
	{disabled}
	appearance={appearance}
	required={required}
	{name}
	current-value={value}
	aria-label={ariaLabel || label}
	on:change={handleChange}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-select>
