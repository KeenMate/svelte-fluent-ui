<script lang="ts">
	import {Toast, Stack, Grid, GridItem, Card} from "$lib/index.js"
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

<Stack orientation="vertical" gap="1rem">
	<h1>Toast</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-messagebar-messagebar--docs" target="_blank" rel="noopener noreferrer">MessageBar</a>
			|
			<a href="https://www.fluentui-blazor.net/MessageBar" target="_blank" rel="noopener noreferrer">FluentUI Blazor MessageBar</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>
				<table class="member-table">
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
			</Card>
		</GridItem>

		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2 class="content-subhead">Actions</h2>

				<table class="member-table">
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
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Slots</h2>

		<table class="member-table">
			<tbody>
				<tr class="slot"><td colspan="5">Slots</td></tr>
				<tr
					><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
						>Additional message or markup content</td
					></tr
				>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Toast with timestamp</h3>
		<Toast title="Auto-saved" timestamp={new Date()} topCTAType="Timestamp" />
		<button onclick={() => (showToast = true)} class="show-toast-button">
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
	</Card>
</Stack>

<style>
	.show-toast-button {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.toast-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		width: 300px;
	}
</style>
