<script lang="ts">
	import {Spacer} from "$lib/index.js"
</script>

<div class="header">
	<h1>Spacer</h1>
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
	<h5>
		Auto width:
	</h5>
	<div class="example tw:flex tw:gap-1">
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
	<div class="example tw:flex tw:justify-items-start tw:gap-1">
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
</div>

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
</style>
