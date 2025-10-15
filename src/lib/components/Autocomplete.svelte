<!--
 * Autocomplete Component
 * Inspired by FluentUI Blazor Autocomplete component
 * https://www.fluentui-blazor.net/Autocomplete
 *
 * Multiple selection autocomplete with tag/chip display and custom filtering
-->

<script lang="ts">
	import TextField from "./TextField.svelte"
	import Badge from "./Badge.svelte"
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
		label?: string
		appearance?: string
		maxSelectedOptions?: number
		maxOptionsSearch?: number
		showOverlayOnEmptyResults?: boolean
		keepOpen?: boolean
		width?: string
		class?: string
		style?: string
		onOptionsSearch?: (searchText: string) => Promise<OptionItem<T>[]> | OptionItem<T>[]
		onSelectedOptionsChange?: (selected: T[]) => void
		[prop: string]: any
	}

	let {
		selectedOptions = $bindable([]),
		options = [],
		placeholder = "Type to search...",
		disabled = false,
		readonly = false,
		required = false,
		label = undefined,
		appearance = undefined,
		maxSelectedOptions = undefined,
		maxOptionsSearch = 9,
		showOverlayOnEmptyResults = true,
		keepOpen = false,
		width = undefined,
		class: className = "",
		style = "",
		onOptionsSearch = undefined,
		onSelectedOptionsChange = undefined,
		...restProps
	}: Props = $props()

	let searchText = $state("")
	let isOpen = $state(false)
	let filteredOptions = $state<OptionItem[]>([])
	let highlightedIndex = $state(-1)
	let textFieldElement: HTMLElement | undefined
	let isSearching = $state(false)

	// Filter options based on search text
	async function filterOptions(text: string) {
		if (!text.trim()) {
			filteredOptions = []
			if (!showOverlayOnEmptyResults) {
				isOpen = false
			}
			return
		}

		isSearching = true

		try {
			if (onOptionsSearch) {
				const results = await onOptionsSearch(text)
				filteredOptions = results.slice(0, maxOptionsSearch)
			} else {
				// Default filtering: contains (case insensitive)
				const filtered = options.filter(opt =>
					!isSelected(opt.value) &&
					opt.text.toLowerCase().includes(text.toLowerCase())
				)
				filteredOptions = filtered.slice(0, maxOptionsSearch)
			}

			isOpen = filteredOptions.length > 0 || showOverlayOnEmptyResults
		} finally {
			isSearching = false
		}
	}

	// Check if an option is already selected
	function isSelected(value: any): boolean {
		return selectedOptions.some(v => v === value)
	}

	// Handle search input change
	async function handleSearchChange(event: Event) {
		const target = event.target as HTMLInputElement
		searchText = target.value
		highlightedIndex = -1
		await filterOptions(searchText)
	}

	// Handle option selection
	function selectOption(option: OptionItem) {
		if (disabled || readonly || option.disabled) return

		if (maxSelectedOptions && selectedOptions.length >= maxSelectedOptions) {
			return
		}

		selectedOptions = [...selectedOptions, option.value]
		searchText = ""
		filteredOptions = []
		highlightedIndex = -1

		if (!keepOpen || (maxSelectedOptions && selectedOptions.length >= maxSelectedOptions)) {
			isOpen = false
		}

		onSelectedOptionsChange?.(selectedOptions)
	}

	// Remove selected option
	function removeOption(value: any) {
		if (disabled || readonly) return

		selectedOptions = selectedOptions.filter(v => v !== value)
		onSelectedOptionsChange?.(selectedOptions)
	}

	// Get display text for a selected value
	function getOptionText(value: any): string {
		const option = options.find(opt => opt.value === value)
		return option ? option.text : String(value)
	}

	// Handle keyboard navigation
	function handleKeyDown(event: KeyboardEvent) {
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
				isOpen = false
				searchText = ""
				filteredOptions = []
				break
			case "Tab":
				// Tab key behavior can be controlled by selectValueOnTab prop in the future
				if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					event.preventDefault()
					selectOption(filteredOptions[highlightedIndex])
				}
				break
		}
	}

	// Handle input focus
	function handleFocus() {
		if (!disabled && !readonly) {
			if (searchText.trim()) {
				filterOptions(searchText)
			}
		}
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (textFieldElement && !textFieldElement.contains(event.target as Node)) {
			isOpen = false
		}
	}

	// Add click outside listener
	$effect(() => {
		if (isOpen) {
			document.addEventListener("click", handleClickOutside)
			return () => {
				document.removeEventListener("click", handleClickOutside)
			}
		}
	})

	// Check if max selections reached
	let isMaxReached = $derived(maxSelectedOptions !== undefined && selectedOptions.length >= maxSelectedOptions)
</script>

<div class="fluent-autocomplete {className}" style="{style} {width ? `width: ${width};` : ''}">
	{#if label}
		<label class="autocomplete-label">
			{label}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<div class="autocomplete-container">
		<!-- Selected options (chips/tags) -->
		{#if selectedOptions.length > 0}
			<div class="selected-options">
				{#each selectedOptions as value}
					<Badge appearance="neutral" class="selected-chip">
						<span>{getOptionText(value)}</span>
						{#if !disabled && !readonly}
							<button
								type="button"
								class="remove-chip"
								onclick={() => removeOption(value)}
								aria-label="Remove {getOptionText(value)}"
							>
								<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
									<path d="M2.09 2.22a.75.75 0 011.06-.13L6 4.94l2.85-2.85a.75.75 0 111.06 1.06L7.06 6l2.85 2.85a.75.75 0 11-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 01-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 01-.13-1.06z"/>
								</svg>
							</button>
						{/if}
					</Badge>
				{/each}
			</div>
		{/if}

		<!-- Search input -->
		<div class="search-input-wrapper" bind:this={textFieldElement}>
			<TextField
				value={searchText}
				{placeholder}
				{disabled}
				readonly={readonly || isMaxReached}
				{required}
				{appearance}
				oninput={handleSearchChange}
				onfocus={handleFocus}
				onkeydown={handleKeyDown}
				style="width: 100%;"
				{...restProps}
			>
				{#snippet end()}
					{#if isSearching}
						<div class="loading-indicator">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="spinner">
								<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
								<path d="M8 1a7 7 0 0 1 7 7" stroke="currentColor" stroke-width="2" fill="none"/>
							</svg>
						</div>
					{/if}
				{/snippet}
			</TextField>

			<!-- Dropdown options -->
			{#if isOpen && textFieldElement}
				<PositioningRegion
					anchor={textFieldElement}
					visible={isOpen}
					style="z-index: 1000; background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: 4px; box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12); max-height: 300px; overflow-y: auto;"
				>
					<div class="options-list">
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
									{option.text}
								</button>
							{/each}
						{:else if showOverlayOnEmptyResults}
							<div class="no-results">No results found</div>
						{/if}
					</div>
				</PositioningRegion>
			{/if}
		</div>

		<!-- Max selections message -->
		{#if isMaxReached}
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
		gap: 0.5rem;
	}

	.autocomplete-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.autocomplete-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.selected-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--neutral-layer-2);
		border-radius: 4px;
		overflow-x: auto;
		max-height: 120px;
		overflow-y: auto;
	}

	.selected-options :global(.selected-chip) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem;
		white-space: nowrap;
	}

	.remove-chip {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: currentColor;
		opacity: 0.7;
		border-radius: 2px;
	}

	.remove-chip:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.1);
	}

	.search-input-wrapper {
		position: relative;
	}

	.loading-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.options-list {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
		min-width: 200px;
	}

	.option-item {
		background: transparent;
		border: none;
		padding: 0.5rem 0.75rem;
		text-align: left;
		cursor: pointer;
		border-radius: 4px;
		color: var(--neutral-foreground-rest);
		font-size: 0.875rem;
	}

	.option-item:hover:not(.disabled) {
		background: var(--neutral-fill-secondary-hover);
	}

	.option-item.highlighted {
		background: var(--neutral-fill-secondary-hover);
	}

	.option-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.no-results {
		padding: 1rem;
		text-align: center;
		color: var(--neutral-foreground-hint);
		font-size: 0.875rem;
	}

	.max-message {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
		padding: 0.25rem 0.5rem;
	}
</style>
