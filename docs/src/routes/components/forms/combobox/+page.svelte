<script lang="ts">
	import { Combobox, Option, Stack, Grid, GridItem, Card, QuickGrid, Icon } from "svelte-fluentui";
	import {References, Meta} from "$lib/components";
	import { songs } from "$lib/demo-data/datasets";

	// Sample data - sizes
	const sizes = [
		{ value: "small", label: "Small" },
		{ value: "medium", label: "Medium" },
		{ value: "large", label: "Large" }
	]

	// Long list for scroll example
	const longList = Array.from({ length: 20 }, (_, i) => ({
		value: `item-${i + 1}`,
		label: `Item ${i + 1}`
	}))

	// People data for option template example
	const people = [
		{ value: "1", firstName: "Jean", lastName: "Martin" },
		{ value: "2", firstName: "António", lastName: "Langa" },
		{ value: "3", firstName: "Julie", lastName: "Smith" },
		{ value: "4", firstName: "Nur", lastName: "Sari" },
		{ value: "5", firstName: "Jose", lastName: "Hernandez" },
		{ value: "6", firstName: "Bert", lastName: "de Vries" },
		{ value: "7", firstName: "Jaques", lastName: "Martin" },
		{ value: "8", firstName: "Elizabeth", lastName: "Johnson" },
		{ value: "9", firstName: "Jakob", lastName: "Berger" }
	]

	// Names with diacritics for testing autocomplete
	const namesWithDiacritics = [
		{ value: "1", label: "José García" },
		{ value: "2", label: "François Müller" },
		{ value: "3", label: "Søren Østergård" },
		{ value: "4", label: "Jiří Dvořák" },
		{ value: "5", label: "Zoë Brontë" },
		{ value: "6", label: "Renée Lefèvre" },
		{ value: "7", label: "Håkon Ødegård" },
		{ value: "8", label: "Ñoño Peña" },
		{ value: "9", label: "Łukasz Wójcik" },
		{ value: "10", label: "Ágnes Németh" },
		{ value: "11", label: "Günther Größe" },
		{ value: "12", label: "Beyoncé Knowles" },
		{ value: "13", label: "Chloë Sevigny" },
		{ value: "14", label: "Fañch Le Hénaff" },
		{ value: "15", label: "Anaïs Dupont" }
	]

	// State for each example
	let basicValue = $state<string[]>([])
	let preselectedValue = $state<string[]>(["3"])
	let placeholderValue = $state<string[]>([])
	let stringValue = $state<string[]>([])
	let intValue = $state<string[]>([])
	let disabledValue = $state<string[]>(["medium"])
	let disabledItemsValue = $state<string[]>([])
	let allDisabledValue = $state<string[]>(["small"])
	let filledValue = $state<string[]>([])
	let inlineValue = $state<string[]>([])
	let listValue = $state<string[]>([])
	let bothValue = $state<string[]>([])
	let longListValue = $state<string[]>([])
	let aboveValue = $state<string[]>([])
	let belowValue = $state<string[]>([])
	let templateValue = $state<string[]>([])
	let widthValue = $state<string[]>([])
	let callbackValue = $state<string[]>([])
	let callbackMessage = $state<string>("")
	let diacriticsValue = $state<string[]>([])
	let minSearchValue = $state<string[]>([])

	// Callback handler example
	function handleSelectionChange(value: string[]) {
		callbackMessage = `Selection changed to: ${value[0] || "None"}`
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "id", type: "string", default: "Required", description: "Unique identifier"},
		{name: "value", type: "string[]", default: "[]", description: "Selected value(s) (bindable)"},
		{name: "options", type: "OptionItem[]", default: "undefined", description: "Array of option items"},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the combobox"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "autocomplete", type: '"inline" | "list" | "both" | "none"', default: "undefined", description: "Autocomplete behavior"},
		{name: "minSearchLength", type: "number", default: "undefined", description: "Keep dropdown closed until the typed text reaches this length. Useful with large/async option sets to avoid opening on a single character."},
		{name: "position", type: '"above" | "below"', default: "undefined", description: "Dropdown position"},
		{name: "appearance", type: '"outline" | "filled"', default: "outline", description: "Visual style"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the combobox"},
		{name: "readonly", type: "boolean", default: "false", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "false", description: "Required field"},
		{name: "open", type: "boolean", default: "false", description: "Dropdown open state"},
		{name: "autofocus", type: "boolean", default: "false", description: "Auto focus on mount"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label (aria-label)"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text"},
		{name: "width", type: "string", default: "undefined", description: "Component width (e.g., '300px', '100%')"},
		{name: "height", type: "string", default: "undefined", description: "Component height"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "(value: string[]) => void", default: "undefined", description: "Called when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Option components (alternative to the options prop)"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content rendered above the combobox"}
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
		title="Combobox"
		description="A Svelte wrapper for FluentUI's combobox web component — an input widget with a popup that lets users pick a value from a collection."
		keywords="svelte, fluentui, combobox, dropdown, autocomplete, select, form"
	/>

	<h1>Combobox</h1>

	<p>
		A combobox is an input widget with an associated popup that enables users to select a value from
		a collection of possible values.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-combobox--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Combobox"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Default examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="basic" bind:value={basicValue} options={songs} label="Select the best song" />
					<small>Selected: {basicValue[0] || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="preselected" bind:value={preselectedValue} options={songs} label="Pre-selected option" />
					<small>Selected: {preselectedValue[0] || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="placeholder" bind:value={placeholderValue} options={songs} label="With Placeholder" placeholder="Please select a song..." />
					<small>Selected: {placeholderValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>From a list of Option&lt;T&gt; items</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>From list of Option&lt;string&gt; items</strong>
					<Combobox id="string-options" bind:value={stringValue} options={songs} />
					<small>Selected Value: {stringValue[0] || "None"}</small>
					<small>Selected Item: {stringValue[0] ? songs.find(s => s.value === stringValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>From list of Option&lt;int&gt; items</strong>
					<small style="color: var(--neutral-foreground-hint);">First item disabled. None initially selected.</small>
					<Combobox id="int-options" bind:value={intValue}>
						<Option value="1" disabled>Type 1</Option>
						<Option value="2">Type 2</Option>
						<Option value="3">Type 3</Option>
					</Combobox>
					<small>Selected Value: {intValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Disabled examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled Combobox</strong>
					<Combobox id="disabled" bind:value={disabledValue} options={sizes} disabled />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With disabled items</strong>
					<Combobox id="disabled-items" bind:value={disabledItemsValue}>
						<Option value="small">Small</Option>
						<Option value="medium" disabled>Medium</Option>
						<Option value="large">Large</Option>
					</Combobox>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>All items disabled</strong>
					<Combobox id="all-disabled" bind:value={allDisabledValue}>
						<Option value="small" disabled>Small</Option>
						<Option value="medium" disabled>Medium</Option>
						<Option value="large" disabled>Large</Option>
					</Combobox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Appearance example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Filled</strong>
					<Combobox id="filled" bind:value={filledValue} options={sizes} appearance="filled" />
					<small>Selected: {filledValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Autocomplete examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Inline Autocomplete</strong>
					<Combobox id="inline" bind:value={inlineValue} options={songs} autocomplete="inline" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>List Autocomplete</strong>
					<Combobox id="list" bind:value={listValue} options={songs} autocomplete="list" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Both Autocomplete</strong>
					<Combobox id="both" bind:value={bothValue} options={songs} autocomplete="both" />
				</Stack>
			</GridItem>
		</Grid>
		<Stack orientation="vertical" gap="0.5rem" style="margin-top: 1rem;">
			<strong>Diacritics Test</strong>
			<small style="color: var(--neutral-foreground-hint);">Try typing: jose, francois, soren, jiri, etc.</small>
			<Combobox id="diacritics" bind:value={diacriticsValue} options={namesWithDiacritics} autocomplete="list" width="300px" />
			<small>Selected: {diacriticsValue[0] ? namesWithDiacritics.find(n => n.value === diacriticsValue[0])?.label : "None"}</small>
		</Stack>

		<h3>Minimum search length</h3>
		<p>Use <code>minSearchLength</code> to keep the dropdown closed until the user has typed at least N characters. Useful against large or async option sets where opening on a single character would be wasteful.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>minSearchLength={2}</strong>
					<small style="color: var(--neutral-foreground-hint);">Type one character — dropdown stays closed. Type a second — it opens.</small>
					<Combobox id="min-search" bind:value={minSearchValue} options={namesWithDiacritics} autocomplete="list" minSearchLength={2} width="300px" />
					<small>Selected: {minSearchValue[0] ? namesWithDiacritics.find(n => n.value === minSearchValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>List examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With long list</strong>
					<Combobox id="long-list" bind:value={longListValue} options={longList} />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position above</strong>
					<Combobox id="above" bind:value={aboveValue} options={sizes} position="above" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position below</strong>
					<Combobox id="below" bind:value={belowValue} options={sizes} position="below" />
				</Stack>
			</GridItem>
		</Grid>

		<h3>Option template</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="template" bind:value={templateValue}>
						{#each people as person (person.value)}
							<Option value={person.value} label={`${person.firstName} (${person.lastName})`}>
								<span class="person-option">
									<Icon name="person" size={16} />
									<span>{person.firstName} ({person.lastName})</span>
								</span>
							</Option>
						{/each}
					</Combobox>
					<small>Selected: {templateValue[0] ? people.find(p => p.value === templateValue[0])?.firstName : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Width and styling</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Custom width (200px)</strong>
					<Combobox id="width-small" bind:value={widthValue} options={sizes} width="200px" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Full width (100%)</strong>
					<Combobox id="width-full" bind:value={widthValue} options={sizes} width="100%" />
				</Stack>
			</GridItem>
		</Grid>

		<h3>Callback example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With onchange callback</strong>
					<Combobox
						id="callback"
						bind:value={callbackValue}
						options={songs}
						onchange={() => handleSelectionChange(callbackValue)}
					/>
					<small>{callbackMessage || "Make a selection to see the callback"}</small>
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
		<h2>Autocomplete Modes</h2>
		<table class="api-table">
			<thead>
				<tr>
					<th>Mode</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>inline</code></td>
					<td>Autocompletes text in the input field as you type</td>
				</tr>
				<tr>
					<td><code>list</code></td>
					<td>Filters the dropdown list to matching options</td>
				</tr>
				<tr>
					<td><code>both</code></td>
					<td>Combines inline autocomplete with list filtering</td>
				</tr>
			</tbody>
		</table>
	</Card>
</Stack>

<style>
	.person-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.api-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--neutral-layer-3);
		font-weight: 600;
		border-bottom: 2px solid var(--neutral-stroke-rest);
	}

	.api-table td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--neutral-stroke-rest);
	}

	.api-table code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}
</style>
