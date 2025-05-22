<script lang="ts">
	import {
		Option,
		TextField,
	} from "$lib"
	import Combobox from "$lib/components/Combobox.svelte"

	let gpuSelectedValue: string = $state("")
	let comboboxSelectedValue: string = $state("")
</script>

<div class="forms">
	<h1>Form components</h1>

	<div class="components">
		<div class="component-section">
			<div class="component-title">
				<a href="/components/forms/input">
					Inputs
				</a>
			</div>
			<div class="grid">
				<TextField placeholder="Text input" />
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Selectors</div>
			<div class="grid">
				<h3>Default: {gpuSelectedValue}</h3>

				<Combobox bind:value={gpuSelectedValue} placeholder="Select a graphics card">
					<Option value="1" label="GTX 1060">GTX 1060</Option>
					<Option value="2" label="GTX 1070">GTX 1070</Option>
					<Option value="3" label="GTX 1080">GTX 1080</Option>
					<Option value="4" label="GTX 1090" disabled>GTX 1090</Option>
				</Combobox>

				<h3>With autocomplete</h3>
				<Combobox bind:value={gpuSelectedValue} autocomplete="both" placeholder="Select a graphics card">
					<Option value="1">GTX 1060</Option>
					<Option value="2">GTX 1070</Option>
					<Option value="3">GTX 1080</Option>
					<Option value="4">GTX 1090</Option>
				</Combobox>

				<h3>Disabled</h3>
				<Combobox bind:value={comboboxSelectedValue} disabled placeholder="Select an option">
					<Option value="1">Option 1</Option>
					<Option value="2">Option 2</Option>
					<Option value="3">Option 3</Option>
				</Combobox>
			</div>
		</div>
	</div>
</div>
