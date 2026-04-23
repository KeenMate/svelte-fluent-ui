<script lang="ts">
	import {Radio, RadioGroup, Stack, Grid, GridItem, Card, QuickGrid, Toolbar, Button} from "svelte-fluentui"

	// State for examples
	let numbersValue = $state<string | null>(null)
	let stringsValue = $state<string | null>(null)
	let readonlyValue = $state<string | null>("word")
	let disabledValue = $state<string | null>(null)
	let labelOutsideValue = $state<string | null>("apples")
	let presetValue = $state<string | null>("maverick")

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const radioGroupProperties: Property[] = [
		{name: "value", type: "string | null", default: "undefined", description: "Selected radio value (bindable)"},
		{name: "name", type: "string", default: "undefined", description: "Form name for the radio group"},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the group"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessible label for screen readers"},
		{name: "orientation", type: '"horizontal" | "vertical"', default: "undefined", description: "Layout direction"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only state"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state for entire group"},
		{name: "required", type: "boolean", default: "undefined", description: "Whether a selection is required"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus the group on page load"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder hint text"},
		{name: "class", type: "string", default: "undefined", description: "CSS class name"},
		{name: "style", type: "string", default: "undefined", description: "Inline CSS styles"},
		{name: "onchange", type: "(value: string) => void", default: "undefined", description: "Callback when selection changes"}
	]

	const radioGroupCallbacks: Property[] = [
		{name: "onchange", type: "(value: string) => void", default: "undefined", description: "Fires when the selected radio value changes"}
	]

	const radioGroupSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Radio button elements inside the group"},
		{name: "labelTemplate", type: "SlotType", default: "undefined", description: "Custom label content rendered above the group"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Radio Group</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-radio-group--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/RadioGroup" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<p>
		A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
		The <code>RadioGroup</code> wraps the <code>&lt;fluent-radio-group&gt;</code> element, a web component implementation of a radio group leveraging the Fluent UI design system.
	</p>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={radioGroupProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={radioGroupCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={radioGroupSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>

		<Grid columns={2} gap="1rem">
			<GridItem>
				<h3>Default</h3>
				<div class="example-section">
					<span class="example-label">Numbers</span>
					<RadioGroup bind:value={numbersValue} name="numbers-radio">
						<Radio value="1">One</Radio>
						<Radio value="2">Two</Radio>
					</RadioGroup>
					<p class="selected-value">Selected: {numbersValue ?? "0"}</p>
				</div>
				<div class="example-section">
					<span class="example-label">Strings</span>
					<RadioGroup bind:value={stringsValue} name="strings-radio">
						<Radio value="one">One</Radio>
						<Radio value="two">Two</Radio>
					</RadioGroup>
					<p class="selected-value">Selected: {stringsValue ?? "0"}</p>
				</div>
			</GridItem>

			<GridItem>
				<h3>In a toolbar</h3>
				<Toolbar>
					<Button appearance="accent">Go</Button>
					<RadioGroup name="toolbar-radio">
						<Radio value="back">back</Radio>
						<Radio value="forward">forward</Radio>
						<Radio value="refresh">refresh</Radio>
					</RadioGroup>
					<Button appearance="accent">Stop</Button>
				</Toolbar>
			</GridItem>
		</Grid>

		<h3>States</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<h4>Read only</h4>
				<p class="hint">readonly radio group</p>
				<RadioGroup bind:value={readonlyValue} name="readonly-radio" readonly>
					<Radio value="word">Word</Radio>
					<Radio value="excel">Excel</Radio>
				</RadioGroup>
			</GridItem>
			<GridItem>
				<h4>Disabled</h4>
				<p class="hint">Disabled radio group</p>
				<RadioGroup bind:value={disabledValue} name="disabled-radio" disabled>
					<Radio value="lamborghini">Lamborghini</Radio>
					<Radio value="ferrari">Ferrari</Radio>
				</RadioGroup>
			</GridItem>
		</Grid>

		<Grid columns={2} gap="1rem">
			<GridItem>
				<h3>Label outside group</h3>
				<RadioGroup bind:value={labelOutsideValue} name="label-outside-radio" label="Outside label" orientation="vertical">
					<Radio value="apples">Apples</Radio>
					<Radio value="oranges">Oranges</Radio>
					<Radio value="bananas">Bananas</Radio>
					<Radio value="kiwi">Kiwi</Radio>
					<Radio value="grapefruit">Grapefruit</Radio>
					<Radio value="mango">Mango</Radio>
					<Radio value="blueberries">Blueberries</Radio>
					<Radio value="strawberries">Strawberries</Radio>
					<Radio value="pineapple">Pineapple</Radio>
				</RadioGroup>
				<p class="selected-value">Your favorite fruit: {labelOutsideValue}!</p>
			</GridItem>

			<GridItem>
				<h3>With preset</h3>
				<p class="hint">Preset selected-value</p>
				<RadioGroup bind:value={presetValue} name="preset-radio">
					<Radio value="iceman">Ice Man</Radio>
					<Radio value="maverick">Maverick</Radio>
					<Radio value="viper">Viper</Radio>
					<Radio value="jester">Jester</Radio>
				</RadioGroup>
				<p class="selected-value">The best pilot according to you is: {presetValue}!</p>
			</GridItem>
		</Grid>
	</Card>
</Stack>

<style>
	.example-section {
		margin-bottom: 1rem;
	}

	.example-label {
		font-weight: 500;
		display: block;
		margin-bottom: 0.25rem;
	}

	.selected-value {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--neutral-foreground-hint);
	}

	.hint {
		font-size: 0.85rem;
		color: var(--neutral-foreground-hint);
		margin: 0 0 0.5rem;
	}

	h4 {
		margin: 0 0 0.25rem;
	}

	code {
		background: var(--neutral-layer-3);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
