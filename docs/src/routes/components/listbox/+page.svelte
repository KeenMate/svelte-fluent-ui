<script lang="ts">
	import {Listbox, Option, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string | string[]", default: "undefined", description: "Selected value(s)"},
		{name: "multi", type: "boolean", default: "false", description: "Enable multiple selection"},
		{name: "readonly", type: "boolean", default: "false", description: "Disables user changes"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the component"},
		{name: "class", type: "string", default: '""', description: "Custom classes"},
		{name: "style", type: "string", default: '""', description: "Custom inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "function", default: "undefined", description: "Fired when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Listbox option elements"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Example 1: Basic options with various states
	let selectedItem1 = $state<string>("item4")

	// Example 2: Default/people picker
	let selectedPerson = $state<string | undefined>(undefined)

	// Example 3: Generic list with objects
	type Person = {
		id: string
		name: string
	}

	const people: Person[] = [
		{ id: "1", name: "Martin, Jean" },
		{ id: "2", name: "Langa, António" },
		{ id: "3", name: "Smith, Julie" },
		{ id: "4", name: "Sari, Nur" }
	]

	let selectedPersonObj = $state<string | undefined>(undefined)

	// Example 4: Simple string list
	const items = ["One", "Two", "Three"]
	let selectedStringItem = $state<string>("Two")
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Listbox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
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
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>Callbacks</h2>
					<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<h2>Examples</h2>

	<!-- Example 1: Options with various states -->
	<Card>
		<h3>Options with Various States</h3>
		<p>Demonstrates options with no value, disabled state, icons, and default selection.</p>

		<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
			<Listbox bind:value={selectedItem1}>
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

			<p style="margin: 0;">Selected: {selectedItem1 || '(none)'}</p>
		</Stack>
	</Card>

	<!-- Example 2: People picker / Default -->
	<Card>
		<h3>Default (People Picker)</h3>
		<p>Select a person from the list.</p>

		<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
			<Listbox bind:value={selectedPerson}>
				<Option value="">Select a person</Option>
				<Option value="jean">Martin, Jean</Option>
				<Option value="antonio">Langa, António</Option>
				<Option value="julie">Smith, Julie</Option>
				<Option value="nur">Sari, Nur</Option>
			</Listbox>

			<div>
				<p style="margin: 0;"><strong>Selected value:</strong> {selectedPerson || '(none)'}</p>
			</div>
		</Stack>
	</Card>

	<!-- Example 3: From a list of Option<T> items (using objects) -->
	<Card>
		<h3>From a List of Option&lt;T&gt; Items</h3>
		<p>Listbox populated from a typed list of objects. Second item initially selected.</p>

		<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
			<div style="max-width: 400px;">
				<Listbox bind:value={selectedPersonObj}>
					{#each people as person}
						<Option value={person.id}>{person.name}</Option>
					{/each}
				</Listbox>
			</div>

			<div>
				<p style="margin: 0;"><strong>Selected value:</strong> {selectedPersonObj || '(none)'}</p>
				<p style="margin: 0;"><strong>Selected item:</strong> {people.find(p => p.id === selectedPersonObj)?.name || '(none)'}</p>
			</div>
		</Stack>
	</Card>

	<!-- Example 4: From a list of string items -->
	<Card>
		<h3>From a List of String Items</h3>
		<p>Simple listbox with string array. Second item ("Two") is initially selected through optionSelected parameter.</p>

		<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
			<div style="max-width: 400px;">
				<Listbox bind:value={selectedStringItem}>
					{#each items as item}
						<Option value={item}>{item}</Option>
					{/each}
				</Listbox>
			</div>

			<div>
				<p style="margin: 0;"><strong>Selected:</strong> {selectedStringItem}</p>
			</div>
		</Stack>
	</Card>

	<!-- Additional Examples -->
	<Card>
		<h3>Disabled Listbox</h3>
		<p>Entire listbox in disabled state.</p>

		<Listbox value="banana" disabled>
			<Option value="apple">Apple</Option>
			<Option value="banana">Banana</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>
	</Card>

	<Card>
		<h3>Multiple Selection</h3>
		<p>Listbox with multiple selection enabled (use Ctrl/Cmd + click).</p>

		<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
			<Listbox value={[]} multi>
				<Option value="option1">Option 1</Option>
				<Option value="option2">Option 2</Option>
				<Option value="option3">Option 3</Option>
				<Option value="option4">Option 4</Option>
			</Listbox>
		</Stack>
	</Card>
</Stack>

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
