<script lang="ts">
	import {TimePicker, Card, Stack} from "$lib/index.js"

	let basicTime = $state<string | null>("14:30")
	let time12Hour = $state<string | null>("02:30")
	let timeWithSeconds = $state<string | null>("14:30:45")
	let timeWithSteps = $state<string | null>("09:00")
	let disabledTime = $state<string | null>("12:00")
</script>

<h1>TimePicker</h1>

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
