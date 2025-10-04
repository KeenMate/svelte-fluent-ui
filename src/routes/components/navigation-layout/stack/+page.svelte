<script lang="ts">
	import {Stack, Grid, GridItem, Card} from "$lib/index.js"
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
				<h2>Members</h2>
				<table class="member-table">
				<tbody>
				<tr class="property">
					<td colspan="5">Members</td>
				</tr>
				<!--<tr class="property">-->
				<!--	<td></td>-->
				<!--	<td>appearance</td>-->
				<!--	<td>boolean</td>-->
				<!--	<td>undefined</td>-->
				<!--	<td></td>-->
				<!--</tr>-->

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
					<Stack orientation="Vertical">
						<p>Inner content 1 of vertical stack</p>
						<p>Inner content 2 of vertical stack</p>
						<p>Inner content 3 of vertical stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack
						orientation="Vertical"
						horizontalAlign="Center"
					>
						<p>Inner content 1 of vertical (horizontalAlign="Center") stack</p>
						<p>Inner content 2 of vertical (horizontalAlign="Center") stack</p>
						<p>Inner content 3 of vertical (horizontalAlign="Center") stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack
						orientation="Horizontal"
						verticalAlign="Center"
					>
						<p>Inner content 1 of horizontal (verticalAlign="Center") stack</p>
						<p>
							Inner content 2 of horizontal (verticalAlign="Center") stack. <br>
							Very long text here <br>
							Very long text here <br>
							Very long text here <br>
						</p>
						<p>Inner content 3 of horizontal (verticalAlign="Center") stack</p>
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
					<Stack orientation="Vertical" horizontalAlign="Right">
						<p>Inner content 1 of vertical (horizontalAlign="Right") stack</p>
						<p>Inner content 2 of vertical (horizontalAlign="Right") stack</p>
						<p>Inner content 3 of vertical (horizontalAlign="Right") stack</p>
					</Stack>
				</div>
				<hr>
				<div class="example">
					<Stack
						orientation="Horizontal"
						verticalAlign="Bottom"
					>
						<p>Inner content 1 of horizontal (verticalAlign="Bottom") stack</p>
						<p>
							Inner content 2 of horizontal (verticalAlign="Bottom") stack. <br>
							Very long text here <br>
							Very long text here <br>
							Very long text here <br>
						</p>
						<p>Inner content 3 of horizontal (verticalAlign="Bottom") stack</p>
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
