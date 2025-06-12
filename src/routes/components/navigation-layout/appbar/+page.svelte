<script lang="ts">
	import {AppBar, AppBarItem, ResourcesIcon, Stack} from "$lib/index.js"
	import {AppBarOrientation} from "$lib/fluent-ui/constants/app-bar.js"

	function onAppBarItemClicked(ev: Event) {
		console.log("Nav appbar item clicked", ev)
	}
</script>

{#snippet commonItemIcon()}
	<ResourcesIcon aria-hidden="true" part="icon-rest" />
	<ResourcesIcon aria-hidden="true" part="icon-active" active />
{/snippet}

<div class="header">
	<h1>AppBar</h1>
	<p>
		For components: <br>
		<span class="tw:font-mono">AppBar</span>,
		<span class="tw:font-mono">AppBarItem</span>
	</p>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<p>(of AppBar)</p>
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
					<td>linkIcon</td>
					<td>any</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="slot">
					<td></td>
					<td>linkText</td>
					<td>any</td>
					<td>undefined</td>
					<td></td>
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
			<h5>Regular AppBar</h5>

			<Stack varticalAlign="start" horizontalAlign="start" vertical>
				<AppBar>
					<AppBarItem href="https://microsoft.com" rel="noreferer noorigin" target="_blank" icon={commonItemIcon}>
						Microsoft
					</AppBarItem>

					<AppBarItem href="/" icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Home
					</AppBarItem>
					<AppBarItem onClick={onAppBarItemClicked} icon={commonItemIcon}>
						Item 2
					</AppBarItem>
					<AppBarItem href="https://microsoft.com" icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 4
					</AppBarItem>
					<AppBarItem icon={commonItemIcon}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 5
					</AppBarItem>
				</AppBar>
			</Stack>
		</div>
		<div class="tw:flex-1">
			<h5>Horizontal AppBar menu</h5>

			<Stack varticalAlign="start" horizontalAlign="start" vertical>
				<AppBar orientation={AppBarOrientation.Horizontal}>
					<AppBarItem title="Item 1 tooltip" icon={commonItemIcon}>
						Item 1
					</AppBarItem>
					<AppBarItem title="Item 2 tooltip" icon={commonItemIcon}>
						Item 2
					</AppBarItem>
					<AppBarItem title="Item 4 tooltip" icon={commonItemIcon}>
						Item 4
					</AppBarItem>
				</AppBar>
			</Stack>
		</div>
	</div>
</div>
