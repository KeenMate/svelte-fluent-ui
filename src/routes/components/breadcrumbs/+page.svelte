<script lang="ts">
	import {Breadcrumb, BreadcrumbItem, ChevronDoubleRight} from "$lib/index.js"

	function onBreadcrumbClicked(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked)
		count += 1
	}
</script>

<div class="header">
	<h1>Breadcrumb</h1>
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
	<div class="tw:flex tw:gap-4">
		<div class="tw:flex-1">
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
		<div class="tw:flex-1">
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
</div>
