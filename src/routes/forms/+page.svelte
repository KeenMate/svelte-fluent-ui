<script lang="ts">
	import {
		Option,
		TextField,
	} from "$lib/index.js"
	import Combobox from "$lib/components/Combobox.svelte"
</script>

<div class="forms">
	<h1>Form components</h1>

	<div class="components">
		<div class="component-section">
			<div class="component-title">
				<a href="/forms/input">
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
				<h3>Default</h3>
				<Combobox placeholder="Select a graphics card">
					<Option value="1">GTX 1060</Option>
					<Option value="2">GTX 1070</Option>
					<Option value="3">GTX 1080</Option>
					<Option value="4" disabled>GTX 1090</Option>
				</Combobox>

				<h3>With autocomplete</h3>
				<Combobox autocomplete="both" placeholder="Select a graphics card">
					<Option value="1">GTX 1060</Option>
					<Option value="2">GTX 1070</Option>
					<Option value="3">GTX 1080</Option>
					<Option value="4" disabled>GTX 1090</Option>
				</Combobox>

				<h3>Disabled</h3>
				<Combobox disabled placeholder="Select an option">
					<Option value="1">Option 1</Option>
					<Option value="2">Option 2</Option>
					<Option value="3">Option 3</Option>
				</Combobox>
			</div>
		</div>
	</div>
</div>
