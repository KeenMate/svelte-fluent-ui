<script lang="ts">
	import {Radio, RadioGroup, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"

	// State for examples
	let defaultValue = $state<string | null>(null)
	let labelValue = $state<string | null>(null)
	let checkedValue = $state<string | null>("checked")
	let requiredValue = $state<string | null>(null)
	let disabledValue = $state<string | null>(null)
	let ariaLabelValue = $state<string | null>(null)
	let outsideLabelValue = $state<string | null>(null)
	let horizontalValue = $state<string | null>("opt1")
	let verticalValue = $state<string | null>("opt1")
	let callbackValue = $state<string | null>(null)
	let callbackMessage = $state<string>("")

	// Callback handler
	function handleChange(value: string) {
		callbackMessage = `Selected: ${value}`
	}

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

	const radioProperties: Property[] = [
		{name: "value", type: "string", default: "Required", description: "Value for this radio button"},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the radio"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessible label for screen readers"},
		{name: "name", type: "string", default: "undefined", description: "Name attribute (usually inherited from group)"},
		{name: "checked", type: "boolean", default: "undefined", description: "Whether this radio is checked"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only state"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disabled state"},
		{name: "required", type: "boolean", default: "undefined", description: "Whether this radio is required"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus on page load"},
		{name: "class", type: "string", default: "undefined", description: "CSS class name"},
		{name: "style", type: "string", default: "undefined", description: "Inline CSS styles"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", width: "140px"},
		{field: "type", title: "Type", width: "200px"},
		{field: "default", title: "Default", width: "100px"},
		{field: "description", title: "Description"}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Radio</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-radio--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Radio" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<p>
		An implementation of a radio button. Only to be used in a <code>RadioGroup</code>.
		The <code>Radio</code> wraps the <code>&lt;fluent-radio&gt;</code> element, a web component implementation of a radio element leveraging the Fluent UI design system.
	</p>

	<h2>Examples</h2>

	<Grid spacing={3}>
		<!-- Default -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Default</h3>
				<RadioGroup bind:value={defaultValue} name="default-radio" orientation="vertical">
					<div class="radio-with-description">
						<span class="radio-description">Without a label:</span>
						<Radio value="no-label"></Radio>
					</div>
					<div class="radio-with-description">
						<span class="radio-description">With a label:</span>
						<Radio value="with-label">label</Radio>
					</div>
				</RadioGroup>
			</Card>
		</GridItem>

		<!-- States: Checked -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Checked</h3>
				<RadioGroup bind:value={checkedValue} name="checked-radio">
					<Radio value="checked">Checked</Radio>
				</RadioGroup>
			</Card>
		</GridItem>

		<!-- States: Required -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Required</h3>
				<RadioGroup bind:value={requiredValue} name="required-radio" required>
					<Radio value="required" required></Radio>
				</RadioGroup>
			</Card>
		</GridItem>

		<!-- States: Disabled -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Disabled</h3>
				<RadioGroup bind:value={disabledValue} name="disabled-radio" disabled>
					<Radio value="label">label</Radio>
					<Radio value="checked" checked>checked</Radio>
				</RadioGroup>
			</Card>
		</GridItem>

		<!-- Aria Label -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Aria Label</h3>
				<p class="hint">Visual vs audio label</p>
				<RadioGroup bind:value={ariaLabelValue} name="aria-radio">
					<Radio value="visible" ariaLabel="Screen reader label">Visible label</Radio>
				</RadioGroup>
				<p class="hint" style="margin-top: 0.5rem;">Outside label</p>
				<RadioGroup bind:value={outsideLabelValue} name="outside-radio" label="Outside label">
					<Radio value="label1">label1</Radio>
				</RadioGroup>
			</Card>
		</GridItem>

		<!-- Orientation: Horizontal -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Horizontal (default)</h3>
				<RadioGroup bind:value={horizontalValue} name="horizontal-radio" orientation="horizontal">
					<Radio value="opt1">Option 1</Radio>
					<Radio value="opt2">Option 2</Radio>
					<Radio value="opt3">Option 3</Radio>
				</RadioGroup>
				<p class="value-display">Value: {horizontalValue}</p>
			</Card>
		</GridItem>

		<!-- Orientation: Vertical -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Vertical</h3>
				<RadioGroup bind:value={verticalValue} name="vertical-radio" orientation="vertical">
					<Radio value="opt1">Option 1</Radio>
					<Radio value="opt2">Option 2</Radio>
					<Radio value="opt3">Option 3</Radio>
				</RadioGroup>
				<p class="value-display">Value: {verticalValue}</p>
			</Card>
		</GridItem>

		<!-- Callback -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>onChange Callback</h3>
				<RadioGroup bind:value={callbackValue} name="callback-radio" orientation="vertical" onchange={handleChange}>
					<Radio value="apple">Apple</Radio>
					<Radio value="banana">Banana</Radio>
					<Radio value="cherry">Cherry</Radio>
				</RadioGroup>
				{#if callbackMessage}
					<p class="callback-message">{callbackMessage}</p>
				{/if}
			</Card>
		</GridItem>

		<!-- With Group Label -->
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Group Label</h3>
				<RadioGroup bind:value={labelValue} name="label-radio" label="Select a fruit:" orientation="vertical">
					<Radio value="apple">Apple</Radio>
					<Radio value="orange">Orange</Radio>
					<Radio value="grape">Grape</Radio>
				</RadioGroup>
			</Card>
		</GridItem>
	</Grid>

	<h2>Documentation</h2>

	<Grid spacing={3}>
		<GridItem xs={12} lg={6}>
			<Card>
				<h3>RadioGroup Properties</h3>
				<QuickGrid items={radioGroupProperties} columns={propertyColumns} striped />
			</Card>
		</GridItem>

		<GridItem xs={12} lg={6}>
			<Card>
				<h3>Radio Properties</h3>
				<QuickGrid items={radioProperties} columns={propertyColumns} striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.radio-with-description {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.radio-description {
		font-size: 0.9rem;
		color: var(--neutral-foreground-hint);
		min-width: 100px;
	}

	.hint {
		font-size: 0.85rem;
		color: var(--neutral-foreground-hint);
		margin: 0 0 0.5rem;
	}

	.value-display {
		margin-top: 0.75rem;
		padding: 0.5rem;
		background: var(--neutral-layer-2);
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.callback-message {
		margin-top: 0.75rem;
		padding: 0.5rem;
		background: var(--accent-fill-rest, #0078d4);
		color: white;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	code {
		background: var(--neutral-layer-3);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
