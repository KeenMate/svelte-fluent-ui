<script lang="ts">
	import {onMount} from "svelte"

	import TextField from "$lib/components/TextField.svelte"

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

<div class="header">
	<h1>Checkbox</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>
			<table class="pure-table member-table">
				<tbody>
				<tr class="property">
					<td colspan="4">Properties</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>value</td>
					<td>string</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>placeholder</td>
					<td>string</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>appearance</td>
					<td>TextInputAppearance</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>disabled</td>
					<td>boolean</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>readonly</td>
					<td>boolean</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>required</td>
					<td>boolean</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>type</td>
					<td>TextInputType</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>name</td>
					<td>string</td>
					<td>undefined</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>autofocus</td>
					<td>boolean</td>
					<td>undefined</td>
				</tr>


				<tr class="property">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="property">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="callback">
					<td colspan="4">Callbacks</td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="callback">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="slot">
					<td colspan="4">Slots</td>
				</tr>
				<tr class="slot">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="slot">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
				</tr>

				<tr class="slot">
					<td></td>
					<td>Value</td>
					<td>text</td>
					<td>undefined</td>
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
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>
	<p>
		<TextField
			bind:this={textField}
			bind:value={textValue}
			placeholder="Enter text"
			onInput={onTextInputChanged}
		/>
	</p>
</div>
