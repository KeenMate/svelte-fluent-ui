<script lang="ts">
	import {
		Button,
		Checkbox, Listbox,
		Option, Radio, RadioGroup,
		TextField,
		Combobox
	} from "$lib/index.js"

	let gpuSelectedValue: string[] | null | undefined = $state(null)
	let comboboxSelectedValue: string[] | null | undefined = $state(null)
	let checkboxValue: boolean = $state(false)
	let radioValue: string | null = $state("option_4")
	let listboxValue: string | null = $state(null)
	// let listboxMultiValue: string[] | null = $state(null)
</script>

<div class="forms">
	<h1>Form components</h1>

	<div class="components">
		<div class="component-section">
			<div class="component-title">
				<a href="/components/forms/text-field">
					Inputs
				</a>
			</div>
			<div class="grid">
				<TextField placeholder="Text input" />
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Comboboxes</div>
			<div class="grid">
				<h3>Default: {gpuSelectedValue}</h3>

				<Combobox id="combo-1" bind:value={gpuSelectedValue} placeholder="Select a graphics card">
					<Option value="1" label="GTX 1060">GTX 1060</Option>
					<Option value="2" label="GTX 1070">GTX 1070</Option>
					<Option value="3" label="GTX 1080">GTX 1080</Option>
					<Option value="4" label="GTX 1090" disabled>GTX 1090</Option>
				</Combobox>

				<h3>With autocomplete</h3>
				<Combobox id="combo-2" bind:value={gpuSelectedValue} autocomplete="both" placeholder="Select a graphics card">
					<Option value="1">GTX 1060</Option>
					<Option value="2">GTX 1070</Option>
					<Option value="3">GTX 1080</Option>
					<Option value="4">GTX 1090</Option>
				</Combobox>

				<h3>Disabled</h3>
				<Combobox id="combo-disabled" bind:value={comboboxSelectedValue} disabled placeholder="Select an option">
					<Option value="1">Option 1</Option>
					<Option value="2">Option 2</Option>
					<Option value="3">Option 3</Option>
				</Combobox>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Checkboxes</div>

			<div class="grid">
				<div>
					<div class="tw:mb-2">
						<div>
							<Checkbox bind:checked={checkboxValue}>
								Check me
							</Checkbox>
						</div>
						{#if checkboxValue}
							Yes
						{:else}
							No
						{/if}
					</div>

					<div>
						<Checkbox bind:checked={checkboxValue} disabled>
							I'm disabled
						</Checkbox>
					</div>
					<!-- note: intermediate state not working -->
					<!--<div>-->
					<!--	<Checkbox-->
					<!--		bind:checked={checkboxWithIntermediateValue}-->
					<!--		withIntermediate-->
					<!--	>-->
					<!--		Intermediate value-->
					<!--	</Checkbox>-->
					<!--</div>-->
				</div>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Radios</div>

			<div class="grid">
				<div>
					<div class="tw:mb-2">
						<div>
							<RadioGroup
								bind:value={radioValue}
								name="first-radio"
								class="tw:flex tw:flex-wrap tw:gap-1"
							>
								<Radio value="option_1">Option 1</Radio>
								<Radio value="option_2">Option 2</Radio>
								<Radio value="option_3">Option 3</Radio>
								<Radio value="option_4">Option 4</Radio>
							</RadioGroup>
						</div>
						Value is: {radioValue}
					</div>
					<div class="tw:mb-2">
						<div>
							<RadioGroup
								bind:value={radioValue}
								name="second-radio"
								orientation="vertical"
								class="tw:flex tw:flex-wrap tw:gap-1"
							>
								<Radio value="option_1">Option 1</Radio>
								<Radio value="option_2">Option 2</Radio>
								<Radio value="option_3">Option 3</Radio>
								<Radio value="option_4">Option 4</Radio>
							</RadioGroup>
						</div>
						Value is: {radioValue}
					</div>
					<div class="tw:mb-2">
						<div>
							<RadioGroup
								bind:value={radioValue}
								name="second-radio"
								class="tw:flex tw:flex-wrap tw:gap-1"
								disabled
							>
								<Radio value="option_1">Option 1</Radio>
								<Radio value="option_2">Option 2</Radio>
								<Radio value="option_3">Option 3</Radio>
								<Radio value="option_4">Option 4</Radio>
							</RadioGroup>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="component-section">
			<div class="component-title">Listboxes</div>

			<div>
				<div>
					Selected value: {listboxValue}
				</div>
				<div>
					<Button onClick={() => listboxValue = null}>
						Reset
					</Button>
				</div>

				<div>
					<Listbox bind:value={listboxValue}>
						<Option value="listbox-option-1">Option 1</Option>
						<Option value="listbox-option-2">Option 2</Option>
						<Option value="listbox-option-3">Option 3</Option>
					</Listbox>
				</div>
			</div>

			<!--<div>-->
			<!--	<div>-->
			<!--		Selected multi value: {listboxMultiValue?.join(", ")}-->
			<!--	</div>-->

			<!--	<div>-->
			<!--		<Listbox bind:value={listboxMultiValue} multi>-->
			<!--			<Option value="listbox-option-1">Option 1</Option>-->
			<!--			<Option value="listbox-option-2">Option 2</Option>-->
			<!--			<Option value="listbox-option-3">Option 3</Option>-->
			<!--		</Listbox>-->
			<!--	</div>-->
			<!--</div>-->
		</div>
	</div>
</div>
