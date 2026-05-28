<script lang="ts">
	import Calendar from "./Calendar.svelte"
	import type {SlotType} from "../types/index.js"
	import {CalendarDay} from "../fluent-ui/calendar/calendar-day.js"
	import {CalendarMonth} from "../fluent-ui/calendar/calendar-month.js"
	import {CalendarYear} from "../fluent-ui/calendar/calendar-year.js"
	import type {CalendarSelectMode, CalendarView, IFluentCalendar, CalendarSelectionError} from "../fluent-ui/calendar/fluent-calendar.js"
	import {CalendarExtended} from "../fluent-ui/calendar/fluent-calendar-extended.js"
	import type DayFormat from "../fluent-ui/calendar/day-format.js"
	import {CalendarTitles} from "../fluent-ui/calendar/calendar-titles.js"
	import {RangeOfDates} from "../fluent-ui/calendar/range-of-dates.js"
	import {CalendarVerticalPosition} from "../fluent-ui/constants/calendar-vertical-position.js"
	import {tick} from "svelte"
	import {getLargest, getSmallest} from "../helpers/array.js"

	type Props = {
		value?: Date
		selectedDates?: Date[]
		pickerMonth?: Date
		culture?: Intl.Locale
		/** First day of the week (0=Sunday, 1=Monday, …, 6=Saturday). Overrides culture's default when set. */
		firstDayOfWeek?: number | null
		view?: CalendarView
		selectMode?: CalendarSelectMode
		checkIfSelectedValueHasChanged?: boolean
		disabledDateFunc?: (date: Date) => boolean
		/** Inverse of disabledDateFunc — return true to allow a date. When both are set, disabledDateFunc wins. */
		selectableDates?: (date: Date) => boolean
		disabledCheckAllDaysOfMonthYear?: boolean
		animatePeriodChanges?: boolean
		disabledSelectable?: boolean
		dayFormat?: typeof DayFormat["TwoDigit"] | null
		/** Day-cell edge length in CSS units (default 28px). Resizes the whole grid proportionally. */
		cellSize?: string | number
		/** Gap between cells in CSS units (default 2px). */
		gap?: string | number
		readonly?: boolean
		/** Hover-preview function: given the day under the cursor, returns the set of dates to visually highlight. Defaults to `[date]`. */
		highlightDates?: (date: Date) => Date[]
		/** Click-selection function: given the clicked day, returns the dates to select. In multiple mode, the result is unioned with existing `selectedDates` (or removed wholesale if the clicked day was already selected). In range mode, the result replaces the range. Defaults to `[date]`. */
		selectDates?: (date: Date) => Date[]
		/** Upper bound for the number of dates that can be selected in multiple mode. When exceeded, `onSelectionError` fires and the selection is not modified. */
		maxSelectableDays?: number
		/** Fires when an attempted selection violates `maxSelectableDays`. The current `selectedDates` is left untouched. */
		onSelectionError?: (error: CalendarSelectionError) => void
		onDatesSelected?: (values: Date[]) => void
		onDateSelected?: (value: Date) => void
		/** Fires when the user navigates months/years (prev/next buttons). */
		onPickerMonthChange?: (month: Date) => void
		/** Fires when the cursor enters a day cell (with that day) or leaves the day grid (with `null`). Pure observation — does not affect highlighting. */
		onDayHover?: (date: Date | null) => void
		day?: SlotType
		class?: string
	}

	let {
		    value                           = new Date(),
		    selectedDates                   = [],
		    pickerMonth                     = $bindable(new Date()),
		    view                            = "days",
		    culture                         = new Intl.Locale(window.navigator.language),
		    firstDayOfWeek                  = undefined,
		    disabledCheckAllDaysOfMonthYear = undefined,
		    animatePeriodChanges            = undefined,
		    disabledSelectable              = undefined,
		    readonly                        = undefined,
		    selectMode                      = "single",
		    checkIfSelectedValueHasChanged  = undefined,
		    dayFormat                       = undefined,
		    cellSize                        = undefined,
		    gap                             = undefined,
		    disabledDateFunc                = undefined,
		    selectableDates                 = undefined,
		    highlightDates                  = undefined,
		    selectDates                     = undefined,
		    maxSelectableDays               = undefined,
		    onSelectionError                = undefined,
		    onDatesSelected                 = undefined,
		    onDateSelected                  = undefined,
		    onPickerMonthChange             = undefined,
		    onDayHover                      = undefined,
		    day: daySnippet                 = undefined,
		    ...  restProps
	    }: Props = $props()

	let _rangeSelector                      = $state(new RangeOfDates())
	let _rangeSelectorMouseOver             = $state(new RangeOfDates())
	let _pickerView: Props["view"] | null   = $state(null)
	let _selectedDatesMouseOver: Date[]             = $state([])
	let _animationRunning: CalendarVerticalPosition = $state(CalendarVerticalPosition.Unset)

	const canBeAnimated             = $derived(animatePeriodChanges ?? (view !== "days" && view !== "years"))
	const calendarExtended          = $derived(new CalendarExtended(culture, pickerMonth, firstDayOfWeek ?? undefined))
	// Merge disabledDateFunc with the inverse of selectableDates so the existing logic stays simple.
	const effectiveDisabledFunc = $derived<(date: Date) => boolean>((date) => {
		if (disabledDateFunc?.(date)) return true
		if (selectableDates && !selectableDates(date)) return true
		return false
	})
	const calendar: IFluentCalendar = $derived({
		view,
		calendarExtended,
		culture:                         culture,
		dayFormat,
		// Default to true so a month/year is only marked disabled when EVERY day in it is.
		// With false (Blazor parity), date-range restrictions like min/maxDate make Jan 1 of every
		// year fail the disabledDateFunc check, blocking the year picker entirely.
		disabledCheckAllDaysOfMonthYear: disabledCheckAllDaysOfMonthYear ?? true,
		disabledSelectable:              disabledSelectable ?? false,
		readOnly:                        readonly ?? false,
		selectMode,
		value:                           value,
		selectedDates:                   selectedDates,
		allDaysAreDisabled,
		disabledDateFunc:                effectiveDisabledFunc
	})
	const titles                    = $derived(new CalendarTitles(calendar))
	const multipleSelection         = $derived(getMultipleSelection())
	const year                      = $derived(pickerMonth.getFullYear())

	// CSS variable overrides for cell size / gap. Accepts a number (interpreted as px) or any CSS length string.
	const sizeStyle = $derived.by(() => {
		const parts: string[] = []
		if (cellSize !== undefined && cellSize !== null) {
			const v = typeof cellSize === "number" ? `${cellSize}px` : cellSize
			parts.push(`--calendar-cell-size: ${v}; --month-cell-size: ${v}; --year-cell-size: ${v}`)
		}
		if (gap !== undefined && gap !== null) {
			const v = typeof gap === "number" ? `${gap}px` : gap
			parts.push(`--calendar-gap: ${v}; --month-gap: ${v}; --year-gap: ${v}`)
		}
		return parts.join("; ")
	})

	function getMultipleSelection() {
		const inProgress = _selectedDatesMouseOver.length > 0

		if (selectedDates == null || !selectedDates.length) {
			return {
				isMultiple: false,
				min:        new Date(0),
				max:        new Date(0),
				inProgress
			}
		}

		return {
			isMultiple: (selectMode == "multiple" || selectMode == "range") && selectedDates.length > 1,
			min:        selectedDates.reduce((acc, x) => !acc || x < acc ? x : acc),
			max:        selectedDates.reduce((acc, x) => !acc || x > acc ? x : acc),
			inProgress
		}
	}

	function sameDay(a: Date, b: Date) {
		return a.getFullYear() === b.getFullYear()
			&& a.getMonth() === b.getMonth()
			&& a.getDate() === b.getDate()
	}

	function dedupeDates(dates: Date[]) {
		const seen = new Set<string>()
		const out: Date[] = []
		for (const d of dates) {
			const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
			if (!seen.has(key)) {
				seen.add(key)
				out.push(d)
			}
		}
		return out
	}

	function fireMaxExceeded(attempted: Date[]) {
		onSelectionError?.({
			code:      "max_selectable_days_exceeded",
			message:   `You can select a maximum of ${maxSelectableDays} day${maxSelectableDays === 1 ? "" : "s"}. Delete a day to select a new one.`,
			attempted,
			current:   selectedDates,
			max:       maxSelectableDays as number
		})
		_selectedDatesMouseOver = []
	}

	function getAnimationClass(existingClass: string) {
		if (!canBeAnimated) {
			return existingClass
		}

		switch (_animationRunning) {
			case CalendarVerticalPosition.Top:
				return `${existingClass} animation-running-up`
			case CalendarVerticalPosition.Bottom:
				return `${existingClass} animation-running-down`
			default:
				return `${existingClass} animation-none`
		}
	}

	function onTitleClicked(title: CalendarTitles) {
		if (title.readOnly) {
			return
		}

		switch (view) {
			// Days -> Months
			case "days":
				_pickerView = "months"
				break

			// Months -> Years
			case "months":
				_pickerView = "years"
				break
		}
	}

	async function onPreviousButtonClicked(e: MouseEvent) {
		await startNewAnimationAsync(CalendarVerticalPosition.Bottom)

		switch (view) {
			case "days":
				pickerMonth.setMonth(pickerMonth.getMonth() - 1)
				break

			case "months":
				pickerMonth.setFullYear(pickerMonth.getFullYear() - 1)
				break

			case "years":
				pickerMonth.setFullYear(pickerMonth.getFullYear() - 12)
				break
		}
		pickerMonth = new Date(pickerMonth)
		onPickerMonthChange?.(pickerMonth)
	}

	async function onNextButtonHandlerAsync(e: MouseEvent) {
		await startNewAnimationAsync(CalendarVerticalPosition.Top)

		switch (view) {
			case "days":
				pickerMonth.setMonth(pickerMonth.getMonth() + 1)
				break

			case "months":
				pickerMonth.setFullYear(pickerMonth.getFullYear() + 1)
				break

			case "years":
				pickerMonth.setFullYear(pickerMonth.getFullYear() + 12)
				break
		}
		pickerMonth = new Date(pickerMonth)
		onPickerMonthChange?.(pickerMonth)
	}

	async function onSelectDayHandlerAsync(value_: Date, dayDisabled: boolean) {
		if (dayDisabled) return

		switch (selectMode) {
			// Single selection
			case "single":
				onDateSelected?.(value_)
				break

			// Multiple selection — toggle the clicked group (single day by default,
			// or whatever selectDates returns). The clicked day determines the
			// toggle pivot: if it's already in selectedDates, the entire group is
			// removed; otherwise the group is unioned in.
			case "multiple": {
				const group     = selectDates ? selectDates(value_) : [value_]
				const isRemoving = selectedDates.some(d => sameDay(d, value_))

				let newSelectedDates: Date[]
				if (isRemoving) {
					newSelectedDates = selectedDates.filter(d => !group.some(g => sameDay(g, d)))
				} else {
					newSelectedDates = dedupeDates([...selectedDates, ...group])
				}

				if (!isRemoving && maxSelectableDays !== undefined && newSelectedDates.length > maxSelectableDays) {
					fireMaxExceeded(group)
					return
				}

				onDatesSelected?.(newSelectedDates)
				break
			}

			// Range of dates
			case "range": {
				// When selectDates is provided, clicking any day defines the
				// entire range via the function. The result is taken verbatim —
				// callers control skip/jump-over behavior for disabled days.
				if (selectDates) {
					const group = selectDates(value_)
					if (maxSelectableDays !== undefined && group.length > maxSelectableDays) {
						fireMaxExceeded(group)
						return
					}
					_rangeSelector.start = getSmallest(group)
					_rangeSelector.end   = getLargest(group)
					onDatesSelected?.(group)
					_selectedDatesMouseOver = []
					break
				}

				const resetRange = (_rangeSelector.isValid() || _rangeSelector.isSingle()) && _rangeSelector.includes(value_)

				// Reset the selection
				if (resetRange) {
					_rangeSelector.clear()
				}

				// End the selection
				else if (_rangeSelector.start !== null && _rangeSelector.end === null) {
					_rangeSelector.end = value_
				}

				// Start the selection
				else {
					_rangeSelector.start = value_
					_rangeSelector.end   = null

					await onSelectDayMouseOverAsync(value_, false)
				}

				// Emit [start] while end is null so the user sees their pivot day
				// highlighted between the first and second click of a new range —
				// otherwise the selection looks empty and they can't tell a new
				// range has been started.
				const newSelectedDates = _rangeSelector.end !== null
					? _rangeSelector.getAllDates()
					: (_rangeSelector.start ? [_rangeSelector.start] : [])

				if (maxSelectableDays !== undefined && newSelectedDates.length > maxSelectableDays) {
					fireMaxExceeded(newSelectedDates)
					_rangeSelector.clear()
					return
				}

				onDatesSelected?.(newSelectedDates)
				break
			}
		}
	}

	async function onSelectDayMouseOverAsync(value: Date, dayDisabled: boolean) {
		// Pure-observation hover callback fires regardless of selectMode or
		// disabled state — consumers may want to react to inactive days too
		// (e.g., tooltip explaining why the day is disabled).
		onDayHover?.(value)

		if (dayDisabled || selectMode === "single") {
			return
		}

		// Highlight set is whatever highlightDates returns (verbatim — no
		// internal disabled filtering). Falls back to the existing in-progress
		// range preview ([rangeStart, hovered]) for range mode when no
		// highlightDates function is provided.
		if (highlightDates) {
			_selectedDatesMouseOver = highlightDates(value)
			return
		}

		if (selectMode === "range" && _rangeSelector.start && !_rangeSelector.end) {
			_rangeSelectorMouseOver.start = _rangeSelector.start
			_rangeSelectorMouseOver.end   = value
			_selectedDatesMouseOver       = _rangeSelectorMouseOver.getAllDates()
			return
		}

		_selectedDatesMouseOver = []
	}

	async function onSelectMonthHandlerAsync(year: number, month: number, isReadOnly: boolean) {
		if (isReadOnly) {
			return
		}

		const newValue = new Date(year, month, 1, 0, 0, 0, 0)
		onDateSelected?.(newValue)
	}

	async function onSelectYearHandlerAsync(year: number, isReadOnly: boolean) {
		if (isReadOnly) {
			return
		}

		const newValue = new Date(year, 0, 1, 0, 0, 0, 0)
		onDateSelected?.(newValue)
	}

	function allDaysAreDisabled(start: Date, end: Date) {
		if (!disabledDateFunc && !selectableDates) {
			return false
		}

		for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
			if (!effectiveDisabledFunc(day)) {
				return false
			}
		}

		return true
	}

	function getDayProperties(day: Date) {
		return new CalendarDay(calendar, day)
	}

	function getMonthProperties(year?: number, month?: number) {
		return new CalendarMonth(calendar, new Date(year ?? 0, month ?? 0))
	}

	function getYearProperties(year?: number) {
		return new CalendarYear(calendar, new Date(year ?? 0, 0, 1))
	}

	function pickerMonthSelectAsync(month?: Date) {
		pickerMonth = month ?? new Date()
		_pickerView = "days"
	}

	function pickerYearSelectAsync(year?: Date) {
		pickerMonth = year ?? new Date()
		_pickerView = "days"
	}

	async function startNewAnimationAsync(position: CalendarVerticalPosition) {
		if (!canBeAnimated) {
			return
		}

		_animationRunning = CalendarVerticalPosition.Unset
		await tick()
		_animationRunning = position
	}
</script>

{#snippet arrowUp()}
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="var(--neutral-fill-strong-focus)"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M4.2 10.73a.75.75 0 001.1 1.04l5.95-6.25v14.73a.75.75 0 001.5 0V5.52l5.95 6.25a.75.75 0 001.1-1.04l-7.08-7.42a1 1 0 00-1.44 0L4.2 10.73z" />
	</svg>
{/snippet}
{#snippet arrowDown()}
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="var(--neutral-fill-strong-focus)"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M19.8 13.27a.75.75 0 00-1.1-1.04l-5.95 6.25V3.75a.75.75 0 10-1.5 0v14.73L5.3 12.23a.75.75 0 10-1.1 1.04l7.08 7.42a1 1 0 001.44 0l7.07-7.42z" />
	</svg>
{/snippet}

<div

	class="{restProps.class || ''}"
	class:fluent-calendar={view === "days"}
	class:fluent-month={view === "months"}
	class:fluent-year={view === "years"}
	aria-readonly={readonly ? "true" : null}
	style={sizeStyle || null}
>
	{#if !_pickerView || _pickerView === "days"}
		<div>
			<!-- Title bar (label, previous and next buttons) -->
			<div class="title" part="title" aria-label="{titles.label}">
				<div
					part="label" class={getAnimationClass('label')}
					role="button" tabindex="0"
					onclick={() => onTitleClicked(titles)}
					onkeydown={(ev) => (ev.key === "Enter" || ev.key === " ") && onTitleClicked(titles)}
				>
					{titles.label}
				</div>
				<div part="move" class="change-period">
					{#if titles.previousDisabled}
						<div class="previous" aria-disabled="true"></div>
					{:else}
						<div
							class="previous" title="{titles.previousTitle}"
							role="button" tabindex="0"
							onclick={onPreviousButtonClicked}
							onkeydown={(ev) => ev.key === "Enter" || ev.key === " " ? onPreviousButtonClicked(ev as unknown as MouseEvent) : undefined}
						>
							{@render arrowUp()}
						</div>
					{/if}
					{#if titles.nextDisabled}
						<div class="next" aria-disabled="true"></div>
					{:else}
						<div
							class="next" title="{titles.nextTitle}"
							role="button" tabindex="0"
							onclick={onNextButtonHandlerAsync}
							onkeydown={(ev) => ev.key === "Enter" || ev.key === " " ? onNextButtonHandlerAsync(ev as unknown as MouseEvent) : undefined}
						>
							{@render arrowDown()}
						</div>
					{/if}
				</div>
			</div>

			{#if view === "days"}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="days" part="days" onmouseleave={ev => { _selectedDatesMouseOver = []; onDayHover?.(null) }}>
					<!-- Titles: Mon, Tue, ... -->
					<div class="week-days" part="week-days">
						{#each calendarExtended.getDayNames() as weekDay}
							<div class="week-day" part="week-day" title={weekDay.name} data-abbr={weekDay.name}>
								{weekDay.shorted}
							</div>
						{/each}
					</div>

					{#each {length: 6} as _, i}
						<!-- A week of 7 days -->
						<div class="week">
							{#each calendarExtended.getDaysOfWeek(i) as day}
								{@const dayProperties = getDayProperties(day)}

								<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
								<!-- svelte-ignore a11y_mouse_events_have_key_events -->
								<div
									part="day"
									class={getAnimationClass('day')}
									role={dayProperties.isDisabled || dayProperties.isInactive ? undefined : 'button'}
									tabindex={dayProperties.isDisabled || dayProperties.isInactive ? undefined : 0}
									aria-disabled={dayProperties.isDisabled}
									data-inactive={dayProperties.isInactive}
									data-today={dayProperties.isToday}
									aria-selected={dayProperties.isSelected}
									data-multi-day={dayProperties.isMultiDaySelected}
									data-multi-day-over={multipleSelection.inProgress && _selectedDatesMouseOver.some(d => sameDay(d, day))}
									data-multi-start={multipleSelection.isMultiple && selectMode === "range" && sameDay(multipleSelection.min, day)}
									data-multi-end={multipleSelection.isMultiple && selectMode === "range" && sameDay(multipleSelection.max, day)}
									aria-label={dayProperties.title}
									data-value={dayProperties.dayIdentifier}
									onkeydown={ev => (ev.key === "Enter" || ev.key === " ") && onSelectDayHandlerAsync(day, dayProperties.isDisabled || dayProperties.isInactive || readonly || false)}
									onclick={ev => onSelectDayHandlerAsync(day, dayProperties.isDisabled || dayProperties.isInactive || readonly || false)}
									onmouseover={ev => onSelectDayMouseOverAsync(day, dayProperties.isDisabled || dayProperties.isInactive || readonly || false)}
								>
									{#if daySnippet}
										{@render daySnippet(dayProperties)}
									{:else}
										{dayProperties.dayNumber}
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{:else if view === "months"}
				<div class="months" part="months">
					{#each calendarExtended.getMonthNames() as month}
						{@const monthProperties = getMonthProperties(year, month.index)}

						<div
							class={getAnimationClass('month')}
							class:selected={monthProperties.isSelected}
							class:readonly={monthProperties.isReadOnly}
							aria-disabled={monthProperties.isDisabled}
							aria-pressed={monthProperties.isSelected}
							aria-label={monthProperties.title}
							title={monthProperties.title}
							data-value={monthProperties.monthIdentifier}
							role="button"
							tabindex={monthProperties.isDisabled || monthProperties.isReadOnly ? undefined : 0}
							onkeydown={ev => (ev.key === "Enter" || ev.key === " ") && onSelectMonthHandlerAsync(year, month.index, monthProperties.isReadOnly)}
							onclick={ev => onSelectMonthHandlerAsync(year, month.index, monthProperties.isReadOnly)}
						>
							{month.abbreviated}
						</div>
					{/each}
				</div>
			{:else if view === "years"}
				<div class="years" part="years">
					{#each calendarExtended.getYearsRange() as year}
						{@const yearProperties = getYearProperties(year.year)}

						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class={getAnimationClass('year')}
							class:selected={yearProperties.isSelected}
							class:readonly={yearProperties.isReadOnly}
							aria-disabled={yearProperties.isDisabled}
							aria-pressed={yearProperties.isSelected}
							aria-label={String(year.year)}
							title={String(year.year)}
							data-value={yearProperties.yearIdentifier}
							tabindex={yearProperties.isDisabled || yearProperties.isReadOnly ? undefined : 0}
							onkeydown={ev => (ev.key === "Enter" || ev.key === " ") && onSelectYearHandlerAsync(year.year, yearProperties.isReadOnly)}
							onclick={ev => onSelectYearHandlerAsync(year.year, yearProperties.isReadOnly)}
						>
							{year.year}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	{#if _pickerView === "months"}
		<Calendar
			view="months"
			value={pickerMonth}
			onDateSelected={pickerMonthSelectAsync}
			checkIfSelectedValueHasChanged={false}
			{readonly}
			{culture}
			{disabledSelectable}
			{animatePeriodChanges}
			disabledCheckAllDaysOfMonthYear={disabledCheckAllDaysOfMonthYear}
			{disabledDateFunc}
			{cellSize}
			{gap}
		/>
	{/if}

	{#if _pickerView === "years"}
		<Calendar
			view="years"
			value={pickerMonth}
			onDateSelected={pickerYearSelectAsync}
			checkIfSelectedValueHasChanged={false}
			{readonly}
			{culture}
			disabledSelectable={disabledSelectable}
			{animatePeriodChanges}
			disabledCheckAllDaysOfMonthYear={disabledCheckAllDaysOfMonthYear}
			{disabledDateFunc}
			{cellSize}
			{gap}
		/>
	{/if}
</div>
