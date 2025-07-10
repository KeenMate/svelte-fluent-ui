<script lang="ts">
	import {Listbox, Option} from "$lib/index.js"
</script>

<div class="header">
	<h1>Listbox</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr
						><td></td><td>value</td><td>string | string[]</td><td>undefined</td><td
							>Selected value(s)</td
						></tr
					>
					<tr
						><td></td><td>multi</td><td>boolean</td><td>false</td><td>Enable multiple selection</td
						></tr
					>
					<tr
						><td></td><td>readonly</td><td>boolean</td><td>false</td><td>Disables user changes</td
						></tr
					>
					<tr
						><td></td><td>disabled</td><td>boolean</td><td>false</td><td>Disables the component</td
						></tr
					>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom classes</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Custom inline styles</td></tr>
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
						<td>onchange</td>
						<td>function</td>
						<td>Fired when selection changes</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>
	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr
				><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
					>Listbox option elements</td
				></tr
			>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic listbox</h3>
	<Listbox value="apple">
		<Option value="apple">Apple</Option>
		<Option value="banana">Banana</Option>
		<Option value="cherry">Cherry</Option>
	</Listbox>

	<h3>Disabled listbox</h3>
	<Listbox value="banana">
		<Option value="apple" disabled>Apple</Option>
		<Option value="banana" disabled>Banana</Option>
		<Option value="cherry" disabled>Cherry</Option>
	</Listbox>
</div>
