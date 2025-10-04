<script lang="ts">
	import {Card, Stack, Grid, GridItem} from "$lib/index.js"

</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Card</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">Card (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/Card" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
				<tr class="property">
					<td></td>
					<td>height</td>
					<td>string | number</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>areaRestricted</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>class</td>
					<td>string</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>style</td>
					<td>string</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>minimalStyle</td>
					<td>boolean</td>
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
				<tr class="action">
					<td></td>
					<td>select</td>
					<td>() => void;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>checkValidity</td>
					<td>() => boolean;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>reportValidity</td>
					<td>() => boolean;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setCustomValidity</td>
					<td>(message: string) => any;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setValidity</td>
					<td>(flags: any, message: any, anchor: any) => void;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setSelectionRange</td>
					<td
					>(start: number, end: number, direction?: "forward" | "backward" |
						"none") => void;
					</td>
					<td></td>
				</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<div class="examples-container">
		<Card class="flex-card">
			<p>
				Some card content
			</p>
		</Card>
		<Card width="200px" height="200px">
			<p>200x200 content</p>
		</Card>
		<Card class="flex-card">
			<p>
				Some card content
			</p>
		</Card>
		</div>
	</Card>
</Stack>

<style>
	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.flex-card {
		flex: 1;
	}
</style>
