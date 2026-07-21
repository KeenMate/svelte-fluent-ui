<!--
 * Combobox Component (rewrite)
 *
 * Custom single-select combobox that replaces the previous <fluent-combobox>
 * wrapper. Like Select, the dropdown is portalled out via PositioningRegion,
 * so it (a) never grows past the viewport — its max-height is capped to the
 * available space — and (b) escapes any ancestor with overflow clipping
 * (e.g. a Card). The old wrapper suffered both because the native listbox
 * rendered in place and measured against the window, not its container.
 *
 * Unlike Select, the trigger is an editable text input that filters the
 * options as you type. Options come from either the `options` prop or
 * <Option> children; both are rendered to the DOM and filtered uniformly by
 * toggling a per-option `data-filtered-out` attribute (diacritic-insensitive),
 * so children-based and array-based usage behave identically.
 *
 * <Option> children work unchanged via the 'selected-options' context — the
 * same contract Select and the old Combobox provided.
-->

<script lang="ts">
	import {setContext, untrack, tick} from "svelte"
	import PositioningRegion from "./PositioningRegion.svelte"
	import Option from "./Option.svelte"
	import OptionGroup from "./OptionGroup.svelte"
	import type {OptionItem, SelectedValue, SlotType} from "../types/index.js"
	import type {
		SelectedOptionSvelteContext,
		ValueType,
		ComboboxFilter,
		ComboboxFilterOption
	} from "../types/combobox.js"

	type Props = {
		id: string
		value?: SelectedValue
		options?: OptionItem[]
		children?: SlotType
		autocomplete?: "inline" | "list" | "both" | "none"
		open?: boolean
		/** Accepted for API compatibility (no-op — value is option-based). */
		currentValue?: string
		placeholder?: string
		position?: "above" | "below"
		disabled?: boolean
		appearance?: "outline" | "filled"
		required?: boolean
		autofocus?: boolean
		name?: string
		class?: string
		style?: string
		label?: string
		labelTemplate?: SlotType
		ariaLabel?: string
		title?: string
		width?: string
		/** Accepted for API compatibility (no-op — combobox is single-line). */
		height?: string
		/** Cap the dropdown listbox height (e.g. "300px", "50vh"). The listbox is
		 * always also capped to the space available to the viewport edge; this
		 * lets a shorter ceiling be set per-instance. */
		maxDropdownHeight?: string
		/** Width of the dropdown listbox (e.g. "360px", "24rem"). When unset the
		 * listbox matches the control width; when set it uses this width instead
		 * (and stops matching), so the list can be wider or narrower than the input. */
		dropdownWidth?: string
		/** Accepted for API compatibility; combobox is single-select. */
		multiple?: boolean
		minSearchLength?: number
		/** Text shown inside the dropdown when the filter matches no options. */
		noDataText?: string
		/** Custom content shown when the filter matches no options; overrides noDataText. */
		noDataTemplate?: SlotType
		/** Debounced notification that the query changed. When provided, the parent
		 * owns the data: update `options` with the results and the component skips
		 * its own client-side filtering (the server/parent already filtered). */
		onsearch?: (query: string) => void
		/** Debounce (ms) before `onsearch` fires. Ignored without `onsearch`. */
		searchDelay?: number
		/** Custom client-side matcher, replacing the built-in diacritic-insensitive
		 * substring match. Ignored when `onsearch` is set (filtering is server-side). */
		filter?: ComboboxFilter
		/** Parent-controlled loading flag (for async `onsearch`). While true the
		 * dropdown shows `loadingText` instead of the empty-state message. */
		loading?: boolean
		/** Text shown while `loading` is true. */
		loadingText?: string
		onchange?: (value: SelectedValue) => void
	}

	let {
		id,
		value = $bindable(),
		options = undefined,
		children = undefined,
		autocomplete = undefined,
		open = $bindable(undefined),
		currentValue = undefined,
		placeholder = undefined,
		position = undefined,
		disabled = false,
		appearance = "outline",
		required = false,
		autofocus = false,
		name = undefined,
		class: className = "",
		style = "",
		label = undefined,
		labelTemplate = undefined,
		ariaLabel = undefined,
		title = undefined,
		width = undefined,
		height = undefined,
		maxDropdownHeight = undefined,
		dropdownWidth = undefined,
		multiple = false,
		minSearchLength = undefined,
		noDataText = "No results found",
		noDataTemplate = undefined,
		onsearch = undefined,
		searchDelay = 250,
		filter = undefined,
		loading = undefined,
		loadingText = "Searching…",
		onchange = undefined
	}: Props = $props()

	// ---------- Selection state (shared with <Option> via context) ----------
	// Single-select: clicking an option SETS the value (never deselects), which
	// is why we provide our own context instead of createSelectedOptions (whose
	// toggle would clear an already-selected option).

	function normalize(v: SelectedValue): string[] {
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
		set(v: ValueType) {
			selectionState.value = Array.isArray(v) ? [...v] : (v ? [v] : [])
		},
		toggle(val: string) {
			if (val == null) return
			selectionState.value = [val]
		}
	}

	setContext<SelectedOptionSvelteContext>("selected-options", ctx)

	// prop value -> internal state
	$effect(() => {
		const n = normalize(value)
		const cur = untrack(() => selectionState.value)
		if (n.length !== cur.length || n.some((v, i) => v !== cur[i])) {
			selectionState.value = n
		}
	})

	// internal state -> prop value (always array form, matching SelectedValue)
	$effect(() => {
		const sel = selectionState.value
		untrack(() => {
			const cur = Array.isArray(value) ? value : (value != null ? [value] : [])
			if (sel.length !== cur.length || sel.some((v, i) => v !== cur[i])) {
				value = [...sel]
			}
		})
	})

	const selectedSingle = $derived<string>(selectionState.value[0] ?? "")

	// ---------- Mode flags ----------
	// list / both / default(undefined): typing filters the dropdown.
	// inline / both: typing auto-completes the input text to the first match.
	// none: typing neither filters nor completes (plain dropdown you can focus-type into).
	const doListFilter = $derived(
		autocomplete === undefined || autocomplete === "list" || autocomplete === "both"
	)
	const doInline = $derived(autocomplete === "inline" || autocomplete === "both")

	// ---------- Open / filter state ----------
	let isOpen = $state(false)
	let isFiltering = $state(false)
	let typed = $state("")
	let highlightedIndex = $state(-1)
	// Count of currently displayed option rows (not filtered out); drives the
	// empty-state message. Starts at -1 so the message never flashes before the
	// first applyFilter() has run.
	let displayedCount = $state(-1)
	// Label of the current selection, cached at selection time. In async mode the
	// option set churns with every query, so the selected option can leave the DOM;
	// this keeps the input showing the right text after it's gone.
	let selectedLabel = $state("")
	// Debounce timer for onsearch.
	let searchTimer: ReturnType<typeof setTimeout> | undefined = undefined
	// True from the moment a keystroke schedules an onsearch until the resulting
	// `options` update lands. Covers the debounce gap so the empty-state message
	// doesn't flash before results arrive — even if the parent doesn't drive `loading`.
	let searchPending = $state(false)

	let inputEl: HTMLInputElement | undefined = $state()
	let listEl: HTMLDivElement | undefined = $state()
	// Hidden mirror of the options, always mounted, so display text resolves
	// from `value` even while the portalled listbox is closed/unmounted.
	let sourceEl: HTMLDivElement | undefined = $state()
	let controlEl: HTMLElement | undefined = $state()

	// Allow external control via `open` prop (binds both ways).
	$effect(() => {
		if (open !== undefined && open !== untrack(() => isOpen)) isOpen = open
	})
	$effect(() => {
		if (open !== undefined && isOpen !== untrack(() => open)) open = isOpen
	})

	// ---------- Option DOM helpers ----------
	function getOptionEls(root: HTMLElement | undefined): HTMLElement[] {
		if (!root) return []
		return Array.from(root.querySelectorAll(".fluent-option")) as HTMLElement[]
	}

	// Option carries its value in `data-value` (see Option.svelte).
	function optionValue(el: HTMLElement): string {
		return el.dataset.value ?? el.getAttribute("value") ?? ""
	}

	function optionText(el: HTMLElement): string {
		return el.dataset.optionLabel ?? el.textContent?.trim() ?? ""
	}

	function getOptionData(el: HTMLElement): Record<string, unknown> | undefined {
		const raw = el.dataset.optionContext
		if (!raw) return undefined
		try { return JSON.parse(raw) } catch { return undefined }
	}

	function getOptionText(val: string): string {
		if (!val) return ""
		for (const root of [listEl, sourceEl]) {
			if (!root) continue
			const el = getOptionEls(root).find(o => optionValue(o) === val)
			if (el) return optionText(el)
		}
		// Async fallback: the selected option may no longer be rendered (its query
		// scrolled past). Use the label cached when it was chosen.
		if (val === selectedSingle && selectedLabel) return selectedLabel
		return ""
	}

	function toFilterOption(el: HTMLElement): ComboboxFilterOption {
		return {
			value: optionValue(el),
			label: optionText(el),
			disabled: el.hasAttribute("disabled"),
			data: getOptionData(el)
		}
	}

	// Diacritic-insensitive, case-insensitive normalization for matching.
	function norm(s: string): string {
		return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
	}

	// ---------- Display text (input value when not actively filtering) ----------
	let displayText = $state("")
	$effect(() => {
		const sel = selectedSingle // dep
		untrack(() => { displayText = getOptionText(sel) })
		// Re-resolve when options render asynchronously (the option text
		// may not exist yet at the moment `value` was first applied).
		if (!sourceEl) return
		const obs = new MutationObserver(() => {
			displayText = getOptionText(untrack(() => selectedSingle))
		})
		obs.observe(sourceEl, {childList: true, subtree: true})
		return () => obs.disconnect()
	})

	const inputDisplay = $derived(isFiltering ? typed : displayText)

	// ---------- Filtering ----------
	function visibleOptionEls(): HTMLElement[] {
		return getOptionEls(listEl).filter(
			el => !el.hasAttribute("disabled") && !el.hasAttribute("data-filtered-out")
		)
	}

	function applyFilter() {
		if (!listEl) return
		const q = norm(typed)
		// In async mode (onsearch) the parent already filtered — show everything it
		// gave us. Otherwise filter client-side, via a custom `filter` if provided.
		const clientFilter = !onsearch && isFiltering && doListFilter && q.length > 0
		let shown = 0
		for (const el of getOptionEls(listEl)) {
			let match = true
			if (clientFilter) {
				match = filter
					? filter(typed, toFilterOption(el))
					: norm(optionText(el)).includes(q)
			}
			el.toggleAttribute("data-filtered-out", !match)
			if (match) shown++ // displayed rows include disabled options (still visible)
		}
		displayedCount = shown
	}

	function highlightInitial() {
		const vis = visibleOptionEls()
		const i = vis.findIndex(el => optionValue(el) === selectedSingle)
		highlightedIndex = i >= 0 ? i : (vis.length > 0 ? 0 : -1)
		scrollHighlightedIntoView()
	}

	function moveHighlight(delta: number) {
		const vis = visibleOptionEls()
		if (vis.length === 0) { highlightedIndex = -1; return }
		let next = highlightedIndex + delta
		if (next < 0) next = 0
		if (next >= vis.length) next = vis.length - 1
		highlightedIndex = next
		scrollHighlightedIntoView()
	}

	function scrollHighlightedIntoView() {
		if (!listEl || highlightedIndex < 0) return
		visibleOptionEls()[highlightedIndex]?.scrollIntoView({block: "nearest"})
	}

	// Number of option rows that fit in the listbox viewport — the step for
	// PageUp/PageDown. Falls back to 10 before the list has measured.
	function pageSize(): number {
		const vis = visibleOptionEls()
		if (!listEl || vis.length === 0) return 10
		const rowH = vis[0].offsetHeight || 32
		const perPage = Math.floor(listEl.clientHeight / rowH)
		return Math.max(1, perPage - 1) // keep one row of context across the jump
	}

	// Reflect highlightedIndex onto the matching option so CSS can style the
	// keyboard cursor distinctly from hover/selected.
	$effect(() => {
		const _ = [highlightedIndex, isOpen, typed] // dep tracking
		if (!isOpen) return
		const vis = visibleOptionEls()
		getOptionEls(listEl).forEach(el => el.removeAttribute("data-highlighted"))
		if (highlightedIndex >= 0) vis[highlightedIndex]?.setAttribute("data-highlighted", "")
	})

	// Inline autocomplete: complete the input to the first matching option's
	// text and select the appended remainder (so the next keystroke replaces it).
	function applyInlineCompletion() {
		if (!inputEl || !typed) return
		const q = norm(typed)
		const match = visibleOptionEls().find(el => norm(optionText(el)).startsWith(q))
		if (!match) return
		const full = optionText(match)
		// Set canonical text (restores diacritics) and select the remainder.
		inputEl.value = full
		inputEl.setSelectionRange(typed.length, full.length)
		const idx = visibleOptionEls().indexOf(match)
		if (idx >= 0) { highlightedIndex = idx; scrollHighlightedIntoView() }
	}

	// ---------- Open / close ----------
	// minSearchLength gate: with a threshold set, the dropdown must not open
	// from a click / chevron / arrow key — only once enough text is typed.
	// Otherwise these "open the list now" affordances would dump the (often
	// large/async) option set the threshold exists to avoid.
	function meetsSearchThreshold(): boolean {
		if (!minSearchLength || minSearchLength <= 0) return true
		return typed.trim().length >= minSearchLength
	}

	function openDropdown() {
		if (disabled) return
		if (!meetsSearchThreshold()) return
		isOpen = true
		tick().then(() => { applyFilter(); highlightInitial() })
	}

	function closeDropdown(refocus = true) {
		if (!isOpen) return
		isOpen = false
		highlightedIndex = -1
		isFiltering = false
		typed = ""
		displayedCount = -1 // avoid a stale empty-state flash on next open
		searchPending = false
		if (refocus) inputEl?.focus()
	}

	function toggleDropdown() {
		if (isOpen) closeDropdown()
		else { inputEl?.focus(); openDropdown() }
	}

	// ---------- Selection ----------
	function emitChange() {
		onchange?.(selectionState.value.length ? [...selectionState.value] : [])
	}

	function selectByValue(val: string) {
		// Cache the label before the option can leave the DOM (async churn).
		const el = getOptionEls(listEl).find(o => optionValue(o) === val)
			?? getOptionEls(sourceEl).find(o => optionValue(o) === val)
		if (el) selectedLabel = optionText(el)
		ctx.toggle(val) // single-select: sets [val]
		isFiltering = false
		typed = ""
		emitChange()
		closeDropdown()
	}

	// Click path: Option.svelte already called ctx.toggle by the time this
	// bubble-phase handler runs. We only handle the side effects.
	function handleListClick(ev: MouseEvent) {
		const optEl = (ev.target as HTMLElement | null)?.closest(".fluent-option") as HTMLElement | null
		if (!optEl) return
		if (optEl.hasAttribute("disabled")) { ev.preventDefault(); return }
		selectedLabel = optionText(optEl) // cache before async churn removes it
		isFiltering = false
		typed = ""
		emitChange()
		closeDropdown()
	}

	// Debounced server-side search notification. The parent updates `options`
	// with the results; the options-change effect below re-syncs the list.
	function fireSearch(query: string) {
		if (!onsearch) return
		searchPending = true
		if (searchTimer) clearTimeout(searchTimer)
		searchTimer = setTimeout(() => onsearch?.(query), Math.max(0, searchDelay))
	}

	// Re-sync the list when async results arrive (the `options` prop changed
	// while the dropdown is open). No-op for children-based options.
	$effect(() => {
		options // dependency
		searchPending = false // results landed
		if (!untrack(() => isOpen)) return
		tick().then(() => {
			applyFilter()
			const vis = visibleOptionEls()
			highlightedIndex = vis.length ? 0 : -1
			scrollHighlightedIntoView()
		})
	})

	// Cancel a pending debounce on unmount.
	$effect(() => () => { if (searchTimer) clearTimeout(searchTimer) })

	// ---------- Input handlers ----------
	function handleInput(ev: Event & {inputType?: string}) {
		if (disabled) return
		const el = ev.target as HTMLInputElement
		isFiltering = true
		typed = el.value
		highlightedIndex = -1

		// Gate against large/async sets: below minSearchLength keep it closed and
		// don't fire a search.
		if (minSearchLength && typed.trim().length > 0 && typed.trim().length < minSearchLength) {
			isOpen = false
			return
		}

		fireSearch(typed)

		if (!isOpen) isOpen = true
		const isDelete = typeof ev.inputType === "string" && ev.inputType.startsWith("delete")
		tick().then(() => {
			applyFilter()
			const vis = visibleOptionEls()
			highlightedIndex = vis.length ? 0 : -1
			scrollHighlightedIntoView()
			// Inline completion works off the local set; skip in async mode where
			// results arrive after this tick.
			if (doInline && !onsearch && !isDelete) applyInlineCompletion()
		})
	}

	function handleKeydown(ev: KeyboardEvent) {
		if (disabled) return
		switch (ev.key) {
			case "ArrowDown":
				ev.preventDefault()
				if (!isOpen) openDropdown()
				else moveHighlight(1)
				break
			case "ArrowUp":
				ev.preventDefault()
				if (!isOpen) openDropdown()
				else moveHighlight(-1)
				break
			case "PageDown":
				ev.preventDefault()
				if (!isOpen) openDropdown()
				else moveHighlight(pageSize())
				break
			case "PageUp":
				ev.preventDefault()
				if (!isOpen) openDropdown()
				else moveHighlight(-pageSize())
				break
			case "Home":
				if (isOpen && visibleOptionEls().length) {
					ev.preventDefault()
					highlightedIndex = 0
					scrollHighlightedIntoView()
				}
				break
			case "End":
				if (isOpen) {
					const n = visibleOptionEls().length
					if (n) { ev.preventDefault(); highlightedIndex = n - 1; scrollHighlightedIntoView() }
				}
				break
			case "Enter": {
				if (!isOpen) break
				ev.preventDefault()
				const el = visibleOptionEls()[highlightedIndex]
				if (el) selectByValue(optionValue(el))
				break
			}
			case "Escape":
				if (isOpen) { ev.preventDefault(); closeDropdown() }
				break
			case "Tab":
				if (isOpen) closeDropdown(false)
				break
		}
	}

	function handleFocus() {
		if (disabled) return
		// Select the display text so the first keystroke replaces it instead of
		// appending to the selected option's label.
		queueMicrotask(() => inputEl?.select())
	}

	// Clicking the control padding (not the input or the indicator button)
	// focuses the input and opens. The input and indicator handle their own
	// clicks so we don't double-fire against the indicator's toggle.
	function handleControlClick(ev: MouseEvent) {
		if (disabled) return
		if (ev.target === controlEl) {
			inputEl?.focus()
			if (!isOpen) openDropdown()
		}
	}

	function handleInputClick() {
		if (disabled) return
		if (!isOpen) openDropdown()
	}

	// ---------- Close on outside pointerdown ----------
	$effect(() => {
		if (!isOpen) return
		function onDown(ev: PointerEvent) {
			const path = ev.composedPath()
			if (controlEl && path.includes(controlEl)) return
			if (listEl && path.includes(listEl)) return
			closeDropdown(false)
		}
		document.addEventListener("pointerdown", onDown, true)
		return () => document.removeEventListener("pointerdown", onDown, true)
	})

	// ---------- Computed ----------
	const forcedPlacement = $derived<"top" | "bottom" | undefined>(
		position === "above" ? "top" : position === "below" ? "bottom" : undefined
	)

	const controlStyle = $derived(() => {
		const parts: string[] = []
		if (width) parts.push(`width: ${width}`)
		return (parts.join("; ") + (parts.length && style ? "; " : "") + style)
	})

	const hasLabel = $derived(!!(label || labelTemplate))
	const listboxId = $derived(id ? `${id}-listbox` : undefined)

	// Section the `options` array in SOURCE ORDER: walk the array and start a new
	// segment whenever the `group` value changes from the previous item. This
	// preserves the author's exact ordering — ungrouped options stay where they
	// sit (not hoisted), and a group that reappears simply emits its header
	// again. null when nothing is grouped, so the flat render path is unchanged.
	type Segment = {group: string | undefined; items: OptionItem[]}
	const segments = $derived.by<Segment[] | null>(() => {
		const opts = options ?? []
		if (!opts.some(o => o.group)) return null
		const segs: Segment[] = []
		let cur: Segment | null = null
		for (const o of opts) {
			const g = o.group || undefined
			if (!cur || cur.group !== g) {
				cur = {group: g, items: []}
				segs.push(cur)
			}
			cur.items.push(o)
		}
		return segs
	})
</script>

{#snippet optionItem(item: OptionItem)}
	<Option value={item.value} label={item.label} disabled={item.disabled}>
		{item.label}
	</Option>
{/snippet}

{#snippet optionList()}
	{#if children}
		{@render children()}
	{:else if segments}
		{#each segments as seg, si (si)}
			{#if seg.group}
				<OptionGroup label={seg.group}>
					{#each seg.items as item (item.value)}
						{@render optionItem(item)}
					{/each}
				</OptionGroup>
			{:else}
				{#each seg.items as item (item.value)}
					{@render optionItem(item)}
				{/each}
			{/if}
		{/each}
	{:else}
		{#each options ?? [] as item (item.value)}
			{@render optionItem(item)}
		{/each}
	{/if}
{/snippet}

<!-- display:contents root so consumers see one element, transparent to layout. -->
<div class="combobox-root">

	<!-- svelte-ignore a11y_label_has_associated_control -->
	{#if hasLabel}
		<label class="fluent-field-label" for={id}>
			{#if label}{label}{/if}
			{#if labelTemplate}{@render labelTemplate()}{/if}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<!-- Hidden mirror of options so the selected value's display text resolves
	     even when the dropdown is closed. aria-hidden — not a second listbox. -->
	<div bind:this={sourceEl} class="combobox-options-source" aria-hidden="true">
		{@render optionList()}
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={controlEl}
		class="combobox-control {appearance} {className}"
		class:open={isOpen}
		class:disabled
		style={controlStyle()}
		{...(title ? {title} : {})}
		onclick={handleControlClick}
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			bind:this={inputEl}
			{id}
			type="text"
			class="combobox-input"
			role="combobox"
			aria-expanded={isOpen}
			aria-controls={listboxId}
			aria-autocomplete={doInline ? (doListFilter ? "both" : "inline") : (doListFilter ? "list" : "none")}
			aria-label={ariaLabel ?? label}
			value={inputDisplay}
			{placeholder}
			{disabled}
			{required}
			{autofocus}
			autocomplete="off"
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={handleFocus}
			onclick={handleInputClick}
		/>
		<button
			type="button"
			class="combobox-indicator"
			tabindex="-1"
			aria-hidden="true"
			{disabled}
			onclick={toggleDropdown}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
				<path d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 1 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06Z"/>
			</svg>
		</button>
	</div>

	{#if isOpen && controlEl}
		<PositioningRegion
			anchor={controlEl}
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
				class="combobox-listbox"
				style={[
					dropdownWidth ? `width: ${dropdownWidth}` : "",
					maxDropdownHeight ? `--combobox-listbox-max-height: ${maxDropdownHeight}` : ""
				].filter(Boolean).join("; ") || undefined}
				onclick={handleListClick}
			>
				{@render optionList()}
				{#if displayedCount === 0}
					<div class="combobox-no-data">
						{#if loading || searchPending}
							{loadingText}
						{:else if noDataTemplate}
							{@render noDataTemplate()}
						{:else}
							{noDataText}
						{/if}
					</div>
				{/if}
			</div>
		</PositioningRegion>
	{/if}

	<!-- Participate in HTML form submission. -->
	{#if name}
		<input type="hidden" {name} {required} value={selectedSingle} />
	{/if}
</div>

<style>
	.combobox-root {
		display: contents;
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	/* ===== Control (bordered box wrapping input + indicator) ===== */
	.combobox-control {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		box-sizing: border-box;
		padding: 0 calc(var(--design-unit, 4) * 2 * 1px);
		background: var(--neutral-fill-input-rest, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		cursor: text;
		transition: border-color 0.1s ease, background 0.1s ease, box-shadow 0.1s ease;
		min-width: 200px;
	}

	.combobox-control:hover:not(.disabled) {
		background: var(--neutral-fill-input-hover, #f5f5f5);
	}

	/* Match fluent-text-field focus: accent bottom edge via inset shadow so the
	 * underline thickens without shifting content by 1px. */
	.combobox-control:focus-within:not(.disabled),
	.combobox-control.open:not(.disabled) {
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: inset 0 -1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	.combobox-control.filled {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		border: none;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
	}

	.combobox-control.filled:hover:not(.disabled) {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
	}

	.combobox-control.filled:focus-within:not(.disabled),
	.combobox-control.filled.open:not(.disabled) {
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	.combobox-control.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.combobox-input {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		font-family: inherit;
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
		color: var(--neutral-foreground-rest, #242424);
		padding: 0;
	}

	.combobox-input::placeholder {
		color: var(--neutral-foreground-hint, #717171);
	}

	.combobox-input:disabled {
		cursor: not-allowed;
	}

	.combobox-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--neutral-foreground-hint, #717171);
		flex-shrink: 0;
	}

	.combobox-indicator:disabled {
		cursor: not-allowed;
	}

	/* ===== Dropdown listbox (portalled) ===== */
	:global(.combobox-listbox) {
		display: flex;
		flex-direction: column;
		background: var(--neutral-layer-floating, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		box-shadow: var(--elevation-shadow-flyout, 0 8px 16px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12));
		padding: calc(var(--design-unit, 4) * 1px);
		/* Cap to the space PositioningRegion measured to the viewport edge, and
		 * (when set) to the per-instance `maxDropdownHeight` prop — whichever is smaller. */
		max-height: min(var(--available-height, 280px), var(--combobox-listbox-max-height, 100vh));
		overflow-y: auto;
		overscroll-behavior: contain;
		box-sizing: border-box;
	}

	/* Option row layout, hover, highlight, selected, disabled and the
	 * data-filtered-out hide rule now live in Option.svelte (scoped to the
	 * option element, so they apply wherever it renders). */

	/* Hide a whole group (its header included) once all of its options have
	 * filtered out, so no orphan headers remain. :has() is live, so this
	 * re-evaluates as data-filtered-out toggles. */
	:global(.combobox-listbox .option-group:not(:has(.fluent-option:not([data-filtered-out])))) {
		display: none;
	}

	/* Empty-state message shown when the filter matches no options. */
	:global(.combobox-listbox) .combobox-no-data {
		padding: 0.75rem 1rem;
		text-align: center;
		color: var(--neutral-foreground-hint, #717171);
		font-size: var(--type-ramp-base-font-size, 14px);
	}

	/* Hidden options mirror — text lookup only, never displayed. */
	.combobox-options-source {
		display: none;
	}
</style>
