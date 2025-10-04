<script lang="ts">
	import "$lib/fluent-ui/setup.js"
	import {Grid, GridItem, Card} from "$lib/index.js"
</script>

<h1>List of components and their state</h1>

<Grid spacing={4}>
	<GridItem xs={12} lg={10} xl={8}>
		<Card class="component-table-card">
			<table class="pure-table pure-table-striped component-table">
			<thead>
			<tr>
				<th>State</th>
				<th>Name</th>
				<th>Comment</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/navigation-layout/accordion">
						accordion
					</a>
				</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>anchor</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>anchored-region</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/navigation-layout/appbar">
						appbar
					</a>
				</td>
				<td>Icons (active and "rest") need to have "part" attr manually specified to work properly</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/badge">
						badge
					</a>
				</td>
				<td>
					Now, only "accent" appearance works. <br>
					Colors need CSS variables to be defined (<pre class="inline-code">--badge-color-[color]</pre>)
				</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/body-content">body-content</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/breadcrumbs">
						breadcrumbs
					</a>
				</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/button">button</a>
				</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/forms/calendar">
						calendar
					</a>
				</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/card">
						card
					</a>
				</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/checkbox">checkbox</a></td>
				<td>Intermediate state does not work</td>
			</tr>
			<tr>
				<td></td>
				<td>color</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/combobox">combobox</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Not planned</td>
				<td>data-grid</td>
				<td>Does not seem to be much flexible</td>
			</tr>
			<tr>
				<td></td>
				<td>design-system-provider</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>dialog</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>divider</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>flipper</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/grid">grid</a></td>
				<td>Responsive 12-column grid system with breakpoints</td>
			</tr>
			<tr>
				<td></td>
				<td>horizontal-scroll</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/layout">layout</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/listbox">listbox</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/option">listbox-option</a></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>menu</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>menu-item</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/multisplitter">multi-splitter</a></td>
				<td>Resizable multi-panel splitter component</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td>
					<a href="/components/navigation-layout/navigation">navigation</a>
				</td>
				<td>Collapsed nav' child tree's floating nodes not implemented at the moment</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/number-field">number-field</a></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>progress</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/radio">radio</a></td>
				<td>
					Wrapped radios have ugly missing spacing (cannot be added so far)
				</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/radio">radio-group</a></td>
				<td>
					Wrapped radios have ugly missing spacing (cannot be added so far)
				</td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/search">search</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/select">select</a></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>skeleton</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>slider</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>slider-label</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/spacer">spacer</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/navigation-layout/stack">stack</a></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>styles</td>
				<td></td>
			</tr>
			<tr>
				<td>Initial Tests</td>
				<td><a href="/components/forms/switch">switch</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/tabs/">tabs</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/text-area">text-area</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/forms/text-field">text-field</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/toast">toast</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/toolbar">toolbar</a></td>
				<td></td>
			</tr>
			<tr>
				<td>Initial tests</td>
				<td><a href="/components/tooltip">tooltip</a></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>tree-item</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>tree-view</td>
				<td></td>
			</tr>
			</tbody>
		</table>
	</Card>
	</GridItem>

	<GridItem xs={12} lg={2} xl={4}>
		<Card class="quick-links-card">
			<h3>Quick Links</h3>
			<div class="quick-links-container">
				<a href="/components/navigation-layout/grid">Grid Demo</a>
				<a href="/components/navigation-layout/multisplitter">MultiSplitter Demo</a>
			</div>
		</Card>
	</GridItem>
</Grid>

<style>
	.component-table-card {
		padding: 2rem;
		background: var(--app-layer-2);
	}

	.component-table {
		width: 100%;
	}

	.inline-code {
		display: inline;
	}

	.quick-links-card {
		padding: 2rem;
		background: var(--app-layer-3);
		text-align: center;
	}

	.quick-links-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}
</style>






