<script lang="ts">
	import {Select, Option, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui";

	let selectedFruit = "apple";

	// Example: Languages with full object data
	type Language = {
		id: number
		name: string
		code: string
		native: string
	}

	const languages: Language[] = [
		{ id: 1, name: "English", code: "en", native: "English" },
		{ id: 2, name: "Czech", code: "cs", native: "Čeština" },
		{ id: 3, name: "German", code: "de", native: "Deutsch" },
		{ id: 4, name: "Spanish", code: "es", native: "Español" }
	]

	let selectedLanguageValue = "1"
	let selectedLanguage: Language | undefined = languages[0]

	function handleLanguageChange(detail: { value: string, data?: Record<string, unknown> }) {
		selectedLanguageValue = detail.value
		selectedLanguage = detail.data as Language | undefined
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "id", type: "string", default: "undefined", description: "Element ID"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "value", type: "string", default: "undefined", description: "Selected value (bindable)"},
		{name: "required", type: "boolean", default: "undefined", description: "Form required validation"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the control"},
		{name: "appearance", type: "\"outline\" | \"filled\"", default: "undefined", description: "Visual style"},
		{name: "open", type: "boolean", default: "undefined", description: "Controls dropdown open state"},
		{name: "position", type: "\"above\" | \"below\"", default: "undefined", description: "Dropdown position"},
		{name: "multiple", type: "boolean", default: "false", description: "Allow multiple selections"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus on mount"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"}
	]

	const optionProperties: Property[] = [
		{name: "value", type: "string", default: "required", description: "Option value"},
		{name: "label", type: "string", default: "undefined", description: "Option label (for accessibility)"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the option"},
		{name: "selected", type: "boolean", default: "undefined", description: "Pre-select this option"},
		{name: "data", type: "Record<string, unknown>", default: "undefined", description: "Arbitrary context data returned in onchange"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "(detail: { value: string, data?: Record<string, unknown> }) => void", default: "undefined", description: "Triggered when selection changes. Returns value and optional data from selected Option."}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Option components"},
		{name: "labelTemplate", type: "SlotType", default: "undefined", description: "Custom label template"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Select</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dropdown--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Select" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Select Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Option Properties</h2>
				<QuickGrid items={optionProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>Callbacks</h2>
					<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
				</Card>
				<Card>
					<h2>Slots</h2>
					<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>

		<h3>Basic Select</h3>
		<p>
			<Select label="Fruits" name="fruit">
				{#snippet children()}
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
					<Option value="cherry">Cherry</Option>
				{/snippet}
			</Select>
		</p>

		<h3>Disabled Select</h3>
		<p>
			<Select label="Disabled" disabled={true}>
				{#snippet children()}
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
				{/snippet}
			</Select>
		</p>

		<h3>Controlled Select with Two-Way Binding</h3>
		<p>
			<Select label="Controlled" bind:value={selectedFruit} name="fruit">
				{#snippet children()}
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
					<Option value="cherry">Cherry</Option>
				{/snippet}
			</Select>
			<br/>
			Selected value: <code>{selectedFruit}</code>
		</p>
	</Card>

	<Card>
		<h2>Select with Item Data</h2>
		<p>
			Use the <code>data</code> prop on <code>Option</code> to pass arbitrary context data.
			When the selection changes, <code>onchange</code> returns both the <code>value</code> and the full <code>data</code> object.
		</p>
		<p>
			<Select label="Language" value={selectedLanguageValue} onchange={handleLanguageChange}>
				{#snippet children()}
					{#each languages as lang}
						<Option value={String(lang.id)} data={lang}>{lang.name} ({lang.native})</Option>
					{/each}
				{/snippet}
			</Select>
		</p>
		<p>
			Selected value: <code>{selectedLanguageValue}</code><br/>
			Selected data: <code>{JSON.stringify(selectedLanguage)}</code>
		</p>

		<h4>Code</h4>
		<pre>{`<script lang="ts">
  type Language = {
    id: number
    name: string
    code: string
    native: string
  }

  const languages: Language[] = [
    { id: 1, name: "English", code: "en", native: "English" },
    { id: 2, name: "Czech", code: "cs", native: "Čeština" },
    { id: 3, name: "German", code: "de", native: "Deutsch" },
    { id: 4, name: "Spanish", code: "es", native: "Español" }
  ]

  let selectedLanguageValue = "1"
  let selectedLanguage: Language | undefined = languages[0]

  function handleLanguageChange(detail: { value: string, data?: Record<string, unknown> }) {
    selectedLanguageValue = detail.value
    selectedLanguage = detail.data as Language | undefined
  }
</script>

<Select label="Language" value={selectedLanguageValue} onchange={handleLanguageChange}>
  {#snippet children()}
    {#each languages as lang}
      <Option value={String(lang.id)} data={lang}>
        {lang.name} ({lang.native})
      </Option>
    {/each}
  {/snippet}
</Select>`}</pre>
	</Card>
</Stack>
