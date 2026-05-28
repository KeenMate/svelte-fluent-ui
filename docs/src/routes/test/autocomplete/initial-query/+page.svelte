<script lang="ts">
	import {Autocomplete} from "svelte-fluentui"

	const fruits = [
		{value: "apple", text: "Apple"},
		{value: "banana", text: "Banana"},
		{value: "cherry", text: "Cherry"},
		{value: "mango", text: "Mango"}
	]

	let selected = $state<string[]>([])
</script>

<h1>autocomplete — initialSearchQuery</h1>
<p>
	Targeted by <code>e2e/autocomplete.spec.ts</code>. Lives on its own route
	because the $effect on mount opens the dropdown — keeping it off the shared
	fixture page so other tests aren't disrupted by a second portaled overlay.
</p>

<div class="fixture">
	<div class="fixture-label">initialSearchQuery — seeds and opens with 'ban' on mount</div>
	<div id="initial-query-wrap" style="max-width: 320px">
		<Autocomplete
			id="initial-query"
			options={fruits}
			bind:selectedOptions={selected}
			initialSearchQuery="ban"
		/>
	</div>
</div>
