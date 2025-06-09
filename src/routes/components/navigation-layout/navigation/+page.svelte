<script lang="ts">
	import {NavMenu, NavItem, NavLink} from "$lib/index.js"
	import NavGroup from "$lib/components/nav/NavGroup.svelte"
</script>

<div class="header">
	<h1>Navigation</h1>
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
	<p>
		<NavMenu width="250px">
			<NavLink href="https://microsoft.com" rel="noreferer noorigin" target="_blank">
				Microsoft
			</NavLink>

			<NavLink Icon="@(new Icons.Regular.Size20.Home())" Href="/" Match="NavLinkMatch.All">Home</NavLink>
			<NavLink Href="/NavMenu">Item 2</NavLink>
			<NavGroup OnClick="OnClick" Title="Item 3" Icon="@(new Icons.Regular.Size20.EarthLeaf())">
				{#snippet linkText()}
					<h3>Item 3</h3>
				{/snippet}

				<NavLink OnClick="OnClick" Icon="@(new Icons.Regular.Size20.LeafOne())">Item 3.1</NavLink>
				<NavLink OnClick="OnClick" Icon="@(new Icons.Regular.Size20.LeafTwo())">Item 3.2</NavLink>
			</NavGroup>
			<NavLink Icon="@(new Icons.Regular.Size20.CalendarAgenda())" Disabled="true" Href="https://microsoft.com">Item 4
			</NavLink>
			<NavLink Icon="@(new Icons.Regular.Size20.Home())" Disabled="true">Item 5</NavLink>
			<NavGroup
				Expanded="true"
				Title="Item 6 Item 6 Item 6 Item 6 Item 6"
				Icon="@(new Icons.Regular.Size20.EarthLeaf())"
			>
				<NavLink Icon="@(new Icons.Regular.Size20.LeafOne())">Item 6.1</NavLink>
				<NavLink Icon="@(new Icons.Regular.Size20.LeafTwo())">Item 6.2</NavLink>
				<NavGroup Expanded="true" Title="Item 6.3" Icon="@(new Icons.Regular.Size20.EarthLeaf())">
					<NavLink Icon="@(new Icons.Regular.Size20.LeafOne())">Item 6.3.1 Item 6.3.1 Item 6.3.1</NavLink>
					<NavLink Icon="@(new Icons.Regular.Size20.LeafTwo())">Item 6.3.2</NavLink>
					<NavGroup
						Expanded="true"
						Title="Item 6.3.3 Item 6.3.3 Item 6.3.3"
						Icon="@(new Icons.Regular.Size20.EarthLeaf())"
					>
						<NavLink Icon="@(new Icons.Regular.Size20.LeafOne())">Item 6.3.3.1</NavLink>
						<NavLink Disabled="true" Icon="@(new Icons.Regular.Size20.LeafTwo())">Item 6.3.3.2</NavLink>
						<NavGroup
							Disabled="true"
							Expanded="true"
							Title="Item 6.3.3.3"
							Icon="@(new Icons.Regular.Size20.EarthLeaf())"
						>
							<NavLink Icon="@(new Icons.Regular.Size20.LeafOne())">Item 6.3.3.3.1</NavLink>
							<NavLink Icon="@(new Icons.Regular.Size20.LeafTwo())">Item 6.3.3.3.2</NavLink>
						</NavGroup>
					</NavGroup>
				</NavGroup>
			</NavGroup>
		</NavMenu>
	</p>
</div>
