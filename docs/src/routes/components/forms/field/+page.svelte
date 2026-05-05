<script lang="ts">
	import {
		Card,
		Stack,
		Grid,
		GridItem,
		Field,
		ValidationSummary,
		TextField,
		NumberField,
		Textarea,
		Select,
		Option,
		Search,
		Combobox,
		Checkbox,
		Button,
		Anchor
	} from "svelte-fluentui"

	// ===== Demo state =====
	let demoText = $state("")
	let demoNumber = $state("")
	let demoTextarea = $state("")
	let demoSelect = $state("")
	let demoTerms = $state(false)
	let demoNewsletter = $state(false)

	// Live-validated email
	let email = $state("")
	let emailTouched = $state(false)
	const emailError = $derived(
		email === ""
			? null
			: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? null
				: "Enter a valid email address"
	)

	// Manual ValidationSummary demo
	let smName = $state("")
	let smEmail = $state("")
	let smErrors = $state<Record<string, string>>({})

	function smValidate() {
		const errs: Record<string, string> = {}
		if (!smName.trim()) errs.name = "Name is required"
		if (!smEmail.trim()) errs.email = "Email is required"
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smEmail)) errs.email = "Invalid email format"
		smErrors = errs
	}
	function smJump(field: string) {
		document.getElementById(`fld-summary-${field}`)?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		})
		const ctl = document.getElementById(`fld-summary-${field}`)?.querySelector(
			"fluent-text-field"
		) as (HTMLElement & {focus?: () => void}) | null
		ctl?.focus?.()
	}
	const smLabels = {name: "Name", email: "Email"}

	type Prop = {name: string; type: string; default: string; description: string}

	const fieldProps: Prop[] = [
		{name: "label", type: "string", default: "undefined", description: "Visible label rendered above the slotted control. Omit to render no label."},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Snippet alternative to label, for custom label content (icons, links, etc.)."},
		{name: "required", type: "boolean", default: "false", description: "Renders a red asterisk after the label. Visual only — does not enforce validation; the inner control's own required prop handles that."},
		{name: "hint", type: "string", default: "undefined", description: "Helper text rendered below the slotted control in neutral color. Hidden automatically when validationMessage is shown."},
		{name: "validationState", type: '"none" | "warning" | "error" | "success"', default: '"none"', description: "Drives the message color and the inner-control border color via the data-state attribute."},
		{name: "validationMessage", type: "string", default: "undefined", description: "Inline message below the control. Only renders when validationState !== 'none' and the message is non-empty."},
		{name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Vertical: label-above-control (default). Horizontal: label and control side-by-side."},
		{name: "id", type: "string", default: "undefined", description: "Used as the label's for attribute. Pass the same id to the inner control to associate them for label clicks and screen readers."},
		{name: "class / style", type: "string", default: "undefined", description: "Pass-through to the root <div>."}
	]

	const summaryProps: Prop[] = [
		{name: "errors", type: "Record<string, string>", default: "{}", description: "Map of field-name → error message. Falsy values are filtered out. Empty map renders nothing."},
		{name: "labels", type: "Record<string, string>", default: "{}", description: "Map of field-name → human-readable label. Falls back to the field name if missing."},
		{name: "title", type: "string", default: '"Please fix the following:"', description: "Heading rendered above the error list."},
		{name: "onjumpto", type: "(field: string) => void", default: "undefined", description: "Called when a user clicks an error link. Receives the field name. Typical use: scroll to + focus the offending input."},
		{name: "children", type: "Snippet", default: "undefined", description: "Optional snippet rendered after the error list (e.g. a 'Contact support' link)."}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Field &amp; ValidationSummary</h1>

	<Card>
		<p>
			<code>&lt;Field&gt;</code> is a wrapper that owns the label, helper text,
			validation message, and validation-state border for any form control. It
			matches the FluentUI 2 / Blazor convention of factoring validation
			presentation out of the individual controls.
		</p>
		<p>
			<code>&lt;ValidationSummary&gt;</code> renders a top-of-form panel listing
			all errors with clickable jump-to-field links. Pairs cleanly with Field on
			submit-time validation flows.
		</p>
		<p>
			<small
				>References:
				<Anchor
					href="https://react.fluentui.dev/?path=/docs/components-field--default"
					target="_blank">FluentUI 2 React Field</Anchor
				>
				·
				<Anchor
					href="https://www.fluentui-blazor.net/Form#validation"
					target="_blank">FluentUI Blazor Form Validation</Anchor
				></small
			>
		</p>
	</Card>

	<!-- ========================================================
	  Validation states
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">Validation states</h2>
			<p style="margin: 0;">
				All four <code>validationState</code> values, side-by-side. Border color and
				message color follow the state.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6} lg={3}>
					<Field label="Default" validationState="none">
						<TextField bind:value={demoText} placeholder="Neutral state" />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={3}>
					<Field
						label="Success"
						validationState="success"
						validationMessage="Looks good!"
					>
						<TextField value="jane@acme.com" />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={3}>
					<Field
						label="Warning"
						validationState="warning"
						validationMessage="This domain is unusual but allowed"
					>
						<TextField value="jane@xyz.local" />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={3}>
					<Field
						label="Error"
						required
						validationState="error"
						validationMessage="Email is required"
					>
						<TextField value="" placeholder="Required" />
					</Field>
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  Label / hint / required
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">Label, hint &amp; required</h2>
			<p style="margin: 0;">
				The <code>required</code> flag adds a red asterisk after the label.
				<code>hint</code> renders neutral helper text below the control; it's
				hidden automatically when an error message is shown.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<Field
						label="Username"
						required
						hint="3 – 20 characters, letters and digits only"
					>
						<TextField bind:value={demoText} placeholder="Pick a username" />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6}>
					<Field label="Bio" hint="Up to 280 characters">
						<Textarea bind:value={demoTextarea} rows={3} placeholder="Tell us about yourself" />
					</Field>
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  Wrapping different controls
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">Wraps any form control</h2>
			<p style="margin: 0;">
				Field is control-agnostic. Drop in TextField, NumberField, Textarea,
				Select, Search, Combobox, or Checkbox — Field renders the label/hint/
				message and the state border applies via shadow parts.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6} lg={4}>
					<Field
						label="Number field"
						required
						validationState="error"
						validationMessage="Must be at least 18"
					>
						<NumberField bind:value={demoNumber} min={0} max={120} />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={4}>
					<Field
						label="Select"
						required
						validationState="error"
						validationMessage="Please pick an option"
					>
						<Select bind:value={demoSelect}>
							{#snippet children()}
								<Option value="">— select —</Option>
								<Option value="a">Option A</Option>
								<Option value="b">Option B</Option>
							{/snippet}
						</Select>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={4}>
					<Field
						label="Search"
						hint="Type to search"
						validationState="success"
						validationMessage="3 results"
					>
						<Search placeholder="Search…" />
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={4}>
					<Field label="Combobox" required>
						<Combobox
							options={[
								{value: "a", label: "Apple", disabled: false},
								{value: "b", label: "Banana", disabled: false},
								{value: "c", label: "Cherry", disabled: false}
							]}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} lg={4}>
					<Field
						validationState="error"
						validationMessage="You must accept the terms"
					>
						<Checkbox bind:checked={demoTerms}>I accept the terms and privacy policy</Checkbox>
					</Field>
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  Live validation
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">Live validation</h2>
			<p style="margin: 0;">
				Pattern: a <code>$derived</code> error string drives both the
				<code>validationState</code> and <code>validationMessage</code>. Touched-on-blur
				gates visibility so the error only appears after the user has interacted
				with the field at least once.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<Field
						label="Email"
						required
						hint="We'll only use this to send you a confirmation"
						validationState={emailTouched && emailError ? "error" : "none"}
						validationMessage={emailTouched && emailError ? emailError : undefined}
					>
						<TextField
							type="email"
							bind:value={email}
							placeholder="jane@example.com"
							onblur={() => (emailTouched = true)}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6}>
					<Stack orientation="vertical" gap="0.25rem">
						<small
							>Current state: <code>{emailTouched && emailError ? "error" : "none"}</code></small
						>
						<small
							>Error: <code>{emailError ?? "null"}</code></small
						>
					</Stack>
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  Horizontal orientation
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">Horizontal orientation</h2>
			<p style="margin: 0;">
				<code>orientation="horizontal"</code> places the label to the left of the
				control. Useful for compact admin forms.
			</p>

			<Stack orientation="vertical" gap="0.5rem" style="max-width: 32rem;">
				<Field label="Name" orientation="horizontal" required>
					<TextField bind:value={demoText} placeholder="Jane Doe" />
				</Field>
				<Field
					label="Age"
					orientation="horizontal"
					hint="Optional — used for analytics only"
				>
					<NumberField bind:value={demoNumber} />
				</Field>
				<Field
					label="Newsletter"
					orientation="horizontal"
					validationState="warning"
					validationMessage="You haven't confirmed your email yet"
				>
					<Checkbox bind:checked={demoNewsletter}>Subscribe to monthly updates</Checkbox>
				</Field>
			</Stack>
		</Stack>
	</Card>

	<!-- ========================================================
	  ValidationSummary
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">ValidationSummary — submit-time error list</h2>
			<p style="margin: 0;">
				Renders a panel listing all errors with clickable jump-to-field links.
				Auto-hides when the errors map is empty. Pair with <code>Field</code> on
				submit-time validation flows where you don't want live errors flickering
				as the user types.
			</p>

			<ValidationSummary errors={smErrors} labels={smLabels} onjumpto={smJump} />

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<div id="fld-summary-name">
						<Field
							label="Name"
							required
							validationState={smErrors.name ? "error" : "none"}
							validationMessage={smErrors.name}
						>
							<TextField bind:value={smName} />
						</Field>
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="fld-summary-email">
						<Field
							label="Email"
							required
							validationState={smErrors.email ? "error" : "none"}
							validationMessage={smErrors.email}
						>
							<TextField type="email" bind:value={smEmail} />
						</Field>
					</div>
				</GridItem>
			</Grid>

			<Stack orientation="horizontal" gap="0.5rem">
				<Button appearance="accent" onclick={smValidate}>Validate</Button>
				<Button
					appearance="outline"
					onclick={() => {
						smName = ""
						smEmail = ""
						smErrors = {}
					}}>Reset</Button
				>
			</Stack>
		</Stack>
	</Card>

	<!-- ========================================================
	  API tables
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.5rem">
			<h2 style="margin: 0;">Field — API</h2>
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{#each fieldProps as p}
						<tr>
							<td><code>{p.name}</code></td>
							<td><code>{p.type}</code></td>
							<td><code>{p.default}</code></td>
							<td>{p.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Stack>
	</Card>

	<Card>
		<Stack orientation="vertical" gap="0.5rem">
			<h2 style="margin: 0;">ValidationSummary — API</h2>
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{#each summaryProps as p}
						<tr>
							<td><code>{p.name}</code></td>
							<td><code>{p.type}</code></td>
							<td><code>{p.default}</code></td>
							<td>{p.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Stack>
	</Card>
</Stack>

<style>
	.api-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}
	.api-table th,
	.api-table td {
		padding: 0.4rem 0.6rem;
		border-bottom: 1px solid var(--neutral-stroke-rest, #e0e0e0);
		text-align: left;
		vertical-align: top;
	}
	.api-table th {
		font-weight: 600;
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
	}
	.api-table code {
		font-size: 0.85em;
	}
</style>
