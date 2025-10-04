<script lang="ts">
	import {Listbox, Option, Stack, Grid, GridItem, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Listbox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Listbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>
				<table class="member-table">
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
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2 class="content-subhead">Actions</h2>
				<table class="member-table">
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
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Slots</h2>
		<table class="member-table">
			<tbody>
				<tr class="slot"><td colspan="5">Slots</td></tr>
				<tr
					><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
						>Listbox option elements</td
					></tr
				>
			</tbody>
		</table>
	</Card>

	<Card>
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
	</Card>
</Stack>
