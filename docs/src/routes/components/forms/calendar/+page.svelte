<script lang="ts">
	import {Calendar, Stack, Grid, GridItem, Card, QuickGrid, Alert} from "svelte-fluentui"
	import type {CalendarSelectionError} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"
	import {tick} from "svelte"

	const now                     = new Date()
	const disabledDates: string[] = [
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9)),
		toDateISOString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10)),
	]

	let value       = $state(new Date(2025, 5, 4))
	let values      = $state([new Date(2025, 5, 4)])
	let pickerMonth = $state(new Date())

	// SelectOneWeek + Select3Days demos
	let weekValues       = $state<Date[]>([])
	let threeDayValues   = $state<Date[]>([])
	let threeDayHovered  = $state<Date | null>(null)
	let maxFiveValues    = $state<Date[]>([])
	let maxFiveError     = $state<CalendarSelectionError | null>(null)
	let maxFiveAlertShown = $state(false)

	function selectOneWeek(date: Date): Date[] {
		const day     = date.getDay()
		const diff    = day === 0 ? -6 : 1 - day
		const monday  = new Date(date)
		monday.setDate(date.getDate() + diff)
		const week: Date[] = []
		for (let i = 0; i < 7; i++) {
			const d = new Date(monday)
			d.setDate(monday.getDate() + i)
			week.push(d)
		}
		return week
	}

	function selectThreeDays(date: Date): Date[] {
		const result: Date[] = []
		for (let i = -1; i <= 1; i++) {
			const d = new Date(date)
			d.setDate(date.getDate() + i)
			result.push(d)
		}
		return result
	}

	async function handleMaxFiveError(error: CalendarSelectionError) {
		maxFiveError = error
		// Force remount so a previously-dismissed Alert reappears.
		maxFiveAlertShown = false
		await tick()
		maxFiveAlertShown = true
	}

	function toDateISOString(date: Date): string {
		return date.toISOString().substring(0, 11)
	}

	function getIsDateDisabled(date: Date): boolean {
		return disabledDates.includes(toDateISOString(date))
	}

	function onDateSelected(date: Date) {
		value = date
	}

	function onDatesSelected(dates: Date[]) {
		values = dates
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "Date | null", default: "undefined", description: "Selected date value (bindable)"},
		{name: "selectedDates", type: "Date[]", default: "undefined", description: "Selected dates for multi/range mode (bindable)"},
		{name: "pickerMonth", type: "Date", default: "new Date()", description: "Currently displayed month (bindable)"},
		{name: "culture", type: "Intl.Locale", default: "navigator.language", description: "Locale for formatting"},
		{name: "view", type: '"days" | "months" | "years"', default: '"days"', description: "Calendar view mode"},
		{name: "selectMode", type: '"single" | "multiple" | "range"', default: '"single"', description: "Selection mode"},
		{name: "checkIfSelectedValueHasChanged", type: "boolean", default: "false", description: "Verify value changes before updating"},
		{name: "disabledDateFunc", type: "(date: Date) => boolean", default: "undefined", description: "Function to disable specific dates"},
		{name: "disabledCheckAllDaysOfMonthYear", type: "boolean", default: "false", description: "Check all days when disabling"},
		{name: "animatePeriodChanges", type: "boolean", default: "false", description: "Animate month/year transitions"},
		{name: "disabledSelectable", type: "boolean", default: "false", description: "Allow selecting disabled dates"},
		{name: "dayFormat", type: "string", default: "undefined", description: "Custom day number format"},
		{name: "readonly", type: "boolean", default: "false", description: "Blocks day/month/year/title interaction without visual de-emphasis. ARIA: sets aria-readonly on the host."},
		{name: "disabled", type: "boolean", default: "false", description: "Blocks interaction AND visually de-emphasizes the whole calendar (reduced opacity, not-allowed cursor on interactive cells). ARIA: sets aria-disabled on the host."},
		{name: "highlightDates", type: "(date: Date) => Date[]", default: "undefined", description: "Hover-preview function — returns the dates to visually highlight when the cursor is over a day"},
		{name: "selectDates", type: "(date: Date) => Date[]", default: "undefined", description: "Click-selection function — returns the dates to select on click. Multiple mode unions with existing; range mode replaces"},
		{name: "maxSelectableDays", type: "number", default: "undefined", description: "Upper bound on selected dates (multiple/range). Exceeding fires onSelectionError and leaves the selection untouched"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onDatesSelected", type: "(values: Date[]) => void", default: "undefined", description: "Fires when selected dates change (multi/range)"},
		{name: "onDateSelected", type: "(value: Date) => void", default: "undefined", description: "Fires when a date is selected (single)"},
		{name: "onSelectionError", type: "(error: CalendarSelectionError) => void", default: "undefined", description: "Fires when an attempted selection would exceed maxSelectableDays"},
		{name: "onPickerMonthChange", type: "(month: Date) => void", default: "undefined", description: "Fires when the user navigates months/years"},
		{name: "onDayHover", type: "(date: Date | null) => void", default: "undefined", description: "Fires when the cursor enters a day cell (date) or leaves the day grid (null)"}
	]

	const slots: Property[] = [
		{name: "day", type: "SlotType", default: "undefined", description: ""}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Calendar"
		description="Inline date picker for Svelte with single, multiple, and range selection modes, disabled-date rules, and localized formatting. Inspired by FluentUI Blazor."
		keywords="svelte, fluentui, calendar, date picker, range, multi-select, form"
	/>

	<h1>Calendar</h1>

	<p>
		A date picker displayed inline, with single, multiple, and range selection modes, disabled date rules, and
		localized formatting. Inspired by the FluentUI Blazor Calendar component.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Calendar"}
	]} />

	<Card>
		<h2>Examples</h2>

	<div class="calendar-examples">
		<div class="calendar-item">
			<h3>Plain calendar</h3>
			<p>
				Selected {value.toLocaleDateString()}
			</p>
			<Calendar
				bind:pickerMonth
				{value}
				disabledDateFunc={getIsDateDisabled}
				{onDateSelected}
			/>
		</div>
		<div class="calendar-item">
			<h3>Months calendar</h3>
			<p>
				Selected {value.toLocaleDateString()}
			</p>
			<Calendar
				bind:pickerMonth
				{value}
				view="months"
				disabledDateFunc={getIsDateDisabled}
				{onDateSelected}
			/>
		</div>
		<div class="calendar-item">
			<h3>Years calendar</h3>
			<p>
				Selected {value.toLocaleDateString()}
			</p>
			<Calendar
				bind:pickerMonth
				{value}
				view="years"
				disabledDateFunc={getIsDateDisabled}
				{onDateSelected}
			/>
		</div>
	</div>

	<div class="calendar-examples">
		<div class="calendar-item">
			<h3>Range calendar</h3>
			<Calendar
				bind:pickerMonth
				selectedDates={values}
				selectMode="range"
				disabledDateFunc={getIsDateDisabled}
				{onDatesSelected}
			/>
			<p>Selected</p>
			<ul>
				{#each values as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>
		<div class="calendar-item">
			<h3>Multiple selection calendar</h3>
			<Calendar
				bind:pickerMonth
				selectedDates={values}
				selectMode="multiple"
				disabledDateFunc={getIsDateDisabled}
				{onDatesSelected}
			/>
			<p>Selected</p>
			<ul>
				{#each values as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>
		<div class="calendar-item"></div>
	</div>

	<div class="calendar-examples">
		<div class="calendar-item">
			<h3>Range with "SelectOneWeek"</h3>
			<Calendar
				bind:pickerMonth
				selectedDates={weekValues}
				selectMode="range"
				disabledDateFunc={getIsDateDisabled}
				highlightDates={selectOneWeek}
				selectDates={selectOneWeek}
				onDatesSelected={(dates) => weekValues = dates}
			/>
			<p>Selected</p>
			<ul>
				{#each weekValues as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>

		<div class="calendar-item">
			<h3>Multiple (max 5 days)</h3>
			{#if maxFiveAlertShown && maxFiveError}
				<Alert
					intent="danger"
					dismissable
					ondismiss={() => maxFiveAlertShown = false}
					style="margin-bottom: 0.5rem;"
				>
					{maxFiveError.message}
				</Alert>
			{/if}
			<Calendar
				bind:pickerMonth
				selectedDates={maxFiveValues}
				selectMode="multiple"
				maxSelectableDays={5}
				disabledDateFunc={getIsDateDisabled}
				onDatesSelected={(dates) => maxFiveValues = dates}
				onSelectionError={handleMaxFiveError}
			/>
			<p>Selected</p>
			<ul>
				{#each maxFiveValues as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>

		<div class="calendar-item">
			<h3>Multiple with "Select3Days"</h3>
			<Calendar
				bind:pickerMonth
				selectedDates={threeDayValues}
				selectMode="multiple"
				disabledDateFunc={getIsDateDisabled}
				highlightDates={selectThreeDays}
				selectDates={selectThreeDays}
				onDatesSelected={(dates) => threeDayValues = dates}
				onDayHover={(date) => threeDayHovered = date}
			/>
			<p>Hovering: {threeDayHovered ? threeDayHovered.toLocaleDateString() : "—"}</p>
			<p>Selected</p>
			<ul>
				{#each threeDayValues as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>
	</div>

	<h3>Calendar states</h3>
	<p>
		<code>readonly</code> blocks day/month/year/title interaction without visual de-emphasis (the calendar
		still looks "live", but clicks are ignored). <code>disabled</code> additionally fades the whole control
		to <code>--disabled-opacity</code> and switches interactive cells to <code>cursor: not-allowed</code>,
		matching the convention of other form inputs.
	</p>

	<div class="calendar-examples">
		<div class="calendar-item">
			<h3>Normal</h3>
			<Calendar
				bind:pickerMonth
				{value}
				{onDateSelected}
			/>
		</div>
		<div class="calendar-item">
			<h3>Readonly</h3>
			<Calendar
				bind:pickerMonth
				{value}
				readonly={true}
				{onDateSelected}
			/>
		</div>
		<div class="calendar-item">
			<h3>Disabled</h3>
			<Calendar
				bind:pickerMonth
				{value}
				disabled={true}
				{onDateSelected}
			/>
		</div>
	</div>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>Callbacks</h2>
					<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.calendar-examples {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.calendar-item {
		flex: 1;
	}
</style>
