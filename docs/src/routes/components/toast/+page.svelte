<script lang="ts">
	import {Toast, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"
	let showToast = false
	let toastId = "demo-toast"

	function handleTopAction() {
		console.log("Top action clicked")
	}

	function handlePrimaryAction() {
		console.log("Primary action clicked")
	}

	function handleSecondaryAction() {
		showToast = false
		console.log("Secondary action clicked")
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "id", type: "string", default: "undefined", description: "Unique toast ID"},
		{name: "title", type: "string", default: "undefined", description: "Main message or heading"},
		{name: "timestamp", type: "Date", default: "undefined", description: 'Displayed if topCTAType is "Timestamp"'},
		{name: "topCTAType", type: '"Dismiss" | "Timestamp" | "Action"', default: "undefined", description: "What to show on the top right"},
		{name: "topAction", type: "string", default: "undefined", description: "Top right action text (if Action type)"},
		{name: "primaryAction", type: "string", default: "undefined", description: "Primary button at bottom"},
		{name: "secondaryAction", type: "string", default: "undefined", description: "Secondary button at bottom"}
	]

	const callbacks: Property[] = [
		{name: "ondismiss", type: "() => void", default: "undefined", description: "Fired when dismiss button is clicked"},
		{name: "ontopactionclick", type: "() => void", default: "undefined", description: "Fired when top right action is clicked"},
		{name: "onprimaryactionclick", type: "() => void", default: "undefined", description: "Fired when primary action is clicked"},
		{name: "onsecondaryactionclick", type: "() => void", default: "undefined", description: "Fired when secondary action is clicked"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Additional message or markup content"}
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
		title="Toast"
		description="Declarative Svelte notification card with title, subtitle, timestamp, and primary/secondary actions, rendered in place. Inspired by FluentUI Blazor."
		keywords="svelte, fluentui, toast, notification, snackbar, message, alert"
	/>

	<h1>Toast (Declarative Component)</h1>

	<p>
		A notification card with title, subtitle, timestamp, and primary/secondary actions, rendered
		declaratively in place. Inspired by the FluentUI Blazor Toast component. For programmatic toasts
		triggered from anywhere, see <code>ToastService</code>.
	</p>

	<Card>
		<p>
			<strong>ℹ️ Note:</strong> This is the declarative <code>&lt;Toast&gt;</code> component for manual state management.
			For programmatic toasts (call <code>toast.success()</code> from anywhere), see the
			<a href="/components/toast-service"><strong>Toast Service</strong></a> instead.
		</p>
	</Card>

	<References links={[
		{label: "MessageBar", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-messagebar-messagebar--docs"},
		{label: "FluentUI Blazor MessageBar", href: "https://www.fluentui-blazor.net/MessageBar"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Toast with timestamp</h3>
		<Toast title="Auto-saved" timestamp={new Date()} topCTAType="timestamp" />
		<button onclick={() => (showToast = true)} class="show-toast-button">
			Show Toast
		</button>

		{#if showToast}
			<div class="toast-container">
				<Toast
					id={toastId}
					title="Saved Successfully"
					timestamp={new Date()}
					topCTAType="action"
					topAction="Undo"
					primaryAction="View Details"
					secondaryAction="Dismiss"
					ontopactionclick={handleTopAction}
					onprimaryactionclick={handlePrimaryAction}
					onsecondaryactionclick={handleSecondaryAction}
				></Toast>
			</div>
		{/if}
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
</Stack>

<style>
	.show-toast-button {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.toast-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		width: 300px;
	}
</style>
