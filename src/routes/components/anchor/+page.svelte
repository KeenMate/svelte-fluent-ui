<script lang="ts">
	import { Anchor } from "$lib/index.js";

	function handleAnchorClick(event: MouseEvent) {
		alert("Anchor clicked!");
	}
</script>

<div class="header">
	<h1>Anchor</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Element ID</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom CSS classes</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
					<tr><td></td><td>download</td><td>string</td><td>undefined</td><td>Download attribute for files</td></tr>
					<tr><td></td><td>href</td><td>string</td><td>undefined</td><td>URL the link points to</td></tr>
					<tr><td></td><td>hreflang</td><td>string</td><td>undefined</td><td>Language of the linked resource</td></tr>
					<tr><td></td><td>ping</td><td>string</td><td>undefined</td><td>URLs to notify on follow</td></tr>
					<tr><td></td><td>referrerpolicy</td><td>string</td><td>undefined</td><td>Referrer policy for the link</td></tr>
					<tr><td></td><td>rel</td><td>string</td><td>undefined</td><td>Relationship between the document and the target</td></tr>
					<tr><td></td><td>target</td><td>string</td><td>undefined</td><td>Where to open the linked document</td></tr>
					<tr><td></td><td>type</td><td>string</td><td>undefined</td><td>Hint of the linked resource’s MIME type</td></tr>
					<tr><td></td><td>appearance</td><td>"neutral" | "accent" | "hypertext" | "stealth" | "transparent"</td><td>undefined</td><td>Visual style variant</td></tr>
					<tr><td></td><td>preventDefault</td><td>boolean</td><td>false</td><td>Prevent default navigation behavior</td></tr>
					<tr><td></td><td>use</td><td>(node: HTMLAnchorElement) =&gt; any</td><td>undefined</td><td>Svelte action applied to the anchor element</td></tr>
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
						<td>onClick</td>
						<td>(event: MouseEvent) =&gt; void</td>
						<td>Fires when the anchor is clicked</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Content inside the anchor</td></tr>
			<tr><td></td><td>iconStart</td><td>SlotType</td><td>undefined</td><td>Element displayed before children</td></tr>
			<tr><td></td><td>iconEnd</td><td>SlotType</td><td>undefined</td><td>Element displayed after children</td></tr>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic Anchor</h3>
	<p>
		<Anchor href="#">example</Anchor>
	</p>
</div>
