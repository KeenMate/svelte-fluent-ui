<script lang="ts">
	import {Toolbar, Button, Stack, Grid, GridItem, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Toolbar</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Toolbar" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique identifier</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>CSS class for styling</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
					<tr
						><td></td><td>orientation</td><td>"horizontal" | "vertical"</td><td>"horizontal"</td><td
							>Toolbar layout direction</td
						></tr
					>
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
						<td colspan="4">None</td>
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
						>Elements to include in the toolbar (e.g., buttons, icons)</td
					></tr
				>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Basic toolbar</h3>
		<Toolbar>
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>

		<h3>Vertical toolbar</h3>
		<Toolbar orientation="vertical">
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>
	</Card>
</Stack>
