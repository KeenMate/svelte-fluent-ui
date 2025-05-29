<script lang="ts">
	import {Radio, RadioGroup} from "$lib/index.js"

	let radioValue: string | null = $state("option_1")
</script>

<div class="header">
	<h1>Combobox</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property">
						<td colspan="5">RadioGroup Members</td>
					</tr>
					<tr class="property">
						<td></td>
						<td>value</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>name</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>orientation</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>readonly</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>disabled</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td colspan="5">Radio Members</td>
					</tr>
					<tr class="property">
						<td></td>
						<td>value</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>readonly</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>disabled</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>

					<tr class="slot">
						<td colspan="5">Slots</td>
					</tr>
					<tr class="slot">
						<td></td>
						<td>children</td>
						<td>SlotType</td>
						<td>undefined</td>
						<td></td>
					</tr>
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
					<!--<tr class="action">-->
					<!--	<td></td>-->
					<!--	<td>select</td>-->
					<!--	<td>() => void;</td>-->
					<!--	<td></td>-->
					<!--</tr>-->
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>
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
