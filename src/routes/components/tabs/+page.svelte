<script lang="ts">
	import {Tab, Tabs} from "$lib/index.js"

	let activeTab = "tab1"
</script>

<div class="header">
	<h1>Tab</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr
						><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique tab identifier</td></tr
					>
					<tr
						><td></td><td>label</td><td>string</td><td>undefined</td><td>Text shown on the tab</td
						></tr
					>
					<tr
						><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disables the tab</td
						></tr
					>
					<tr
						><td></td><td>visible</td><td>boolean</td><td>true</td><td>Shows or hides the tab</td
						></tr
					>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom CSS class</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
					<tr
						><td></td><td>activeTabId</td><td>string</td><td>undefined</td><td
							>ID of the currently active tab</td
						></tr
					>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr><td></td><td>on:click</td><td>event</td><td>Fires when the tab is clicked</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>default</td><td>SlotType</td><td>undefined</td><td>Tab panel content</td></tr
			>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic tab layout</h3>

	
<Tabs id="main-tabs" activeId={activeTab}>
	<Tab id="tab1" label="Tab One" content="Hello from the first tab!" />
	<Tab id="tab2" label="Tab Two" content="This is the second tab content 🎉" />
</Tabs>
</div>
