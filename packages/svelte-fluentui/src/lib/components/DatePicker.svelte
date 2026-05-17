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
	import type DayFormat from "../fluent-ui/calendar/day-format.js"

	type Props = {
		id?: string
		value?: Date | null
		placeholder?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		autofocus?: boolean
		label?: string
		labelTemplate?: SlotType
		appearance?: string
		culture?: Intl.Locale
		dateFormat?: Intl.DateTimeFormatOptions
		minDate?: Date
		maxDate?: Date
		/** Custom date-disable predicate (composes with minDate/maxDate and selectableDates). */
		disabledDateFunc?: (date: Date) => boolean
		/** Inverse of disabledDateFunc — return true to allow a date. Composes with disabledDateFunc. */
		selectableDates?: (date: Date) => boolean
		/** Apply disabled styling to unselectable dates. Default true. */
		disabledSelectable?: boolean
		/** When true, treat a month/year as disabled only if every contained day is disabled. */
		disabledCheckAllDaysOfMonthYear?: boolean
		/** Day cell format. "two_digit" renders "01" instead of "1". */
		dayFormat?: typeof DayFormat["TwoDigit"] | null
		/** Day-cell edge length for the calendar popup (default 28px). Resizes the whole grid proportionally. */
		cellSize?: string | number
		/** Gap between cells in the calendar popup (default 2px). */
		gap?: string | number
		/** Animate transitions between months/years. By default only the Months view animates. */
		animatePeriodChanges?: boolean
		/** First day of the week (0=Sunday…6=Saturday). Overrides culture default. */
		firstDayOfWeek?: number | null
		/** When true (default), the popup closes after a date is picked. */
		autoClose?: boolean
		/** Bindable open state of the calendar popup. */
		open?: boolean
		openCalendarIconAriaLabel?: string
		title?: string
		class?: string
		style?: string
		/** Custom render for each day cell in the calendar popup. Receives CalendarDay properties. */
		day?: SlotType
		onValueChange?: (value: Date | null) => void
		onOpenChange?: (open: boolean) => void
		/** Fires when the user navigates months/years inside the calendar popup. */
		onPickerMonthChange?: (month: Date) => void
	}

	let {
		id = undefined,
		value = $bindable(null),
		placeholder = "Select a date",
		disabled = false,
		readonly = false,
		required = false,
		autofocus = undefined,
		label = undefined,
		labelTemplate = undefined,
		appearance = undefined,
		culture = new Intl.Locale(window.navigator.language),
		dateFormat = { year: 'numeric', month: 'long', day: 'numeric' },
		minDate = undefined,
		maxDate = undefined,
		disabledDateFunc = undefined,
		selectableDates = undefined,
		disabledSelectable = undefined,
		disabledCheckAllDaysOfMonthYear = undefined,
		dayFormat = undefined,
		cellSize = undefined,
		gap = undefined,
		animatePeriodChanges = undefined,
		firstDayOfWeek = undefined,
		autoClose = true,
		open = $bindable(false),
		openCalendarIconAriaLabel = "Open calendar",
		title = undefined,
		class: className = "",
		style = "",
		day: daySnippet = undefined,
		onValueChange = undefined,
		onOpenChange = undefined,
		onPickerMonthChange = undefined
	}: Props = $props()

	let inputValue = $state("")
	// Bridge `open` prop with internal logic so $effect and bindable prop stay consistent.
	let isOpen = $derived(open)
	function setOpen(next: boolean) {
		if (open === next) return
		open = next
		onOpenChange?.(next)
	}
	let wrapperElement = $state<HTMLElement | undefined>(undefined)
	let popupElement = $state<HTMLElement | undefined>(undefined)

	// Close on outside click / Escape
	$effect(() => {
		if (!isOpen) return

		function handlePointerDown(event: PointerEvent) {
			const target = event.target as Node | null
			if (!target) return
			if (wrapperElement?.contains(target)) return
			if (popupElement?.contains(target)) return
			setOpen(false)
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				event.stopPropagation()
				setOpen(false)
			}
		}

		document.addEventListener("pointerdown", handlePointerDown, true)
		document.addEventListener("keydown", handleKeyDown, true)
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown, true)
			document.removeEventListener("keydown", handleKeyDown, true)
		}
	})

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

	// Check if date is disabled — composes minDate/maxDate, disabledDateFunc, and selectableDates.
	function isDateDisabled(date: Date): boolean {
		if (minDate && date < minDate) return true
		if (maxDate && date > maxDate) return true
		if (disabledDateFunc?.(date)) return true
		if (selectableDates && !selectableDates(date)) return true
		return false
	}

	// Handle calendar date selection
	function handleDateSelected(selectedDate: Date) {
		value = selectedDate
		if (autoClose) setOpen(false)
		onValueChange?.(selectedDate)
	}

	// Handle input click to open calendar
	function handleInputClick() {
		if (!disabled && !readonly) {
			setOpen(!isOpen)
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
		setOpen(false)
		onValueChange?.(null)
	}
</script>

<div class="fluent-datepicker {className}" style={style}>
	{#if label || labelTemplate}
		<label for={id} class="fluent-label">
			{#if label}{label}{/if}
			{#if labelTemplate}{@render labelTemplate?.()}{/if}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<div class="datepicker-wrapper" bind:this={wrapperElement}>
		<TextField
			{id}
			value={inputValue}
			{placeholder}
			{disabled}
			readonly={true}
			{required}
			{autofocus}
			{appearance}
			{title}
			oninput={handleInputChange}
			style="width: 100%; cursor: pointer;"
		>
			{#snippet end()}
				<span class="end-buttons">
				<!-- Calendar icon -->
				<button
					type="button"
					class="calendar-button"
					onclick={handleInputClick}
					disabled={disabled}
					aria-label={openCalendarIconAriaLabel}
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
				</span>
			{/snippet}
		</TextField>

		{#if isOpen && wrapperElement}
			<PositioningRegion
				anchor={wrapperElement}
				visible={isOpen}
				matchWidth={false}
				style="z-index: var(--fluent-z-popover, 1060); background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: 4px; padding: 1rem; box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12);"
			>
				<div bind:this={popupElement}>
					<Calendar
						value={value || new Date()}
						pickerMonth={value || new Date()}
						{culture}
						{firstDayOfWeek}
						{disabledSelectable}
						{disabledCheckAllDaysOfMonthYear}
						{dayFormat}
						{cellSize}
						{gap}
						{animatePeriodChanges}
						disabledDateFunc={isDateDisabled}
						onDateSelected={handleDateSelected}
						{onPickerMonthChange}
						day={daySnippet}
					/>
				</div>
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

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.datepicker-wrapper {
		position: relative;
	}

	.end-buttons {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
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
