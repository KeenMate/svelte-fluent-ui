<script lang="ts">
	import "$lib/fluent-ui/setup.js"
</script>


<div class="pure-g">
	<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
		<h1>List of components and their state</h1>

		<table class="pure-table pure-table-striped">
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
					Colors need CSS variables to be defined (<pre class="tw:inline">--badge-color-[color]</pre>)
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
				<td>listbox</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td>listbox-option</td>
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
	</div>
</div>


	<!--<style lang="scss">-->
	<!--	@import ;-->
	<!--</style>-->






