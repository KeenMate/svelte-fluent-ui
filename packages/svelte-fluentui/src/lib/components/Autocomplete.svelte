<!--
 * Autocomplete Component
 * Inspired by FluentUI Blazor Autocomplete component
 * https://www.fluentui-blazor.net/Autocomplete
 *
 * Multiple selection autocomplete with tag/chip display and custom filtering
 * Supports three tag positions: inline (default), above, below
-->

<script lang="ts">
	import type { Snippet } from "svelte"
	import PositioningRegion from "./PositioningRegion.svelte"

	type OptionItem<T = any> = {
		value: T
		text: string
		disabled?: boolean
	}

	type Props<T = any> = {
		selectedOptions?: T[]
		options?: OptionItem<T>[]
		placeholder?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		autofocus?: boolean
		label?: string
		labelTemplate?: Snippet
		appearance?: string
		autocomplete?: string
		maxSelectedOptions?: number
		maxOptionsSearch?: number
		minSearchLength?: number
		showOverlayOnEmptyResults?: boolean
		showInitialOptions?: boolean
		initialOptionsCount?: number
		keepOpen?: boolean
		width?: string
		height?: string
		/** Cap the dropdown listbox height (e.g. "300px", "50vh"). The listbox is
		 * always also capped to the space available to the viewport edge; this
		 * lets a shorter ceiling be set per-instance. Defaults to 300px. */
		maxDropdownHeight?: string
		/** Width of the dropdown listbox (e.g. "360px", "24rem"). When unset the
		 * listbox matches the control width; when set it uses this width instead
		 * (and stops matching), so the list can be wider or narrower than the input. */
		dropdownWidth?: string
		id?: string
		title?: string
		ariaLabel?: string
		multiple?: boolean
		loading?: boolean
		immediateDelay?: number
		selectValueOnTab?: boolean
		tagsPosition?: "inline" | "above" | "below"
		headerContent?: Snippet
		footerContent?: Snippet
		optionTemplate?: Snippet<[OptionItem<T>]>
		// Decorative slots inside the input. Render arbitrary content (typically icons or
		// small buttons) at the start (left) or end (right) of the input. The auto-rendered
		// clear button and loading spinner take precedence in the end slot — `endIcon`
		// renders only when neither is active, so a search icon doesn't fight a clear button.
		startIcon?: Snippet
		endIcon?: Snippet
		class?: string
		style?: string
		initialSearchQuery?: string
		onoptionssearch?: (searchText: string) => Promise<OptionItem<T>[]> | OptionItem<T>[]
		onselectedoptionschange?: (selected: T[]) => void
		ondismissed?: () => void
	}

	let {
		selectedOptions = $bindable([]),
		options = [],
		placeholder = "Type to search...",
		disabled = false,
		readonly = false,
		required = false,
		autofocus = undefined,
		label = undefined,
		labelTemplate = undefined,
		appearance = undefined,
		autocomplete = undefined,
		maxSelectedOptions = undefined,
		maxOptionsSearch = 9,
		minSearchLength = undefined,
		showOverlayOnEmptyResults = true,
		showInitialOptions = false,
		initialOptionsCount = undefined,
		keepOpen = false,
		width = undefined,
		height = undefined,
		maxDropdownHeight = undefined,
		dropdownWidth = undefined,
		id = undefined,
		title = undefined,
		ariaLabel = undefined,
		multiple = undefined,
		loading = undefined,
		immediateDelay = 0,
		selectValueOnTab = true,
		tagsPosition = "inline",
		headerContent = undefined,
		footerContent = undefined,
		optionTemplate = undefined,
		startIcon = undefined,
		endIcon = undefined,
		class: className = "",
		style = "",
		initialSearchQuery = "",
		onoptionssearch = undefined,
		onselectedoptionschange = undefined,
		ondismissed = undefined
	}: Props = $props()

	let searchText = $state("")
	let isOpen = $state(false)
	let filteredOptions = $state<OptionItem[]>([])
	let highlightedIndex = $state(-1)
	let containerElement = $state<HTMLElement | undefined>(undefined)
	let inputElement = $state<HTMLInputElement | undefined>(undefined)
	let isSearching = $state(false)
	let isFocused = $state(false)
	let debounceTimer: ReturnType<typeof setTimeout> | undefined = undefined

	// Compute effective multi/single select mode
	// If multiple is explicitly set, use it. Otherwise, infer from maxSelectedOptions
	let effectiveMultiple = $derived(
		multiple !== undefined ? multiple : (maxSelectedOptions === undefined || maxSelectedOptions !== 1)
	)

	// Handle initial search query (used when typing to start editing in grid)
	$effect(() => {
		if (initialSearchQuery && initialSearchQuery.length > 0) {
			searchText = initialSearchQuery
			isOpen = true
			// Trigger search immediately (bypass debounce)
			performSearch(initialSearchQuery)
		}
	})

	// Perform the actual search
	async function performSearch(text: string) {
		// Show loading state (either from prop or internal state)
		isSearching = true

		try {
			if (onoptionssearch) {
				const results = await onoptionssearch(text)
				filteredOptions = results.slice(0, maxOptionsSearch)
			} else {
				// Default filtering: contains (case insensitive)
				// Filter out already selected options to avoid duplicates
				const filtered = options.filter(opt =>
					opt.text.toLowerCase().includes(text.toLowerCase()) &&
					!isSelected(opt.value)
				)
				filteredOptions = filtered.slice(0, maxOptionsSearch)
			}

			isOpen = filteredOptions.length > 0 || showOverlayOnEmptyResults
		} finally {
			isSearching = false
		}
	}

	// Filter options based on search text (with optional debounce)
	function filterOptions(text: string) {
		// Clear any pending debounce timer
		if (debounceTimer) {
			clearTimeout(debounceTimer)
			debounceTimer = undefined
		}

		// Handle empty search text (no debounce needed)
		if (!text || !text.trim()) {
			// Show initial options if enabled
			if (showInitialOptions && options.length > 0) {
				const limit = initialOptionsCount ?? maxOptionsSearch
				const filtered = options.filter(opt => !isSelected(opt.value))
				filteredOptions = filtered.slice(0, limit)
				isOpen = filteredOptions.length > 0
			} else {
				filteredOptions = []
				if (!showOverlayOnEmptyResults) {
					isOpen = false
				}
			}
			return
		}

		// Gate: below minSearchLength, don't search or open the dropdown.
		// Why: against large/async option sets, searching on a single character
		// is wasteful (UX noise) or expensive (triggers consumer API calls).
		if (minSearchLength && text.trim().length < minSearchLength) {
			filteredOptions = []
			isOpen = false
			isSearching = false
			return
		}

		// Apply debounce if immediateDelay is set
		if (immediateDelay > 0) {
			isSearching = true // Show loading immediately
			debounceTimer = setTimeout(() => {
				performSearch(text)
			}, immediateDelay)
		} else {
			// No debounce, search immediately
			performSearch(text)
		}
	}

	// Check if an option is already selected
	function isSelected(value: any): boolean {
		return selectedOptions.some(v => v === value)
	}

	// Handle option selection
	function selectOption(option: OptionItem) {
		if (disabled || readonly || option.disabled) return

		if (effectiveMultiple && maxSelectedOptions && selectedOptions.length >= maxSelectedOptions) {
			return
		}

		// Single-select replaces the previous value; multi-select appends.
		selectedOptions = effectiveMultiple
			? [...selectedOptions, option.value]
			: [option.value]
		searchText = ""
		filteredOptions = []
		highlightedIndex = -1

		// Always close after a single-select pick; multi-select honors keepOpen / max-cap.
		if (!effectiveMultiple || !keepOpen || (maxSelectedOptions && selectedOptions.length >= maxSelectedOptions)) {
			closeDropdown()
		}

		onselectedoptionschange?.(selectedOptions)
	}

	// Remove selected option
	function removeOption(value: any, event?: MouseEvent) {
		if (event) {
			event.stopPropagation()
		}
		if (disabled || readonly) return

		selectedOptions = selectedOptions.filter(v => v !== value)
		onselectedoptionschange?.(selectedOptions)
	}

	// Get display text for a selected value
	function getOptionText(value: any): string {
		const option = options.find(opt => opt.value === value)
		return option ? option.text : String(value)
	}

	// Close dropdown and call ondismissed callback
	function closeDropdown() {
		if (isOpen) {
			isOpen = false
			ondismissed?.()
		}
	}

	// Show all available options (minus already-selected) in the dropdown.
	// Used by Ctrl+Space and any caller that wants to force-open the list.
	function showAllOptions() {
		if (disabled || readonly) return
		if (onoptionssearch) {
			// Async mode: trigger a search with the current text (or empty)
			performSearch(searchText)
			return
		}
		const available = options.filter(opt => !isSelected(opt.value))
		filteredOptions = available.slice(0, maxOptionsSearch)
		highlightedIndex = filteredOptions.length > 0 ? 0 : -1
		isOpen = filteredOptions.length > 0 || showOverlayOnEmptyResults
	}

	// Handle keyboard navigation
	function handleKeyDown(event: KeyboardEvent) {
		// Ctrl+Space: open dropdown and show all available options
		if (event.key === " " && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			showAllOptions()
			return
		}

		// Handle backspace to remove last chip when input is empty
		if (event.key === "Backspace" && searchText === "" && effectiveMultiple && selectedOptions.length > 0) {
			const lastValue = selectedOptions[selectedOptions.length - 1]
			removeOption(lastValue)
			return
		}

		if (!isOpen) return

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault()
				highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1)
				break
			case "ArrowUp":
				event.preventDefault()
				highlightedIndex = Math.max(highlightedIndex - 1, 0)
				break
			case "Enter":
				event.preventDefault()
				if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					selectOption(filteredOptions[highlightedIndex])
				}
				break
			case "Escape":
				event.preventDefault()
				closeDropdown()
				searchText = ""
				filteredOptions = []
				break
			case "Tab":
				// Tab key behavior controlled by selectValueOnTab prop
				if (selectValueOnTab && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					event.preventDefault()
					selectOption(filteredOptions[highlightedIndex])
				}
				break
		}
	}

	// Handle input focus
	function handleInputFocus() {
		isFocused = true
		if (!disabled && !readonly) {
			if (searchText.trim()) {
				filterOptions(searchText)
			} else if (showInitialOptions) {
				// Show initial options on focus when search is empty
				filterOptions("")
			}
		}
	}

	// Handle input blur
	function handleInputBlur() {
		isFocused = false
	}

	// Handle container click to focus input
	function handleContainerClick(event: MouseEvent) {
		// Don't focus if clicking remove button or clear button
		const target = event.target as HTMLElement
		if (target.closest('.chip-remove, .clear-button')) {
			return
		}
		inputElement?.focus()
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (containerElement && !containerElement.contains(event.target as Node)) {
			closeDropdown()
		}
	}

	// Close dropdown on outside scroll. The options list itself is scrollable
	// (max-height + overflow-y: auto) and is portaled out via PositioningRegion,
	// so scrolling inside the listbox must not trigger this. Scrolling anywhere
	// else on the page would otherwise leave the dropdown floating at its old
	// anchor position, since PositioningRegion does not re-anchor on scroll.
	function handleOutsideScroll(event: Event) {
		const target = event.target as Node | null
		if (!target) return
		// Allow scroll inside our own anchor container (input + inline chips, etc.)
		if (containerElement && containerElement.contains(target)) return
		// Allow scroll inside the popover surface (options-list lives in a portal).
		if (target instanceof Element && target.closest('.options-list, .positioning-region')) return
		closeDropdown()
	}

	// Add click-outside and outside-scroll listeners
	$effect(() => {
		if (isOpen) {
			document.addEventListener("click", handleClickOutside)
			// `capture: true` because most page scroll containers don't bubble
			// scroll events to document; capture phase reliably catches them.
			window.addEventListener("scroll", handleOutsideScroll, true)
			return () => {
				document.removeEventListener("click", handleClickOutside)
				window.removeEventListener("scroll", handleOutsideScroll, true)
			}
		}
	})

	// Check if max selections reached
	let isMaxReached = $derived(maxSelectedOptions !== undefined && selectedOptions.length >= maxSelectedOptions)

	// Single-select mode detection (uses effectiveMultiple for explicit control)
	let isSingleSelect = $derived(!effectiveMultiple)
	let hasSingleSelection = $derived(isSingleSelect && selectedOptions.length === 1)

	// Computed display value for input
	let displayValue = $derived(hasSingleSelection ? getOptionText(selectedOptions[0]) : searchText)

	// Computed loading state (external prop or internal state)
	let showLoading = $derived(loading !== undefined ? loading : isSearching)

	// Compute placeholder - hide when there are inline chips
	let effectivePlaceholder = $derived(
		(tagsPosition === 'inline' && selectedOptions.length > 0 && effectiveMultiple)
			? ''
			: placeholder
	)

	// Handle input change
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement

		// In single-select mode, clear selection when user starts typing
		if (hasSingleSelection) {
			selectedOptions = []
			onselectedoptionschange?.(selectedOptions)
		}

		searchText = target.value
		highlightedIndex = -1
		filterOptions(searchText)
	}

	// Clear selection for single-select mode
	function clearSingleSelection(event: MouseEvent) {
		event.stopPropagation()
		if (!disabled && !readonly) {
			selectedOptions = []
			searchText = ""
			onselectedoptionschange?.(selectedOptions)
		}
	}

	// Should show tags - only for multi-select with selections
	let showTags = $derived(selectedOptions.length > 0 && effectiveMultiple)

	// Auto-open the dropdown when initial options arrive asynchronously while the
	// input is already focused. Scenario: the control is autofocused (or the user
	// focuses it) before a background fetch has populated `options`; on focus the
	// list is still empty so nothing opens, and without this the loaded data stays
	// inaccessible until the user types (which needlessly re-runs the search).
	// Requires `showInitialOptions` (the opt-in for showing options on an empty
	// query). Gated on the empty→non-empty transition so manually closing the
	// dropdown (Escape) while focused doesn't immediately re-open it.
	let hadOptions = false
	$effect(() => {
		const hasOptions = options.length > 0
		const justLoaded = hasOptions && !hadOptions
		hadOptions = hasOptions
		if (
			justLoaded &&
			isFocused &&
			showInitialOptions &&
			!isOpen &&
			!disabled &&
			!readonly &&
			!searchText.trim() &&
			!hasSingleSelection
		) {
			filterOptions("")
		}
	})
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<div
	class="fluent-autocomplete {className}"
	style="{style}{width ? ` width: ${width};` : ''}{height ? ` height: ${height};` : ''}"
	{...id ? { id } : {}}
	{...title ? { title } : {}}
	{...ariaLabel ? { 'aria-label': ariaLabel } : {}}
>
	{#if labelTemplate}
		{@render labelTemplate()}
	{:else if label}
		<label class="fluent-field-label">
			{label}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<div class="autocomplete-container">
		<!-- Tags ABOVE (if tagsPosition === 'above') -->
		{#if tagsPosition === 'above' && showTags}
			<div class="selected-options">
				{#each selectedOptions as value}
					<span class="external-chip">
						<span class="chip-text">{getOptionText(value)}</span>
						{#if !disabled && !readonly}
							<button
								type="button"
								class="chip-remove"
								onclick={(e) => removeOption(value, e)}
								aria-label="Remove {getOptionText(value)}"
								title="Remove {getOptionText(value)}"
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
									<path d="m4.4 4.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 0 1-.07-.98l.07-.08-.07.08Z"/>
								</svg>
							</button>
						{/if}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Input container -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_role_has_required_aria_props -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="autocomplete-input-container"
			class:inline-mode={tagsPosition === 'inline'}
			class:focused={isFocused}
			class:disabled
			class:readonly
			class:filled={appearance === 'filled'}
			bind:this={containerElement}
			onclick={handleContainerClick}
			role="combobox"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
		>
			<!-- Start icon slot (e.g. search magnifying glass) -->
			{#if startIcon}
				<div class="input-start">
					{@render startIcon()}
				</div>
			{/if}

			<!-- Tags INLINE (if tagsPosition === 'inline') -->
			{#if tagsPosition === 'inline' && showTags}
				{#each selectedOptions as value}
					<span class="inline-chip">
						<span class="chip-text">{getOptionText(value)}</span>
						{#if !disabled && !readonly}
							<button
								type="button"
								class="chip-remove"
								onclick={(e) => removeOption(value, e)}
								aria-label="Remove {getOptionText(value)}"
								title="Remove {getOptionText(value)}"
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
									<path d="m4.4 4.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 0 1-.07-.98l.07-.08-.07.08Z"/>
								</svg>
							</button>
						{/if}
					</span>
				{/each}
			{/if}

			<!-- Native input element -->
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				class="autocomplete-native-input"
				bind:this={inputElement}
				value={displayValue}
				placeholder={effectivePlaceholder}
				disabled={disabled}
				readonly={readonly}
				{required}
				autofocus={autofocus}
				autocomplete={(autocomplete || 'off') as AutoFill}
				oninput={handleInput}
				onkeydown={handleKeyDown}
				onfocus={handleInputFocus}
				onblur={handleInputBlur}
			/>

			<!-- End slot: clear button OR loading indicator OR custom endIcon (in that priority).
				 Only renders when something will show inside, so the `:has(.input-end)` padding
				 rule on the input doesn't reserve space for an empty slot. -->
			{#if (hasSingleSelection && !disabled && !readonly) || showLoading || endIcon}
				<div class="input-end">
					{#if hasSingleSelection && !disabled && !readonly}
						<button
							type="button"
							class="clear-button"
							onclick={clearSingleSelection}
							aria-label="Clear selection"
							title="Clear selection"
						>
							<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
								<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
							</svg>
						</button>
					{:else if showLoading}
						<div class="loading-indicator">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="spinner">
								<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
								<path d="M8 1a7 7 0 0 1 7 7" stroke="currentColor" stroke-width="2" fill="none"/>
							</svg>
						</div>
					{:else if endIcon}
						{@render endIcon()}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Tags BELOW (if tagsPosition === 'below') -->
		{#if tagsPosition === 'below' && showTags}
			<div class="selected-options">
				{#each selectedOptions as value}
					<span class="external-chip">
						<span class="chip-text">{getOptionText(value)}</span>
						{#if !disabled && !readonly}
							<button
								type="button"
								class="chip-remove"
								onclick={(e) => removeOption(value, e)}
								aria-label="Remove {getOptionText(value)}"
								title="Remove {getOptionText(value)}"
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
									<path d="m4.4 4.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 0 1-.07-.98l.07-.08-.07.08Z"/>
								</svg>
							</button>
						{/if}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Dropdown options -->
		{#if isOpen && containerElement}
			<PositioningRegion
				anchor={containerElement}
				visible={isOpen}
				availableHeight
				matchWidth={!dropdownWidth}
				style="z-index: var(--fluent-z-popover, 1060); background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: var(--fluent-border-radius-md); box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12); {dropdownWidth ? `width: ${dropdownWidth}; ` : ''}{maxDropdownHeight ? `--autocomplete-listbox-max-height: ${maxDropdownHeight}; ` : ''}max-height: min(var(--available-height, 100vh), var(--autocomplete-listbox-max-height, 300px)); overflow-y: auto; overscroll-behavior: contain;"
			>
				<div class="options-list">
					{#if headerContent}
						<div class="options-header">
							{@render headerContent()}
						</div>
					{/if}
					{#if filteredOptions.length > 0}
						{#each filteredOptions as option, index}
							<button
								type="button"
								class="option-item"
								class:highlighted={index === highlightedIndex}
								class:disabled={option.disabled}
								onclick={() => selectOption(option)}
								disabled={option.disabled}
							>
								{#if optionTemplate}
									{@render optionTemplate(option)}
								{:else}
									{option.text}
								{/if}
							</button>
						{/each}
					{:else if showOverlayOnEmptyResults}
						<div class="no-results">No results found</div>
					{/if}
					{#if footerContent}
						<div class="options-footer">
							{@render footerContent()}
						</div>
					{/if}
				</div>
			</PositioningRegion>
		{/if}

		<!-- Max selections message - Don't show for single-select -->
		{#if isMaxReached && !isSingleSelect}
			<div class="max-message">
				Maximum {maxSelectedOptions} selection{maxSelectedOptions !== 1 ? 's' : ''} reached
			</div>
		{/if}
	</div>
</div>

<style>
	.fluent-autocomplete {
		display: flex;
		flex-direction: column;
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.autocomplete-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	/* ===== Input Container (base styles) ===== */
	.autocomplete-input-container {
		display: flex;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		min-height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
	}

	/* ===== Input Container: Inline Mode (mimics fluent-text-field) ===== */
	.autocomplete-input-container.inline-mode {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		min-height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		box-sizing: border-box;
		padding: 0 8px;
		background: var(--neutral-fill-input-rest, #ffffff);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		cursor: text;
		transition: border-color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
	}

	.autocomplete-input-container.inline-mode:hover:not(.disabled):not(.readonly) {
		background: var(--neutral-fill-input-hover, #f5f5f5);
	}

	.autocomplete-input-container.inline-mode.focused:not(.disabled) {
		/* FluentUI 2 textfield focus: thin gray border on top/sides stays put,
		   bottom edge becomes accent + visually 2px thick. We use an inset box-shadow
		   to add the 1px instead of bumping border-bottom-width — that would shift
		   the input's content by 1px on focus. */
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: inset 0 -1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	.autocomplete-input-container.inline-mode.disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: var(--neutral-fill-input-rest, #ffffff);
	}

	.autocomplete-input-container.inline-mode.readonly {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
	}

	/* Filled appearance for inline mode */
	.autocomplete-input-container.inline-mode.filled {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		border: none;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
	}

	.autocomplete-input-container.inline-mode.filled:hover:not(.disabled):not(.readonly) {
		background: var(--neutral-fill-secondary-hover, #ebebeb);
	}

	.autocomplete-input-container.inline-mode.filled.focused:not(.disabled) {
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	/* ===== Inline Chips =====
	   Inline chips share the same height + typography as external chips so picking a value
	   doesn't visually shrink it on its way into the input. The only intentional difference
	   is the border: inline chips sit inside the input's own border so adding another would
	   double up; external chips are standalone elements and need their own.

	   Sizing tokens (`--fluent-autocomplete-chip-*`) drive both inline and external chip
	   geometry, so theme overrides apply everywhere chips render. Defaults are in rem so
	   chips scale with the user's root font-size. */
	.inline-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--fluent-autocomplete-chip-gap, 0.25rem);
		padding: var(--fluent-autocomplete-chip-padding-y, 0.125rem) var(--fluent-autocomplete-chip-padding-x, 0.5rem);
		background: var(--neutral-fill-secondary-rest, #f0f0f0);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		font-size: var(--fluent-autocomplete-chip-font-size, 0.875rem);
		line-height: var(--fluent-autocomplete-chip-line-height, 1.4);
		white-space: nowrap;
		max-width: var(--fluent-autocomplete-chip-max-width, 9.375rem);
		color: var(--neutral-foreground-rest, #242424);
	}

	.chip-text {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chip-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: var(--fluent-autocomplete-chip-remove-padding, 0.125rem);
		cursor: pointer;
		color: var(--neutral-foreground-hint, #717171);
		border-radius: var(--fluent-border-radius-sm);
		flex-shrink: 0;
		transition: color 0.1s ease, background 0.1s ease;
	}

	.chip-remove:hover {
		background: var(--neutral-fill-secondary-hover, #e0e0e0);
		color: var(--neutral-foreground-rest, #242424);
	}

	.chip-remove:focus {
		outline: 1px solid var(--accent-fill-rest, #0078d4);
		outline-offset: 1px;
	}

	/* ===== Native Input ===== */
	.autocomplete-native-input {
		flex: 1;
		min-width: 60px;
		border: none;
		outline: none;
		background: transparent;
		font-family: inherit;
		font-size: 14px;
		line-height: 20px;
		color: var(--neutral-foreground-rest, #242424);
		padding: 0;
	}

	.autocomplete-input-container.inline-mode .autocomplete-native-input {
		align-self: stretch;
	}

	.autocomplete-native-input::placeholder {
		color: var(--neutral-foreground-hint, #717171);
	}

	.autocomplete-native-input:disabled {
		cursor: not-allowed;
	}

	/* Non-inline mode: make input full width */
	.autocomplete-input-container:not(.inline-mode) .autocomplete-native-input {
		padding: 4px 8px;
		height: calc((var(--base-height-multiplier, 8) + var(--density, 0)) * var(--design-unit, 4) * 1px);
		box-sizing: border-box;
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		background: var(--neutral-fill-input-rest, #ffffff);
		width: 100%;
	}

	.autocomplete-input-container:not(.inline-mode) .autocomplete-native-input:hover:not(:disabled) {
		background: var(--neutral-fill-input-hover, #f5f5f5);
	}

	.autocomplete-input-container:not(.inline-mode) .autocomplete-native-input:focus {
		/* See comment on `.inline-mode.focused` — same FluentUI bottom-emphasis pattern. */
		border-bottom-color: var(--accent-fill-rest, #0078d4);
		box-shadow: inset 0 -1px 0 0 var(--accent-fill-rest, #0078d4);
	}

	.autocomplete-input-container:not(.inline-mode).filled .autocomplete-native-input {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		border: none;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px) calc(var(--control-corner-radius, 4) * 1px) 0 0;
	}

	/* ===== Input Start Slot ===== */
	.input-start {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding-right: 4px;
		color: var(--neutral-foreground-hint, #707070);
	}

	/* ===== Input End Slot ===== */
	.input-end {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding-left: 4px;
		color: var(--neutral-foreground-hint, #707070);
	}

	/* Non-inline mode: position end slot inside input */
	.autocomplete-input-container:not(.inline-mode) .input-end {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
	}

	.autocomplete-input-container:not(.inline-mode) .input-start {
		position: absolute;
		left: 8px;
		top: 50%;
		transform: translateY(-50%);
	}

	/* Non-inline mode: pad the input so its text doesn't sit underneath the icons */
	.autocomplete-input-container:not(.inline-mode):has(.input-start) .autocomplete-native-input {
		padding-left: 32px;
	}

	.autocomplete-input-container:not(.inline-mode):has(.input-end) .autocomplete-native-input {
		padding-right: 32px;
	}

	/* ===== Selected Options Container (above/below modes) ===== */
	.selected-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.25rem 0;
		max-height: 120px;
		overflow-y: auto;
	}

	/* External chips (above/below modes) - FluentUI Blazor style.
	   Same `--fluent-autocomplete-chip-*` tokens as inline chips. Adds a 1px border
	   since these aren't sitting inside the input's own border. */
	.external-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--fluent-autocomplete-chip-gap, 0.25rem);
		padding: var(--fluent-autocomplete-chip-padding-y, 0.125rem) var(--fluent-autocomplete-chip-padding-x, 0.5rem);
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		color: var(--neutral-foreground-rest, #242424);
		border: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		border-radius: calc(var(--control-corner-radius, 4) * 1px);
		font-size: var(--fluent-autocomplete-chip-font-size, 0.875rem);
		line-height: var(--fluent-autocomplete-chip-line-height, 1.4);
		font-weight: 400;
		white-space: nowrap;
	}

	.external-chip .chip-text {
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: var(--fluent-autocomplete-chip-text-max-width, 12.5rem);
	}

	.external-chip .chip-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: var(--fluent-autocomplete-chip-remove-padding, 0.125rem);
		cursor: pointer;
		color: var(--error-foreground-rest, #c42b1c);
		border-radius: var(--fluent-border-radius-sm);
	}

	.external-chip .chip-remove:hover {
		color: var(--error-foreground-hover, #a32315);
	}

	.external-chip .chip-remove:focus {
		outline: 1px solid var(--accent-fill-rest, #0078d4);
		outline-offset: 1px;
	}

	/* ===== Clear Button ===== */
	.clear-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--neutral-foreground-hint, #717171);
		border-radius: var(--fluent-border-radius-sm);
		transition: background 0.1s ease, color 0.1s ease;
	}

	.clear-button:hover {
		background: var(--neutral-fill-secondary-hover, #e0e0e0);
		color: var(--neutral-foreground-rest, #242424);
	}

	.clear-button:focus {
		outline: 1px solid var(--accent-fill-rest, #0078d4);
		outline-offset: 2px;
	}

	/* ===== Loading Indicator ===== */
	.loading-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ===== Dropdown Options ===== */
	.options-list {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
		min-width: 200px;
	}

	.options-header {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		margin-bottom: 0.25rem;
	}

	.options-footer {
		padding: 0.5rem 0.75rem;
		border-top: 1px solid var(--neutral-stroke-rest, #d1d1d1);
		margin-top: 0.25rem;
	}

	.option-item {
		background: transparent;
		border: none;
		padding: 0.5rem 0.75rem;
		text-align: left;
		cursor: pointer;
		border-radius: var(--fluent-border-radius-md);
		color: var(--neutral-foreground-rest, #242424);
		font-size: 0.875rem;
	}

	.option-item:hover:not(.disabled) {
		background: var(--neutral-fill-secondary-hover, #e0e0e0);
	}

	.option-item.highlighted {
		background: var(--neutral-fill-secondary-hover, #e0e0e0);
	}

	.option-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.no-results {
		padding: 1rem;
		text-align: center;
		color: var(--neutral-foreground-hint, #717171);
		font-size: 0.875rem;
	}

	.max-message {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint, #717171);
		padding: 0.25rem 0.5rem;
	}
</style>
