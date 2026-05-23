<script lang="ts">
	import {Stack, QuickGrid, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

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
	<Meta
		title="Stack"
		description="A flexbox container for Svelte that arranges children vertically or horizontally with configurable gap, alignment, and wrapping."
		keywords="svelte, fluentui, stack, flexbox, layout, vertical, horizontal"
	/>

	<h1>Stack</h1>

	<p>
		A flexbox-based container that arranges children vertically or horizontally with configurable gap,
		alignment, and wrapping — the go-to building block for one-dimensional layouts.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-stack--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Stack"}
	]} />

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

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
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
					background-color: var(--neutral-layer-2, #f5f5f5);
					color: var(--neutral-foreground-rest, #242424);
					padding: .25rem;
					border-radius: .15em;
					line-height: 1;
				}
			}
		}
	}
</style>
