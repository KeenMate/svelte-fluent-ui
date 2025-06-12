<script lang="ts">
	import {Toast} from "$lib/index.js"
	let showToast = false
	let toastId = "demo-toast"

	function handleTopAction() {
		console.log("Top action clicked")
	}

	function handlePrimaryAction() {
		console.log("Primary action clicked")
	}

	function handleSecondaryAction() {
		showToast = false
		console.log("Secondary action clicked")
	}
</script>

<div class="header">
	<h1>Toast</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique toast ID</td></tr>
					<tr
						><td></td><td>title</td><td>string</td><td>undefined</td><td>Main message or heading</td
						></tr
					>
					<tr
						><td></td><td>timestamp</td><td>Date</td><td>undefined</td><td
							>Displayed if topCTAType is "Timestamp"</td
						></tr
					>
					<tr
						><td></td><td>topCTAType</td><td>"Dismiss" | "Timestamp" | "Action"</td><td
							>undefined</td
						><td>What to show on the top right</td></tr
					>
					<tr
						><td></td><td>topAction</td><td>string</td><td>undefined</td><td
							>Top right action text (if Action type)</td
						></tr
					>
					<tr
						><td></td><td>primaryAction</td><td>string</td><td>undefined</td><td
							>Primary button at bottom</td
						></tr
					>
					<tr
						><td></td><td>secondaryAction</td><td>string</td><td>undefined</td><td
							>Secondary button at bottom</td
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
					<tr>
						<td></td>
						<td>onDismiss</td>
						<td>() => void</td>
						<td>Fired when dismiss button is clicked</td>
					</tr>
					<tr>
						<td></td>
						<td>onTopActionClick</td>
						<td>() => void</td>
						<td>Fired when top right action is clicked</td>
					</tr>
					<tr>
						<td></td>
						<td>onPrimaryActionClick</td>
						<td>() => void</td>
						<td>Fired when primary action is clicked</td>
					</tr>
					<tr>
						<td></td>
						<td>onSecondaryActionClick</td>
						<td>() => void</td>
						<td>Fired when secondary action is clicked</td>
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
				><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
					>Additional message or markup content</td
				></tr
			>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Toast with timestamp</h3>
	<p>
		<Toast title="Auto-saved" timestamp={new Date()} topCTAType="Timestamp" />
	</p>
	<button on:click={() => (showToast = true)} style="padding: 0.5rem 1rem; cursor:pointer;">
		Show Toast
	</button>

	{#if showToast}
		<div class="toast-container">
			<Toast
				id={toastId}
				title="Saved Successfully"
				timestamp={new Date()}
				topCTAType="Action"
				topAction="Undo"
				primaryAction="View Details"
				secondaryAction="Dismiss"
				onTopActionClick={handleTopAction}
				onPrimaryActionClick={handlePrimaryAction}
				onSecondaryActionClick={handleSecondaryAction}
			></Toast>
		</div>
	{/if}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		width: 300px;
	}
</style>
