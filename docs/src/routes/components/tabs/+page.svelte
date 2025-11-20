<script lang="ts">
	import {Tab, Tabs, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "childContent", type: "SlotType", default: "undefined", description: "Slot for additional child content"},
		{name: "class", type: "string", default: '""', description: "Custom class for styling"},
		{name: "content", type: "SlotType", default: "undefined", description: "Slot for tab panel content"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the tab"},
		{name: "header", type: "SlotType", default: "undefined", description: "Custom header slot"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Optional icon slot"},
		{name: "id", type: "string", default: "undefined", description: "Unique ID"},
		{name: "label", type: "string", default: "undefined", description: "Tab label text"},
		{name: "labelEditable", type: "boolean", default: "false", description: "Allows inline editing of label"},
		{name: "overflow", type: "string", default: "undefined", description: "Overflow behavior of the tab"},
		{name: "showClose", type: "boolean", default: "false", description: "Shows close button on tab"},
		{name: "style", type: "string", default: '""', description: "Inline CSS styles"},
		{name: "visible", type: "boolean", default: "true", description: "Controls whether tab is rendered"}
	]

	const actions: Property[] = [
		{name: "onCloseClick", type: "function", default: "undefined", description: "Fires when close button is clicked"}
	]

	const slots: Property[] = [
		{name: "childContent", type: "SlotType", default: "undefined", description: "Tab items and panels"},
		{name: "icon", type: "SlotType", default: "conditional", description: "Slot for icon inside tab header"},
		{name: "header", type: "SlotType", default: "conditional", description: "Custom tab header content"},
		{name: "content", type: "SlotType", default: "conditional", description: "Main content inside tab panel"},
		{name: "end", type: "fluent-badge", default: "conditional", description: "Overflow badge"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Tab</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-tablist--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Tabs" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
					<h2>Actions</h2>
					<QuickGrid items={actions} columns={propertyColumns} sortable filterable striped />
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
		<h2 class="content-subhead">Examples</h2>

		<h3>Basic tab layout</h3>

		<Tabs>
			{#snippet childContent()}
				<Tab id="tab1" label="First tab">
					{#snippet content()}
						<p>Example text for tab 1</p>
					{/snippet}
				</Tab>

				<Tab id="tab2" label="Second tab">
					{#snippet content()}
						<p>Example text for tab 2</p>
					{/snippet}
				</Tab>
			{/snippet}
		</Tabs>
	</Card>
</Stack>

