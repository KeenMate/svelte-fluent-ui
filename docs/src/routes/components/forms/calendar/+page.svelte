<script lang="ts">
	import {Calendar, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"
	import {References} from "$lib/components"

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
		{name: "readonly", type: "boolean", default: "false", description: "Read-only mode"},
		{name: "selectDatesHover", type: "(date: Date) => Date[]", default: "undefined", description: "Highlight dates on hover"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onSelectedDatesChanged", type: "(values: Date[]) => void", default: "undefined", description: "Fires when selected dates change (multi/range)"},
		{name: "onDateSelected", type: "(value: Date) => void", default: "undefined", description: "Fires when a date is selected (single)"}
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
				{onDateSelected}
			/>
			<p>Selected</p>
			<ul>
				{#each values as date}
					<li>{date.toLocaleDateString()}</li>
				{/each}
			</ul>
		</div>
		<div class="calendar-item">
			<!--<h3>Years calendar</h3>-->
			<!--<p>-->
			<!--	Selected {value.toLocaleDateString()}-->
			<!--</p>-->
			<!--<Calendar-->
			<!--	bind:pickerMonth-->
			<!--	{value}-->
			<!--	view="years"-->
			<!--	disabledDateFunc={getIsDateDisabled}-->
			<!--	{onDateSelected}-->
			<!--/>-->
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
