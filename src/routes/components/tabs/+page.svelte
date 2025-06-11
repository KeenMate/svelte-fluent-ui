<script lang="ts">
	import {Tab, Tabs} from "$lib/index.js"
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
      					<tr><td></td><td>ariaLabel</td><td>string</td><td>undefined</td><td>Accessibility label</td></tr>
      					<tr><td></td><td>childContent</td><td>SlotType</td><td>undefined</td><td>Slot for additional child content</td></tr>
      					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom class for styling</td></tr>
      					<tr><td></td><td>content</td><td>SlotType</td><td>undefined</td><td>Slot for tab panel content</td></tr>
      					<tr><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disables the tab</td></tr>
      					<tr><td></td><td>header</td><td>SlotType</td><td>undefined</td><td>Custom header slot</td></tr>
      					<tr><td></td><td>icon</td><td>SlotType</td><td>undefined</td><td>Optional icon slot</td></tr>
      					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique ID</td></tr>
      					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Tab label text</td></tr>
      					<tr><td></td><td>labelEditable</td><td>boolean</td><td>false</td><td>Allows inline editing of label</td></tr>
      					<tr><td></td><td>loadingContent</td><td>SlotType</td><td>undefined</td><td>Displays while content is loading</td></tr>
      					<tr><td></td><td>overflow</td><td>string</td><td>undefined</td><td>Overflow behavior of the tab</td></tr>
      					<tr><td></td><td>showClose</td><td>boolean</td><td>false</td><td>Shows close button on tab</td></tr>
      					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline CSS styles</td></tr>
      					<tr><td></td><td>visible</td><td>boolean</td><td>true</td><td>Controls whether tab is rendered</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
        				<td></td>
        				<td>onCloseClick</td>
        				<td>function</td>
        				<td>Fires when close button is clicked</td>
      				</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>childContent</td><td>SlotType</td><td>undefined</td><td>Tab items and panels</td></tr>
      		<tr><td></td><td>icon</td><td>SlotType</td><td>conditional</td><td>Slot for icon inside tab header</td></tr>
      		<tr><td></td><td>header</td><td>SlotType</td><td>conditional</td><td>Custom tab header content</td></tr>
      		<tr><td></td><td>content</td><td>SlotType</td><td>conditional</td><td>Main content inside tab panel</td></tr>
      		<tr><td></td><td>loadingContent</td><td>SlotType</td><td>conditional</td><td>Shown when content is loading</td></tr>
      		<tr><td></td><td>end</td><td>fluent-badge</td><td>conditional</td><td>Overflow badge</td></tr>
		</tbody>
	</table>

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

</div>

