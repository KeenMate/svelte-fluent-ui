<script lang="ts">
	import { Textarea, Stack, Grid, GridItem, Card, QuickGrid } from "$lib/index.js";

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "\"outline\" | \"filled\"", default: "undefined", description: "Visual style"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus on mount"},
		{name: "class", type: "string", default: "\"\"", description: "CSS class"},
		{name: "cols", type: "number", default: "undefined", description: "Number of columns"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable input"},
		{name: "form", type: "string", default: "undefined", description: "Form owner"},
		{name: "id", type: "string", default: "undefined", description: "Unique ID"},
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "list", type: "string", default: "undefined", description: "Datalist id"},
		{name: "maxlength", type: "number", default: "undefined", description: "Max character length"},
		{name: "minlength", type: "number", default: "undefined", description: "Min character length"},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "undefined", description: "Form required"},
		{name: "resize", type: "\"none\" | \"both\" | \"horizontal\" | \"vertical\"", default: "undefined", description: "Resize behavior"},
		{name: "rows", type: "number", default: "undefined", description: "Number of rows"},
		{name: "spellcheck", type: "boolean", default: "undefined", description: "Enable spellcheck"},
		{name: "style", type: "string", default: "\"\"", description: "Inline style"},
		{name: "value", type: "string", default: "\"\"", description: "Text value"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(ev: Event) => void", default: "undefined", description: "Fires when value changes on blur"},
		{name: "onInput", type: "(ev: InputEvent) => void", default: "undefined", description: "Fires as value is typed"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Additional content"},
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
	<h1>TextArea</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-textarea--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/TextArea" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h3>Basic Textarea</h3>
		<Textarea placeholder="Type here..." resize="both" />

		<h3>Textarea with max length</h3>
		<Textarea maxlength={10} placeholder="Max 10 chars" />

		<h3>Disabled Textarea with label</h3>
		<Textarea label="Not editable" disabled={true} value="Read-only content" />
	</Card>
</Stack>
