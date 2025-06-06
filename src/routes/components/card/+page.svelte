<script lang="ts">
	import {Card} from "$lib/index.js"

</script>

<div class="header">
	<h1>Card</h1>
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

		</div>
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
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
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>
	<div class="tw:flex tw:gap-4">
		<Card class="tw:flex-1">
			<p>
				Some card content
			</p>
		</Card>
		<Card width="200px" height="200px">
			<p>200x200 content</p>
		</Card>
		<Card class="tw:flex-1">
			<p>
				Some card content
			</p>
		</Card>
	</div>
</div>
