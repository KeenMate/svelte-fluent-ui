<script lang="ts">
	import { Textarea, Stack, Grid, GridItem, Card } from "$lib/index.js";
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>TextArea</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-textarea--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/TextArea" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>appearance</td><td>"outline" | "filled"</td><td>undefined</td><td>Visual style</td></tr>
					<tr><td></td><td>ariaLabel</td><td>string</td><td>undefined</td><td>Accessibility label</td></tr>
					<tr><td></td><td>autofocus</td><td>boolean</td><td>undefined</td><td>Focus on mount</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>CSS class</td></tr>
					<tr><td></td><td>cols</td><td>number</td><td>undefined</td><td>Number of columns</td></tr>
					<tr><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disable input</td></tr>
					<tr><td></td><td>form</td><td>string</td><td>undefined</td><td>Form owner</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique ID</td></tr>
					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Visible label</td></tr>
					<tr><td></td><td>list</td><td>string</td><td>undefined</td><td>Datalist id</td></tr>
					<tr><td></td><td>maxlength</td><td>number</td><td>undefined</td><td>Max character length</td></tr>
					<tr><td></td><td>minlength</td><td>number</td><td>undefined</td><td>Min character length</td></tr>
					<tr><td></td><td>name</td><td>string</td><td>undefined</td><td>Form name</td></tr>
					<tr><td></td><td>placeholder</td><td>string</td><td>undefined</td><td>Placeholder text</td></tr>
					<tr><td></td><td>readonly</td><td>boolean</td><td>undefined</td><td>Read-only mode</td></tr>
					<tr><td></td><td>required</td><td>boolean</td><td>undefined</td><td>Form required</td></tr>
					<tr><td></td><td>resize</td><td>"none" | "both" | "horizontal" | "vertical"</td><td>undefined</td><td>Resize behavior</td></tr>
					<tr><td></td><td>rows</td><td>number</td><td>undefined</td><td>Number of rows</td></tr>
					<tr><td></td><td>spellcheck</td><td>boolean</td><td>undefined</td><td>Enable spellcheck</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline style</td></tr>
					<tr><td></td><td>value</td><td>string</td><td>""</td><td>Text value</td></tr>
				</tbody>
			</table>
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Actions</h2>

				<table class="member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td></td>
						<td>onChange</td>
						<td>function</td>
						<td>Fires when value changes on blur</td>
					</tr>
					<tr>
						<td></td>
						<td>onInput</td>
						<td>function</td>
						<td>Fires as value is typed</td>
					</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Slots</h2>

		<table class="member-table">
			<tbody>
				<tr class="slot"><td colspan="5">Slots</td></tr>
				<tr><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Additional content</td></tr>
				<tr><td></td><td>labelTemplate</td><td>SlotType</td><td>undefined</td><td>Custom label markup</td></tr>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2>Examples</h2>

		<h3>Basic Textarea</h3>
		<Textarea placeholder="Type here..." resize="both" />

		<h3>Textarea with max length</h3>
		<Textarea maxlength={10} placeholder="Max 10 chars" />

		<h3>Disabled Textarea with label</h3>
		<Textarea label="Not editable" disabled={true} value="Read-only content" />
	</Card>
</Stack>
