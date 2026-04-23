<script lang="ts">
	import {DatePicker, Card, Stack, Button, Grid, GridItem, QuickGrid} from "svelte-fluentui"

	let basicDate = $state<Date | null>(new Date())
	let minMaxDate = $state<Date | null>(null)
	let customFormatDate = $state<Date | null>(new Date())
	let disabledDate = $state<Date | null>(new Date())

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
		{name: "class", type: "string", default: '""', description: "Additional CSS class names applied to the root element."},
		{name: "style", type: "string", default: '""', description: "Inline styles applied to the root element."},
	]

	const callbacks: Property[] = [
		{name: "onValueChange", type: "(value: Date | null) => void", default: "undefined", description: "Called when the selected date changes, either by calendar selection or manual text entry. Receives the new Date value or null when cleared."},
	]

	const slots: Property[] = []

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
