<script lang="ts">
	import Tooltip from "$lib/components/Tooltip.svelte"
	import {onMount} from "svelte"

	let tooltipVisible = $state(false)

	onMount(() => {
		setTimeout(() => {
			const tooltip = document.querySelector("fluent-tooltip")
			const anchor = tooltip?.anchor
			console.log("Tooltip element:", tooltip)
			console.log("Tooltip anchor:", anchor)
			console.log("Resolved anchor element:", document.getElementById(anchor))
		}, 500)
	})
</script>

<div class="header">
	<h1>Tooltip</h1>
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
					<tr class="property"
						><td></td><td>anchor</td><td>string</td><td>undefined</td><td>ID of anchor</td></tr
					>
					<tr class="property"
						><td></td><td>autoUpdateMode</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"><td></td><td>class</td><td>string</td><td>""</td><td></td></tr>
					<tr class="property"><td></td><td>delay</td><td>number</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>horizontalViewportLock</td><td>boolean</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>maxWidth</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>position</td><td>string</td><td>undefined</td><td></td></tr
					>
					<tr class="property"><td></td><td>style</td><td>string</td><td>""</td><td></td></tr>
					<tr class="property"
						><td></td><td>verticalViewportLock</td><td>boolean</td><td>undefined</td><td></td></tr
					>
					<tr class="property"
						><td></td><td>visible</td><td>boolean</td><td>undefined</td><td></td></tr
					>

					<tr class="slot">
						<td colspan="5">Slots</td>
					</tr>
					<tr class="slot"
						><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Tooltip content</td
						></tr
					>
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
					<tr><td></td><td>None</td><td></td><td>Tooltip has no imperative API</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>

	<h3>Tooltip on hover</h3>
	<p>
		<span
			id="hover-target"
			on:mouseenter={() => (tooltipVisible = true)}
			on:mouseleave={() => (tooltipVisible = false)}
		>
			Hover
		</span>

		<Tooltip anchor="hover-target" visible={tooltipVisible} delay={100} autoUpdateMode="auto"
			>Testovaci text</Tooltip
		>
	</p>
</div>
