<script lang="ts">
	import Checkbox from "$lib/components/Checkbox.svelte";
	import {Stack, Grid, GridItem, Card} from "$lib/index.js";

	let value:boolean = $state();
	let checkboxField: HTMLElement;

	function onClicked(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked);
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Checkbox</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-checkbox--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Checkbox" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>
				<table class="member-table">
  <tbody>
    <tr class="property">
      <td colspan="5">Members</td>
    </tr>
    <tr class="property">
      <td></td>
      <td>autofocus</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>checked</td>
      <td>boolean | null</td>
      <td>bindable</td>
      <td>bindable</td>
    </tr>
    <tr class="property">
      <td></td>
      <td>disabled</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>readonly</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>required</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>withIntermediate</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>

    <tr class="callback">
      <td colspan="5">Callbacks</td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>checkValidity</td>
      <td>() => boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>onClick</td>
      <td>(ev: PointerEvent, previousValue: boolean | null) => void</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>reportValidity</td>
      <td>() => boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>setCustomValidity</td>
      <td>(message: string) => any</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>setValidity</td>
      <td>(flags: any, message: any, anchor: any) => void</td>
      <td>undefined</td>
      <td></td>
    </tr>

    <tr class="slot">
      <td colspan="5">Slots</td>
    </tr>
    <tr class="slot">
      <td></td>
      <td>children</td>
      <td>any</td>
      <td>undefined</td>
      <td></td>
    </tr>
  </tbody>
</table>
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2 class="content-subhead">Actions</h2>
				<table class="member-table">
				<tbody>
					<tr class="action">
						<td colspan="4">Actions</td>
					</tr>
					<tr class="action">
						<td></td>
						<td>select</td>
						<td>() => void;</td>
						<td></td>
					</tr>
					<tr class="action">
						<td></td>
						<td>checkValidity</td>
						<td>() => boolean;</td>
						<td></td>
					</tr>
					<tr class="action">
						<td></td>
						<td>reportValidity</td>
						<td>() => boolean;</td>
						<td></td>
					</tr>
					<tr class="action">
						<td></td>
						<td>setCustomValidity</td>
						<td>(message: string) => any;</td>
						<td></td>
					</tr>
					<tr class="action">
						<td></td>
						<td>setValidity</td>
						<td>(flags: any, message: any, anchor: any) => void;</td>
						<td></td>
					</tr>
					<tr class="action">
						<td></td>
						<td>setSelectionRange</td>
						<td
							>(start: number, end: number, direction?: "forward" | "backward" |
							"none") => void;
						</td>
						<td></td>
					</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<Checkbox
			bind:this={checkboxField}
			bind:checked = {value}
			onClick={onClicked}
		>Are you going to Mars?</Checkbox>
		Value: {value}
	</Card>
</Stack>
