<script lang="ts">
	import {Stack} from "$lib/index.js"
</script>

<div class="header">
	<h1>Stack</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
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

		</div>
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
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
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>
	<div class="tw:flex tw:gap-1">
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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
</div>

<style lang="scss">
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
