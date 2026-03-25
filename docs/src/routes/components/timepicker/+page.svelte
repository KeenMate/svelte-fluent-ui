<script lang="ts">
	import {TimePicker, Card, Stack, Grid, GridItem, QuickGrid} from "svelte-fluentui"

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
		{name: "class", type: "string", default: '""', description: "Additional CSS class names applied to the root element."},
		{name: "style", type: "string", default: '""', description: "Inline styles applied to the root element."}
	]

	const callbacks: Property[] = [
		{name: "onValueChange", type: "(value: string | null) => void", default: "undefined", description: "Called when the user confirms a time selection or clears the value. Receives the new time string (HH:mm or HH:mm:ss) or null if cleared."}
	]

	const slots: Property[] = [
		{name: "(none)", type: "-", default: "-", description: "TimePicker has no public slots. Internal slots are used for the clock icon and clear button inside the TextField."}
	]

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
</script>

<h1>TimePicker</h1>

<p>
	A time selection component with hour/minute/second picker, 12/24-hour format support, and custom step intervals.
	Inspired by the FluentUI Blazor TimePicker component.
</p>

<Card>
	<h3>Reference</h3>
	<p>
		<strong>FluentUI Web Components:</strong> N/A (custom implementation)<br/>
		<strong>FluentUI Blazor:</strong> <a href="https://www.fluentui-blazor.net/TimePicker" target="_blank" rel="noopener noreferrer">FluentTimePicker</a>
	</p>
</Card>

<h2>API</h2>

<Grid spacing={3}>
	<GridItem xs={12} xl={6} xxl={4}>
		<Card>
			<h3>Properties</h3>
			<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
		</Card>
	</GridItem>
	<GridItem xs={12} xl={6} xxl={4}>
		<Card>
			<h3>Callbacks</h3>
			<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
		</Card>
	</GridItem>
	<GridItem xs={12} xl={6} xxl={4}>
		<Card>
			<h3>Slots</h3>
			<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
		</Card>
	</GridItem>
</Grid>

<h2>Examples</h2>

<!-- Basic TimePicker (24-hour) -->
<Card>
	<h3>Basic TimePicker (24-hour format)</h3>
	<p>A simple time picker with 24-hour format.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
		<TimePicker
			bind:value={basicTime}
			label="Select time"
			placeholder="Choose a time"
			use24Hours={true}
		/>
		<p style="margin: 0;">Selected: {basicTime || 'None'}</p>
	</Stack>
</Card>

<!-- TimePicker 12-hour format -->
<Card>
	<h3>TimePicker (12-hour format with AM/PM)</h3>
	<p>Time picker with 12-hour format and AM/PM selector.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
		<TimePicker
			bind:value={time12Hour}
			label="Select time"
			placeholder="Choose a time"
			use24Hours={false}
		/>
		<p style="margin: 0;">Selected: {time12Hour || 'None'}</p>
	</Stack>
</Card>

<!-- TimePicker with Seconds -->
<Card>
	<h3>TimePicker with Seconds</h3>
	<p>Time picker that includes seconds selection.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
		<TimePicker
			bind:value={timeWithSeconds}
			label="Select time with seconds"
			placeholder="Choose a time"
			use24Hours={true}
			showSeconds={true}
		/>
		<p style="margin: 0;">Selected: {timeWithSeconds || 'None'}</p>
	</Stack>
</Card>

<!-- TimePicker with Custom Steps -->
<Card>
	<h3>TimePicker with Custom Steps</h3>
	<p>Time picker with 15-minute intervals and 2-hour steps.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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
</Card>

<!-- TimePicker States -->
<Card>
	<h3>TimePicker States</h3>
	<p>Time pickers in different states.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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
</Card>

<!-- TimePicker with Different Appearances -->
<Card>
	<h3>TimePicker with Different Appearances</h3>
	<p>Time pickers with different visual styles.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 2rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
	}
</style>
