<script lang="ts">
	import {Select} from "$lib/index.js";

	let selectedFruit = "apple";
</script>

<div class="header">
	<h1>Select</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Visible label</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td></td></tr>
					<tr><td></td><td>name</td><td>string</td><td>undefined</td><td>Form name</td></tr>
					<tr><td></td><td>value</td><td>string</td><td>undefined</td><td>Selected value</td></tr>
					<tr><td></td><td>required</td><td>boolean</td><td>undefined</td><td>Form required</td></tr>
					<tr><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disables the control</td></tr>
					<tr><td></td><td>appearance</td><td>string</td><td>"outline"</td><td>Visual style</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td></td>
						<td>onChange</td>
						<td>function</td>
						<td>Triggered when selection changes</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>
	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Selectable options</td></tr>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic Select</h3>
	<p>
		<Select label="Fruits" name="fruit">
			{#snippet children()}
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
				<option value="cherry">Cherry</option>
			{/snippet}
		</Select>
	</p>

	<h3>Disabled Select</h3>
	<p>
		<Select label="Disabled" disabled={true}>
			{#snippet children()}
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
			{/snippet}
		</Select>
	</p>

	<h3>Controlled Select</h3>
	<p>
		<Select label="Controlled" bind:value={selectedFruit} name="fruit">
			{#snippet children()}
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
				<option value="cherry">Cherry</option>
			{/snippet}
		</Select>
		Selected: {selectedFruit}
	</p>
</div>
