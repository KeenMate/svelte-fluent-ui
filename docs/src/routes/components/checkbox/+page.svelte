<script lang="ts">
	import { Checkbox, Stack, Grid, GridItem, Card, QuickGrid } from "svelte-fluentui";

	// Default examples
	let apples = $state(true);
	let bananas = $state(true);
	let oranges = $state(false);

	// Three states examples
	let threeStateTrue = $state<boolean | null>(true);
	let threeStateFalse = $state<boolean | null>(false);
	let threeStateIndeterminate = $state<boolean | null>(null);

	// Three states with alternative order
	let altOrderValue = $state<boolean | null>(false);

	// Three states list
	let projectChecked = $state(true);
	let executableChecked = $state(true);
	let containerChecked = $state(true);

	// Computed "All" checkbox state
	let allChecked = $derived.by(() => {
		const items = [projectChecked, executableChecked, containerChecked];
		const allTrue = items.every(item => item === true);
		const allFalse = items.every(item => item === false);

		if (allTrue) return true;
		if (allFalse) return false;
		return null; // indeterminate
	});

	// Handler for "All" checkbox click
	function handleAllClick() {
		if (allChecked === true) {
			projectChecked = false;
			executableChecked = false;
			containerChecked = false;
		} else {
			projectChecked = true;
			executableChecked = true;
			containerChecked = true;
		}
	}

	// Disabled examples
	let disabledChecked = $state(true);
	let disabledIndeterminate = $state<boolean | null>(null);

	// Readonly examples
	let readonlyChecked = $state(true);
	let readonlyUnchecked = $state(false);

	// Label examples
	let labelPropValue = $state(false);
	let childrenValue = $state(false);

	// Callback example
	let callbackValue = $state(false);
	let callbackMessage = $state("");

	function handleCallback(ev: PointerEvent, previousValue: boolean | null) {
		callbackMessage = `Changed from ${previousValue} to ${!previousValue}`;
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "checked", type: "boolean | null", default: "undefined", description: "The checked state (bindable). null = indeterminate"},
		{name: "withIntermediate", type: "boolean", default: "false", description: "Enable three-state mode (true/null/false cycling)"},
		{name: "threeStateOrderUncheckToIntermediate", type: "boolean", default: "false", description: "Controls cycle order. false: Unchecked→Checked→Intermediate. true: Unchecked→Intermediate→Checked"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable user interaction"},
		{name: "readonly", type: "boolean", default: "false", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "false", description: "Required for form validation"},
		{name: "autofocus", type: "boolean", default: "false", description: "Auto-focus on mount"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "label", type: "string", default: "undefined", description: "Label text"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label (aria-label)"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onclick", type: "(ev: PointerEvent, previousValue: boolean | null) => void", default: "undefined", description: "Called on click with the previous checked value"}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Label content rendered inside the checkbox. Takes precedence over the label prop when both are provided"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Checkbox</h1>

	<p>
		An implementation of a checkbox web-component. The Checkbox component wraps the <code>fluent-checkbox</code> element,
		a web component implementation of a checkbox, leveraging the Fluent UI design system.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-checkbox--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Checkbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h3>Default checkbox examples</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Horizontal</strong>
					<Stack orientation="horizontal" gap="1rem" style="flex-wrap: wrap;">
						<Checkbox bind:checked={apples}>Apples</Checkbox>
						<Checkbox checked={true} disabled>Bananas (disabled)</Checkbox>
						<Checkbox bind:checked={oranges}>Oranges</Checkbox>
					</Stack>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Vertical</strong>
					<Stack orientation="vertical" gap="0.5rem">
						<Checkbox bind:checked={apples}>Apples</Checkbox>
						<Checkbox checked={true} disabled>Bananas (disabled)</Checkbox>
						<Checkbox bind:checked={oranges}>Oranges</Checkbox>
					</Stack>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Three States</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="1rem">
					<div>
						<Checkbox bind:checked={threeStateTrue} withIntermediate>
							ThreeState = true
						</Checkbox>
						<span class="value-display">Value = {threeStateTrue} - CheckState = {threeStateTrue === null ? 'null' : threeStateTrue}</span>
					</div>

					<div>
						<Checkbox bind:checked={threeStateFalse} withIntermediate>
							ThreeState = false
						</Checkbox>
						<span class="value-display">Value = {threeStateFalse}</span>
					</div>

					<div>
						<Checkbox bind:checked={threeStateIndeterminate} withIntermediate>
							ShowIndeterminate = false
						</Checkbox>
						<span class="value-display">Value = {threeStateIndeterminate} - CheckState = {threeStateIndeterminate === null ? 'null (Indeterminate)' : threeStateIndeterminate}</span>
					</div>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Alternative cycle order</strong>
					<small>threeStateOrderUncheckToIntermediate = true</small>
					<small>Order: Unchecked → Intermediate → Checked</small>
					<Checkbox bind:checked={altOrderValue} withIntermediate threeStateOrderUncheckToIntermediate>
						Click to cycle
					</Checkbox>
					<span class="value-display">Value = {altOrderValue === null ? 'null (Indeterminate)' : altOrderValue}</span>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Three States List</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Checkbox checked={allChecked} withIntermediate onclick={handleAllClick}>
						All ({allChecked === null ? 'Indeterminate' : allChecked ? 'True' : 'False'})
					</Checkbox>
					<div style="margin-left: 1.5rem;">
						<Stack orientation="vertical" gap="0.5rem">
							<Checkbox bind:checked={projectChecked}>Project ({projectChecked})</Checkbox>
							<Checkbox bind:checked={executableChecked}>Executable ({executableChecked})</Checkbox>
							<Checkbox bind:checked={containerChecked}>Container ({containerChecked})</Checkbox>
						</Stack>
					</div>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<small>The parent "All" checkbox automatically shows:</small>
					<ul style="margin: 0; padding-left: 1.5rem;">
						<li>Checked when all children are checked</li>
						<li>Unchecked when all children are unchecked</li>
						<li>Indeterminate when children have mixed states</li>
					</ul>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Disabled examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled unchecked</strong>
					<Checkbox checked={false} disabled>Unchecked</Checkbox>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled checked</strong>
					<Checkbox bind:checked={disabledChecked} disabled>Checked</Checkbox>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled indeterminate</strong>
					<Checkbox bind:checked={disabledIndeterminate} disabled withIntermediate>Indeterminate</Checkbox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Read-only examples</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>ReadOnly unchecked</strong>
					<Checkbox bind:checked={readonlyUnchecked} readonly>Unchecked (readonly)</Checkbox>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>ReadOnly checked</strong>
					<Checkbox bind:checked={readonlyChecked} readonly>Checked (readonly)</Checkbox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Label examples</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Using label prop</strong>
					<Checkbox bind:checked={labelPropValue} label="Label via prop" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Using children slot</strong>
					<Checkbox bind:checked={childrenValue}>
						<span style="font-weight: bold; color: var(--accent-foreground-rest);">Custom styled label</span>
					</Checkbox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Callback example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With onclick callback</strong>
					<Checkbox bind:checked={callbackValue} onclick={handleCallback}>
						Click me
					</Checkbox>
					<small>{callbackMessage || "Click the checkbox to see the callback"}</small>
				</Stack>
			</GridItem>
		</Grid>
	</Card>
</Stack>

<style>
	.value-display {
		margin-left: 1rem;
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}
</style>
