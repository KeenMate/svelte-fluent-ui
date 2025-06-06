<script lang="ts">
	import {Tab, Tabs} from "$lib/index.js"
</script>

<div class="header">
	<h1>Tabs</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-2-3 pure-u-xxl-3-4 pure-u-xxxl-2-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique identifier</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>CSS class</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
					<tr><td></td><td>orientation</td><td>horizontal/vertical</td><td>"horizontal"</td><td>Tab direction</td></tr>
					<tr><td></td><td>activeId</td><td>string</td><td>undefined</td><td>Currently active tab ID</td></tr>
					<tr><td></td><td>showActiveIndicator</td><td>boolean</td><td>true</td><td>Shows the active tab indicator</td></tr>
					<tr><td></td><td>overflow</td><td></td><td>[]</td><td>Overflow tab items</td></tr>
					<tr><td></td><td>moreButtonId</td><td>string</td><td>"more-button"</td><td>ID for overflow menu button</td></tr>
					<tr><td></td><td>styleMoreValues</td><td>string</td><td>""</td><td>Style for overflow badge</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-3 pure-u-xxl-1-4 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td></td>
						<td>onTabChange</td>
						<td>function</td>
						<td>Fires when the active tab changes</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr
				><td></td><td>childContent</td><td>SlotType</td><td>undefined</td><td
					>Tab items and panels</td
				></tr
			>
			<tr><td></td><td>end</td><td>fluent-badge</td><td>conditional</td><td>Overflow badge</td></tr>
		</tbody>
	</table>
</div>

<h2 class="content-subhead">Examples</h2>

<h3>Basic tab layout</h3>

<Tabs>
	{#snippet childContent()}
		<Tab id="tab1" label="First tab">
			{#snippet content()}
				<p>Example text for tab 1</p>
			{/snippet}
		</Tab>

		<Tab id="tab2" label="Second tab">
			{#snippet content()}
				<p>Example text for tab 2</p>
			{/snippet}
		</Tab>
	{/snippet}
</Tabs>
