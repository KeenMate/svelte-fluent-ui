<script lang="ts">
	import {Search, Stack, Grid, GridItem, Card} from "$lib/index.js"
	let query = ""
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Search</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Search" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
						><td></td><td>appearance</td><td>string</td><td>undefined</td><td>Style variant</td></tr
					>
					<tr
						><td></td><td>ariaLabel</td><td>string</td><td>undefined</td><td>Accessibility label</td
						></tr
					>
					<tr
						><td></td><td>autofocus</td><td>boolean</td><td>undefined</td><td>Auto focus field</td
						></tr
					>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>CSS class</td></tr>
					<tr><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disable field</td></tr
					>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>HTML id</td></tr>
					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Visible label</td></tr>
					<tr
						><td></td><td>maxlength</td><td>number</td><td>undefined</td><td>Max input length</td
						></tr
					>
					<tr
						><td></td><td>minlength</td><td>number</td><td>undefined</td><td>Min input length</td
						></tr
					>
					<tr><td></td><td>name</td><td>string</td><td>undefined</td><td>Form name</td></tr>
					<tr
						><td></td><td>pattern</td><td>string</td><td>undefined</td><td>Validation pattern</td
						></tr
					>
					<tr
						><td></td><td>placeholder</td><td>string</td><td>undefined</td><td>Placeholder text</td
						></tr
					>
					<tr
						><td></td><td>readonly</td><td>boolean</td><td>undefined</td><td>Read-only mode</td></tr
					>
					<tr
						><td></td><td>required</td><td>boolean</td><td>undefined</td><td>Required field</td></tr
					>
					<tr><td></td><td>size</td><td>number</td><td>undefined</td><td>Field size</td></tr>
					<tr
						><td></td><td>spellcheck</td><td>boolean</td><td>undefined</td><td
							>Spellcheck enabled</td
						></tr
					>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline style</td></tr>
					<tr><td></td><td>value</td><td>string</td><td>""</td><td>Input value</td></tr>
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
						<td>Fires when value changes</td>
					</tr>
					<tr>
						<td></td>
						<td>onInput</td>
						<td>function</td>
						<td>Fires on every input</td>
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
			<tr
				><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
					>Custom elements inside input</td
				></tr
			>
			<tr
				><td></td><td>labelTemplate</td><td>SlotType</td><td>undefined</td><td
					>Custom label markup</td
				></tr
			>
		</tbody>
	</table>

		<h2>Examples</h2>

		<h3>Basic Search</h3>
		<Search label="Search term" placeholder="Type here..." />

		<h3>Disabled Search</h3>
		<Search label="Disabled input" disabled={true} value="Static text" />

		<h3>Controlled Search</h3>
		<Search label="Controlled" bind:value={query} placeholder="Search..." />
		<p>Query: {query}</p>
	</Card>
</Stack>
