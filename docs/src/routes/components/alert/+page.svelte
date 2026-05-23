<script lang="ts">
	import {Alert, Card, QuickGrid, Stack, Grid, GridItem, Icon} from "svelte-fluentui"
	import {References} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "intent", type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: "The intent/severity level of the alert"},
		{name: "title", type: "string", default: "undefined", description: "The header/title text"},
		{name: "dismissable", type: "boolean", default: "false", description: "Whether the alert can be dismissed"},
		{name: "class", type: "string", default: "undefined", description: "Custom CSS classes"},
		{name: "style", type: "string", default: "undefined", description: "Inline styles"}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "The body content of the alert"},
		{name: "icon", type: "Snippet", default: "undefined", description: "Custom icon (overrides default intent icon)"}
	]

	const callbacks: Property[] = [
		{name: "ondismiss", type: "() => void", default: "undefined", description: "Called when the dismiss button is clicked"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	let dismissCount = $state(0)

	function handleDismiss() {
		dismissCount++
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Alert</h1>

	<p>
		A contextual banner that displays informational, success, warning, or error messages with an optional
		dismiss action. Inspired by the FluentUI Blazor MessageBar component.
	</p>

	<References links={[
		{label: "Alert", custom: true},
		{label: "FluentUI Blazor (MessageBar)", href: "https://www.fluentui-blazor.net/MessageBar"}
	]} />



	<Card>
		<h2 class="content-subhead">Intent Levels</h2>
		<Stack orientation="vertical" gap="1rem">
			<Alert intent="info" title="Information">
				This is an informational message.
			</Alert>

			<Alert intent="success" title="Success">
				Your changes have been saved successfully.
			</Alert>

			<Alert intent="warning" title="Warning">
				Please review your input before continuing.
			</Alert>

			<Alert intent="danger" title="Error">
				An error occurred while processing your request.
			</Alert>
		</Stack>
	</Card>

	<Card>
		<h2 class="content-subhead">Without Title</h2>
		<Stack orientation="vertical" gap="1rem">
			<Alert intent="info">
				A simple info message without a title.
			</Alert>

			<Alert intent="success">
				Operation completed.
			</Alert>
		</Stack>
	</Card>

	<Card>
		<h2 class="content-subhead">Dismissable</h2>
		<p style="margin-bottom: 1rem;">Dismissed count: {dismissCount}</p>
		<Stack orientation="vertical" gap="1rem">
			<Alert intent="info" title="Dismissable Alert" dismissable ondismiss={handleDismiss}>
				Click the X button to dismiss this alert.
			</Alert>

			<Alert intent="warning" title="Another Dismissable" dismissable ondismiss={handleDismiss}>
				This warning can also be dismissed.
			</Alert>
		</Stack>
	</Card>

	<Card>
		<h2 class="content-subhead">Custom Icon</h2>
		<Stack orientation="vertical" gap="1rem">
			<Alert intent="info" title="Custom Icon Example">
				{#snippet icon()}
					<Icon name="lightbulb_filament" size={16} />
				{/snippet}
				This alert uses a custom lightbulb icon.
			</Alert>
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
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>
