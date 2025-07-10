<script lang="ts">
	import {Listbox, Option} from "$lib/index.js"

	let selectedValue: string = "banana";
</script>

<div class="header">
	<h1>Option</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>value</td><td>string</td><td>required</td><td>Option value</td></tr>
					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Optional display label</td></tr>
					<tr><td></td><td>disabled</td><td>boolean</td><td>false</td><td>Disable the option</td></tr>
					<tr><td></td><td>selected</td><td>boolean</td><td>undefined</td><td>Force selection</td></tr>
					<tr><td></td><td>onClick</td><td>Function</td><td>undefined</td><td>Optional click handler</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Custom inline styles</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic option in listbox</h3>
		<Listbox bind:value={selectedValue}>
			<Option value="apple">Apple</Option>
			<Option value="banana">Banana</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>
	<p>Selected: {selectedValue}</p>

	<h3>Disabled option</h3>
		<Listbox value="banana">
			<Option value="apple">Apple</Option>
			<Option value="banana" disabled={true}>Banana (disabled)</Option>
			<Option value="cherry">Cherry</Option>
		</Listbox>
</div>
