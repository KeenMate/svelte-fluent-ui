<script lang="ts">
	import { NumberField, Button, Stack, Grid, GridItem, Card, QuickGrid, Icon } from "svelte-fluentui";
	import {References, Meta} from "$lib/components";

	// State for examples
	let integerValue = $state<string>("");
	let nullableValue = $state<string>("");
	let positiveValue = $state<string>("");

	// Types examples
	let shortValue = $state<string>("123");
	let intValue = $state<string>("12345");
	let longValue = $state<string>("123456789");
	let floatValue = $state<string>("12.68");
	let decimalValue = $state<string>("12345.6789");

	// Constraints examples
	let constrainedShort = $state<string>("0");
	let constrainedMinMax = $state<string>("10");
	let constrainedOverride = $state<string>("10");

	// Display examples
	let fullWidthValue = $state<string>("");
	let placeholderValue = $state<string>("");
	let hideStepValue = $state<string>("42");
	let requiredValue = $state<string>("");
	let disabledValue = $state<string>("100");
	let readonlyValue = $state<string>("200");

	// Icons examples
	let startIconValue = $state<string>("");
	let endIconValue = $state<string>("");
	let bothIconsValue = $state<string>("");

	// Focus examples
	let autofocusValue = $state<string>("");
	let focusAsyncValue = $state<string>("");
	let focusAsyncRef: { focus: () => void };

	// Filled appearance
	let filledDefault = $state<string>("");
	let filledPlaceholder = $state<string>("");
	let filledRequired = $state<string>("");
	let filledDisabled = $state<string>("50");
	let filledReadonly = $state<string>("75");

	// Callback example
	let callbackValue = $state<string>("");
	let callbackMessage = $state<string>("");

	function handleFocusAsync() {
		focusAsyncRef?.focus();
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		callbackMessage = `Value changed to: ${target.value || "(empty)"}`;
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string", default: "undefined", description: "Value of the input (bindable)"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "appearance", type: '"outline" | "filled"', default: "outline", description: "Visual appearance style"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the input"},
		{name: "readonly", type: "boolean", default: "false", description: "Makes the input read-only"},
		{name: "required", type: "boolean", default: "false", description: "Marks the field as required"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "id", type: "string", default: "undefined", description: "Element id, also linked to the external label via for="},
		{name: "label", type: "string", default: "undefined", description: "Label text (rendered as external <label class=\"fluent-label\">)"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Snippet rendered inside the external label — use for icons or rich label markup"},
		{name: "autofocus", type: "boolean", default: "false", description: "Auto-focus on mount"},
		{name: "autocomplete", type: "string", default: '"off"', description: "Browser autocomplete behavior"},
		{name: "step", type: "number", default: "undefined", description: "Increment/decrement step value"},
		{name: "min", type: "number", default: "undefined", description: "Minimum allowed value"},
		{name: "max", type: "number", default: "undefined", description: "Maximum allowed value"},
		{name: "minlength", type: "number", default: "undefined", description: "Minimum character length"},
		{name: "maxlength", type: "number", default: "undefined", description: "Maximum character length"},
		{name: "size", type: "number", default: "undefined", description: "Input field size"},
		{name: "list", type: "string", default: "undefined", description: "ID of a datalist element"},
		{name: "hideStep", type: "boolean", default: "false", description: "Hides the stepper up/down buttons"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label (aria-label)"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text on hover"},
		{name: "width", type: "string", default: "undefined", description: "Component width (e.g., '300px', '100%')"},
		{name: "height", type: "string", default: "undefined", description: "Component height"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS classes"},
		{name: "style", type: "string", default: "undefined", description: "Inline CSS styles"}
	]

	const callbacks: Property[] = [
		{name: "oninput", type: "(ev: InputEvent) => void", default: "undefined", description: "Fires as value is typed"},
		{name: "onchange", type: "(ev: Event) => void", default: "undefined", description: "Fires when value changes on blur"},
		{name: "onfocus", type: "(ev: FocusEvent) => void", default: "undefined", description: "Fires when input gains focus"},
		{name: "onblur", type: "(ev: FocusEvent) => void", default: "undefined", description: "Fires when input loses focus"},
		{name: "onkeydown", type: "(ev: KeyboardEvent) => void", default: "undefined", description: "Fires on key down"},
		{name: "onkeyup", type: "(ev: KeyboardEvent) => void", default: "undefined", description: "Fires on key up"}
	]

	const methods: Property[] = [
		{name: "stepUp", type: "() => void", default: "-", description: "Increments value by step amount"},
		{name: "stepDown", type: "() => void", default: "-", description: "Decrements value by step amount"},
		{name: "focus", type: "() => void", default: "-", description: "Focuses the input element"},
		{name: "blur", type: "() => void", default: "-", description: "Removes focus from the input"},
		{name: "select", type: "() => void", default: "-", description: "Selects all text in the input"},
		{name: "checkValidity", type: "() => boolean", default: "-", description: "Returns whether input is valid"},
		{name: "reportValidity", type: "() => boolean", default: "-", description: "Triggers validation UI"},
		{name: "setCustomValidity", type: "(message: string) => void", default: "-", description: "Sets custom validity message"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Label content (alternative to label prop)"},
		{name: "start", type: "SlotType", default: "undefined", description: "Content/icon before the input"},
		{name: "end", type: "SlotType", default: "undefined", description: "Content/icon after the input"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Number field"
		description="A Svelte wrapper for FluentUI's number-field web component — numeric input with step controls, outline and filled appearances, and form integration."
		keywords="svelte, fluentui, number field, numberfield, numeric input, form"
	/>

	<h1>Number field</h1>

	<p>
		An implementation of a text field as a form-connected web-component. The fluent-number-field supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/NumberField"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Default</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Integer</strong>
					<NumberField bind:value={integerValue} label="Integer" />
					<small>Minimum value: -2147483648 Maximum value: 2147483647</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Nullable integer</strong>
					<NumberField bind:value={nullableValue} label="Nullable integer" />
					<small>Minimum value: -2147483648 Maximum value: 2147483647</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Positive integer</strong>
					<NumberField bind:value={positiveValue} label="Positive integer" min={0} />
					<small>Minimum value: 0 Maximum value: 2147483647</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Types</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.75rem">
					<div>
						<strong>Short</strong>
						<NumberField bind:value={shortValue} label="Short" min={-32768} max={32767} />
						<small>Minimum value: -32768 Maximum value: 32767</small>
					</div>
					<div>
						<strong>Integer</strong>
						<NumberField bind:value={intValue} label="Integer" />
						<small>Minimum value: -2147483648 Maximum value: 2147483647</small>
					</div>
					<div>
						<strong>Long</strong>
						<NumberField bind:value={longValue} label="Long" />
						<small>Minimum value: -9999999999 Maximum value: 9999999999</small>
					</div>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.75rem">
					<div>
						<strong>Float</strong>
						<NumberField bind:value={floatValue} label="Float" step={0.01} />
						<small>Minimum value: -9999999999 Maximum value: 9999999999</small>
					</div>
					<div>
						<strong>Decimal</strong>
						<NumberField bind:value={decimalValue} label="Decimal" step={0.0001} />
						<small>Minimum value: -9999999999 Maximum value: 9999999999</small>
					</div>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Types with constraints</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Stack orientation="vertical" gap="1rem">
			<div>
				<strong>Unsigned short with inherent constraints from type</strong>
				<NumberField bind:value={constrainedShort} label="Example unsigned short" min={0} max={65535} />
				<small>Minimum value: 0 Maximum value: 65535</small>
			</div>
			<div>
				<strong>Unsigned short with inherent constraints from type and manual min</strong>
				<NumberField bind:value={constrainedMinMax} label="Example unsigned short" min={10} max={65535} />
				<small>Minimum value: 10 Maximum value: 65535</small>
			</div>
			<div>
				<strong>Unsigned short with inherent constraints, but Min and Max overrides</strong>
				<NumberField bind:value={constrainedOverride} label="Example unsigned short" min={10} max={19} />
				<small>Minimum value: 10 Maximum value: 19</small>
			</div>
		</Stack>

		<h3>Displays</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Stack orientation="vertical" gap="1rem">
			<div>
				<strong>Full Width</strong>
				<NumberField bind:value={fullWidthValue} label="Full width" width="100%" />
			</div>
			<div>
				<strong>Placeholder</strong>
				<NumberField bind:value={placeholderValue} placeholder="Placeholder" />
			</div>
			<div>
				<strong>Hide up/down steps</strong>
				<NumberField bind:value={hideStepValue} label="Hide steps" hideStep />
			</div>
			<div>
				<strong>Required</strong>
				<NumberField bind:value={requiredValue} label="Required" required />
			</div>
			<div>
				<strong>Disabled</strong>
				<NumberField bind:value={disabledValue} label="Disabled" disabled />
				<small>value: {disabledValue}</small>
			</div>
			<div>
				<strong>Read only</strong>
				<NumberField bind:value={readonlyValue} label="Read only" readonly />
				<small>value: {readonlyValue}</small>
			</div>
		</Stack>

		<h3>Icons</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Start icon</strong>
					<NumberField bind:value={startIconValue} label="With start">
						{#snippet start()}
							<Icon name="money" size={16} />
						{/snippet}
					</NumberField>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>End icon</strong>
					<NumberField bind:value={endIconValue} label="With end">
						{#snippet end()}
							<Icon name="calculator" size={16} />
						{/snippet}
					</NumberField>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Both icons</strong>
					<NumberField bind:value={bothIconsValue} label="Both">
						{#snippet start()}
							<Icon name="money" size={16} />
						{/snippet}
						{#snippet end()}
							<Icon name="calculator" size={16} />
						{/snippet}
					</NumberField>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Focus</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Autofocus</strong>
					<small style="color: var(--neutral-foreground-hint);">Autofocus set to prevent page actually jumping to this button. See example code in Razor tab for implementation.</small>
					<NumberField bind:value={autofocusValue} label="Autofocus" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Focus Async</strong>
					<NumberField bind:this={focusAsyncRef} bind:value={focusAsyncValue} label="FocusAsync" />
					<Button onclick={handleFocusAsync}>Focus</Button>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Filled Appearance</h3>
		<p style="font-size: 0.875rem; color: var(--neutral-foreground-hint);">Example: Basic</p>
		<Stack orientation="vertical" gap="1rem">
			<div>
				<strong>Default</strong>
				<NumberField bind:value={filledDefault} label="Default" appearance="filled" />
			</div>
			<div>
				<strong>Placeholder</strong>
				<NumberField bind:value={filledPlaceholder} placeholder="Placeholder" appearance="filled" />
			</div>
			<div>
				<strong>Required</strong>
				<NumberField bind:value={filledRequired} label="Required" appearance="filled" required />
			</div>
			<div>
				<strong>Disabled</strong>
				<NumberField bind:value={filledDisabled} label="Disabled" appearance="filled" disabled />
				<small>value: {filledDisabled}</small>
			</div>
			<div>
				<strong>Read only</strong>
				<NumberField bind:value={filledReadonly} label="Read only" appearance="filled" readonly />
				<small>value: {filledReadonly}</small>
			</div>
		</Stack>

		<h3>Callback example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With onchange callback</strong>
					<NumberField
						bind:value={callbackValue}
						label="Enter a number"
						onchange={handleChange}
					/>
					<small>{callbackMessage || "Change the value to see the callback"}</small>
				</Stack>
			</GridItem>
		</Grid>
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
		<h2>Methods</h2>
		<QuickGrid items={methods} columns={propertyColumns} sortable filterable striped />
	</Card>
</Stack>

<style>
	small {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}

	strong {
		display: block;
		margin-bottom: 0.25rem;
	}
</style>
