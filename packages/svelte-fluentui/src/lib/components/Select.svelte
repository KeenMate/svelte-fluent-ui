<script lang="ts">
	import { fluentSelect, provideFluentDesignSystem } from "@fluentui/web-components";
	import type { SlotType } from "../types/index.js";

	provideFluentDesignSystem().register(fluentSelect());

	type SelectChangeDetail = {
		value: string;
		selectedOption?: string;
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
		title?: string;
		width?: string;
		height?: string;
		/** Max visible options for multiple select. When explicitly set, auto-calculates height based on option row height. */
		maxVisibleOptions?: number;
		labelTemplate?: SlotType;
		indicatorTemplate?: SlotType;
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
		title = undefined,
		width = undefined,
		height = undefined,
		maxVisibleOptions = undefined,
		labelTemplate = undefined,
		indicatorTemplate = undefined,
		children = undefined,
		onchange = undefined
	}: Props = $props();

	let selectElement: HTMLElement | undefined = $state();
	let calculatedHeight: string | undefined = $state();

	// Re-apply value when options are added asynchronously
	// The fluent-select web component only evaluates current-value at init,
	// so if options arrive later (async), the selection is lost.
	$effect(() => {
		if (!selectElement || value === undefined || value === null) return;

		const observer = new MutationObserver(() => {
			if (value !== undefined && value !== null) {
				// Force fluent-select to re-evaluate the value
				const el = selectElement as any;
				if (el && el.value !== value) {
					el.value = value;
				}
			}
		});

		observer.observe(selectElement, { childList: true, subtree: true });

		return () => observer.disconnect();
	});

	// Auto-calculate height for multiple select
	$effect(() => {
		if (multiple && selectElement && !height) {
			// Wait for options to render and get their computed height
			setTimeout(() => {
				const options = selectElement?.querySelectorAll('fluent-option');
				if (options && options.length > 0) {
					const firstOption = options[0] as HTMLElement;
					// Get computed height or use fallback
					const computedHeight = window.getComputedStyle(firstOption).height;
					const optionHeight = parseInt(computedHeight) || firstOption.offsetHeight || 32;
					// If maxVisibleOptions set, limit to that; otherwise show all
					const visibleCount = maxVisibleOptions !== undefined
						? Math.min(options.length, maxVisibleOptions)
						: options.length;
					// Add padding for top/bottom of the select container (approx 2.5rem = 40px)
					const containerPadding = 40;
					calculatedHeight = `${visibleCount * optionHeight + containerPadding}px`;
				}
			}, 0);
		} else {
			calculatedHeight = undefined;
		}
	});

	// Whether we need a scroll container (maxVisibleOptions limits visible items)
	const needsScrollContainer = $derived(multiple && maxVisibleOptions !== undefined && !height);

	// Style for the scroll container (when needed)
	const scrollContainerStyle = $derived(() => {
		if (!needsScrollContainer || !calculatedHeight) return undefined;
		const styles: string[] = [];
		styles.push(`height: ${calculatedHeight}`);
		styles.push('overflow: auto');
		styles.push('padding: 0px 0.1rem');
		styles.push('display: inline-block');
		if (width) styles.push(`width: ${width}`);
		return styles.join('; ');
	});

	// Compute inline style for fluent-select
	const computedStyle = $derived(() => {
		const styles: string[] = [];
		if (style) styles.push(style);
		// Width goes on container if using scroll container, otherwise on select
		if (width && !needsScrollContainer) styles.push(`width: ${width}`);
		// Height handling - only apply directly when not using scroll container
		if (height) {
			styles.push(`height: ${height}`);
		} else if (calculatedHeight && !needsScrollContainer) {
			styles.push(`height: ${calculatedHeight}`);
		}
		return styles.join('; ') || undefined;
	});

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		value = target.value;

		// Find selected option and extract its data and display text
		const selectedOptionEl = selectElement?.querySelector(`fluent-option[value="${target.value}"]`) as HTMLElement | null;
		const contextData = selectedOptionEl?.dataset.optionContext;
		const data = contextData ? JSON.parse(contextData) : undefined;
		const selectedOption = selectedOptionEl?.textContent?.trim();

		onchange?.({ value: target.value, selectedOption, data });
	}
</script>

{#if needsScrollContainer}
	<div class="select-scroll-wrapper" style="display: inline-flex; flex-direction: column;">
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
		<div class="select-scroll-container" style={scrollContainerStyle()}>
		<!-- svelte-ignore a11y_autofocus -->
		<fluent-select
			bind:this={selectElement}
			{id}
			class={className}
			style={computedStyle() || style}
			{open}
			{position}
			{multiple}
			{disabled}
			{appearance}
			{required}
			{autofocus}
			{name}
			current-value={value}
			{title}
			aria-label={ariaLabel || label}
			onchange={handleChange}
		>
			{#if indicatorTemplate}
				<span slot="indicator">
					{@render indicatorTemplate()}
				</span>
			{/if}
			{#if children}
				{@render children?.()}
			{/if}
		</fluent-select>
		</div>
	</div>
{:else}
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
		{id}
		class={className}
		style={computedStyle() || style}
		{open}
		{position}
		{multiple}
		{disabled}
		{appearance}
		{required}
		{autofocus}
		{name}
		current-value={value}
		{title}
		aria-label={ariaLabel || label}
		onchange={handleChange}
	>
		{#if indicatorTemplate}
			<span slot="indicator">
				{@render indicatorTemplate()}
			</span>
		{/if}
		{#if children}
			{@render children?.()}
		{/if}
	</fluent-select>
{/if}
