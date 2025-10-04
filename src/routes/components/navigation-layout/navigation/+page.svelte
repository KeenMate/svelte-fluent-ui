<script lang="ts">
	import {NavMenu, NavGroup, NavLinkItem, Stack, Grid, GridItem, Card} from "$lib/index.js"

	function onNavClick(ev: Event) {
		console.log("Nav link/group clicked", ev)
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Navigation</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Custom component">NavMenu (Custom)</span>
			|
			<a href="https://www.fluentui-blazor.net/NavMenu" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<p>
		For components: <br>
		<span class="component-name">NavMenu</span>,
		<span class="component-name">NavItem</span>,
		<span class="component-name">NavLink</span>,
		<span class="component-name">NavLinkItem</span>
	</p>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>
				<p>(of NavMenu)</p>
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
		<div class="example-item">
			<h5>Regular nav menu</h5>

			<NavMenu width="250px">
				<NavLinkItem href="https://microsoft.com" rel="noreferer noorigin" target="_blank">
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
		<NavMenu class="example-item">
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
	</Card>
</Stack>

<style>
	.component-name {
		font-family: monospace;
	}

	.examples-container {
		display: flex;
		gap: 1rem;
	}

	.example-item {
		flex: 1;
	}
</style>
