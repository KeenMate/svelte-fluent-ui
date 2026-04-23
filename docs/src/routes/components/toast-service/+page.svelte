<script lang="ts">
	import {QuickGrid, Stack, Grid, GridItem, Card, Button} from "svelte-fluentui"
	import {toast} from "svelte-fluentui"

	let lastToastId = ""

	function showSuccess() {
		lastToastId = toast.success("Operation completed successfully!")
	}

	function showError() {
		lastToastId = toast.error("Something went wrong. Please try again.")
	}

	function showWarning() {
		lastToastId = toast.warning("This action cannot be undone.")
	}

	function showInfo() {
		lastToastId = toast.info("New features are now available.")
	}

	function showWithTitle() {
		lastToastId = toast.success("File uploaded", {
			title: "Upload Complete"
		})
	}

	function showPersistent() {
		lastToastId = toast.error("This toast requires manual dismissal", {
			persistent: true
		})
	}

	function showWithProgress() {
		lastToastId = toast.info("Processing your request...", {
			showProgress: true,
			duration: 8000
		})
	}

	function showTopLeft() {
		lastToastId = toast.success("Top Left Position", {position: "top-left"})
	}

	function showTopCenter() {
		lastToastId = toast.info("Top Center Position", {position: "top-center"})
	}

	function showTopRight() {
		lastToastId = toast.success("Top Right Position", {position: "top-right"})
	}

	function showBottomLeft() {
		lastToastId = toast.warning("Bottom Left Position", {position: "bottom-left"})
	}

	function showBottomCenter() {
		lastToastId = toast.info("Bottom Center Position", {position: "bottom-center"})
	}

	function showBottomRight() {
		lastToastId = toast.error("Bottom Right Position", {position: "bottom-right"})
	}

	function dismissLast() {
		if (lastToastId) {
			toast.dismiss(lastToastId)
		}
	}

	function dismissAllToasts() {
		toast.dismissAll()
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{
			name: "id",
			type: "string",
			default: "undefined",
			description: "Optional HTML id attribute for the toast element"
		},
		{
			name: "title",
			type: "string",
			default: "undefined",
			description: "Toast title displayed in the header"
		},
		{
			name: "timestamp",
			type: "Date",
			default: "undefined",
			description: "Timestamp shown when topCTAType is set to \"timestamp\""
		},
		{
			name: "topCTAType",
			type: '"dismiss" | "timestamp" | "action"',
			default: "undefined",
			description: "Controls the top-right action area: dismiss button, timestamp display, or a custom action link"
		},
		{
			name: "topAction",
			type: "string",
			default: "undefined",
			description: "Label for the top action link (used when topCTAType is \"action\")"
		},
		{
			name: "primaryAction",
			type: "string",
			default: "undefined",
			description: "Label for the primary action link shown in the footer area"
		},
		{
			name: "secondaryAction",
			type: "string",
			default: "undefined",
			description: "Label for the secondary action link shown in the footer area"
		}
	]

	const callbacks: Property[] = [
		{
			name: "ondismiss",
			type: "() => void",
			default: "undefined",
			description: "Called when the dismiss button is clicked (topCTAType=\"dismiss\")"
		},
		{
			name: "ontopactionclick",
			type: "() => void",
			default: "undefined",
			description: "Called when the top action link is clicked (topCTAType=\"action\")"
		},
		{
			name: "onprimaryactionclick",
			type: "() => void",
			default: "undefined",
			description: "Called when the primary action link is clicked"
		},
		{
			name: "onsecondaryactionclick",
			type: "() => void",
			default: "undefined",
			description: "Called when the secondary action link is clicked"
		}
	]

	const slots: Property[] = [
		{
			name: "children",
			type: "Snippet",
			default: "undefined",
			description: "Default slot — renders the toast body content between the header and action links"
		}
	]

	const storeMethodsData: Property[] = [
		{
			name: "toast.success(message, options?)",
			type: "(message: string, options?: ToastOptions) => string",
			default: "-",
			description: "Show success toast. Returns toast ID."
		},
		{
			name: "toast.error(message, options?)",
			type: "(message: string, options?: ToastOptions) => string",
			default: "-",
			description: "Show error toast. Returns toast ID."
		},
		{
			name: "toast.warning(message, options?)",
			type: "(message: string, options?: ToastOptions) => string",
			default: "-",
			description: "Show warning toast. Returns toast ID."
		},
		{
			name: "toast.info(message, options?)",
			type: "(message: string, options?: ToastOptions) => string",
			default: "-",
			description: "Show info toast. Returns toast ID."
		},
		{
			name: "toast.show(options)",
			type: "(options: ToastOptions) => string",
			default: "-",
			description: "Show toast with full control. Returns toast ID."
		},
		{
			name: "toast.dismiss(id)",
			type: "(id: string) => void",
			default: "-",
			description: "Dismiss specific toast by ID."
		},
		{
			name: "toast.dismissAll(position?)",
			type: "(position?: ToastPosition) => void",
			default: "-",
			description: "Dismiss all toasts or by position."
		}
	]

	const optionsData: Property[] = [
		{
			name: "variant",
			type: '"success" | "error" | "warning" | "info"',
			default: '"info"',
			description: "Toast variant/type"
		},
		{
			name: "title",
			type: "string",
			default: "Auto (based on variant)",
			description: "Toast title"
		},
		{
			name: "message",
			type: "string",
			default: '""',
			description: "Toast message content"
		},
		{
			name: "position",
			type: '"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"',
			default: '"top-right"',
			description: "Toast position on screen"
		},
		{
			name: "duration",
			type: "number",
			default: "5000",
			description: "Auto-dismiss duration in ms"
		},
		{
			name: "showProgress",
			type: "boolean",
			default: "false",
			description: "Show progress bar"
		},
		{
			name: "persistent",
			type: "boolean",
			default: "false",
			description: "Requires manual dismissal"
		}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Toast Service</h1>

	<p>
		A programmatic toast notification system with FluentUI styling. Add <code>&lt;ToastContainer /&gt;</code>
		once in your layout, then call <code>toast.success()</code> from anywhere. For inline notifications see
		the declarative <code>Toast</code> component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://www.fluentui-blazor.net/MessageBar" target="_blank" rel="noopener noreferrer">FluentUI Blazor MessageBar</a>
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

	<Grid spacing={3}>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Store Methods</h2>
				<QuickGrid items={storeMethodsData} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Toast Options</h2>
				<QuickGrid items={optionsData} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>

		<h3>Setup</h3>
		<pre><code>{`// 1. Add ToastContainer to your layout (e.g., +layout.svelte)
import { ToastContainer } from 'svelte-fluentui';

<ToastContainer />

// 2. Use toast service anywhere in your app
import { toast } from 'svelte-fluentui';

const id = toast.success('Operation completed!');
// Later: toast.dismiss(id);`}</code></pre>

		<h3>Basic Variants</h3>
		<div class="button-grid">
			<Button appearance="accent" onClick={showSuccess}>Success Toast</Button>
			<Button appearance="accent" onClick={showError}>Error Toast</Button>
			<Button appearance="accent" onClick={showWarning}>Warning Toast</Button>
			<Button appearance="accent" onClick={showInfo}>Info Toast</Button>
		</div>

		<h3>Custom Options</h3>
		<div class="button-grid">
			<Button appearance="accent" onClick={showWithTitle}>Custom Title</Button>
			<Button appearance="accent" onClick={showPersistent}>Persistent (No Auto-dismiss)</Button>
			<Button appearance="accent" onClick={showWithProgress}>With Progress Bar</Button>
		</div>

		<h3>Positions</h3>
		<div class="button-grid">
			<Button appearance="accent" onClick={showTopLeft}>Top Left</Button>
			<Button appearance="accent" onClick={showTopCenter}>Top Center</Button>
			<Button appearance="accent" onClick={showTopRight}>Top Right</Button>
			<Button appearance="accent" onClick={showBottomLeft}>Bottom Left</Button>
			<Button appearance="accent" onClick={showBottomCenter}>Bottom Center</Button>
			<Button appearance="accent" onClick={showBottomRight}>Bottom Right</Button>
		</div>

		<h3>Dismiss Actions</h3>
		<div class="button-grid">
			<Button appearance="outline" onClick={dismissLast}>Dismiss Last Toast</Button>
			<Button appearance="outline" onClick={dismissAllToasts}>Dismiss All Toasts</Button>
		</div>

		<h3>Usage Examples</h3>
		<pre><code>{`import { toast } from 'svelte-fluentui';

// Basic usage - returns toast ID
const id = toast.success('Saved successfully!');

// With options
toast.error('Upload failed', {
  title: 'Upload Error',
  position: 'top-center',
  persistent: true
});

// With progress bar
toast.info('Processing...', {
  showProgress: true,
  duration: 8000
});

// Dismiss specific toast
toast.dismiss(id);

// Dismiss all toasts
toast.dismissAll();

// Dismiss toasts in specific position
toast.dismissAll('top-right');`}</code></pre>
	</Card>
</Stack>

<style>
	.button-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	code {
		background: var(--neutral-fill-secondary-rest);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.9em;
	}

	pre {
		background: var(--neutral-fill-secondary-rest);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	pre code {
		background: none;
		padding: 0;
	}
</style>
