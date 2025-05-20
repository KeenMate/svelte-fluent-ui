<script lang="ts">
	import {
		Dropdown,
		Option,
		TextField,
		Link
	} from "$lib/index.js"
</script>

<div class="forms">
	<h1>Form components</h1>

	<div class="components">
		<div class="component-section">
			<div class="component-title">
				<Link href="/components/forms/input">
					Inputs
				</Link>
			</div>
			<div class="grid">
				<TextField placeholder="Text input" />
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Selectors</div>
			<div class="grid">
				<Dropdown>
					<Option value="A">A</Option>
					<Option value="B">B</Option>
					<Option value="Selected" selected>Selected</Option>
					<Option value="Disabled" disabled={true}>Disabled</Option>
				</Dropdown>
			</div>
		</div>
	</div>
</div>
