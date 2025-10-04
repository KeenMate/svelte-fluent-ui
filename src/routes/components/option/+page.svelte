<script lang="ts">
	import {Listbox, Option, Stack, Grid, GridItem, Card} from "$lib/index.js"

	let selectedValue: string = "banana";
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Option</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-dropdown-option--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Option" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
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
			</Card>
		</GridItem>
	</Grid>

	<Card>
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
	</Card>
</Stack>
