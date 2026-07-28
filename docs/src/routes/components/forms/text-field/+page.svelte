<script lang="ts">
	import {onMount} from "svelte"
	import {TextField, Grid, GridItem, Card, Stack, QuickGrid} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let textValue = $state("")
	let textField: HTMLElement & {select: Function}

	onMount(() => {
		setTimeout(() => {
			textField.select()
		}, 3500)
	})

	function onTextInputChanged(ev: InputEvent) {
		console.log("🚀 ~ onTextInputChanged ~ ev:", ev.target.value)
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "value", type: "string", default: "undefined", description: "Input value (bindable)"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "appearance", type: '"outline" | "filled"', default: "undefined", description: "Visual style"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disable input"},
		{name: "readonly", type: "boolean", default: "undefined", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "undefined", description: "Required field"},
		{name: "type", type: "string", default: '"text"', description: "Input type (text, password, email, etc.)"},
		{name: "name", type: "string", default: "undefined", description: "Form name"},
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "autocomplete", type: "string", default: '"off"', description: 'Browser autocomplete ("off", "on", "email", "username", etc.)'},
		{name: "maxlength", type: "number", default: "undefined", description: "Max length of the typed value (forwarded to the shadow `<input>`; browser blocks further input)"},
		{name: "minlength", type: "number", default: "undefined", description: "Min required length (forwarded to the shadow `<input>`; flags tooShort on validation)"},
		{name: "pattern", type: "string", default: "undefined", description: "Regex the value must match; participates in native validity (patternMismatch)"}
	]

	const callbacks: Property[] = [
		{name: "onInput", type: "(ev: InputEvent) => void", default: "undefined", description: "Fires as value is typed"},
		{name: "onChange", type: "(ev: Event) => void", default: "undefined", description: "Fires when value changes on blur"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Additional content"}
	]

	const actions: Property[] = [
		{name: "select", type: "() => void", default: "-", description: "Select all text"},
		{name: "checkValidity", type: "() => boolean", default: "-", description: "Check form validity"},
		{name: "reportValidity", type: "() => boolean", default: "-", description: "Report form validity"},
		{name: "setCustomValidity", type: "(message: string) => any", default: "-", description: "Set custom validity message"},
		{name: "setValidity", type: "(flags: any, message: any, anchor: any) => void", default: "-", description: "Set validity state"},
		{name: "setSelectionRange", type: "(start: number, end: number, direction?: \"forward\" | \"backward\" | \"none\") => void", default: "-", description: "Set text selection range"}
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
		title="Text field"
		description="A Svelte wrapper for FluentUI's text-field web component — a single-line text input with multiple types, outline/filled looks, and form integration."
		keywords="svelte, fluentui, text field, textfield, input, form, web components"
	/>

	<h1>Text field</h1>

	<p>
		A single-line text input that wraps the <code>&lt;fluent-text-field&gt;</code> element, supporting
		multiple input types, outline and filled appearances, and standard form integration.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-textinput--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/TextField"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic TextField</h3>
		<TextField
			bind:this={textField}
			bind:value={textValue}
			placeholder="Enter text"
			oninput={onTextInputChanged}
		/>

		<h3>Autocomplete Examples</h3>
		<p>Control browser autocomplete behavior with the <code>autocomplete</code> prop:</p>

		<Stack orientation="vertical" gap="1rem">
			<TextField
				label="Autocomplete Off"
				placeholder="Browser won't suggest values"
				autocomplete="off"
			/>

			<TextField
				label="Email Field"
				type="email"
				placeholder="user@example.com"
				autocomplete="email"
			/>

			<TextField
				label="Username"
				placeholder="Enter username"
				autocomplete="username"
			/>

			<TextField
				label="Current Password"
				type="password"
				placeholder="Enter password"
				autocomplete="current-password"
			/>
		</Stack>

		<h3>Length &amp; pattern validation</h3>
		<p>
			<code>minlength</code>, <code>maxlength</code> and <code>pattern</code> are forwarded to the
			inner <code>&lt;input&gt;</code>, so they participate in native form validity. <code>maxlength</code>
			hard-caps typed length; <code>minlength</code> and <code>pattern</code> are validation-only.
		</p>

		<Stack orientation="vertical" gap="1rem">
			<TextField
				label="Max 10 characters"
				placeholder="Can't type past 10"
				maxlength={10}
			/>

			<TextField
				label="At least 3 characters"
				placeholder="Too short flags on submit"
				minlength={3}
				required
			/>

			<TextField
				label="Digits only (pattern)"
				placeholder="e.g. 12345"
				pattern="[0-9]*"
			/>
		</Stack>

		<h3>Readonly</h3>
		<p>Set <code>readonly</code> to display a value the user can focus and select but not edit.</p>

		<Stack orientation="vertical" gap="1rem">
			<TextField
				label="Readonly (outline)"
				value="Read-only value"
				readonly
			/>

			<TextField
				label="Readonly (filled)"
				appearance="filled"
				value="Read-only value"
				readonly
			/>
		</Stack>

		<h3>Disabled</h3>
		<p>Set <code>disabled</code> to render the field as inactive and skip it during form submission.</p>

		<Stack orientation="vertical" gap="1rem">
			<TextField
				label="Disabled (outline)"
				placeholder="Disabled placeholder"
				disabled
			/>

			<TextField
				label="Disabled with value"
				value="Cannot be edited"
				disabled
			/>

			<TextField
				label="Disabled (filled)"
				appearance="filled"
				value="Cannot be edited"
				disabled
			/>
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
