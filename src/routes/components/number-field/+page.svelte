<script lang="ts">
	import { NumberField } from "$lib/index.js"

	let testValue="10";
</script>

<div class="header">
	<h1>NumberField</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Properties</td></tr>

					<tr class="property"><td></td><td>value</td><td>string</td><td>undefined</td><td>Value of the input</td></tr>
					<tr class="property"><td></td><td>placeholder</td><td>string</td><td>undefined</td><td>Placeholder text</td></tr>
					<tr class="property"><td></td><td>appearance</td><td>string</td><td>undefined</td><td>Visual style</td></tr>
					<tr class="property"><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disable input</td></tr>
					<tr class="property"><td></td><td>readonly</td><td>boolean</td><td>undefined</td><td>Read-only input</td></tr>
					<tr class="property"><td></td><td>required</td><td>boolean</td><td>undefined</td><td>Marks the field as required</td></tr>
					<tr class="property"><td></td><td>name</td><td>string</td><td>undefined</td><td>Name attribute</td></tr>
					<tr class="property"><td></td><td>label</td><td>string</td><td>undefined</td><td>Label or slot content</td></tr>
					<tr class="property"><td></td><td>autofocus</td><td>boolean</td><td>undefined</td><td>Autofocus on mount</td></tr>
					<tr class="property"><td></td><td>step</td><td>number</td><td>undefined</td><td>Increment/decrement step</td></tr>
					<tr class="property"><td></td><td>min</td><td>number|string</td><td>undefined</td><td>Minimum value</td></tr>
					<tr class="property"><td></td><td>max</td><td>number|string</td><td>undefined</td><td>Maximum value</td></tr>
					<tr class="property"><td></td><td>hideStep</td><td>boolean</td><td>undefined</td><td>Hides the stepper buttons</td></tr>

					<tr class="slot"><td colspan="5">Slots</td></tr>
					<tr class="slot"><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Label or slotted content</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr><td></td><td>select()</td><td>void</td><td>Selects input contents</td></tr>
					<tr><td></td><td>checkValidity()</td><td>boolean</td><td>Returns whether input is valid</td></tr>
					<tr><td></td><td>reportValidity()</td><td>boolean</td><td>Triggers validation UI</td></tr>
					<tr><td></td><td>setCustomValidity(message)</td><td>void</td><td>Sets custom validity message</td></tr>
					<tr><td></td><td>setSelectionRange(start, end, direction?)</td><td>void</td><td>Programmatically set selection</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>

	<h3>Age number field</h3>
	<NumberField label="Age" placeholder="Enter age" />

	<h3>With min=1, max=20, and step=5</h3>
	<NumberField label="Step 5" min={1} max={20} step={5} value={testValue} />

	<h3>Read-only and disabled</h3>
	<NumberField label="Read-only" value={"10"} readonly />
	<NumberField label="Disabled" value={"11"} disabled />
</div>
