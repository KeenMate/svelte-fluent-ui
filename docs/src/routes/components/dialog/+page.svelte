<script lang="ts">
	import {Button, Dialog, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	let dialog: Dialog
	let smallDialog = $state(false)
	let mediumDialog = $state(false)
	let largeDialog = $state(false)
	let extraLargeDialog = $state(false)
	let fullDialog = $state(false)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "modal", type: "boolean", default: "undefined", description: "Modal behavior"},
		{name: "visible", type: "boolean", default: "undefined", description: "Visibility state"},
		{name: "preventClose", type: "boolean", default: "false", description: "Prevent closing"},
		{name: "dismissable", type: "boolean", default: "false", description: "Show dismiss button"},
		{name: "trapFocus", type: "boolean", default: "undefined", description: "Trap focus"},
		{name: "size", type: '"small" | "medium" | "large" | "extra-large" | "full"', default: '"medium"', description: "Predefined dialog size"},
		{name: "width", type: "string", default: "undefined", description: "Custom width (overrides size)"},
		{name: "height", type: "string", default: "undefined", description: "Custom height (overrides size)"},
		{name: "ariaDescribedby", type: "string", default: "undefined", description: "Accessibility: described by"},
		{name: "ariaLabelledby", type: "string", default: "undefined", description: "Accessibility: labelled by"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"}
	]

	const actions: Property[] = [
		{name: "show", type: "() => void", default: "-", description: "Show the dialog"},
		{name: "hide", type: "() => void", default: "-", description: "Hide the dialog"}
	]

	const callbacks: Property[] = [
		{name: "onClose", type: "() => void", default: "undefined", description: "Fires when dialog is closed"}
	]

	const slots: Property[] = [
		{name: "children", type: "any", default: "undefined", description: "Dialog content"},
		{name: "actions", type: "any", default: "undefined", description: "Action buttons"},
		{name: "dismissButtonText", type: "any", default: "undefined", description: "Dismiss button text"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Dialog</h1>

	<p>
		A modal or non-modal overlay that wraps the <code>&lt;fluent-dialog&gt;</code> element, with focus
		trapping, dismiss behavior, preset sizes, and an actions slot for footer buttons.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dialog-dialog--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Dialog" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
		<h2>Actions</h2>
		<QuickGrid items={actions} columns={propertyColumns} sortable filterable striped />
	</Card>

	<Card>
		<h2>Examples</h2>

		<h3>Dialog Sizes</h3>
		<p>Dialogs can be displayed in different predefined sizes using the <code>size</code> prop.</p>

		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Button appearance="accent" onclick={() => smallDialog = true}>
				Small (400px)
			</Button>
			<Button appearance="accent" onclick={() => mediumDialog = true}>
				Medium (600px)
			</Button>
			<Button appearance="accent" onclick={() => largeDialog = true}>
				Large (800px)
			</Button>
			<Button appearance="accent" onclick={() => extraLargeDialog = true}>
				Extra Large (1000px)
			</Button>
			<Button appearance="accent" onclick={() => fullDialog = true}>
				Full (90vw x 90vh)
			</Button>
		</Stack>

		<!-- Small Dialog -->
		<Dialog visible={smallDialog} modal={true} size="small" onClose={() => smallDialog = false}>
			<h3 style="margin: 0 0 1rem 0;">Small Dialog</h3>
			<p>This is a small dialog (400px wide).</p>
			<p>Perfect for simple confirmations or short messages.</p>
			<div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
				<Button appearance="accent" onclick={() => smallDialog = false}>Close</Button>
			</div>
		</Dialog>

		<!-- Medium Dialog -->
		<Dialog visible={mediumDialog} modal={true} size="medium" onClose={() => mediumDialog = false}>
			<h3 style="margin: 0 0 1rem 0;">Medium Dialog</h3>
			<p>This is a medium dialog (600px wide) - the default size.</p>
			<p>Suitable for most dialog content including forms and detailed information.</p>
			<div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
				<Button appearance="accent" onclick={() => mediumDialog = false}>Close</Button>
			</div>
		</Dialog>

		<!-- Large Dialog -->
		<Dialog visible={largeDialog} modal={true} size="large" onClose={() => largeDialog = false}>
			<h3 style="margin: 0 0 1rem 0;">Large Dialog</h3>
			<p>This is a large dialog (800px wide).</p>
			<p>Great for more complex content, multiple columns, or detailed forms.</p>
			<p>You can add more content here and it will have plenty of space to display properly.</p>
			<div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
				<Button appearance="accent" onclick={() => largeDialog = false}>Close</Button>
			</div>
		</Dialog>

		<!-- Extra Large Dialog -->
		<Dialog visible={extraLargeDialog} modal={true} size="extra-large" onClose={() => extraLargeDialog = false}>
			<h3 style="margin: 0 0 1rem 0;">Extra Large Dialog</h3>
			<p>This is an extra large dialog (1000px wide).</p>
			<p>Perfect for dashboards, complex data tables, or multi-step wizards.</p>
			<p>This size provides maximum space while still maintaining a dialog feel.</p>
			<div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
				<Button appearance="accent" onclick={() => extraLargeDialog = false}>Close</Button>
			</div>
		</Dialog>

		<!-- Full Dialog -->
		<Dialog visible={fullDialog} modal={true} size="full" onClose={() => fullDialog = false}>
			<h3 style="margin: 0 0 1rem 0;">Full Screen Dialog</h3>
			<p>This is a full-screen dialog (90vw x 90vh).</p>
			<p>Use this for immersive experiences that need maximum screen real estate.</p>
			<p>Great for image galleries, video players, or complex workflows.</p>
			<div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
				<Button appearance="accent" onclick={() => fullDialog = false}>Close</Button>
			</div>
		</Dialog>

		<h3>Basic Dialog</h3>
		<p>Simple dialog with programmatic control using <code>show()</code> and <code>hide()</code> methods.</p>

		<Button appearance="accent" onclick={() => dialog.show()}>
			Open Basic Dialog
		</Button>

		<Dialog bind:this={dialog}>
			<h3 style="margin: 0 0 1rem 0;">Basic Dialog</h3>
			<p>This dialog can be controlled using the <code>show()</code> and <code>hide()</code> methods.</p>
			<p>Click the X button or use the Dismiss button to close.</p>
		</Dialog>
	</Card>
</Stack>

<style>
	code {
		background-color: var(--neutral-layer-2);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875em;
	}
</style>
