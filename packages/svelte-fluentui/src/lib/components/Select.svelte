<!--
 * Select Component (rewrite)
 *
 * Custom Select that replaces the previous <fluent-select> wrapper.
 *
 * Single mode: custom combobox-style trigger + portalled listbox via
 * PositioningRegion. The listbox max-height is capped to the available
 * viewport space via PositioningRegion's availableHeight middleware, so
 * the dropdown never extends past the viewport edges.
 *
 * Multi mode: always-expanded inline listbox (matches Blazor
 * FluentSelect, which renders multi-select inline because the underlying
 * web component doesn't support a multi-select dropdown).
 *
 * <Option> children work unchanged — they read selection via the
 * 'selected-options' context, which this component provides.
-->

<script lang="ts">
	import {setContext, untrack, tick} from "svelte"
	import PositioningRegion from "./PositioningRegion.svelte"
	import type {SlotType} from "../types/index.js"
	import type {SelectedOptionSvelteContext} from "../types/combobox.js"

	type SelectChangeDetail = {
		value: string
		selectedOption?: string
		data?: Record<string, unknown>
	}

	type Props = {
		id?: string
		class?: string
		style?: string
		open?: boolean
		/** Force the dropdown above/below the trigger. Default: auto (flip()). */
		position?: "above" | "below"
		multiple?: boolean
		disabled?: boolean
		/** Non-editable: the value shows but can't be changed (dropdown won't open,
		 * options can't be toggled). Unlike `disabled`, it stays focusable and un-dimmed. */
		readonly?: boolean
		appearance?: "outline" | "filled"
		required?: boolean
		autofocus?: boolean
		name?: string
		/** Selected value. String in single mode, string[] in multi mode. */
		value?: string | string[]
		label?: string
		ariaLabel?: string
		title?: string
		width?: string
		/** Multi mode: explicit height for the inline listbox. */
		height?: string
		/** Single mode: cap the dropdown listbox height (e.g. "300px", "50vh").
		 * The listbox is always also capped to the space available to the
		 * viewport edge; this lets a shorter ceiling be set per-instance. */
		maxDropdownHeight?: string
		/** Single mode: width of the dropdown listbox (e.g. "360px", "24rem").
		 * When unset the listbox matches the control width; when set it uses this
		 * width instead (and stops matching), so the list can be wider or narrower. */
		dropdownWidth?: string
		/** Multi mode: cap visible option rows, enables internal scroll. */
		maxVisibleOptions?: number
		labelTemplate?: SlotType
		indicatorTemplate?: SlotType
		children?: SlotType
		onchange?: (detail: SelectChangeDetail) => void
	}

	let {
		id = undefined,
		class: className = "",
		style = "",
		open = $bindable(undefined),
		position = undefined,
		multiple = false,
		disabled = false,
		readonly = false,
		appearance = "outline",
		required = false,
		autofocus = false,
		name = undefined,
		value = $bindable(),
		label = undefined,
		ariaLabel = undefined,
		title = undefined,
		width = undefined,
		height = undefined,
		maxDropdownHeight = undefined,
		dropdownWidth = undefined,
		maxVisibleOptions = undefined,
		labelTemplate = undefined,
		indicatorTemplate = undefined,
		children = undefined,
		onchange = undefined
	}: Props = $props()

	// ---------- Selection state (shared with <Option> via context) ----------
	// We provide our own context instead of createSelectedOptions because the
	// single-mode UX is "click sets value", not "click toggles" — the existing
	// store would deselect when clicking the already-selected option.

	function normalize(v: typeof value): string[] {
		if (v == null) return []
		return Array.isArray(v) ? [...v] : [v]
	}

	let selectionState = $state<{value: string[]}>({value: normalize(value)})

	const ctx: SelectedOptionSvelteContext = {
		get value() {
			return selectionState.value.length ? selectionState.value : null
		},
		set value(v) {
			selectionState.value = v ?? []
		},
		set(v) {
			selectionState.value = Array.isArray(v) ? [...v] : (v ? [v] : [])
		},
		toggle(val: string) {
			if (val == null) return
			if (readonly) return // readonly: block user-driven selection (Option click path)
			if (multiple) {
				const cur = selectionState.value
				selectionState.value = cur.includes(val)
					? cur.filter(x => x !== val)
					: [...cur, val]
			} else {
				selectionState.value = [val]
			}
		}
	}

	setContext<SelectedOptionSvelteContext>("selected-options", ctx)

	// prop value -> internal state
	$effect(() => {
		const normalized = normalize(value)
		const current = untrack(() => selectionState.value)
		if (
			normalized.length !== current.length ||
			normalized.some((v, i) => v !== current[i])
		) {
			selectionState.value = normalized
		}
	})

	// internal state -> prop value
	$effect(() => {
		const sel = selectionState.value
		untrack(() => {
			if (multiple) {
				const cur = Array.isArray(value) ? value : (value != null ? [value] : [])
				if (sel.length !== cur.length || sel.some((v, i) => v !== cur[i])) {
					value = [...sel]
				}
			} else {
				const next = sel[0] ?? ""
				if (value !== next) value = next
			}
		})
	})

	const selectedSingle = $derived<string>(selectionState.value[0] ?? "")

	// ---------- Open / close (single mode) ----------
	let isOpen = $state(false)

	// Allow external control via `open` prop (binds both ways).
	$effect(() => {
		if (open !== undefined && open !== untrack(() => isOpen)) {
			isOpen = open
		}
	})
	$effect(() => {
		if (open !== undefined && isOpen !== untrack(() => open)) {
			open = isOpen
		}
	})

	let triggerEl: HTMLButtonElement | undefined = $state()
	let listEl: HTMLDivElement | undefined = $state()
	let inlineListEl: HTMLDivElement | undefined = $state()
	// Single-mode hidden mirror of <Option> children. Stays mounted even when
	// the dropdown is closed, so getOptionText() can resolve the trigger's
	// display text from `value` (the portalled listEl unmounts on close).
	let sourceEl: HTMLDivElement | undefined = $state()
	let highlightedIndex = $state(-1)
	let typeAheadBuffer = ""
	let typeAheadTimer: ReturnType<typeof setTimeout> | undefined

	function getOptionEls(root: HTMLElement | undefined): HTMLElement[] {
		if (!root) return []
		return Array.from(root.querySelectorAll(".fluent-option")) as HTMLElement[]
	}
	function enabledOptionEls(root: HTMLElement | undefined): HTMLElement[] {
		return getOptionEls(root).filter(el => !el.hasAttribute("disabled"))
	}

	// Option carries its value in `data-value` (see Option.svelte).
	function optionValue(el: HTMLElement): string {
		return el.dataset.value ?? el.getAttribute("value") ?? ""
	}

	function getOptionText(val: string): string {
		const roots = multiple
			? [inlineListEl]
			: [listEl, sourceEl]
		for (const root of roots) {
			if (!root) continue
			const all = getOptionEls(root)
			const el = all.find(o => optionValue(o) === val)
			if (el) return el.textContent?.trim() ?? ""
		}
		return ""
	}

	function getOptionData(el: HTMLElement): Record<string, unknown> | undefined {
		const raw = el.dataset.optionContext
		if (!raw) return undefined
		try { return JSON.parse(raw) } catch { return undefined }
	}

	function openDropdown() {
		if (disabled || multiple || readonly) return
		isOpen = true
		tick().then(() => {
			const opts = enabledOptionEls(listEl)
			const i = opts.findIndex(el => optionValue(el) === selectedSingle)
			highlightedIndex = i >= 0 ? i : (opts.length > 0 ? 0 : -1)
			scrollHighlightedIntoView()
		})
	}

	function closeDropdown(refocus = true) {
		if (!isOpen) return
		isOpen = false
		highlightedIndex = -1
		typeAheadBuffer = ""
		if (refocus) triggerEl?.focus()
	}

	function toggleDropdown() {
		if (isOpen) closeDropdown()
		else openDropdown()
	}

	// Keyboard-path selection: explicit call from key handlers when there's no
	// click event to ride. Mutates selection via ctx.toggle (which has the right
	// mode-aware semantics), fires onchange, and closes in single mode.
	function selectByValue(val: string, el?: HTMLElement) {
		if (readonly) return
		const optEl = el ?? getOptionEls(multiple ? inlineListEl : listEl)
			.find(o => optionValue(o) === val)

		ctx.toggle(val)

		onchange?.({
			value: multiple ? "" : (selectionState.value[0] ?? ""),
			selectedOption: optEl?.textContent?.trim(),
			data: optEl ? getOptionData(optEl) : undefined
		})

		if (!multiple) closeDropdown()
	}

	// Click-path: Option.svelte's own onclick already called ctx.toggle by the
	// time this bubble-phase handler runs (option is a descendant of the
	// listbox). We deliberately do NOT call ctx.toggle here — doing so would
	// double-toggle in multi mode and cancel the user's click. We only handle
	// the post-selection side effects: onchange + close-on-single.
	function handleListClick(ev: MouseEvent) {
		if (readonly) return
		const target = ev.target as HTMLElement | null
		if (!target) return
		const optEl = target.closest(".fluent-option") as HTMLElement | null
		if (!optEl) return
		if (optEl.hasAttribute("disabled")) {
			ev.preventDefault()
			return
		}

		onchange?.({
			value: multiple ? "" : (selectionState.value[0] ?? ""),
			selectedOption: optEl.textContent?.trim(),
			data: getOptionData(optEl)
		})

		if (!multiple) closeDropdown()
	}

	// ---------- Keyboard (single mode) ----------
	function moveHighlight(delta: number) {
		const opts = enabledOptionEls(listEl)
		if (opts.length === 0) return
		const cur = highlightedIndex
		let next = cur + delta
		if (next < 0) next = 0
		if (next >= opts.length) next = opts.length - 1
		highlightedIndex = next
		scrollHighlightedIntoView()
	}

	function scrollHighlightedIntoView() {
		if (!listEl || highlightedIndex < 0) return
		const opts = enabledOptionEls(listEl)
		const el = opts[highlightedIndex]
		el?.scrollIntoView({block: "nearest"})
	}

	// Number of option rows that fit in the popover viewport — the step for
	// PageUp/PageDown. Falls back to 10 before the list has measured.
	function pageSize(): number {
		const opts = enabledOptionEls(listEl)
		if (!listEl || opts.length === 0) return 10
		const rowH = opts[0].offsetHeight || 32
		const perPage = Math.floor(listEl.clientHeight / rowH)
		return Math.max(1, perPage - 1) // keep one row of context across the jump
	}

	function typeAheadJump(ch: string) {
		clearTimeout(typeAheadTimer)
		typeAheadBuffer += ch.toLowerCase()
		typeAheadTimer = setTimeout(() => { typeAheadBuffer = "" }, 750)

		const opts = enabledOptionEls(listEl)
		if (opts.length === 0) return
		const start = highlightedIndex >= 0 ? highlightedIndex : 0
		const n = opts.length

		// Mode picking:
		// - "Repeat" (buffer="cc"|"ccc"): user is cycling — advance past current.
		// - "Single re-press" (buffer="c", current option already starts with "c"):
		//   treat like cycle too, so c-pause-c-pause-c advances through matches
		//   even when the buffer timed out between presses.
		// - "Prefix" (anything else): land on the first option matching the buffer
		//   from the current position.
		const isRepeat = typeAheadBuffer.length > 1
			&& typeAheadBuffer.split("").every(c => c === typeAheadBuffer[0])
		const isSingleRepress = typeAheadBuffer.length === 1
			&& (opts[start]?.textContent?.trim().toLowerCase() ?? "").startsWith(typeAheadBuffer)
		const advance = isRepeat || isSingleRepress
		const needle = isRepeat ? typeAheadBuffer[0] : typeAheadBuffer
		const startAt = advance ? (start + 1) % n : start

		for (let i = 0; i < n; i++) {
			const idx = (startAt + i) % n
			const text = opts[idx].textContent?.trim().toLowerCase() ?? ""
			if (text.startsWith(needle)) {
				highlightedIndex = idx
				scrollHighlightedIntoView()
				return
			}
		}
	}

	function handleTriggerKeydown(ev: KeyboardEvent) {
		if (disabled || readonly) return

		if (!isOpen) {
			switch (ev.key) {
				case "ArrowDown":
				case "ArrowUp":
				case "PageDown":
				case "PageUp":
				case "Enter":
				case " ":
					ev.preventDefault()
					openDropdown()
					return
			}
			// Type-ahead on the closed trigger: open + jump-highlight (no commit).
			if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
				ev.preventDefault()
				openDropdown()
				tick().then(() => typeAheadJump(ev.key))
			}
			return
		}

		switch (ev.key) {
			case "ArrowDown": ev.preventDefault(); moveHighlight(1); break
			case "ArrowUp":   ev.preventDefault(); moveHighlight(-1); break
			case "PageDown":  ev.preventDefault(); moveHighlight(pageSize()); break
			case "PageUp":    ev.preventDefault(); moveHighlight(-pageSize()); break
			case "Home": {
				ev.preventDefault()
				const opts = enabledOptionEls(listEl)
				if (opts.length) { highlightedIndex = 0; scrollHighlightedIntoView() }
				break
			}
			case "End": {
				ev.preventDefault()
				const opts = enabledOptionEls(listEl)
				if (opts.length) { highlightedIndex = opts.length - 1; scrollHighlightedIntoView() }
				break
			}
			case "Enter":
			case " ": {
				ev.preventDefault()
				const opts = enabledOptionEls(listEl)
				const el = opts[highlightedIndex]
				if (el) selectByValue(optionValue(el), el)
				break
			}
			case "Escape": ev.preventDefault(); closeDropdown(); break
			case "Tab": closeDropdown(false); break
			default:
				if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
					ev.preventDefault()
					typeAheadJump(ev.key)
				}
		}
	}

	// ---------- Visual highlight sync ----------
	// Reflects highlightedIndex to a data-highlighted attribute on the corresponding
	// option element, so CSS can style the keyboard-cursor row distinctly from
	// hover and selected states.
	$effect(() => {
		const _ = highlightedIndex // dep tracking
		const opts = enabledOptionEls(listEl)
		opts.forEach((el, i) => {
			if (i === highlightedIndex) el.setAttribute("data-highlighted", "")
			else el.removeAttribute("data-highlighted")
		})
	})

	// ---------- Close on outside pointerdown / focus move ----------
	$effect(() => {
		if (!isOpen) return
		// Shared test: does the event's path touch our trigger or portalled list?
		function isInside(ev: Event): boolean {
			const path = ev.composedPath()
			return !!(triggerEl && path.includes(triggerEl)) || !!(listEl && path.includes(listEl))
		}
		function onDown(ev: PointerEvent) {
			if (!isInside(ev)) closeDropdown(false)
		}
		// Focus moving outside (e.g. a modal dialog opening and trapping focus, or
		// Tab-ing away) closes the popover too — otherwise it floats above the modal,
		// since the popover z-layer sits above the modal layer by design (so popovers
		// opened INSIDE a dialog work). Don't refocus the trigger — that would yank
		// focus back out of whatever just opened.
		function onFocusIn(ev: FocusEvent) {
			if (!isInside(ev)) closeDropdown(false)
		}
		// Use capture so we beat any handler that stops propagation.
		document.addEventListener("pointerdown", onDown, true)
		document.addEventListener("focusin", onFocusIn, true)
		return () => {
			document.removeEventListener("pointerdown", onDown, true)
			document.removeEventListener("focusin", onFocusIn, true)
		}
	})

	// ---------- Multi-mode height calculation (maxVisibleOptions) ----------
	let multiCalcHeight: string | undefined = $state()
	$effect(() => {
		if (!multiple || !inlineListEl || height) {
			multiCalcHeight = undefined
			return
		}
		if (maxVisibleOptions === undefined) {
			multiCalcHeight = undefined
			return
		}
		queueMicrotask(() => {
			if (!inlineListEl) return
			const opts = inlineListEl.querySelectorAll(".fluent-option")
			if (opts.length === 0) return
			const first = opts[0] as HTMLElement
			const rowH = parseInt(window.getComputedStyle(first).height) || first.offsetHeight || 32
			const visible = Math.min(opts.length, maxVisibleOptions)
			// + 8px for top/bottom padding of the listbox.
			multiCalcHeight = `${visible * rowH + 8}px`
		})
	})

	// ---------- Computed styles ----------
	const triggerStyle = $derived(() => {
		const parts: string[] = []
		if (width) parts.push(`width: ${width}`)
		return parts.join("; ")
	})

	const multiListStyle = $derived(() => {
		const parts: string[] = []
		if (width) parts.push(`width: ${width}`)
		if (height) parts.push(`height: ${height}`)
		else if (multiCalcHeight) parts.push(`height: ${multiCalcHeight}`)
		return parts.join("; ")
	})

	// Forced position support: prop -> Floating UI placement.
	const forcedPlacement = $derived<"top" | "bottom" | undefined>(
		position === "above" ? "top" : position === "below" ? "bottom" : undefined
	)

	const displayText = $derived(getOptionText(selectedSingle))

	const hasLabel = $derived(!!(label || labelTemplate))

	const listboxId = $derived(id ? `${id}-listbox` : undefined)
</script>

<!-- Single DOM root so consumers see one element, not 2–4 siblings. Uses
     display:contents so it's transparent to flex/grid layout in the parent. -->
<div class="select-root">

<!-- svelte-ignore a11y_label_has_associated_control -->
{#if hasLabel}
	<label class="fluent-field-label" for={id}>
		{#if label}{label}{/if}
		{#if labelTemplate}{@render labelTemplate?.()}{/if}
		{#if required}<span class="required-indicator">*</span>{/if}
	</label>
{/if}

{#if multiple}
	<!-- ===== Multi mode: always-expanded inline listbox ===== -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={inlineListEl}
		{id}
		role="listbox"
		tabindex="0"
		aria-multiselectable="true"
		aria-readonly={readonly ? "true" : null}
		aria-label={ariaLabel || label}
		class="select-listbox-inline {appearance} {className}"
		class:disabled
		class:readonly
		style={(multiListStyle() ? multiListStyle() + "; " : "") + style}
		{title}
		onclick={handleListClick}
	>
		{@render children?.()}
	</div>
{:else}
	<!-- ===== Single mode: trigger + portalled dropdown ===== -->

	<!-- Hidden mirror of <Option> children so getOptionText() can resolve the
	     selected value's display text when the dropdown is closed. Aria-hidden
	     so screen readers don't see two copies of the options. -->
	<div bind:this={sourceEl} class="select-options-source" aria-hidden="true">
		{@render children?.()}
	</div>

	<!-- svelte-ignore a11y_autofocus -->
	<button
		bind:this={triggerEl}
		type="button"
		{id}
		role="combobox"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-controls={listboxId}
		aria-label={ariaLabel || label}
		aria-readonly={readonly ? "true" : null}
		{disabled}
		{autofocus}
		{title}
		class="select-trigger {appearance} {className}"
		class:open={isOpen}
		class:readonly
		style={(triggerStyle() ? triggerStyle() + "; " : "") + style}
		onclick={toggleDropdown}
		onkeydown={handleTriggerKeydown}
	>
		<span class="select-trigger-value" class:placeholder={!displayText}>
			{displayText}
		</span>
		<span class="select-trigger-indicator" aria-hidden="true">
			{#if indicatorTemplate}
				{@render indicatorTemplate()}
			{:else}
				<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
					<path d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 1 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06Z"/>
				</svg>
			{/if}
		</span>
	</button>

	{#if isOpen && triggerEl}
		<PositioningRegion
			anchor={triggerEl}
			visible={isOpen}
			position={forcedPlacement}
			matchWidth={!dropdownWidth}
			availableHeight
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				bind:this={listEl}
				id={listboxId}
				role="listbox"
				tabindex="-1"
				class="select-listbox-popover"
				style={[
					dropdownWidth ? `width: ${dropdownWidth}` : "",
					maxDropdownHeight ? `--select-listbox-max-height: ${maxDropdownHeight}` : ""
				].filter(Boolean).join("; ") || undefined}
				onclick={handleListClick}
			>
				{@render children?.()}
			</div>
		</PositioningRegion>
	{/if}

	<!-- Hidden input to participate in HTML form submission. -->
	{#if name}
		<input type="hidden" {name} {required} value={selectedSingle} />
	{/if}
{/if}

</div>

<style>
	/* Transparent to layout — wraps label + trigger + mirror + portal anchor
	 * so consumers only see one root, but parent flex/grid still lays out the
	 * inner elements directly. */
	.select-root {
		display: contents;
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	/* ===== Trigger button (single mode) ===== */
	.select-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		min-height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		box-sizing: border-box;
		padding: 0 calc(var(--design-unit, 4) * 2 * 1px);
		background: var(--neutral-fill-input-rest, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		font-family: inherit;
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		color: var(--neutral-foreground-rest, #242424);
		cursor: pointer;
		text-align: left;
		transition: border-color 0.1s ease, background 0.1s ease, box-shadow 0.1s ease;
		min-width: 200px;
	}

	.select-trigger:hover:not(:disabled):not(.readonly) {
		background: var(--neutral-fill-input-hover, #f5f5f5);
	}

	.select-trigger:focus-visible:not(:disabled),
	.select-trigger.open:not(:disabled) {
		/* Match fluent-text-field focus: accent-colored bottom edge via inset shadow
		 * so the underline thickens visually without shifting content by 1px. */
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: inset 0 -1px 0 0 var(--accent-fill-rest, #0078d4);
		outline: none;
	}

	.select-trigger.filled {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		border: none;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
	}

	.select-trigger.filled:hover:not(:disabled):not(.readonly) {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
	}

	.select-trigger.filled:focus-visible:not(:disabled),
	.select-trigger.filled.open:not(:disabled) {
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	.select-trigger:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Readonly: value shows but the dropdown won't open. Non-dimmed (unlike
	   disabled), with a neutral-secondary fill + default cursor to signal it's inert. */
	.select-trigger.readonly {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		cursor: default;
	}

	.select-trigger-value {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.select-trigger-value.placeholder {
		color: var(--neutral-foreground-hint, #717171);
	}

	.select-trigger-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--neutral-foreground-hint, #717171);
		flex-shrink: 0;
	}

	/* Hidden mirror of options for trigger-text lookup (single mode). */
	.select-options-source {
		display: none;
	}

	/* ===== Dropdown listbox (single mode, portalled) ===== */
	:global(.select-listbox-popover) {
		display: flex;
		flex-direction: column;
		background: var(--neutral-layer-floating, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		box-shadow: var(--elevation-shadow-flyout, 0 8px 16px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12));
		padding: calc(var(--design-unit, 4) * 1px);
		/* Cap to the available viewport space exposed by PositioningRegion
		 * (fallback 280px), and — when the `maxHeight` prop is set — to that
		 * ceiling too, whichever is smaller. */
		max-height: min(var(--available-height, 280px), var(--select-listbox-max-height, 100vh));
		overflow-y: auto;
		overscroll-behavior: contain;
		box-sizing: border-box;
	}

	/* Option row layout, hover, keyboard highlight (data-highlighted), selected
	 * and disabled styling now live in Option.svelte, scoped to the option
	 * element so they apply in both the portalled popover and the inline list. */

	/* ===== Inline listbox (multi mode) ===== */
	.select-listbox-inline {
		display: flex;
		flex-direction: column;
		background: var(--neutral-fill-input-rest, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		padding: calc(var(--design-unit, 4) * 1px);
		overflow-y: auto;
		overscroll-behavior: contain;
		box-sizing: border-box;
	}

	.select-listbox-inline.filled {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		border: none;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
	}

	.select-listbox-inline.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	/* Readonly multi-select: value shows but options can't be toggled (blocked in
	   ctx.toggle). Keep it non-dimmed and scrollable, but make the rows read as
	   inert — no pointer cursor, no hover highlight. */
	.select-listbox-inline.readonly :global(.fluent-option) {
		cursor: default;
	}

	.select-listbox-inline.readonly :global(.fluent-option:hover:not([disabled])) {
		background: transparent;
	}

	.select-listbox-inline.readonly :global(.fluent-option[aria-selected="true"]:hover:not([disabled])) {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
	}
</style>
