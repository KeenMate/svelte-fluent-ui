<script lang="ts">
	import {DatePicker, Card, Stack, Button, Grid, GridItem, QuickGrid} from "svelte-fluentui"

	let basicDate = $state<Date | null>(new Date())
	let minMaxDate = $state<Date | null>(null)
	let customFormatDate = $state<Date | null>(new Date())
	let disabledDate = $state<Date | null>(new Date())
	let weekdaysOnlyDate = $state<Date | null>(null)
	let customDayDate = $state<Date | null>(null)
	let pickerMonthLabel = $state<string>("")
	let pickerMonthDate = $state<Date | null>(null)

	// Highlight every 1st and 15th of the month in the custom-day example.
	function isPayday(d: Date) {
		const day = d.getDate()
		return day === 1 || day === 15
	}

	// Min and max dates (last 30 days)
	const today = new Date()
	const minDate = new Date(today)
	minDate.setDate(today.getDate() - 30)
	const maxDate = new Date(today)
	maxDate.setDate(today.getDate() + 30)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "Date | null", default: "null", description: "The currently selected date. Supports two-way binding with bind:value."},
		{name: "placeholder", type: "string", default: '"Select a date"', description: "Placeholder text shown in the text field when no date is selected."},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the date picker, preventing interaction."},
		{name: "readonly", type: "boolean", default: "false", description: "Makes the date picker read-only; calendar cannot be opened."},
		{name: "required", type: "boolean", default: "false", description: "Marks the field as required, showing a * indicator next to the label."},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Automatically focuses the input on mount."},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the input field."},
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance of the text field (e.g. 'outline', 'filled-darker')."},
		{name: "culture", type: "Intl.Locale", default: "navigator.language", description: "Locale used for date formatting and calendar display."},
		{name: "dateFormat", type: "Intl.DateTimeFormatOptions", default: '{ year: "numeric", month: "long", day: "numeric" }', description: "Format options passed to Intl.DateTimeFormat to control how the selected date is displayed."},
		{name: "minDate", type: "Date", default: "undefined", description: "Minimum selectable date. Dates before this are disabled in the calendar."},
		{name: "maxDate", type: "Date", default: "undefined", description: "Maximum selectable date. Dates after this are disabled in the calendar."},
		{name: "disabledDateFunc", type: "(date: Date) => boolean", default: "undefined", description: "Custom predicate marking a date as disabled. Composes with minDate/maxDate and selectableDates."},
		{name: "selectableDates", type: "(date: Date) => boolean", default: "undefined", description: "Inverse of disabledDateFunc — return true to allow a date. Composes with the other date filters."},
		{name: "disabledSelectable", type: "boolean", default: "undefined", description: "When true, disabled days still receive disabled styling rather than being hidden."},
		{name: "disabledCheckAllDaysOfMonthYear", type: "boolean", default: "undefined", description: "When true, a month/year is treated as disabled only if every day inside it is disabled."},
		{name: "dayFormat", type: '"two_digit" | null', default: "undefined", description: 'Day cell format. "two_digit" renders "01" instead of "1".'},
		{name: "animatePeriodChanges", type: "boolean", default: "undefined", description: "Animate transitions between months/years inside the popup. By default only the Months view animates."},
		{name: "firstDayOfWeek", type: "number | null", default: "undefined", description: "First day of the week (0=Sunday … 6=Saturday). Overrides the culture default."},
		{name: "autoClose", type: "boolean", default: "true", description: "When true, the popup closes immediately after a date is picked."},
		{name: "open", type: "boolean", default: "false", description: "Bindable open state of the calendar popup."},
		{name: "openCalendarIconAriaLabel", type: "string", default: '"Open calendar"', description: "ARIA label for the calendar trigger button."},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names applied to the root element."},
		{name: "style", type: "string", default: '""', description: "Inline styles applied to the root element."},
	]

	const callbacks: Property[] = [
		{name: "onValueChange", type: "(value: Date | null) => void", default: "undefined", description: "Called when the selected date changes, either by calendar selection or manual text entry. Receives the new Date value or null when cleared."},
		{name: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Called when the calendar popup opens or closes."},
		{name: "onPickerMonthChange", type: "(month: Date) => void", default: "undefined", description: "Called when the user navigates to a different month/year inside the popup."},
	]

	const slots: Property[] = [
		{name: "day", type: "Snippet<[CalendarDay]>", default: "undefined", description: "Custom render for each day cell. Receives the CalendarDay properties (dayNumber, isToday, isSelected, isDisabled, isInactive, title, etc.)."},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content rendered above the input. Used alongside or instead of the `label` string."},
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true},
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>DatePicker</h1>

	<p>
		A date selection component with calendar popup, date validation, and custom formatting options.
		Inspired by the FluentUI Blazor DatePicker component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/DatePicker" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>

		<h3>Basic DatePicker</h3>
		<p>A simple date picker with default settings.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={basicDate}
				label="Select a date"
				placeholder="Choose a date"
			/>
			<p style="margin: 0;">Selected: {basicDate ? basicDate.toLocaleDateString() : 'None'}</p>
		</Stack>

		<h3>DatePicker with Min/Max Dates</h3>
		<p>Date picker with restricted date range (last 30 days to next 30 days from today).</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={minMaxDate}
				label="Select a date (restricted range)"
				placeholder="Choose a date"
				minDate={minDate}
				maxDate={maxDate}
			/>
			<p style="margin: 0;">Selected: {minMaxDate ? minMaxDate.toLocaleDateString() : 'None'}</p>
			<p style="margin: 0; font-size: 0.875rem; color: var(--neutral-foreground-hint);">
				Valid range: {minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()}
			</p>
		</Stack>

		<h3>DatePicker with Custom Format</h3>
		<p>Date picker with custom date formatting options.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={customFormatDate}
				label="Custom date format"
				placeholder="Choose a date"
				dateFormat={{ weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }}
			/>
			<p style="margin: 0;">Selected: {customFormatDate ? customFormatDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) : 'None'}</p>
		</Stack>

		<h3>DatePicker with selectableDates (weekdays only)</h3>
		<p>Inverse of <code>disabledDateFunc</code> — return <code>true</code> for dates the user is allowed to pick. Here we only allow Mon–Fri.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={weekdaysOnlyDate}
				label="Weekdays only"
				placeholder="Mon–Fri"
				selectableDates={(d) => d.getDay() !== 0 && d.getDay() !== 6}
			/>
			<p style="margin: 0;">Selected: {weekdaysOnlyDate ? weekdaysOnlyDate.toLocaleDateString() : 'None'}</p>
		</Stack>

		<h3>DatePicker with custom day snippet</h3>
		<p>Use the <code>day</code> snippet to render day cells yourself. The snippet receives the <code>CalendarDay</code> properties. This example puts a dot under paydays (1st and 15th of each month).</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={customDayDate}
				label="Paydays highlighted"
				placeholder="Choose a date"
			>
				{#snippet day(d: any)}
					<div style="display: flex; flex-direction: column; align-items: center; line-height: 1;">
						<span>{d.dayNumber}</span>
						{#if isPayday(d.date)}
							<span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-fill-rest); margin-top: 2px;"></span>
						{/if}
					</div>
				{/snippet}
			</DatePicker>
			<p style="margin: 0;">Selected: {customDayDate ? customDayDate.toLocaleDateString() : 'None'}</p>
		</Stack>

		<h3>DatePicker with onPickerMonthChange</h3>
		<p>Subscribe to month/year navigation inside the popup — useful for prefetching events, syncing two calendars, etc.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				bind:value={pickerMonthDate}
				label="Watch the displayed month"
				placeholder="Open and navigate"
				onPickerMonthChange={(m) => pickerMonthLabel = m.toLocaleDateString(undefined, {year: 'numeric', month: 'long'})}
			/>
			<p style="margin: 0;">Currently viewing: {pickerMonthLabel || '(open the popup and click ▲/▼)'}</p>
		</Stack>

		<h3>DatePicker with two-digit day format</h3>
		<p>Render day cells as "01" instead of "1".</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				label="Two-digit days"
				placeholder="Choose a date"
				dayFormat="two_digit"
			/>
		</Stack>

		<h3>DatePicker States</h3>
		<p>Date pickers in different states.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				label="Normal"
				placeholder="Select a date"
			/>

			<DatePicker
				label="Disabled"
				placeholder="Select a date"
				disabled={true}
			/>

			<DatePicker
				label="Readonly"
				placeholder="Select a date"
				readonly={true}
				bind:value={disabledDate}
			/>

			<DatePicker
				label="Required"
				placeholder="Select a date"
				required={true}
			/>
		</Stack>

		<h3>DatePicker with Different Appearances</h3>
		<p>Date pickers with different visual styles.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<DatePicker
				label="Filled (default)"
				placeholder="Select a date"
			/>

			<DatePicker
				label="Outline"
				placeholder="Select a date"
				appearance="outline"
			/>
		</Stack>
	</Card>
</Stack>
