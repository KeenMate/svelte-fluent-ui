<script lang="ts">
	import {Accordion, AccordionItem, Button, Icon, Label, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"
	let accordionValue = $state<string | string[] | null>(null)
	let deletedField = $state<string | null>(null)

	// Expand / collapse all (multi mode). In multi mode the bound `value` IS the
	// list of open item ids, so there's no imperative "open all" call: setting
	// value to an array of every id expands all, and null (or []) collapses all.
	// Each AccordionItem derives its own state from `value.includes(id)`, so one
	// reassignment fans out to every item.
	const expandAllIds = ["exp-1", "exp-2", "exp-3"]
	let expandAllValue = $state<string | string[] | null>(null)

	// "Standard Fields" form example: toggle on the left, a required-marker in the
	// heading, and a field-name chip in the end slot. Exercises the trailing inset
	// the end slot gets in togglePosition="start" so the chip clears the card edge.
	const standardFields = [
		{id: "sf-caller", label: "Caller", required: true, field: "Incident.caller_id"},
		{id: "sf-ci", label: "Configuration Item", required: false, field: "Incident.cmdb_ci"},
		{id: "sf-workgroup", label: "Default Assignment Workgroup", required: true, field: "Incident.assignment_group"},
		{id: "sf-description", label: "Description", required: false, field: "Incident.description"},
		{id: "sf-impact", label: "Impact", required: true, field: "Incident.impact"},
		{id: "sf-bu", label: "Impacted Business Unit", required: false, field: "Incident.u_impacted_business_unit"}
	]

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const accordionProperties: Property[] = [
		{name: "value", type: "string | string[]", default: "null", description: "Expanded item ID(s). In multi mode, set to an array of every item id to expand all at once; null collapses all"},
		{name: "multi", type: "boolean", default: "undefined", description: "Allow multiple items open"},
		{name: "togglePosition", type: '"start" | "end"', default: '"end"', description: "Side the expand/collapse chevron sits on. \"end\" = right (LTR default), \"start\" = left"},
		{name: "gap", type: "string", default: "undefined", description: "Gap between items (any CSS length, e.g. \"0.5rem\"). Defaults to the FluentUI spacing"}
	]

	const accordionCallbacks: Property[] = [
		{name: "onchange", type: "(value: string | string[] | null) => void", default: "undefined", description: "Fires when the set of expanded items changes"}
	]

	const accordionSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "AccordionItem components"}
	]

	const accordionItemProperties: Property[] = [
		{name: "id", type: "string", default: "Required", description: "Unique item identifier"},
		{name: "header", type: "string", default: "undefined", description: "Header text (plain string)"},
		{name: "headingLevel", type: "string | number", default: "2", description: "Heading level for accessibility (aria-level)"},
		{name: "expanded", type: "boolean", default: "undefined", description: "Controls expanded state (falls back to parent Accordion's value)"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the item: not togglable and skipped in keyboard navigation"}
	]

	const accordionItemCallbacks: Property[] = [
		{name: "onchange", type: "(ev: Event, isExpanded: boolean) => void", default: "undefined", description: "Fires when this item expands or collapses"}
	]

	const accordionItemSlots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Body content rendered when the item is expanded"},
		{name: "heading", type: "SlotType", default: "undefined", description: "Custom heading content (overrides the `header` string prop)"},
		{name: "start", type: "SlotType", default: "undefined", description: "Content rendered at the start of the header"},
		{name: "end", type: "SlotType", default: "undefined", description: "Content rendered at the end of the header"},
		{name: "icon", type: "SlotType", default: "undefined", description: "Custom expand/collapse icon. Receives isExpanded boolean"}
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
		title="Accordion"
		description="A custom Svelte stack of collapsible panels styled with FluentUI design tokens — single or multiple-expand modes, configurable toggle side, gap, and per-item disabling."
		keywords="svelte, fluentui, accordion, collapsible, expander, panel"
	/>

	<h1>Accordion</h1>

	<p>
		A custom stack of collapsible panels built from plain themed elements and styled with
		FluentUI design tokens — <strong>not</strong> a <code>&lt;fluent-accordion&gt;</code> wrapper.
		Supports single or multiple-expand modes, a configurable toggle side, adjustable gap, and
		per-item disabling, with full control over layout, spacing, and the expand/collapse animation.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-accordion-accordion--docs"},
		{label: "FluentUI Blazor", na: "Not available — this is a custom implementation"}
	]} />

	<Card>
		<h2>Examples</h2>

		<Grid spacing={3}>
			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Basic accordion</h3>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="item-1" header="Section 1">
							<p>This is the content of section 1.</p>
						</AccordionItem>
						<AccordionItem id="item-2" header="Section 2">
							<p>This is the content of section 2.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Accordion with multiple expand allowed</h3>
				<Accordion multi={true}>
					{#snippet children()}
						<AccordionItem id="multi-1" header="First">
							<p>Multi mode - first item content.</p>
						</AccordionItem>
						<AccordionItem id="multi-2" header="Second">
							<p>Multi mode - second item content.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Controlled accordion</h3>
				<Accordion bind:value={accordionValue}>
					{#snippet children()}
						<AccordionItem id="controlled-1" header="Controlled One">
							<p>First controlled content.</p>
						</AccordionItem>
						<AccordionItem id="controlled-2" header="Controlled Two">
							<p>Second controlled content.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
				<p>Current value: {JSON.stringify(accordionValue)}</p>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Toggle on the left</h3>
				<Accordion togglePosition="start">
					{#snippet children()}
						<AccordionItem id="left-1" header="Section 1">
							<p>The expand/collapse chevron sits on the left.</p>
						</AccordionItem>
						<AccordionItem id="left-2" header="Section 2">
							<p>Set <code>togglePosition="start"</code> on the Accordion.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Disabled item</h3>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="dis-1" header="Available">
							<p>This section can be opened and closed.</p>
						</AccordionItem>
						<AccordionItem id="dis-2" header="Disabled" disabled>
							<p>This content can't be reached.</p>
						</AccordionItem>
						<AccordionItem id="dis-3" header="Also available">
							<p>Disabled items are skipped by arrow-key navigation.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Custom gap between items</h3>
				<Accordion gap="0.75rem">
					{#snippet children()}
						<AccordionItem id="gap-1" header="Spaced One">
							<p>Items are separated by a 0.75rem gap.</p>
						</AccordionItem>
						<AccordionItem id="gap-2" header="Spaced Two">
							<p>Set <code>gap</code> to any CSS length.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Expand / collapse all</h3>
				<Stack orientation="horizontal" gap="0.5rem">
					<Button appearance="accent" onclick={() => (expandAllValue = [...expandAllIds])}>Expand all</Button>
					<Button onclick={() => (expandAllValue = null)}>Collapse all</Button>
				</Stack>
				<Accordion multi={true} bind:value={expandAllValue}>
					{#snippet children()}
						<AccordionItem id="exp-1" header="First">
							<p>In multi mode, set value to an array of every item id.</p>
						</AccordionItem>
						<AccordionItem id="exp-2" header="Second">
							<p>Setting value to null collapses everything.</p>
						</AccordionItem>
						<AccordionItem id="exp-3" header="Third">
							<p>The buttons drive the bound value directly.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Accordion with custom heading</h3>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="custom-head">
							{#snippet heading()}
								<strong class="warning-heading">⚠ Important Section</strong>
							{/snippet}
							<p>Custom heading content goes here.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Leading icons (start slot)</h3>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="ico-1" header="Profile">
							{#snippet start()}<Icon name="person" size={20} />{/snippet}
							<p>Account and personal details.</p>
						</AccordionItem>
						<AccordionItem id="ico-2" header="Settings">
							{#snippet start()}<Icon name="settings" size={20} />{/snippet}
							<p>Application preferences.</p>
						</AccordionItem>
						<AccordionItem id="ico-3" header="Security">
							{#snippet start()}<Icon name="lock_closed" size={20} />{/snippet}
							<p>Passwords and sign-in options.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Trailing icons (end slot)</h3>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="end-1" header="Notifications">
							{#snippet end()}<Icon name="alert" size={20} />{/snippet}
							<p>Recent alerts and messages.</p>
						</AccordionItem>
						<AccordionItem id="end-2" header="Favorites">
							{#snippet end()}<Icon name="star" size={20} />{/snippet}
							<p>Items you've starred.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Custom toggle icon</h3>
				<p class="hint">The <code>icon</code> snippet receives the current <code>isExpanded</code> state.</p>
				<Accordion>
					{#snippet children()}
						<AccordionItem id="ci-1" header="Frequently asked">
							{#snippet icon(isExpanded: boolean)}
								<Icon name={isExpanded ? "subtract" : "add"} size={16} />
							{/snippet}
							<p>A plus turns into a minus when the panel opens.</p>
						</AccordionItem>
						<AccordionItem id="ci-2" header="Also worth reading">
							{#snippet icon(isExpanded: boolean)}
								<Icon name={isExpanded ? "subtract" : "add"} size={16} />
							{/snippet}
							<p>Each item swaps its own icon independently.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12} xl={6} xxl={4}>
				<h3>Icons + toggle on the left</h3>
				<Accordion togglePosition="start">
					{#snippet children()}
						<AccordionItem id="il-1" header="Documents">
							{#snippet start()}<Icon name="folder" size={20} />{/snippet}
							<p>Chevron on the left, leading icon after it.</p>
						</AccordionItem>
						<AccordionItem id="il-2" header="Messages">
							{#snippet start()}<Icon name="mail" size={20} />{/snippet}
							<p>The start slot sits between the chevron and the heading.</p>
						</AccordionItem>
					{/snippet}
				</Accordion>
			</GridItem>

			<GridItem xs={12}>
				<h3>Form fields (end-slot chips, toggle on the left)</h3>
				<p class="hint">
					Toggle on the leading edge with a field-name chip in the <code>end</code> slot. The end
					slot keeps a trailing inset in <code>togglePosition="start"</code> so the chip clears the
					card edge.
				</p>
				<Accordion togglePosition="start" multi={true}>
					{#snippet children()}
						{#each standardFields as f (f.id)}
							<AccordionItem id={f.id}>
								{#snippet heading()}
									<span class="field-heading">
										{f.label}{#if f.required}<span class="field-required" aria-hidden="true">*</span>{/if}
									</span>
								{/snippet}
								{#snippet end()}
									<Stack orientation="horizontal" gap="0.5rem" verticalAlign="center">
										<Label outline color="secondary">{f.field}</Label>
										<Button
											appearance="stealth"
											aria-label="Delete {f.label}"
											onclick={() => (deletedField = f.field)}
										>
											<Icon name="delete" size={16} />
										</Button>
									</Stack>
								{/snippet}
								<p>Bind this field to <code>{f.field}</code>.</p>
							</AccordionItem>
						{/each}
					{/snippet}
				</Accordion>
				{#if deletedField}
					<p class="hint">Delete clicked for <code>{deletedField}</code> (the header toggle didn't fire).</p>
				{/if}
			</GridItem>
		</Grid>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Accordion Properties</h2>
				<QuickGrid items={accordionProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Accordion Callbacks</h2>
				<QuickGrid items={accordionCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Accordion Slots</h2>
				<QuickGrid items={accordionSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Properties</h2>
				<QuickGrid items={accordionItemProperties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Callbacks</h2>
				<QuickGrid items={accordionItemCallbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>AccordionItem Slots</h2>
				<QuickGrid items={accordionItemSlots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>

<style>
	.warning-heading {
		color: red;
	}
	.hint {
		margin: 0 0 0.5rem;
		font-size: 0.85rem;
		color: var(--neutral-foreground-hint, #616161);
	}
	.field-heading {
		font-weight: 600;
	}
	.field-required {
		margin-inline-start: 0.25rem;
		color: var(--fluent-color-danger-primary, #d13438);
	}
</style>
