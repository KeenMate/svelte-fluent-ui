<script lang="ts">
	import {Spacer, Stack, Grid, GridItem, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Spacer</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">Spacer (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/Spacer" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
					<td>width</td>
					<td>string | number</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="callback">
					<td colspan="5">Callbacks</td>
				</tr>
				<!--<tr class="callback">-->
				<!--	<td></td>-->
				<!--	<td>checkValidity</td>-->
				<!--	<td>() => boolean</td>-->
				<!--	<td>undefined</td>-->
				<!--	<td></td>-->
				<!--</tr>-->

				<tr class="slot">
					<td colspan="5">Slots</td>
				</tr>
				<!--<tr class="slot">-->
				<!--	<td></td>-->
				<!--	<td>children</td>-->
				<!--	<td>any</td>-->
				<!--	<td>undefined</td>-->
				<!--	<td></td>-->
				<!--</tr>-->
				</tbody>
			</table>

			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Actions</h2>
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
		<h2>Examples</h2>
		<h5>
			Auto width:
		</h5>
		<div class="example example-row">
		<div class="element-block">1</div>
		<Spacer />
		<div class="element-block">2</div>
		<Spacer />
		<div class="element-block">3</div>
		<Spacer />
		<div class="element-block">4</div>
	</div>
	<h5>
		Specific width:
	</h5>
	<div class="example example-row-start">
		<div class="element-block">
			<span>100px after</span>
		</div>
		<Spacer width="100" />
		<div class="element-block">
			<span>200px after</span>
		</div>
		<Spacer width="200" />
		<div class="element-block">
			<span>300px after</span>
		</div>
		<Spacer width="300" />
		<div class="element-block">4</div>
	</div>
	</Card>
</Stack>

<style lang="scss">
	.example {
		:global {
			.element-block {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 5rem;
				height: 5rem;
				background-color: #d7d7d7;
				border-radius: .15em;
				line-height: 1;
				font-family: monospace;
			}
		}
	}

	.example-row {
		display: flex;
		gap: 0.25rem;
	}

	.example-row-start {
		display: flex;
		justify-items: start;
		gap: 0.25rem;
	}
</style>
