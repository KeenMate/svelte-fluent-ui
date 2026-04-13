<script lang="ts">
	import {Card, Stack, Grid, GridItem, Anchor} from "svelte-fluentui"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Applications</h1>
	<Card>
		<p>
			Real-life examples that combine multiple components into common UI patterns you
			would build in production apps. Each page shows a focused scenario (filters,
			forms, dashboards, etc.) using the components from this library.
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Filter Card</h3>
				<p>
					A card with a row of filters: text search, a select dropdown, and an
					autocomplete with tag/chip selection. Shown together with a QuickGrid
					that reacts to the filters.
				</p>
				<Anchor href="/applications/filter-card">Open example</Anchor>
			</Card>
		</GridItem>
		<GridItem xs={12} md={6} lg={4}>
			<Card>
				<h3>Order Form</h3>
				<p>
					A cascading hardware / software order form. Selecting the order type
					reveals a branch of fields (mobile, hardware, software), and some
					branches cascade further. Covers nearly every form component in the
					library.
				</p>
				<Anchor href="/applications/order-form">Open example</Anchor>
			</Card>
		</GridItem>
	</Grid>
</Stack>
