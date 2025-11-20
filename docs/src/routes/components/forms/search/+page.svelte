<script lang="ts">
	import {Search, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"
	let query = ""

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "string", default: "undefined", description: "Style variant"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "autocomplete", type: "string", default: "undefined", description: "Browser autocomplete behavior (e.g., \"off\", \"on\")"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus field"},
		{name: "class", type: "string", default: "\"\"", description: "CSS class"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable field"},
		{name: "id", type: "string", default: "undefined", description: "HTML id"},
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "maxlength", type: "number", default: "undefined", description: "Max input length"},
		{name: "minlength", type: "number", default: "undefined", description: "Min input length"},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "pattern", type: "string", default: "undefined", description: "Validation pattern"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "undefined", description: "Required field"},
		{name: "size", type: "number", default: "undefined", description: "Field size"},
		{name: "spellcheck", type: "boolean", default: "undefined", description: "Spellcheck enabled"},
		{name: "style", type: "string", default: "\"\"", description: "Inline style"},
		{name: "value", type: "string", default: "\"\"", description: "Input value"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(ev: Event) => void", default: "undefined", description: "Fires when value changes"},
		{name: "onInput", type: "(ev: InputEvent) => void", default: "undefined", description: "Fires on every input"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Custom elements inside input"},
		{name: "labelTemplate", type: "SlotType", default: "undefined", description: "Custom label markup"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Search</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Search" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

	<Card>

		<h2>Examples</h2>

		<h3>Basic Search</h3>
		<Search label="Search term" placeholder="Type here..." />

		<h3>Disabled Search</h3>
		<Search label="Disabled input" disabled={true} value="Static text" />

		<h3>Controlled Search</h3>
		<Search label="Controlled" bind:value={query} placeholder="Search..." />
		<p>Query: {query}</p>
	</Card>
</Stack>
