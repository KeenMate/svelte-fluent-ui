<script lang="ts">
	import {DatePicker, Card, Stack, Button} from "$lib/index.js"

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
</script>

<h1>DatePicker</h1>

<h2>Examples</h2>

<!-- Basic DatePicker -->
<Card>
	<h3>Basic DatePicker</h3>
	<p>A simple date picker with default settings.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
		<DatePicker
			bind:value={basicDate}
			label="Select a date"
			placeholder="Choose a date"
		/>
		<p style="margin: 0;">Selected: {basicDate ? basicDate.toLocaleDateString() : 'None'}</p>
	</Stack>
</Card>

<!-- DatePicker with Min/Max -->
<Card>
	<h3>DatePicker with Min/Max Dates</h3>
	<p>Date picker with restricted date range (last 30 days to next 30 days from today).</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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
</Card>

<!-- DatePicker with Custom Format -->
<Card>
	<h3>DatePicker with Custom Format</h3>
	<p>Date picker with custom date formatting options.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
		<DatePicker
			bind:value={customFormatDate}
			label="Custom date format"
			placeholder="Choose a date"
			dateFormat={{ weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }}
		/>
		<p style="margin: 0;">Selected: {customFormatDate ? customFormatDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) : 'None'}</p>
	</Stack>
</Card>

<!-- DatePicker States -->
<Card>
	<h3>DatePicker States</h3>
	<p>Date pickers in different states.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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
</Card>

<!-- DatePicker with Different Appearances -->
<Card>
	<h3>DatePicker with Different Appearances</h3>
	<p>Date pickers with different visual styles.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem; max-width: 400px;">
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
