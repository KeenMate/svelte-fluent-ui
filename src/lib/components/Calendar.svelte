<script lang="ts">
	import Calendar from "./Calendar.svelte"
	import type {SlotType} from "../types/index.js"
	import {CalendarDay} from "../fluent-ui/calendar/calendar-day.js"
	import {CalendarMonth} from "../fluent-ui/calendar/calendar-month.js"
	import {CalendarYear} from "../fluent-ui/calendar/calendar-year.js"
	import type {CalendarSelectMode, CalendarView, IFluentCalendar} from "../fluent-ui/calendar/fluent-calendar.js"
	import {CalendarExtended} from "../fluent-ui/calendar/fluent-calendar-extended.js"
	import type DayFormat from "../fluent-ui/calendar/day-format.js"
	import {CalendarTitles} from "../fluent-ui/calendar/calendar-titles.js"
	import {RangeOfDates} from "../fluent-ui/calendar/range-of-dates.js"
	import {VerticalPosition} from "../fluent-ui/constants/vertical-position.js"
	import {tick} from "svelte"
	import {getLargest, getSmallest} from "../helpers/array.js"

	type Props = {
		value?: Date
		selectedDates?: Date[]
		pickerMonth?: Date
		culture?: Intl.Locale
		view?: CalendarView
		selectMode?: CalendarSelectMode
		checkIfSelectedValueHasChanged?: boolean
		disabledDateFunc?: (date: Date) => boolean
		disabledCheckAllDaysOfMonthYear?: boolean
		animatePeriodChanges?: boolean
		disabledSelectable?: boolean
		dayFormat?: typeof DayFormat["TwoDigit"] | null
		readonly?: boolean
		selectDatesHover?: ((date: Date) => Date[]) | null | undefined
		onDatesSelected?: (values: Date[]) => void
		onDateSelected?: (value: Date) => void
		day?: SlotType
		[prop: string]: any
	}

	let {
		    value                           = new Date(),
		    selectedDates                   = [],
		    pickerMonth                     = $bindable(new Date()),
		    view                            = "days",
		    culture                         = new Intl.Locale(window.navigator.language),
		    disabledCheckAllDaysOfMonthYear = undefined,
		    animatePeriodChanges            = undefined,
		    disabledSelectable              = undefined,
		    readonly                        = undefined,
		    selectMode                      = "single",
		    checkIfSelectedValueHasChanged  = undefined,
		    dayFormat                       = undefined,
		    disabledDateFunc                = undefined,
		    selectDatesHover                = undefined,
		    onDatesSelected          = undefined,
		    onDateSelected                  = undefined,
		    day: daySnippet                 = undefined,
		    ...  restProps
	    }: Props = $props()

	let _rangeSelector                      = $state(new RangeOfDates())
	let _rangeSelectorMouseOver             = $state(new RangeOfDates())
	let _pickerView: Props["view"] | null   = $state(null)
	let _selectedDatesMouseOver: Date[]     = $state([])
	let _animationRunning: VerticalPosition = $state(VerticalPosition.Unset)

	const canBeAnimated             = $derived(animatePeriodChanges ?? (view !== "days" && view !== "years"))
	const calendarExtended          = $derived((value, new CalendarExtended(culture, pickerMonth)))
	const calendar: IFluentCalendar = $derived({
		view,
		calendarExtended,
		culture:                         culture,
		dayFormat,
		disabledCheckAllDaysOfMonthYear: false,
		disabledSelectable:              false,
		readOnly:                        readonly ?? false,
		selectMode,
		value:                           value,
		selectedDates:                   selectedDates,
		allDaysAreDisabled,
		disabledDateFunc:                disabledDateFunc || ((_d: Date) => false)
	})
	const titles                    = $derived(new CalendarTitles(calendar))
	const multipleSelection         = $derived(getMultipleSelection())
	const year                      = $derived(pickerMonth.getFullYear())

	function getMultipleSelection() {
		let inProgress = selectDatesHover !== null

		if (selectedDates == null || !selectedDates.length) {
			return {
				isMultiple: false,
				min:        new Date(0),
				max:        new Date(0),
				inProgress
			}
		}

		if (selectDatesHover === null) {
			inProgress = !_rangeSelector.isValid()
		} else {
			inProgress = _rangeSelectorMouseOver.isValid()
		}

		return {
			isMultiple: (selectMode == "multiple" || selectMode == "range") && selectedDates.length > 1,
			min:        selectedDates.reduce((acc, x) => !acc || x < acc ? x : acc),
			max:        selectedDates.reduce((acc, x) => !acc || x > acc ? x : acc),
			inProgress
		}
	}

	function getAnimationClass(existingClass: string) {
		if (!canBeAnimated) {
			return existingClass
		}

		switch (_animationRunning) {
			case VerticalPosition.Top:
				return `${existingClass} animation-running-up`
			case VerticalPosition.Bottom:
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
		await startNewAnimationAsync(VerticalPosition.Bottom)

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
	}

	async function onNextButtonHandlerAsync(e: MouseEvent) {
		await startNewAnimationAsync(VerticalPosition.Top)

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
	}

	async function onSelectDayHandlerAsync(value_: Date, dayDisabled: boolean) {
		if (!dayDisabled) {
			switch (selectMode) {
				// Single selection
				case "single":
					onDateSelected?.(value_)
					break

				// Multiple selection
				case "multiple":
					if (!selectDatesHover) {
						let newSelectedDates = Array.from(selectedDates)
						if (selectedDates.includes(value_)) {
							newSelectedDates = newSelectedDates.filter(i => i !== value_)
						} else {
							newSelectedDates.push(value_)
						}

						onDatesSelected?.(newSelectedDates)
					} else {
						const range   = selectDatesHover(value_)
						const newSelectedDates = range.filter(day => disabledDateFunc != null ? !disabledDateFunc(day) : true)

						onDatesSelected?.(newSelectedDates)
					}

					break

				// Range of dates
				case "range":

					const resetRange = (_rangeSelector.isValid() || _rangeSelector.isSingle()) && _rangeSelector.includes(value_)

					// Reset the selection
					if (resetRange) {
						_rangeSelector.clear()
						_rangeSelectorMouseOver.clear()
					}

					// End the selection
					else if (_rangeSelector.start !== null && _rangeSelector.end === null) {
						_rangeSelector.end = value_
					}

					// Start and close a pre-selection
					else if (selectDatesHover) {
						const range = selectDatesHover(value_)

						_rangeSelector.start = getSmallest(range)
						_rangeSelector.end   = getLargest(range)
					}

					// Start the selection
					else {
						_rangeSelector.start = value_
						_rangeSelector.end   = null

						await onSelectDayMouseOverAsync(value_, false)
					}

					const newSelectedDates = _rangeSelector
						.getAllDates()
						.filter(day => disabledDateFunc != null ? !disabledDateFunc(day) : true)

					onDatesSelected?.(newSelectedDates)
					break
			}
		}
	}

	async function onSelectDayMouseOverAsync(value: Date, dayDisabled: boolean) {
		if (dayDisabled ||
			selectMode === "single" ||
			(_rangeSelector.isSingle() && !selectDatesHover)) {
			return
		}

		if (!selectDatesHover) {
			_rangeSelectorMouseOver.start = _rangeSelector.start ?? value
			_rangeSelectorMouseOver.end   = value
		} else {
			const range                   = selectDatesHover(value)
			_rangeSelectorMouseOver.start = getSmallest(range)
			_rangeSelectorMouseOver.end   = getLargest(range)
		}

		_selectedDatesMouseOver = !disabledDateFunc
			? _rangeSelectorMouseOver.getAllDates()
			: _rangeSelectorMouseOver.getAllDates().filter(day => !disabledDateFunc(day))
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
		if (!disabledDateFunc) {
			return false
		}

		for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
			if (!disabledDateFunc(day)) {
				return false
			}
		}

		return true
	}

	function getDayProperties(day: Date) {
		return new CalendarDay(calendar, day)
	}

	function getMonthProperties(year?: number, month?: number) {
		return new CalendarMonth(calendar, new Date(year, month))
	}

	function getYearProperties(year?: number) {
		return new CalendarYear(calendar, new Date(year, 0, 1))
	}

	function pickerMonthSelectAsync(month?: Date) {
		pickerMonth = month ?? new Date()
		_pickerView = "days"
	}

	function pickerYearSelectAsync(year?: Date) {
		pickerMonth = year ?? new Date()
		_pickerView = "days"
	}

	async function startNewAnimationAsync(position: VerticalPosition) {
		if (!canBeAnimated) {
			return
		}

		_animationRunning = VerticalPosition.Unset
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
	{...restProps}
	class="{restProps.class || ''}"
	class:fluent-calendar={view === "days"}
	class:fluent-month={view === "months"}
	class:fluent-year={view === "years"}
>
	{#if !_pickerView || _pickerView === "days"}
		<div>
			<!-- Title bar (label, previous and next buttons) -->
			<div class="title" part="title" aria-label="{titles.label}">
				<div
					part="label" class={getAnimationClass('label')}
					role="button" tabindex="0"
					onclick={() => onTitleClicked(titles)}
					onkeydown={() => onTitleClicked(titles)}
				>
					{titles.label}
				</div>
				<div part="move" class="change-period">
					{#if titles.previousDisabled}
						<div class="previous" disabled="true"></div>
					{:else}
						<div
							class="previous" title="{titles.previousTitle}"
							role="button" tabindex="0"
							onclick={onPreviousButtonClicked}
							onkeydown={onPreviousButtonClicked}
						>
							{@render arrowUp()}
						</div>
					{/if}
					{#if titles.nextDisabled}
						<div class="next" disabled="true"></div>
					{:else}
						<div
							class="next" title="{titles.nextTitle}"
							role="button" tabindex="0"
							onclick={onNextButtonHandlerAsync}
							onkeydown={onNextButtonHandlerAsync}
						>
							{@render arrowDown()}
						</div>
					{/if}
				</div>
			</div>

			{#if view === "days"}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="days" part="days" onmouseleave={ev => _selectedDatesMouseOver = []}>
					<!-- Titles: Mon, Tue, ... -->
					<div class="week-days" part="week-days">
						{#each calendarExtended.getDayNames() as weekDay}
							<div class="week-day" part="week-day" title={weekDay.name} abbr={weekDay.name}>
								{weekDay.shorted}
							</div>
						{/each}
					</div>

					{#each {length: 5} as _, i}
						<!-- A week of 7 days -->
						<div class="week">
							{#each calendarExtended.getDaysOfWeek(i) as day}
								{@const dayProperties = getDayProperties(day)}

								<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
								<!-- svelte-ignore a11y_mouse_events_have_key_events -->
								<div
									part="day"
									class={getAnimationClass('day')}
									role={dayProperties.isDisabled || dayProperties.isInactive ? null : 'button'}
									tabindex={dayProperties.isDisabled || dayProperties.isInactive ? null : 0}
									disabled={dayProperties.isDisabled}
									inactive={dayProperties.isInactive}
									today={dayProperties.isToday}
									selected={dayProperties.isSelected}
									multi-day={dayProperties.isMultiDaySelected}
									multi-day-over={multipleSelection.inProgress && _selectedDatesMouseOver.includes(day)}
									multi-start={multipleSelection.isMultiple && selectMode === "range" && multipleSelection.min === day}
									multi-end={multipleSelection.isMultiple && selectMode === "range" && multipleSelection.max === day}
									aria-label={dayProperties.title}
									value={dayProperties.dayIdentifier}
									onkeydown={ev => onSelectDayHandlerAsync(day, dayProperties.isDisabled || dayProperties.isInactive || readonly || false)}
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
							selected={monthProperties.isSelected}
							readonly={monthProperties.isReadOnly}
							disabled={monthProperties.isDisabled}
							aria-label={monthProperties.title}
							title={monthProperties.title}
							value={monthProperties.monthIdentifier}
							role="button"
							tabindex={monthProperties.isDisabled || monthProperties.isReadOnly ? null : 0}
							onkeydown={ev => onSelectMonthHandlerAsync(year, month.index, monthProperties.isReadOnly)}
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
							selected={yearProperties.isSelected}
							readonly={yearProperties.isReadOnly}
							disabled={yearProperties.isDisabled}
							aria-label={year.year}
							title={year.year}
							value={yearProperties.yearIdentifier}
							tabindex={yearProperties.isDisabled || yearProperties.isReadOnly ? null : 0}
							onkeydown={ev => onSelectYearHandlerAsync(year.year, yearProperties.isReadOnly)}
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
			View="months"
			Value={pickerMonth}
			ValueChanged={pickerMonthSelectAsync}
			CheckIfSelectedValueHasChanged={false}
			{readonly}
			{culture}
			disabledSelectable={disabledCheckAllDaysOfMonthYear}
			{animatePeriodChanges}
			disabledCheckAllDaysOfMonthYear={disabledCheckAllDaysOfMonthYear}
			{disabledDateFunc}
		/>
	{/if}

	{#if _pickerView === "years"}
		<Calendar
			view="years"
			value={pickerMonth}
			valueChanged={pickerYearSelectAsync}
			checkIfSelectedValueHasChanged={false}
			{readonly}
			{culture}
			disabledSelectable={disabledSelectable}
			{animatePeriodChanges}
			disabledCheckAllDaysOfMonthYear={disabledCheckAllDaysOfMonthYear}
			{disabledDateFunc}
		/>
	{/if}
</div>
