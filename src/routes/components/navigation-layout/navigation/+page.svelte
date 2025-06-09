<script lang="ts">
	import {NavMenu, NavGroup, NavLink} from "$lib/index.js"

	function onNavClick(ev: Event) {
		console.log("Nav link/group clicked", ev)
	}
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

			<NavLink href="/" match="NavLinkMatch.All">
				<!--{#snippet icon()}-->
				<!--{/snippet}-->
				Home
			</NavLink>
			<NavLink href="/NavMenu">Item 2</NavLink>
			<NavGroup title="Item 3" onClick={onNavClick}>
				<!--{#snippet icon()}-->
				<!--{/snippet}-->

				{#snippet linkText()}
					<h3>Item 3</h3>
				{/snippet}

				<NavLink onClick={onNavClick}>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 3.1
				</NavLink>
				<NavLink onClick={onNavClick}>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 3.2
				</NavLink>
			</NavGroup>
			<NavLink disabled href="https://microsoft.com">
				<!--{#snippet icon()}-->
				<!--{/snippet}-->
				Item 4
			</NavLink>
			<NavLink disabled>
				<!--{#snippet icon()}-->
				<!--{/snippet}-->
				Item 5
			</NavLink>
			<NavGroup
				expanded
				title="Item 6 Item 6 Item 6 Item 6 Item 6"
			>
				<!--{#snippet icon()}-->
				<!--{/snippet}-->

				<NavLink>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 6.1
				</NavLink>
				<NavLink>
					<!--{#snippet icon()}-->
					<!--{/snippet}-->
					Item 6.2
				</NavLink>
				<NavGroup expanded title="Item 6.3">
					<!--{#snippet icon()}-->
					<!--{/snippet}-->

					<NavLink>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 6.3.1 Item 6.3.1 Item 6.3.1
					</NavLink>
					<NavLink>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->
						Item 6.3.2
					</NavLink>
					<NavGroup
						expanded
						title="Item 6.3.3 Item 6.3.3 Item 6.3.3"
					>
						<!--{#snippet icon()}-->
						<!--{/snippet}-->

						<NavLink>
							<!--{#snippet icon()}-->
							<!--{/snippet}-->
							Item 6.3.3.1
						</NavLink>
						<NavLink disabled>
							<!--{#snippet icon()}-->
							<!--{/snippet}-->
							Item 6.3.3.2
						</NavLink>
						<NavGroup
							disabled
							expanded
							title="Item 6.3.3.3"
						>
							<!--{#snippet icon()}-->
							<!--{/snippet}-->

							<NavLink>
								<!--{#snippet icon()}-->
								<!--{/snippet}-->
								Item 6.3.3.3.1
							</NavLink>
							<NavLink>
								<!--{#snippet icon()}-->
								<!--{/snippet}-->
								Item 6.3.3.3.2
							</NavLink>
						</NavGroup>
					</NavGroup>
				</NavGroup>
			</NavGroup>
		</NavMenu>
	</p>
</div>
