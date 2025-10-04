<script lang="ts">
	import {Radio, RadioGroup, Stack, Grid, GridItem, Card} from "$lib/index.js"

	let radioValue: string | null = $state("option_1")
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Radio</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-radio--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Radio" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>

				<table class="member-table">
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
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Actions</h2>
				<table class="member-table">
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
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<div class="example-group">
		<div>
			<RadioGroup
				bind:value={radioValue}
				name="second-radio"
				orientation="vertical"
				class="radio-group-wrapper"
			>
				<Radio value="option_1">Option 1</Radio>
				<Radio value="option_2">Option 2</Radio>
				<Radio value="option_3">Option 3</Radio>
				<Radio value="option_4">Option 4</Radio>
			</RadioGroup>
		</div>
		Value is: {radioValue}
	</div>
	<div class="example-group">
		<div>
			<RadioGroup
				bind:value={radioValue}
				name="second-radio"
				class="radio-group-wrapper"
				disabled
			>
				<Radio value="option_1">Option 1</Radio>
				<Radio value="option_2">Option 2</Radio>
				<Radio value="option_3">Option 3</Radio>
				<Radio value="option_4">Option 4</Radio>
			</RadioGroup>
		</div>
	</div>
	</Card>
</Stack>

<style>
	.example-group {
		margin-bottom: 0.5rem;
	}

	.radio-group-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
</style>
