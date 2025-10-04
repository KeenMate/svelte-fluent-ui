<script lang="ts">
	import {Tooltip, Stack, Grid, GridItem, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Tooltip</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-tooltip--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Tooltip" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
				<tbody>
					<tr class="property">
						<td colspan="5">Members</td>
					</tr>
					<tr class="property"
						><td></td><td>anchor</td><td>string</td><td>undefined</td><td>ID of anchor</td></tr
					>
					<tr class="property"
						><td></td><td>autoUpdateMode</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"><td></td><td>class</td><td>string</td><td>""</td><td></td></tr>
					<tr class="property"><td></td><td>delay</td><td>number</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>horizontalViewportLock</td><td>boolean</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>maxWidth</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>position</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"><td></td><td>style</td><td>string</td><td>""</td><td></td></tr>
					<tr class="property"
						><td></td><td>verticalViewportLock</td><td>boolean</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>visible</td><td>boolean</td><td>undefined</td><td></td></tr
					>

					<tr class="slot">
						<td colspan="5">Slots</td>
					</tr>
					<tr class="slot"
						><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Tooltip content</td
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
					<tr class="action">
						<td colspan="4">Actions</td>
					</tr>
					<tr><td></td><td>None</td><td></td><td>Tooltip has no imperative API</td></tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Tooltip on hover</h3>
		<p>
		<span
			id="hover-target">
			Top tooltip
		</span>

		<Tooltip anchor="hover-target" autoUpdateMode="auto"
			>Test text</Tooltip
		>
	</p>
	<p>
		<span
			id="hover-target2">
			Right tooltip
		</span>

		<Tooltip anchor="hover-target2" autoUpdateMode="auto" position="end"
			>Test text</Tooltip
		>
	</p>
	<p>
		<span
			id="hover-target3">
			Always active
		</span>

		<Tooltip anchor="hover-target3" autoUpdateMode="anchor" position="end" visible={true}
			><bold> This text is different and bold doesn't work</bold></Tooltip
		>
</p>
	</Card>
</Stack>
