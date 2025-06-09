<script lang="ts">
	import {NavMenu, NavGroup, NavLinkItem} from "$lib/index.js"

	function onNavClick(ev: Event) {
		console.log("Nav link/group clicked", ev)
	}
</script>

<div class="header">
	<h1>Navigation</h1>
	<p>
		For components: <br>
		<span class="tw:font-mono">NavMenu</span>,
		<span class="tw:font-mono">NavItem</span>,
		<span class="tw:font-mono">NavLink</span>,
		<span class="tw:font-mono">NavLinkItem</span>
	</p>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<p>(of NavMenu)</p>
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
			<h5>Regular nav menu</h5>

			<NavMenu width="250px">
				<NavLinkItem href="https://microsoft.com" rel="noreferer noorigin" target>
					Microsoft
				</NavLinkItem>

				<NavLinkItem href="/">
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Home
				</NavLinkItem>
				<NavLinkItem href="/NavMenu">Item 2</NavLinkItem>
				<NavGroup onClick={onNavClick}>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->

					{#snippet linkText()}
						<h3>Item 3</h3>
					{/snippet}

					<NavLinkItem onClick={onNavClick}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 3.1
					</NavLinkItem>
					<NavLinkItem onClick={onNavClick}>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 3.2
					</NavLinkItem>
				</NavGroup>
				<NavLinkItem disabled href="https://microsoft.com">
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 4
				</NavLinkItem>
				<NavLinkItem disabled>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 5
				</NavLinkItem>
				<NavGroup
					expanded
				>
					{#snippet linkText()}
						Item 6 Item 6 Item 6 Item 6 Item 6
					{/snippet}
					<!--{#snippet icon()}-->
					<!--{/snippet}-->

					<NavLinkItem>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 6.1
					</NavLinkItem>
					<NavLinkItem>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 6.2
					</NavLinkItem>
					<NavGroup expanded>
						{#snippet linkText()}
							Item 6.3
						{/snippet}
						<!--{#snippet icon()}-->
						<!--{/snippet}-->

						<NavLinkItem>
							<!--{#snippet icon()}-->
							<!--{/snippet}-->
							Item 6.3.1 Item 6.3.1 Item 6.3.1
						</NavLinkItem>
						<NavLinkItem>
							<!--{#snippet icon()}-->
							<!--{/snippet}-->
							Item 6.3.2
						</NavLinkItem>
						<NavGroup
							expanded
						>
							{#snippet linkText()}
								Item 6.3.3 Item 6.3.3 Item 6.3.3
							{/snippet}
							<!--{#snippet icon()}-->
							<!--{/snippet}-->

							<NavLinkItem>
								<!--{#snippet icon()}-->
								<!--{/snippet}-->
								Item 6.3.3.1
							</NavLinkItem>
							<NavLinkItem disabled>
								<!--{#snippet icon()}-->
								<!--{/snippet}-->
								Item 6.3.3.2
							</NavLinkItem>
							<NavGroup
								disabled
								expanded
							>
								{#snippet linkText()}
									Item 6.3.3.3
								{/snippet}
								<!--{#snippet icon()}-->
								<!--{/snippet}-->

								<NavLinkItem>
									<!--{#snippet icon()}-->
									<!--{/snippet}-->
									Item 6.3.3.3.1
								</NavLinkItem>
								<NavLinkItem>
									<!--{#snippet icon()}-->
									<!--{/snippet}-->
									Item 6.3.3.3.2
								</NavLinkItem>
							</NavGroup>
						</NavGroup>
					</NavGroup>
				</NavGroup>
			</NavMenu>
		</div>
		<NavMenu class="tw:flex-1">
			<h5>Collapsible nav menu</h5>

			<NavMenu collapsible><!--!--><!--!--><!--!-->
				<NavLinkItem title="Item 1 tooltip">
					Item 1
				</NavLinkItem>
				<NavLinkItem title="Item 2 tooltip" disabled>
					Item 2
				</NavLinkItem>
				<NavGroup>
					{#snippet linkText()}
						Item 3
					{/snippet}

					<NavMenu>
						<NavLinkItem title="Item 3.1 tooltip">
							Item 3.1
						</NavLinkItem>
						<NavLinkItem title="Item 3.2 tooltip" disabled>
							Item 3.2
						</NavLinkItem>
						<NavGroup>
							{#snippet linkText()}
								Item 3.3
							{/snippet}

							<NavMenu>
								<NavLinkItem href="https://microsoft.com" title="Item 3.3.1 tooltip">
									https://microsoft.com
								</NavLinkItem>
							</NavMenu>
						</NavGroup>
						<NavGroup title="Item 3.4 tooltip" disabled>
							{#snippet linkText()}
								Item 3.4
							{/snippet}

							<NavMenu>
								<NavLinkItem
									title="Item 3.4.1 tooltip"
									href="https://microsoft.com"
									rel=""
								>
									https://microsoft.com
								</NavLinkItem>
							</NavMenu>
						</NavGroup>
					</NavMenu>
				</NavGroup>
				<NavLinkItem title="Item 4 tooltip" disabled>
					Item 4
				</NavLinkItem>
			</NavMenu>
		</NavMenu>
	</div>
</div>
