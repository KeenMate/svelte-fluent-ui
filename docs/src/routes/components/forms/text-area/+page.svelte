<script lang="ts">
	import {Textarea, Button, Stack, Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let focusTarget: {focus: () => void} | undefined = $state()

	function focusAsync() {
		focusTarget?.focus()
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "\"outline\" | \"filled\"", default: "\"outline\"", description: "Visual style"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "autocomplete", type: "string", default: "\"off\"", description: "Browser autocomplete attribute (applied to inner <textarea> via shadow DOM)"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus on mount"},
		{name: "class", type: "string", default: "\"\"", description: "CSS class"},
		{name: "cols", type: "number", default: "undefined", description: "Number of character columns"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable input"},
		{name: "form", type: "string", default: "undefined", description: "Associated form id"},
		{name: "fullWidth", type: "boolean", default: "false", description: "Stretch the host to fill its container. By default the host sizes to its content (matches Blazor)."},
		{name: "id", type: "string", default: "undefined", description: "Element id"},
		{name: "label", type: "string", default: "undefined", description: "Visible label rendered above the textarea"},
		{name: "list", type: "string", default: "undefined", description: "Datalist id to associate"},
		{name: "maxlength", type: "number", default: "undefined", description: "Maximum number of characters"},
		{name: "minlength", type: "number", default: "undefined", description: "Minimum number of characters"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "undefined", description: "Required for form submission"},
		{name: "resize", type: "\"none\" | \"both\" | \"horizontal\" | \"vertical\"", default: "undefined", description: "Resize behavior"},
		{name: "rows", type: "number", default: "undefined", description: "Number of character rows"},
		{name: "spellcheck", type: "boolean", default: "undefined", description: "Enable spellcheck"},
		{name: "style", type: "string", default: "\"\"", description: "Inline style"},
		{name: "value", type: "string", default: "undefined", description: "Text value (bindable)"}
	]

	const callbacks: Property[] = [
		{name: "oninput", type: "(value: string) => void", default: "undefined", description: "Fires as value is typed"},
		{name: "onchange", type: "(value: string) => void", default: "undefined", description: "Fires when value changes on blur"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Additional content rendered inside <fluent-text-area>"},
		{name: "labelTemplate", type: "SlotType", default: "undefined", description: "Custom label markup"}
	]

	const actions: Property[] = [
		{name: "focus", type: "() => void", default: "-", description: "Focus the textarea (via bind:this, calls native HTMLElement.focus())"}
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
		title="TextArea"
		description="A Svelte wrapper for FluentUI's text-area web component — a multi-line text input with outline and filled appearances and form integration."
		keywords="svelte, fluentui, textarea, text area, multiline, form, input"
	/>

	<h1>TextArea</h1>

	<p>
		A multi-line text input that wraps the <code>&lt;fluent-text-area&gt;</code> element, with outline
		and filled appearances and standard form integration.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-textarea--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/TextArea"}
	]} />

	<Card>
		<h2>Default</h2>
		<Stack orientation="vertical" gap="1rem">
			<Stack orientation="horizontal" gap="0.5rem" verticalAlign="center">
				<span>Without label:</span>
				<Textarea />
			</Stack>
			<Textarea label="With label:" />
		</Stack>
	</Card>

	<Card>
		<h2>Rows and Cols</h2>
		<Stack orientation="vertical" gap="1rem">
			<Textarea label="12 rows:" rows={12} />
			<Textarea label="60 cols:" cols={60} />
		</Stack>
	</Card>

	<Card>
		<h2>Displays</h2>
		<Stack orientation="vertical" gap="1rem">
			<Textarea label="Full width:" fullWidth />
			<Textarea label="Placeholder:" placeholder="Placeholder" />
		</Stack>
	</Card>

	<Card>
		<h2>States</h2>
		<Stack orientation="vertical" gap="1rem">
			<Textarea label="Required:" required />
			<Stack orientation="horizontal" gap="1rem">
				<Textarea disabled />
				<Textarea label="label" disabled />
				<Textarea disabled placeholder="placeholder" />
			</Stack>
			<Stack orientation="horizontal" gap="1rem">
				<Textarea readonly value="Readonly text area" />
				<Textarea label="label" readonly value="Readonly text area" />
			</Stack>
		</Stack>
	</Card>

	<Card>
		<h2>Resize</h2>
		<Stack orientation="vertical" gap="1rem">
			<Textarea label="Both:" resize="both" />
			<Textarea label="Horizontal:" resize="horizontal" />
			<Textarea label="Vertical:" resize="vertical" />
		</Stack>
	</Card>

	<Card>
		<h2>Focus</h2>
		<Stack orientation="vertical" gap="1rem">
			<div>
				<h3>Autofocus</h3>
				<p>Commented out to prevent the page from jumping to this location on load. See example code for usage:</p>
				<pre><code>&lt;Textarea autofocus /&gt;</code></pre>
			</div>
			<div>
				<h3>Focus via bind:this</h3>
				<Stack orientation="horizontal" gap="0.5rem" verticalAlign="center">
					<Button onclick={focusAsync}>FocusAsync</Button>
					<Textarea bind:this={focusTarget} />
				</Stack>
			</div>
		</Stack>
	</Card>

	<Card>
		<h2>Filled appearance</h2>
		<Stack orientation="vertical" gap="1rem">
			<Stack orientation="horizontal" gap="1rem">
				<Textarea appearance="filled" />
				<Textarea appearance="filled" label="label" />
			</Stack>
			<Textarea appearance="filled" placeholder="Placeholder" />
			<Textarea appearance="filled" label="Required:" required />
			<Stack orientation="horizontal" gap="1rem">
				<Textarea appearance="filled" disabled />
				<Textarea appearance="filled" label="label" disabled />
				<Textarea appearance="filled" disabled placeholder="placeholder" />
			</Stack>
			<Stack orientation="horizontal" gap="1rem">
				<Textarea appearance="filled" readonly value="Read only text area" />
				<Textarea appearance="filled" label="label" readonly value="Read only text area" />
			</Stack>
		</Stack>
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
		<h2>Actions</h2>
		<QuickGrid items={actions} columns={propertyColumns} sortable filterable striped />
	</Card>
</Stack>
