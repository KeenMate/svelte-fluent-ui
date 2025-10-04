<script lang="ts">
	import {onMount} from "svelte"
	import {TextField, Grid, GridItem, Card, Stack} from "$lib/index.js"

	let textValue = $state("")
	let textField: HTMLElement & {select: Function}

	onMount(() => {
		console.log("🚀 ~ onMount ~ onMount:", onMount)
		setTimeout(() => {
			console.log("🚀 ~ setTimeout ~ textField.select:", textField.select)

			textField.select()
		}, 3500)
	})

	function onTextInputChanged(ev: InputEvent) {
		console.log("🚀 ~ onTextInputChanged ~ ev:", ev.target.value)
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Text field</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-textinput--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/TextField" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
      <td>value</td>
      <td>string</td>
      <td>undefined</td>
      <td>bindable</td>
    </tr>
    <tr class="property">
      <td></td>
      <td>placeholder</td>
      <td>string</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>appearance</td>
      <td>string</td>
      <td>undefined</td>
      <td></td>
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
      <td>type</td>
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
      <td>label</td>
      <td>string</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="property">
      <td></td>
      <td>autofocus</td>
      <td>boolean</td>
      <td>undefined</td>
      <td></td>
    </tr>

    <tr class="callback">
      <td colspan="5">Callbacks</td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>onInput</td>
      <td>(ev: InputEvent) => void</td>
      <td>undefined</td>
      <td></td>
    </tr>
    <tr class="callback">
      <td></td>
      <td>onChange</td>
      <td>(ev: Event) => void</td>
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
					</td
					>
					<td></td>
				</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Examples</h2>
		<TextField
			bind:this={textField}
			bind:value={textValue}
			placeholder="Enter text"
			onInput={onTextInputChanged}
		/>
	</Card>
</Stack>
