<script lang="ts">
	import {Panel, Button, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let rightOpen = $state(false)
	let leftOpen = $state(false)
	let wideOpen = $state(false)
	let noOverlayOpen = $state(false)
	let stickyOpen = $state(false)
	let rtlOpen = $state(false)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const panelProperties: Property[] = [
		{name: "open", type: "boolean", default: "false", description: "Open state (bindable)"},
		{name: "side", type: '"left" | "right" | "start" | "end"', default: '"right"', description: "Edge the panel slides in from. \"left\"/\"right\" are physical; \"start\"/\"end\" are logical and flip with dir=\"rtl\""},
		{name: "width", type: "string", default: '"320px"', description: "Panel width (any CSS length)"},
		{name: "top", type: "string", default: '"0"', description: "Top offset for the panel + overlay (any CSS length). Leaves the area above (e.g. a sticky header / top nav) visible and interactive so the trigger remains clickable while the drawer is open."},
		{name: "overlay", type: "boolean", default: "true", description: "Render a dimmed backdrop behind the panel"},
		{name: "closeOnOutsideClick", type: "boolean", default: "true", description: "Close the panel when the user clicks outside it (overlay click when overlay is on, document click when overlay is off)"},
		{name: "closeOnEscape", type: "boolean", default: "true", description: "Close the panel when Escape is pressed"},
		{name: "class", type: "string", default: "undefined", description: "Additional CSS class on the root"},
		{name: "style", type: "string", default: "undefined", description: "Inline style appended on the panel surface"}
	]

	const panelCallbacks: Property[] = [
		{name: "onclose", type: "() => void", default: "undefined", description: "Fires after the panel closes (via overlay, Escape, or open=false)"}
	]

	const panelSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Panel content — header, body, footer are the consumer's responsibility"}
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
		title="Panel"
		description="A slide-in side panel primitive — left or right edge, optional overlay, Escape-to-close. Build profile panels, filter drawers, and details pane on top."
		keywords="svelte, fluentui, panel, drawer, sidebar, flyout, slide-in"
	/>

	<h1>Panel</h1>

	<p>
		A side-anchored slide-in panel. Single <span class="component-name">children</span> slot — compose your
		own header, body, and footer. Use it as the shell for profile panels, filter drawers, details pane, and
		similar overlays.
	</p>

	<References links={[
		{label: "Panel", custom: true}
	]} />

	<Card>
		<h2>Examples</h2>

		<Stack orientation="vertical" gap="1.5rem">
			<div>
				<h3>Right side (default)</h3>
				<p class="example-description">Slides in from the right with a dimmed overlay. Click overlay or press Escape to close.</p>
				<Button appearance="accent" onclick={() => rightOpen = true}>Open right panel</Button>
				<Panel bind:open={rightOpen}>
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>Right panel</h3>
						</div>
						<div class="demo-panel__body">
							<p>This panel slid in from the right edge.</p>
							<p>Press <kbd>Esc</kbd> or click the dimmed area to close.</p>
						</div>
						<div class="demo-panel__footer">
							<Button onclick={() => rightOpen = false}>Close</Button>
						</div>
					</div>
				</Panel>
			</div>

			<div>
				<h3>Left side</h3>
				<p class="example-description"><span class="component-name">side="left"</span> swaps the anchor edge.</p>
				<Button onclick={() => leftOpen = true}>Open left panel</Button>
				<Panel bind:open={leftOpen} side="left">
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>Left panel</h3>
						</div>
						<div class="demo-panel__body">
							<p>Slid in from the left edge.</p>
						</div>
						<div class="demo-panel__footer">
							<Button onclick={() => leftOpen = false}>Close</Button>
						</div>
					</div>
				</Panel>
			</div>

			<div>
				<h3>Custom width</h3>
				<p class="example-description">Any CSS length works — pixels, rems, viewport units.</p>
				<Button onclick={() => wideOpen = true}>Open 480px panel</Button>
				<Panel bind:open={wideOpen} width="480px">
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>Wide panel</h3>
						</div>
						<div class="demo-panel__body">
							<p>Useful for forms, detail views, or content-heavy panels.</p>
						</div>
						<div class="demo-panel__footer">
							<Button onclick={() => wideOpen = false}>Close</Button>
						</div>
					</div>
				</Panel>
			</div>

			<div>
				<h3>Without overlay</h3>
				<p class="example-description">
					<span class="component-name">overlay={'{false}'}</span> renders a non-modal panel — page behind stays interactive.
				</p>
				<Button onclick={() => noOverlayOpen = true}>Open non-modal panel</Button>
				<Panel bind:open={noOverlayOpen} overlay={false}>
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>Non-modal</h3>
						</div>
						<div class="demo-panel__body">
							<p>No backdrop — you can still click the page behind.</p>
						</div>
						<div class="demo-panel__footer">
							<Button onclick={() => noOverlayOpen = false}>Close</Button>
						</div>
					</div>
				</Panel>
			</div>

			<div dir="rtl">
				<h3 dir="ltr">RTL — logical <span class="component-name">side="start"</span></h3>
				<p class="example-description" dir="ltr">
					In RTL, <span class="component-name">side="start"</span> anchors to the right edge and slides in
					from the right. Use it whenever you want the panel to follow writing direction (drawer menus,
					filter panes); use the physical <span class="component-name">"left"</span> / <span class="component-name">"right"</span>
					when you specifically want a fixed side regardless of locale.
				</p>
				<Button appearance="accent" onclick={() => rtlOpen = true}>افتح اللوحة</Button>
				<Panel bind:open={rtlOpen} side="start">
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>لوحة RTL</h3>
						</div>
						<div class="demo-panel__body">
							<p>انزلقت من الجانب البادئ (اليمين في RTL).</p>
						</div>
						<div class="demo-panel__footer">
							<Button onclick={() => rtlOpen = false}>إغلاق</Button>
						</div>
					</div>
				</Panel>
			</div>

			<div>
				<h3>Sticky open (Escape & overlay disabled)</h3>
				<p class="example-description">
					Disable both dismiss paths when the consumer must explicitly close — e.g. multi-step flows.
				</p>
				<Button onclick={() => stickyOpen = true}>Open sticky panel</Button>
				<Panel
					bind:open={stickyOpen}
					closeOnEscape={false}
					closeOnOutsideClick={false}
				>
					<div class="demo-panel">
						<div class="demo-panel__header">
							<h3>Sticky</h3>
						</div>
						<div class="demo-panel__body">
							<p>Escape does nothing. Overlay click does nothing. Only the button below closes me.</p>
						</div>
						<div class="demo-panel__footer">
							<Button appearance="accent" onclick={() => stickyOpen = false}>Confirm & close</Button>
						</div>
					</div>
				</Panel>
			</div>
		</Stack>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Panel Properties</h2>
				<QuickGrid items={panelProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Panel Callbacks</h2>
				<QuickGrid items={panelCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Panel Slots</h2>
				<QuickGrid items={panelSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style lang="scss">
	.component-name {
		font-family: monospace;
	}

	.example-description {
		margin: 0 0 0.75rem 0;
		color: var(--neutral-foreground-hint-rest, #616161);
		font-size: 0.9rem;
	}

	.demo-panel {
		display: flex;
		flex-direction: column;
		height: 100%;

		&__header {
			padding: 1rem 1.25rem;
			border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);

			h3 {
				margin: 0;
			}
		}

		&__body {
			flex: 1 1 0;
			min-height: 0;
			overflow-y: auto;
			padding: 1rem 1.25rem;
		}

		&__footer {
			padding: 1rem 1.25rem;
			border-top: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
			display: flex;
			justify-content: flex-end;
			gap: 0.5rem;
		}
	}

	kbd {
		font-family: monospace;
		background: var(--neutral-fill-secondary-rest, #f0f0f0);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 3px;
		padding: 0 0.35rem;
		font-size: 0.85em;
	}
</style>
