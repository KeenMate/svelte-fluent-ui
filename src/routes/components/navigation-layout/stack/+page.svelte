<script lang="ts">
	import {Stack, QuickGrid, Grid, GridItem, Card} from "$lib/index.js"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Stack direction"},
		{name: "gap", type: "string", default: "undefined", description: "Gap between items"},
		{name: "horizontalAlign", type: "string", default: "undefined", description: "Horizontal alignment"},
		{name: "verticalAlign", type: "string", default: "undefined", description: "Vertical alignment"},
		{name: "wrap", type: "boolean", default: "false", description: "Allow wrapping"}
	]

	const actions: Property[] = []

	const callbacks: Property[] = []

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Stack content"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Stack</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-stack--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Stack" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<div class="examples-container">
		<div class="examples-column">
			<div class="examples">
				<div class="example">
					<Stack>
						<p>Inner content 1 of plain stack</p>
						<p>Inner content 2 of plain stack</p>
						<p>Inner content 3 of plain stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack orientation="vertical">
						<p>Inner content 1 of vertical stack</p>
						<p>Inner content 2 of vertical stack</p>
						<p>Inner content 3 of vertical stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack orientation="vertical">
						<p>Inner content 1 of vertical stack</p>
						<p>Inner content 2 of vertical stack</p>
						<p>Inner content 3 of vertical stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack orientation="horizontal">
						<p>Inner content 1 of horizontal stack</p>
						<p>
							Inner content 2 of horizontal stack. <br>
							Very long text here <br>
							Very long text here <br>
							Very long text here <br>
						</p>
						<p>Inner content 3 of horizontal stack</p>
					</Stack>
				</div>
			</div>
		</div>
		<div class="examples-column">
			<div class="examples">
				<div class="example">
					<Stack>
						<p>Inner content 1 of plain stack</p>
						<p>Inner content 2 of plain stack</p>
						<p>Inner content 3 of plain stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack orientation="vertical">
						<p>Inner content 1 of vertical stack</p>
						<p>Inner content 2 of vertical stack</p>
						<p>Inner content 3 of vertical stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack orientation="horizontal">
						<p>Inner content 1 of horizontal stack</p>
						<p>
							Inner content 2 of horizontal stack. <br>
							Very long text here <br>
							Very long text here <br>
							Very long text here <br>
						</p>
						<p>Inner content 3 of horizontal stack</p>
					</Stack>
				</div>
			</div>
		</div>
	</div>
	</Card>
</Stack>

<style lang="scss">
	.examples-container {
		display: flex;
		gap: 0.25rem;
	}

	.examples-column {
		flex: 1;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: .5rem;

		.example {
			:global {
				p {
					background-color: #d7d7d7;
					padding: .25rem;
					border-radius: .15em;
					line-height: 1;
				}
			}
		}
	}
</style>
