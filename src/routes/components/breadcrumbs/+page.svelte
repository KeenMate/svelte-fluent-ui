<script lang="ts">
	import {Breadcrumb, BreadcrumbItem, ChevronDoubleRight, Stack, Grid, GridItem, Card} from "$lib/index.js"

	function onBreadcrumbClicked(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked)
		count += 1
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Breadcrumb</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Breadcrumb" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
				<tr class="property">
					<td></td>
					<td>appearance</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="callback">
					<td colspan="5">Callbacks</td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>onClick</td>
					<td>(ev: MouseEvent) => void</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="slot">
					<td colspan="5">Slots</td>
				</tr>
				<tr class="slot">
					<td></td>
					<td>children</td>
					<td>any</td>
					<td>undefined</td>
					<td></td>
				</tr>
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
				<!--<tr class="action">-->
				<!--	<td></td>-->
				<!--	<td>select</td>-->
				<!--	<td>() => void;</td>-->
				<!--	<td></td>-->
				<!--</tr>-->
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<div class="examples-container">
		<div class="example-item">
			<Breadcrumb>
				<BreadcrumbItem>
					Item 1
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 2
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 3
				</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="example-item">
			<Breadcrumb>
				<BreadcrumbItem>
					{#snippet separator()}
						<ChevronDoubleRight />
					{/snippet}
					Item 1
				</BreadcrumbItem>
				<BreadcrumbItem>
					{#snippet separator()}
						<ChevronDoubleRight />
					{/snippet}
					Item 2
				</BreadcrumbItem>
				<BreadcrumbItem>
					Item 3
				</BreadcrumbItem>
			</Breadcrumb>
		</div>
		</div>
	</Card>
</Stack>

<style>
	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.example-item {
		flex: 1;
	}
</style>
