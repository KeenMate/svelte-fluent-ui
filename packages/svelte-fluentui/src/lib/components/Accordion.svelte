<!--
 * Accordion Component (custom implementation)
 *
 * Fully custom Accordion that replaces the previous <fluent-accordion> /
 * <fluent-accordion-item> wrappers. Built from plain themed elements styled
 * with FluentUI design tokens — same approach as the Select/Combobox/Option
 * family. Gives us full control over layout (native togglePosition), spacing
 * (gap), per-item `disabled`, and a real expand/collapse animation, with no
 * shadow-DOM upgrade cost.
 *
 * The parent owns the value/multi state and exposes it — plus toggle and
 * keyboard-nav helpers — to <AccordionItem> children via the
 * 'fluent-accordion' context.
-->

<script lang="ts">
	import {setContext} from "svelte"
	import type {AccordionSvelteContext, SlotType} from "../types/index.js"

	type ValueType = string | string[] | null | undefined

	type Props = {
		/** Expanded item id(s). String (single) or string[] (multi). In multi
		 * mode set to an array of every item id to expand all at once; null
		 * collapses all. */
		value?: ValueType
		/** Allow multiple items open at once. */
		multi?: boolean
		/** Side the expand/collapse chevron sits on. "end" (default) = right in
		 * LTR, "start" = left. */
		togglePosition?: "start" | "end"
		/** Gap between accordion items (any CSS length, e.g. "0.5rem"). Defaults
		 * to the FluentUI spacing. */
		gap?: string
		children?: SlotType
		/** Fires when the set of expanded items changes. */
		onchange?: (value: ValueType) => void
	}

	let {
		value = $bindable(),
		multi = false,
		togglePosition = "end",
		gap = undefined,
		children = undefined,
		onchange = undefined
	}: Props = $props()

	let rootEl: HTMLDivElement | undefined = $state()

	function normalizeToIds(v: ValueType): string[] {
		if (v === null || v === undefined) return []
		return Array.isArray(v) ? v.slice() : [v]
	}

	function toggle(id: string) {
		if (multi) {
			const ids = normalizeToIds(value)
			const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
			value = next.length ? next : null
		} else {
			value = value === id ? null : id
		}
		onchange?.(value)
	}

	// Roving focus between item headers (ArrowUp/Down wrap, Home/End jump).
	// DOM order is authoritative, so query live rather than tracking an array.
	function focusableButtons(): HTMLButtonElement[] {
		if (!rootEl) return []
		return Array.from(
			rootEl.querySelectorAll<HTMLButtonElement>(".fluent-accordion-item__button:not([aria-disabled='true'])")
		)
	}

	function onHeaderKeydown(id: string, event: KeyboardEvent) {
		const buttons = focusableButtons()
		const idx = buttons.findIndex((b) => b.dataset.itemId === id)
		if (idx === -1) return

		let next = -1
		switch (event.key) {
			case "ArrowUp":
				next = idx <= 0 ? buttons.length - 1 : idx - 1
				break
			case "ArrowDown":
				next = idx >= buttons.length - 1 ? 0 : idx + 1
				break
			case "Home":
				next = 0
				break
			case "End":
				next = buttons.length - 1
				break
			default:
				return
		}

		event.preventDefault()
		buttons[next]?.focus()
	}

	const ctx: AccordionSvelteContext = $state({
		expandedIds: normalizeToIds(value),
		// svelte-ignore state_referenced_locally
		togglePosition,
		isExpanded(id: string) {
			return this.expandedIds.includes(id)
		},
		toggle,
		onHeaderKeydown
	})
	setContext("fluent-accordion", ctx)

	$effect(() => {
		ctx.expandedIds = normalizeToIds(value)
	})
	$effect(() => {
		ctx.togglePosition = togglePosition
	})
</script>

<div class="fluent-accordion" bind:this={rootEl} style={gap ? `gap: ${gap};` : null}>
	{@render children?.()}
</div>

<style>
	.fluent-accordion {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: calc(var(--design-unit, 4) * 1px);
		color: var(--neutral-foreground-rest, #242424);
	}
</style>
