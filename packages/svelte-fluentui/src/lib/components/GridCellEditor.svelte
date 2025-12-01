<script lang="ts">
	import TextField from "./TextField.svelte"
	import NumberField from "./NumberField.svelte"
	import Checkbox from "./Checkbox.svelte"
	import Select from "./Select.svelte"
	import Option from "./Option.svelte"
	import DatePicker from "./DatePicker.svelte"
	import Autocomplete from "./Autocomplete.svelte"

	type EditorType = "text" | "number" | "checkbox" | "select" | "date" | "autocomplete" | "custom"
	type OptionsLoadTrigger = "immediate" | "oneditstart" | "ondropdownopen"

	type EditorOption = {
		value: string
		label: string
	}

	type EditorOptions = {
		// For select/autocomplete - static options
		options?: EditorOption[]
		// For select/autocomplete - dynamic loading
		loadOptions?: () => Promise<EditorOption[]>
		optionsLoadTrigger?: OptionsLoadTrigger
		// For number
		min?: number
		max?: number
		step?: number
		// For text
		maxLength?: number
		// For autocomplete
		onSearch?: (query: string) => Promise<EditorOption[]>
	}

	type Props = {
		type: EditorType
		value: any
		options?: EditorOptions
		oncommit: (newValue: any) => void
		oncancel: () => void
		skipBlurCommit?: boolean
		skipKeyboardCommit?: boolean  // When true, don't handle Enter/Escape (parent handles it)
	}

	let {
		type = "text",
		value,
		options = {},
		oncommit,
		oncancel,
		skipBlurCommit = false,
		skipKeyboardCommit = false
	}: Props = $props()

	let internalValue = $state(value)
	let editorElement: HTMLElement | undefined = $state()
	let loadedOptions = $state<EditorOption[]>([])
	let isLoadingOptions = $state(false)
	let hasLoadedOnDropdown = $state(false)

	// Get effective options (static or loaded)
	let effectiveOptions = $derived(loadedOptions.length > 0 ? loadedOptions : (options.options || []))

	// Focus the editor when mounted
	$effect(() => {
		if (editorElement) {
			// Try to focus the inner input
			const input = editorElement.querySelector('input, select, textarea') as HTMLElement
			if (input) {
				input.focus()
			} else {
				editorElement.focus?.()
			}
		}
	})

	// Handle ondropdownopen loading
	async function handleDropdownFocus() {
		if (
			options.loadOptions &&
			options.optionsLoadTrigger === "ondropdownopen" &&
			!hasLoadedOnDropdown
		) {
			isLoadingOptions = true
			try {
				loadedOptions = await options.loadOptions()
				hasLoadedOnDropdown = true
			} catch (error) {
				console.error("Failed to load options:", error)
			} finally {
				isLoadingOptions = false
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		// Skip keyboard handling if parent is handling it (e.g., navigate mode)
		if (skipKeyboardCommit) {
			return
		}

		if (e.key === "Enter") {
			e.preventDefault()
			commit()
		} else if (e.key === "Escape") {
			e.preventDefault()
			oncancel()
		}
	}

	function handleBlur(e: FocusEvent) {
		// Skip blur commit if parent is handling it (e.g., keyboard navigation)
		if (skipBlurCommit) {
			return
		}

		// Check if focus is moving outside the editor
		const relatedTarget = e.relatedTarget as HTMLElement
		if (editorElement && !editorElement.contains(relatedTarget)) {
			commit()
		}
	}

	function commit() {
		if (internalValue !== value) {
			oncommit(internalValue)
		} else {
			oncancel()
		}
	}

	function handleCheckboxChange() {
		// Checkbox commits immediately on change
		internalValue = !internalValue
		oncommit(internalValue)
	}

	function handleSelectChange(detail: { value: string, data?: Record<string, unknown> }) {
		internalValue = detail.value
		oncommit(internalValue)
	}

	function handleDateChange(date: Date | null) {
		internalValue = date
		oncommit(internalValue)
	}

	function handleAutocompleteChange(selected: string[]) {
		internalValue = selected.length > 0 ? selected[0] : null
		oncommit(internalValue)
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={editorElement}
	class="grid-cell-editor"
	onkeydown={handleKeyDown}
	onblur={handleBlur}
>
	{#if type === "text"}
		<input
			type="text"
			class="cell-input"
			bind:value={internalValue}
			maxlength={options.maxLength}
		/>
	{:else if type === "number"}
		<input
			type="number"
			class="cell-input"
			bind:value={internalValue}
			min={options.min}
			max={options.max}
			step={options.step}
		/>
	{:else if type === "checkbox"}
		<input
			type="checkbox"
			class="cell-checkbox"
			checked={internalValue}
			onchange={handleCheckboxChange}
		/>
	{:else if type === "select"}
		<select
			class="cell-select"
			class:loading={isLoadingOptions}
			bind:value={internalValue}
			onchange={() => oncommit(internalValue)}
			onfocus={handleDropdownFocus}
		>
			{#if isLoadingOptions}
				<option value="">Loading...</option>
			{:else}
				{#each effectiveOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			{/if}
		</select>
	{:else if type === "date"}
		<input
			type="date"
			class="cell-input"
			value={internalValue instanceof Date ? internalValue.toISOString().split('T')[0] : internalValue || ''}
			onchange={(e) => {
				const dateStr = e.currentTarget.value
				internalValue = dateStr ? new Date(dateStr) : null
				oncommit(internalValue)
			}}
		/>
	{:else if type === "autocomplete"}
		<input
			type="text"
			class="cell-input"
			bind:value={internalValue}
			placeholder="Type to search..."
		/>
	{/if}
</div>

<style>
	.grid-cell-editor {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.cell-input,
	.cell-select {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border: none;
		border-radius: 0;
		background: transparent;
		color: var(--neutral-foreground-rest, #242424);
		font: inherit;
		line-height: inherit;
		letter-spacing: inherit;
		box-sizing: border-box;
		outline: none;
	}

	.cell-input:focus,
	.cell-select:focus {
		outline: none;
	}

	.cell-checkbox {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: var(--accent-fill-rest, #0078d4);
	}

	/* Loading state for select */
	.cell-select.loading {
		opacity: 0.7;
		cursor: wait;
	}

	/* Dark mode */
	[data-theme="dark"] .cell-input,
	[data-theme="dark"] .cell-select {
		color: var(--neutral-foreground-rest, #e0e0e0);
	}
</style>
