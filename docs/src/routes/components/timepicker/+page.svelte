<script lang="ts">
	import {TimePicker, Card, Stack, Grid, GridItem, QuickGrid} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string | null", default: "null", description: "The selected time value in HH:mm or HH:mm:ss format. Bindable."},
		{name: "placeholder", type: "string", default: '"Select time"', description: "Placeholder text shown in the input when no time is selected."},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the time picker, preventing user interaction."},
		{name: "readonly", type: "boolean", default: "false", description: "Makes the time picker read-only; the popup cannot be opened."},
		{name: "required", type: "boolean", default: "false", description: "Marks the field as required, showing a * indicator next to the label."},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Automatically focuses the input on mount."},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the time picker input."},
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance of the underlying TextField (e.g. 'outline', 'filled-lighter')."},
		{name: "use24Hours", type: "boolean", default: "true", description: "When true, uses 24-hour format. When false, uses 12-hour format with AM/PM selector."},
		{name: "showSeconds", type: "boolean", default: "false", description: "When true, shows a seconds column in the time picker popup."},
		{name: "minuteStep", type: "number", default: "1", description: "Step interval for the minutes column (e.g. 15 shows 00, 15, 30, 45)."},
		{name: "hourStep", type: "number", default: "1", description: "Step interval for the hours column."},
		{name: "secondStep", type: "number", default: "1", description: "Step interval for the seconds column."},
		{name: "minTime", type: "string", default: "undefined", description: "Minimum allowed time in HH:mm or HH:mm:ss format."},
		{name: "maxTime", type: "string", default: "undefined", description: "Maximum allowed time in HH:mm or HH:mm:ss format."},
		{name: "disabledTimeFunc", type: "(h, m, s) => boolean", default: "undefined", description: "Custom predicate marking a specific (h, m, s) triplet as disabled. Composes with minTime/maxTime and disabledTimes."},
		{name: "disabledTimes", type: "string[]", default: "undefined", description: 'Convenience shorthand for booked / blocked slots, e.g. ["10:15", "10:30"]. Composes with disabledTimeFunc.'},
		{name: "autoClose", type: "boolean", default: "true", description: "When true, the popup closes when the user clicks OK."},
		{name: "openOnInputClick", type: "boolean", default: "true", description: "When true, clicking anywhere on the input area opens the popup (matching FluentUI Blazor). Set false to require clicking the clock icon."},
		{name: "open", type: "boolean", default: "false", description: "Bindable open state of the popup."},
		{name: "useAmPm", type: "boolean | null", default: "undefined", description: "When set, forces AM/PM on (true) or off (false). Overrides use24Hours."},
		{name: "class", type: "string", default: '""', description: "Additional CSS class names applied to the root element."},
		{name: "style", type: "string", default: '""', description: "Inline styles applied to the root element."}
	]

	const callbacks: Property[] = [
		{name: "onValueChange", type: "(value: string | null) => void", default: "undefined", description: "Called when the user confirms a time selection or clears the value. Receives the new time string (HH:mm or HH:mm:ss) or null if cleared."}
	]

	const slots: Property[] = []

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	let basicTime = $state<string | null>("14:30")
	let time12Hour = $state<string | null>("02:30")
	let timeWithSeconds = $state<string | null>("14:30:45")
	let timeWithSteps = $state<string | null>("09:00")
	let disabledTime = $state<string | null>("12:00")
	let bookingTime = $state<string | null>("10:00")
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="TimePicker"
		description="Svelte time selection with hour, minute, and second pickers, 12/24-hour format support, and custom step intervals. Inspired by FluentUI Blazor."
		keywords="svelte, fluentui, timepicker, time picker, time, form, input"
	/>

	<h1>TimePicker</h1>

	<p>
		A time selection component with hour/minute/second picker, 12/24-hour format support, and custom step intervals.
		Inspired by the FluentUI Blazor TimePicker component.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/DateTime"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic TimePicker (24-hour format)</h3>
		<p>A simple time picker with 24-hour format.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				bind:value={basicTime}
				label="Select time"
				placeholder="Choose a time"
				use24Hours={true}
			/>
			<p style="margin: 0;">Selected: {basicTime || 'None'}</p>
		</Stack>

		<h3>TimePicker (12-hour format with AM/PM)</h3>
		<p>Time picker with 12-hour format and AM/PM selector.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				bind:value={time12Hour}
				label="Select time"
				placeholder="Choose a time"
				use24Hours={false}
			/>
			<p style="margin: 0;">Selected: {time12Hour || 'None'}</p>
		</Stack>

		<h3>TimePicker with Seconds</h3>
		<p>Time picker that includes seconds selection.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				bind:value={timeWithSeconds}
				label="Select time with seconds"
				placeholder="Choose a time"
				use24Hours={true}
				showSeconds={true}
			/>
			<p style="margin: 0;">Selected: {timeWithSeconds || 'None'}</p>
		</Stack>

		<h3>TimePicker with Custom Steps</h3>
		<p>Time picker with 15-minute intervals and 2-hour steps.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				bind:value={timeWithSteps}
				label="Select time (15-min intervals)"
				placeholder="Choose a time"
				use24Hours={true}
				minuteStep={15}
				hourStep={2}
			/>
			<p style="margin: 0;">Selected: {timeWithSteps || 'None'}</p>
		</Stack>

		<h3>TimePicker with disabled slots (booking-style)</h3>
		<p>
			15-minute slots in the 9–12 window. <code>disabledTimes</code> blocks specific slots already booked
			(here: 10:15 and 10:30). The hour column also dims an hour when no valid minute remains for it
			under the current other-column choices.
		</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				bind:value={bookingTime}
				label="Pick a free slot"
				placeholder="HH:mm"
				use24Hours={true}
				minuteStep={15}
				minTime="09:00"
				maxTime="12:00"
				disabledTimes={["10:15", "10:30", "11:45"]}
			/>
			<p style="margin: 0;">Selected: {bookingTime || 'None'}</p>
		</Stack>

		<h3>TimePicker States</h3>
		<p>Time pickers in different states.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				label="Normal"
				placeholder="Select a time"
				use24Hours={true}
			/>

			<TimePicker
				label="Disabled"
				placeholder="Select a time"
				use24Hours={true}
				disabled={true}
			/>

			<TimePicker
				label="Readonly"
				placeholder="Select a time"
				use24Hours={true}
				readonly={true}
				bind:value={disabledTime}
			/>

			<TimePicker
				label="Required"
				placeholder="Select a time"
				use24Hours={true}
				required={true}
			/>
		</Stack>

		<h3>TimePicker with Different Appearances</h3>
		<p>Time pickers with different visual styles.</p>

		<Stack orientation="vertical" gap="1rem" style="max-width: 400px;">
			<TimePicker
				label="Filled (default)"
				placeholder="Select a time"
				use24Hours={true}
			/>

			<TimePicker
				label="Outline"
				placeholder="Select a time"
				use24Hours={true}
				appearance="outline"
			/>
		</Stack>
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
</Stack>
