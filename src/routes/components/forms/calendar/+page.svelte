<script lang="ts">
	import {Calendar} from "$lib/index.js"

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
</script>

<div class="header">
	<h1>Calendar</h1>
</div>

<div class="content">
	<div class="tw:flex tw:flex-wrap tw:gap-2">
		<div class="tw:flex-1">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
				<tr class="property">
					<td colspan="5">Members</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>value</td>
					<td>Date | null | undefined</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>selectedDates</td>
					<td>Date[] | undefined</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>pickerMonth</td>
					<td>number | Date</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>culture</td>
					<td>Intl.Locale</td>
					<td>new Intl.Locale(window.navigator.language)</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>view</td>
					<td>CalendarView = "days" | "months" | "years"</td>
					<td>"days"</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>selectMode</td>
					<td>CalendarSelectMode = "single" | "multiple" | "range"</td>
					<td>"single"</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>checkIfSelectedValueHasChanged</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>disabledDateFunc</td>
					<td>(date: Date) => boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>disabledCheckAllDaysOfMonthYear</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>animatePeriodChanges</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>disabledSelectable</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>dayFormat</td>
					<td>string</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>readonly</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>selectDatesHover</td>
					<td>(date: Date) => Date[]</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="slot">
					<td colspan="5">Slots</td>
				</tr>
				<tr class="slot">
					<td></td>
					<td>day</td>
					<td>SlotType</td>
					<td>undefined</td>
					<td></td>
				</tr>
				</tbody>
			</table>
		</div>
		<div class="tw:flex-1">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
				<tbody>
				<tr class="action">
					<td colspan="4">Actions</td>
				</tr>
				<tr class="action">
					<td></td>
					<td>onSelectedDatesChanged</td>
					<td>(values: Date[]) => void;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>onDateSelected</td>
					<td>(value: Date) => void;</td>
					<td></td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>

	<div class="tw:flex tw:flex-wrap tw:gap-1">
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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

	<div class="tw:flex tw:flex-wrap tw:gap-1">
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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
</div>
