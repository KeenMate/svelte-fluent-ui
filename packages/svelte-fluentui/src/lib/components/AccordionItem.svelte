<!--
 * AccordionItem Component (custom implementation)
 *
 * A single collapsible panel rendered as plain themed elements (no
 * <fluent-accordion-item>). Reads its expanded state and delegates clicks /
 * keyboard nav to the parent <Accordion> via the 'fluent-accordion' context.
 *
 * Layout: a CSS-grid heading row [start | button | end | icon]. The chevron
 * moves to the leading edge when the parent's togglePosition is "start".
 * The content region animates open/closed via a grid-template-rows 0fr→1fr
 * transition and is `inert` while collapsed so its contents leave the tab
 * order and the accessibility tree.
-->

<script lang="ts">
	import {getContext} from "svelte"
	import type {AccordionSvelteContext, SlotType} from "../types/index.js"

	type Props = {
		/** Unique item identifier. Required. */
		id: string
		/** Heading level for the role="heading" wrapper (accessibility). */
		headingLevel?: string | number
		/** Header text (plain string). Use the `heading` snippet for rich content. */
		header?: string
		/** Explicitly control expanded state; falls back to the parent value. */
		expanded?: boolean
		/** Disable the item: not togglable and skipped in keyboard navigation. */
		disabled?: boolean
		heading?: SlotType
		start?: SlotType
		end?: SlotType
		/** Custom expand/collapse icon. Receives the current isExpanded boolean. */
		icon?: SlotType
		children?: SlotType
		/** Fires when this item expands or collapses. */
		onchange?: (ev: Event, isExpanded: boolean) => void
	}

	let {
		id,
		headingLevel = 2,
		expanded = undefined,
		header = undefined,
		heading = undefined,
		start = undefined,
		end = undefined,
		icon = undefined,
		disabled = false,
		children = undefined,
		onchange = undefined
	}: Props = $props()

	const ctx = getContext<AccordionSvelteContext>("fluent-accordion")

	// Explicit `expanded` prop wins; otherwise follow the parent's value state.
	const isExpanded = $derived(expanded !== undefined ? expanded : (ctx?.isExpanded(id) ?? false))
	const toggleStart = $derived(ctx?.togglePosition === "start")

	function handleClick(ev: MouseEvent) {
		if (disabled) return
		ctx?.toggle(id)
		onchange?.(ev, !isExpanded)
	}

	function handleKeydown(ev: KeyboardEvent) {
		ctx?.onHeaderKeydown(id, ev)
	}
</script>

<div class="fluent-accordion-item" class:expanded={isExpanded} class:disabled>
	<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
	<div class="fluent-accordion-item__heading" class:toggle-start={toggleStart} role="heading" aria-level={Number(headingLevel)}>
		{#if start}
			<span class="fluent-accordion-item__start">{@render start()}</span>
		{/if}

		<button
			class="fluent-accordion-item__button"
			data-item-id={id}
			{id}
			type="button"
			aria-expanded={isExpanded}
			aria-controls="{id}-panel"
			aria-disabled={disabled ? "true" : null}
			onclick={handleClick}
			onkeydown={handleKeydown}
		>
			<span class="fluent-accordion-item__heading-content">
				{#if heading}
					{@render heading()}
				{:else}
					{header}
				{/if}
			</span>
		</button>

		{#if end}
			<span class="fluent-accordion-item__end">{@render end()}</span>
		{/if}

		<span class="fluent-accordion-item__icon" aria-hidden="true">
			{#if icon}
				{@render icon(isExpanded)}
			{:else}
				<svg class="fluent-accordion-item__chevron" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
					<path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z" fill="currentColor" />
				</svg>
			{/if}
		</span>
	</div>

	<div class="fluent-accordion-item__region-wrapper">
		<div class="fluent-accordion-item__region" id="{id}-panel" role="region" aria-labelledby={id} inert={!isExpanded}>
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.fluent-accordion-item {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		background: var(--neutral-fill-layer-rest, #ffffff);
		color: var(--neutral-foreground-rest, #242424);
		border: calc(var(--stroke-width, 1) * 1px) solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: calc(var(--layer-corner-radius, 8) * 1px);
		font: inherit;
	}

	.fluent-accordion-item__heading {
		display: grid;
		position: relative;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
	}

	/* Keep every cell on a single row: the chevron can sit in any column
	   (see toggle-start) without grid auto-flow bumping it to a new row. */
	.fluent-accordion-item__heading > * {
		grid-row: 1;
	}

	.fluent-accordion-item__start {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-column: 1;
		padding-inline-start: calc(var(--design-unit, 4) * 2 * 1px);
	}

	.fluent-accordion-item__button {
		grid-column: 2;
		appearance: none;
		border: none;
		background: none;
		outline: none;
		margin: calc(var(--design-unit, 4) * 3 * 1px) 0;
		padding: 0 calc(var(--design-unit, 4) * 2 * 1px);
		text-align: left;
		color: inherit;
		cursor: pointer;
		font: inherit;
	}

	.fluent-accordion-item__button::before {
		content: "";
		position: absolute;
		inset: calc(var(--stroke-width, 1) * -1px);
		cursor: pointer;
	}

	.fluent-accordion-item__button:focus-visible::before {
		outline: calc(var(--focus-stroke-width, 2) * 1px) solid var(--neutral-foreground-rest, #242424);
		outline-offset: calc(var(--focus-stroke-width, 2) * -1px);
		border-radius: calc(var(--layer-corner-radius, 8) * 1px);
	}

	.fluent-accordion-item.expanded .fluent-accordion-item__button:focus-visible::before {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.fluent-accordion-item__end {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-column: 3;
	}

	.fluent-accordion-item__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-column: 4;
		pointer-events: none;
		background: var(--neutral-fill-stealth-rest-on-neutral-fill-layer-rest, transparent);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		fill: currentcolor;
		color: inherit;
		width: calc((var(--base-height-multiplier, 10) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		height: calc((var(--base-height-multiplier, 10) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		margin: calc(var(--design-unit, 4) * 2 * 1px);
	}

	.fluent-accordion-item__heading:hover .fluent-accordion-item__icon {
		background: var(--neutral-fill-stealth-hover-on-neutral-fill-layer-rest, var(--neutral-fill-stealth-hover, transparent));
	}

	.fluent-accordion-item__heading:active .fluent-accordion-item__icon {
		background: var(--neutral-fill-stealth-active-on-neutral-fill-layer-rest, var(--neutral-fill-stealth-active, transparent));
	}

	.fluent-accordion-item__chevron {
		transition: transform 0.2s ease;
	}

	.fluent-accordion-item.expanded .fluent-accordion-item__chevron {
		transform: rotate(180deg);
	}

	/* Toggle on the leading (left in LTR) side: reorder the grid so the icon
	   comes first, with no collision against the start slot. */
	.fluent-accordion-item__heading.toggle-start {
		grid-template-columns: auto auto 1fr auto;
	}
	.fluent-accordion-item__heading.toggle-start .fluent-accordion-item__icon {
		grid-column: 1;
		/* The chevron now provides the left separation, so drop its inner-facing
		   margin to sit closer to the following start slot / heading. */
		margin-inline-end: calc(var(--design-unit, 4) * 1px);
	}
	.fluent-accordion-item__heading.toggle-start .fluent-accordion-item__start {
		grid-column: 2;
		/* Redundant here: the leading indent is owned by the chevron, not the
		   start slot (which is no longer against the card edge). */
		padding-inline-start: 0;
	}
	.fluent-accordion-item__heading.toggle-start .fluent-accordion-item__button {
		grid-column: 3;
	}
	.fluent-accordion-item__heading.toggle-start .fluent-accordion-item__end {
		grid-column: 4;
		/* The end slot is now the rightmost cell (the chevron moved to the
		   leading edge), so it must supply the trailing inset the chevron's
		   margin used to provide against the card edge. */
		padding-inline-end: calc(var(--design-unit, 4) * 2 * 1px);
	}

	/* Animated collapse via grid-template-rows 0fr -> 1fr. */
	.fluent-accordion-item__region-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.2s ease;
	}

	.fluent-accordion-item.expanded .fluent-accordion-item__region-wrapper {
		grid-template-rows: 1fr;
	}

	.fluent-accordion-item__region {
		overflow: hidden;
		min-height: 0;
	}

	.fluent-accordion-item.expanded .fluent-accordion-item__region {
		padding: calc(var(--design-unit, 4) * 2 * 1px);
		border-top: calc(var(--stroke-width, 1) * 1px) solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-fill-layer-alt-rest, transparent);
		border-bottom-left-radius: calc((var(--layer-corner-radius, 8) - var(--stroke-width, 1)) * 1px);
		border-bottom-right-radius: calc((var(--layer-corner-radius, 8) - var(--stroke-width, 1)) * 1px);
	}

	.fluent-accordion-item.disabled .fluent-accordion-item__button {
		cursor: not-allowed;
		opacity: 0.6;
	}
</style>
