<script lang="ts">
	import { Switch, Stack, Grid, GridItem, Card, QuickGrid } from "svelte-fluentui";
	let switchState = false;

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "checked", type: "boolean", default: "false", description: "Whether switch is on"},
		{name: "checkedMessage", type: "string", default: "undefined", description: "Message when checked"},
		{name: "class", type: "string", default: "\"\"", description: ""},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the switch"},
		{name: "id", type: "string", default: "undefined", description: ""},
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Prevents user changes"},
		{name: "required", type: "boolean", default: "undefined", description: "Required for form submission"},
		{name: "style", type: "string", default: "\"\"", description: "Custom CSS"},
		{name: "uncheckedMessage", type: "string", default: "undefined", description: "Message when unchecked"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = [
		{name: "onChange", type: "(checked: boolean) => void", default: "undefined", description: "Fires when the checked state changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Additional content"},
		{name: "labelTemplate", type: "SlotType", default: "undefined", description: "Custom label markup"},
		{name: "checked-message", type: "string", default: "undefined", description: "Message when on"},
		{name: "unchecked-message", type: "string", default: "undefined", description: "Message when off"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Switch</h1>

	<p>
		A two-state toggle that wraps the <code>&lt;fluent-switch&gt;</code> element, with optional
		checked/unchecked labels and standard form integration.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-switch--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Switch" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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

		<h3>Basic switch</h3>
		<p>
			<Switch label="Enable notifications" />
		</p>

		<h3>Switch with messages</h3>
		<p>
			<Switch
				label="Send notifications?"
				checkedMessage="Yes"
				uncheckedMessage="No"
			/>
		</p>

		<h3>Disabled switch</h3>
		<p>
			<Switch label="Unavailable option" disabled={true} checked={true} />
		</p>

		<h3>Controlled switch</h3>
		<p>
			<Switch label="Custom toggle" bind:checked={switchState} onchange={(val) => switchState = val} />
			<br />
			State: {switchState ? "ON" : "OFF"}
		</p>
	</Card>
</Stack>
