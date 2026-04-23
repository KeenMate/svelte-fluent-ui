<script lang="ts">
	import { Listbox, Option, QuickGrid, Stack, Grid, GridItem, Card, Icon } from "svelte-fluentui";

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string | string[]", default: "undefined", description: "Selected value(s) (bindable)"},
		{name: "multi", type: "boolean", default: "false", description: "Enable multiple selection"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the component"},
		{name: "readonly", type: "boolean", default: "false", description: "Disables user changes"},
		{name: "autofocus", type: "boolean", default: "false", description: "Auto-focus on mount"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the listbox"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label (aria-label)"},
		{name: "width", type: "string", default: "undefined", description: "Component width (e.g., '300px', '100%')"},
		{name: "height", type: "string", default: "undefined", description: "Component height (e.g., '200px')"},
		{name: "size", type: "number", default: "undefined", description: "Number of visible options"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "(ev: Event) => void", default: "undefined", description: "Called when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Option elements"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Manual example
	let manualValue = $state<string>("item4");

	// Default example - people picker
	const defaultPeople = [
		{ value: "1", name: "Martin, Jean" },
		{ value: "2", name: "Langa, António" },
		{ value: "3", name: "Smith, Julie" },
		{ value: "4", name: "Sari, Nur" }
	];
	let defaultSelectedValue = $state<string | undefined>(undefined);
	let defaultSelectedItem = $state<string | undefined>(undefined);

	// From list of Option<T> - Option<string> items
	let optionStringValue = $state<string | undefined>(undefined);

	// From list of Option<int> items
	let optionIntValue = $state<string>("2");
	let optionIntValueType = $derived(optionIntValue ? `Type ${optionIntValue}` : "None");

	// US States for long list example
	const usStates = [
		"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
		"Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
		"Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
		"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
		"New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
		"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
		"Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
		"Wisconsin", "Wyoming"
	];
	let longListValue = $state<string | undefined>(undefined);
	let longListWithSizeValue = $state<string | undefined>(undefined);

	// Option template example - people with icons
	const templatePeople = [
		{ value: "1", firstName: "Jean", lastName: "Martin", age: 32 },
		{ value: "2", firstName: "António", lastName: "Langa", age: 45 },
		{ value: "3", firstName: "Julie", lastName: "Smith", age: 28 },
		{ value: "4", firstName: "Nur", lastName: "Sari", age: 0 },
		{ value: "5", firstName: "Jose", lastName: "Hernandez", age: 55 },
		{ value: "6", firstName: "Bert", lastName: "de Vries", age: 41 },
		{ value: "7", firstName: "Jaques", lastName: "Martin", age: 0 },
		{ value: "8", firstName: "Elizabeth", lastName: "Johnson", age: 67 },
		{ value: "9", firstName: "Jakob", lastName: "Berger", age: 23 }
	];
	let templateValue = $state<string | undefined>(undefined);
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Listbox</h1>

	<p>
		An implementation of a listbox. While any DOM content is permissible as a child of the listbox, only
		<code>fluent-option</code> elements, option elements, and slotted items with <code>role="option"</code> will be treated as options and receive keyboard support.
	</p>

	<p>
		The <code>fluent-listbox</code> component has no internals related to form association. For a form-associated listbox, see the <code>fluent-select</code> element.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-listbox--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Listbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h3>Manual</h3>
		<Stack orientation="vertical" gap="1rem">
			<Listbox bind:value={manualValue}>
				<Option value="">This option has no value</Option>
				<Option value="item2" disabled>This option is disabled</Option>
				<Option value="item3">This option has a value</Option>
				<Option value="item-icon">
					<span style="display: flex; align-items: center; gap: 0.5rem;">
						📁 This option has an icon
					</span>
				</Option>
				<Option value="item4">This option is selected by default</Option>
			</Listbox>
			<small>Selection: Item 4</small>
		</Stack>

		<h3>Default</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox bind:value={defaultSelectedValue} label="Select a person">
					{#each defaultPeople as person}
						<Option value={person.value}>{person.name}</Option>
					{/each}
				</Listbox>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<small>Selected value: {defaultSelectedValue || "(none)"}</small>
					<small>Selected item: {defaultPeople.find(p => p.value === defaultSelectedValue)?.name || "(none)"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>From a list of Option&lt;T&gt; items</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="1rem">
					<div>
						<strong>From a List of Option&lt;string&gt; items</strong>
						<p class="hint">Second item in the list is disabled through the OptionDisabled parameter.</p>
						<p class="hint">Note that none of the options is initially highlighted or selected.</p>
						<Listbox bind:value={optionStringValue}>
							<Option value="1">1</Option>
							<Option value="2" disabled>2</Option>
							<Option value="3">3</Option>
						</Listbox>
						<small style="display: block; margin-top: 0.5rem;">Selected Value:</small>
						<small>Selected Item (strongly typed):</small>
						<small>Value (Type {optionStringValue || "?"})</small>
					</div>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="1rem">
					<div>
						<strong>From List of Option&lt;int&gt; items</strong>
						<p class="hint">First item in the list is disabled through the OptionDisabled parameter. Value (Type 2) is selected through the OptionSelected parameter.</p>
						<Listbox bind:value={optionIntValue}>
							<Option value="1" disabled>1</Option>
							<Option value="2">2</Option>
							<Option value="3">3</Option>
						</Listbox>
						<small style="display: block; margin-top: 0.5rem;">Selected Value:</small>
						<small>Selected Item (strongly typed):</small>
						<small>{optionIntValueType}</small>
					</div>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Long list</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox bind:value={longListValue}>
					{#each usStates as state}
						<Option value={state}>{state}</Option>
					{/each}
				</Listbox>
			</GridItem>
			<GridItem>
				<small>Selected value: {longListValue || "(none)"}</small>
			</GridItem>
		</Grid>

		<h3>Long list with Width and Height</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox bind:value={longListWithSizeValue} width="200px" height="250px">
					{#each usStates as state}
						<Option value={state}>{state}</Option>
					{/each}
				</Listbox>
			</GridItem>
			<GridItem>
				<small>Selected value: {longListWithSizeValue || "(none)"}</small>
			</GridItem>
		</Grid>

		<h3>Option template</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox bind:value={templateValue}>
					{#each templatePeople as person}
						<Option value={person.value}>
							<span class="person-option">
								<Icon name="person" size={16} />
								<span>{person.firstName} ({person.lastName})</span>
								{#if person.age > 0}
									<span class="age-badge">{person.age}</span>
								{/if}
							</span>
						</Option>
					{/each}
				</Listbox>
			</GridItem>
			<GridItem>
				<small>Selected: {templateValue ? templatePeople.find(p => p.value === templateValue)?.firstName : "(none)"}</small>
			</GridItem>
		</Grid>

		<h3>Multiple Selection</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<small>Use Ctrl/Cmd + click to select multiple items</small>
					<Listbox value={[]} multi>
						<Option value="option1">Option 1</Option>
						<Option value="option2">Option 2</Option>
						<Option value="option3">Option 3</Option>
						<Option value="option4">Option 4</Option>
					</Listbox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Disabled</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox value="banana" disabled>
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
					<Option value="cherry">Cherry</Option>
				</Listbox>
			</GridItem>
			<GridItem>
				<small>Entire listbox is disabled</small>
			</GridItem>
		</Grid>

		<h3>With Label</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Listbox label="Select a fruit" value="apple">
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
					<Option value="cherry">Cherry</Option>
				</Listbox>
			</GridItem>
		</Grid>
	</Card>
</Stack>

<style>
	small {
		font-size: 0.875rem;
	}

	code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}

	.hint {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
		margin: 0.25rem 0;
	}

	.person-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.age-badge {
		background: var(--accent-fill-rest);
		color: var(--accent-foreground-cut-rest, white);
		padding: 0.125rem 0.375rem;
		border-radius: 10px;
		font-size: 0.75rem;
		margin-left: auto;
	}
</style>
