<!--
 * DatePicker Component
 * Inspired by FluentUI Blazor DatePicker component
 * https://www.fluentui-blazor.net/DatePicker
 *
 * Combines TextField with Calendar popup for date selection
-->

<script lang="ts">
	import TextField from "./TextField.svelte"
	import Calendar from "./Calendar.svelte"
	import PositioningRegion from "./PositioningRegion.svelte"
	import type {SlotType} from "../types/index.js"

	type Props = {
		value?: Date | null
		placeholder?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		label?: string
		appearance?: string
		culture?: Intl.Locale
		dateFormat?: Intl.DateTimeFormatOptions
		minDate?: Date
		maxDate?: Date
		class?: string
		style?: string
		onValueChange?: (value: Date | null) => void
		[prop: string]: any
	}

	let {
		value = $bindable(null),
		placeholder = "Select a date",
		disabled = false,
		readonly = false,
		required = false,
		label = undefined,
		appearance = undefined,
		culture = new Intl.Locale(window.navigator.language),
		dateFormat = { year: 'numeric', month: 'long', day: 'numeric' },
		minDate = undefined,
		maxDate = undefined,
		class: className = "",
		style = "",
		onValueChange = undefined,
		...restProps
	}: Props = $props()

	let isOpen = $state(false)
	let inputValue = $state("")
	let textFieldElement: HTMLElement | undefined

	// Format date for display
	function formatDate(date: Date | null): string {
		if (!date) return ""
		try {
			return new Intl.DateTimeFormat(culture.baseName, dateFormat).format(date)
		} catch {
			return date.toLocaleDateString()
		}
	}

	// Update input value when value changes
	$effect(() => {
		inputValue = formatDate(value)
	})

	// Check if date is disabled
	function isDateDisabled(date: Date): boolean {
		if (minDate && date < minDate) return true
		if (maxDate && date > maxDate) return true
		return false
	}

	// Handle calendar date selection
	function handleDateSelected(selectedDate: Date) {
		value = selectedDate
		isOpen = false
		onValueChange?.(selectedDate)
	}

	// Handle input click to open calendar
	function handleInputClick() {
		if (!disabled && !readonly) {
			isOpen = !isOpen
		}
	}

	// Handle input change (manual text entry)
	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement
		inputValue = target.value

		// Try to parse the date
		try {
			const parsed = new Date(target.value)
			if (!isNaN(parsed.getTime()) && !isDateDisabled(parsed)) {
				value = parsed
				onValueChange?.(parsed)
			}
		} catch {
			// Invalid date, ignore
		}
	}

	// Handle clear
	function handleClear() {
		value = null
		inputValue = ""
		isOpen = false
		onValueChange?.(null)
	}
</script>

<div class="fluent-datepicker {className}" style={style}>
	{#if label}
		<label class="datepicker-label">
			{label}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<div class="datepicker-wrapper">
		<TextField
			bind:this={textFieldElement}
			value={inputValue}
			{placeholder}
			{disabled}
			readonly={true}
			{required}
			{appearance}
			oninput={handleInputChange}
			style="width: 100%; cursor: pointer;"
			{...restProps}
		>
			{#snippet end()}
				<!-- Calendar icon -->
				<button
					type="button"
					class="calendar-button"
					onclick={handleInputClick}
					disabled={disabled}
					aria-label="Open calendar"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M14 2a1 1 0 011 1v1h1.5A1.5 1.5 0 0118 5.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-11A1.5 1.5 0 013.5 4H5V3a1 1 0 112 0v1h6V3a1 1 0 011-1zM5 6H3.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-10a.5.5 0 00-.5-.5H15v1a1 1 0 11-2 0V6H7v1a1 1 0 01-2 0V6zm1.5 4a.5.5 0 110 1h-1a.5.5 0 110-1h1zm0 3a.5.5 0 110 1h-1a.5.5 0 110-1h1zm3.5-3a.5.5 0 110 1h-1a.5.5 0 110-1h1zm0 3a.5.5 0 110 1h-1a.5.5 0 110-1h1zm3.5-3a.5.5 0 110 1h-1a.5.5 0 110-1h1zm0 3a.5.5 0 110 1h-1a.5.5 0 110-1h1z"/>
					</svg>
				</button>

				{#if value && !disabled && !readonly}
					<!-- Clear button -->
					<button
						type="button"
						class="clear-button"
						onclick={handleClear}
						aria-label="Clear date"
					>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
							<path d="M2.09 2.22a.75.75 0 011.06-.13L6 4.94l2.85-2.85a.75.75 0 111.06 1.06L7.06 6l2.85 2.85a.75.75 0 11-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 01-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 01-.13-1.06z"/>
						</svg>
					</button>
				{/if}
			{/snippet}
		</TextField>

		{#if isOpen && textFieldElement}
			<PositioningRegion
				anchor={textFieldElement}
				visible={isOpen}
				style="z-index: 1000; background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: 4px; padding: 1rem; box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12);"
			>
				<Calendar
					value={value || new Date()}
					pickerMonth={value || new Date()}
					{culture}
					disabledDateFunc={isDateDisabled}
					onDateSelected={handleDateSelected}
				/>
			</PositioningRegion>
		{/if}
	</div>
</div>

<style>
	.fluent-datepicker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.datepicker-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.datepicker-wrapper {
		position: relative;
	}

	.calendar-button,
	.clear-button {
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		color: var(--neutral-foreground-rest);
		border-radius: 4px;
	}

	.calendar-button:hover:not(:disabled),
	.clear-button:hover {
		background: var(--neutral-fill-secondary-hover);
	}

	.calendar-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.clear-button {
		margin-left: 0.25rem;
	}
</style>
