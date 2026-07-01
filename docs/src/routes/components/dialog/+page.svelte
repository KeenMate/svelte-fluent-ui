<script lang="ts">
	import {Button, Dialog, Tab, Tabs, TextField, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let dialog: Dialog
	let smallDialog = $state(false)
	let mediumDialog = $state(false)
	let largeDialog = $state(false)
	let extraLargeDialog = $state(false)
	let fullDialog = $state(false)

	// "Tabs inside a height-constrained Dialog" reproduction. Toggle the
	// containment pattern on/off to compare the broken vs fixed layout.
	let scrollDialog = $state(false)
	let containScroll = $state(true)

	// Stacked modal dialogs — opening a second modal from inside the first used
	// to ping-pong focus between the two FAST focus traps and freeze the tab.
	let outerDialog = $state(false)
	let innerDialog = $state(false)

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
	<Meta
		title="Dialog"
		description="Modal or non-modal overlay built on FluentUI's dialog web component, with focus trapping, dismiss behavior, preset sizes, and an actions slot."
		keywords="svelte, fluentui, dialog, modal, overlay, popup, web components"
	/>

	<h1>Dialog</h1>

	<p>
		A modal or non-modal overlay that wraps the <code>&lt;fluent-dialog&gt;</code> element, with focus
		trapping, dismiss behavior, preset sizes, and an actions slot for footer buttons.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-dialog-dialog--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Dialog"}
	]} />

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

		<h3>Tabs inside a height-constrained Dialog</h3>
		<p>
			A common pattern: a fixed-height <code>&lt;Dialog&gt;</code> whose body is a
			<code>&lt;Tabs&gt;</code> set to fill the available height, with a tall form (e.g. a
			big expression textarea) inside a panel. By default a tab panel is a plain block —
			it neither fills nor scrolls — so content taller than the dialog
			<strong>overflows and grows out of the dialog</strong> instead of scrolling within it.
		</p>
		<p>
			Toggle the containment pattern to see the fix. It makes
			<code>.fluent-tabs-panels</code> a flex column and gives the active
			<code>.fluent-tab-panel</code> <code>flex: 1; min-height: 0; overflow-y: auto</code>,
			so the panel fills the remaining dialog height and scrolls its own overflow.
		</p>

		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap; align-items: center;">
			<Button appearance="accent" onclick={() => scrollDialog = true}>
				Open Dialog with Tabs
			</Button>
			<label style="display: flex; align-items: center; gap: 0.5rem;">
				<input type="checkbox" bind:checked={containScroll} />
				Apply scroll-containment fix
			</label>
		</Stack>

		<Dialog
			visible={scrollDialog}
			modal={true}
			title="Override value"
			width="640px"
			height="70vh"
			onClose={() => scrollDialog = false}
		>
			<div class="dialog-body-fill">
				<Tabs class={`scroll-demo-tabs${containScroll ? " contained" : ""}`} activeId="expression">
					{#snippet childContent()}
						<Tab id="expression" label="Expression">
							{#snippet content()}
								<div class="expr-form">
									<label class="field-label" for="default-value">Default value</label>
									<TextField id="default-value" placeholder="Static value or field reference" />

									<div class="override-head">Override — Expression</div>
									<textarea
										class="expr-textarea"
										placeholder="Expression — use &#123;&#123;field&#125;&#125; for interpolation"
									></textarea>

									<p class="hint">
										This textarea is the field that grew out of the dialog in the original report.
										With the fix off, the panel doesn't scroll and the whole form spills past the
										dialog bounds.
									</p>
									{#each Array(8) as _, i}
										<TextField placeholder={`Extra rule field ${i + 1}`} />
									{/each}
								</div>
							{/snippet}
						</Tab>
						<Tab id="condition" label="Condition">
							{#snippet content()}
								<div class="expr-form">
									<p>Condition builder goes here.</p>
									<TextField placeholder="when ..." />
								</div>
							{/snippet}
						</Tab>
					{/snippet}
				</Tabs>
			</div>

			{#snippet footer()}
				<Button appearance="accent" onclick={() => scrollDialog = false}>Apply</Button>
				<Button appearance="neutral" onclick={() => scrollDialog = false}>Cancel</Button>
			{/snippet}
		</Dialog>

		<h3>Stacked modal dialogs</h3>
		<p>
			Two modal dialogs can be open at once — e.g. opening a picker from inside an
			already-open form. Each <code>&lt;Dialog&gt;</code> wraps <code>&lt;fluent-dialog&gt;</code>,
			whose FAST focus trap defaults on and pulls focus back inside whenever it escapes.
			With two traps live, they used to fight over focus and freeze the tab with a
			<code>RangeError</code>. The library now keeps the trap active on only the
			<strong>topmost</strong> open dialog and releases it on the ones beneath, re-trapping
			the one below when the top closes.
		</p>
		<p>
			Open the outer dialog, open the inner one from inside it, then <kbd>Tab</kbd> around —
			focus stays trapped in the inner dialog. Close it and focus trapping resumes in the
			outer dialog. No freeze.
		</p>

		<Button appearance="accent" onclick={() => outerDialog = true}>
			Open Outer Dialog
		</Button>

		<!-- Outer (first) modal dialog -->
		<Dialog visible={outerDialog} modal={true} title="Outer dialog" width="520px" onClose={() => outerDialog = false}>
			<p>This is the first modal dialog. Open a second one on top of it.</p>
			<TextField placeholder="Try tabbing through these fields" />
			<TextField placeholder="Focus stays trapped here…" />
			{#snippet footer()}
				<Button appearance="accent" onclick={() => innerDialog = true}>Open Inner Dialog</Button>
				<Button appearance="neutral" onclick={() => outerDialog = false}>Close</Button>
			{/snippet}
		</Dialog>

		<!-- Inner (stacked) modal dialog -->
		<Dialog visible={innerDialog} modal={true} title="Inner dialog" width="400px" onClose={() => innerDialog = false}>
			<p>Now two modal dialogs are open. Tab around — focus is trapped here, not in the outer dialog.</p>
			<TextField placeholder="Inner field 1" />
			<TextField placeholder="Inner field 2" />
			{#snippet footer()}
				<Button appearance="accent" onclick={() => innerDialog = false}>Close Inner</Button>
			{/snippet}
		</Dialog>
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

<style>
	code {
		background-color: var(--neutral-layer-2);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875em;
	}

	/*
	 * Make the dialog body a flex column that fills the fixed dialog height, so
	 * the <Tabs> child has a definite height to flex within. Without this the
	 * dialog content area is a plain block and Tabs can't fill it.
	 */
	.dialog-body-fill {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	/*
	 * The Tabs host fills the dialog body in both states. The difference between
	 * broken and fixed lives entirely in the panel rules below.
	 */
	.dialog-body-fill :global(.scroll-demo-tabs) {
		flex: 1 1 auto;
		min-height: 0;
	}

	/*
	 * Containment fix: turn the panels region into a flex column and let the
	 * ACTIVE panel fill the remaining height and scroll its own overflow. The
	 * `min-height: 0` is the escape hatch that lets a flex item shrink below
	 * its content size so `overflow-y: auto` can actually kick in. Without these
	 * rules the panel is a plain block that grows with its content and overflows
	 * the dialog.
	 */
	.dialog-body-fill :global(.scroll-demo-tabs.contained .fluent-tabs-panels) {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.dialog-body-fill :global(.scroll-demo-tabs.contained .fluent-tab-panel.active) {
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
	}

	.expr-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.field-label,
	.override-head {
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		color: var(--neutral-foreground-hint);
	}

	.override-head {
		margin-top: 0.5rem;
	}

	.expr-textarea {
		width: 100%;
		min-height: 160px;
		resize: vertical;
		padding: 0.5rem;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 4px;
		box-sizing: border-box;
	}

	.hint {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}
</style>
